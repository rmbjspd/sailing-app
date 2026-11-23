import { WATCHED_ITEMS } from "./items";
import { getApproval } from "./approvedBrands";
import { checkPrice } from "./priceCheck";
import { getPriceHistory, appendPrices, logDeal, type ConfirmedDeal } from "./db";
import { sendDealAlert, type AlertStatus } from "./notify";

// Fire only if today's price is within 2% of the lowest price in the prior
// 12 months…
const DEAL_TOLERANCE = 0.02;
// …AND at least 5% below the typical (median) price over that period, so an
// item whose price never moves doesn't "alert" every week at 0% off.
const MIN_SAVING_PCT = 5;
// Don't judge a "12-month low" until there are a few weeks of prices to
// compare against. Weekly scans → alerts can start after 4 weeks.
const MIN_HISTORY_POINTS = 4;
// Prices recorded before this were the cheapest result of ANY brand (see
// brandMatch.ts), so they aren't comparable with brand-filtered prices and
// would hold the 12-month minimum artificially low for a year.
const BRAND_FILTERED_SINCE = "2026-11-23T00:00:00.000Z";

export interface ScanResult {
  scanned: number;
  priceCheckFailed: number; // no result from an approved brand (or no API key)
  buildingHistory: number;  // fewer than MIN_HISTORY_POINTS prior prices
  notAtLow: number;         // above the prior 12-month low
  smallSaving: number;      // at the low, but < MIN_SAVING_PCT below typical
  unapprovedBrand: number;
  confirmed: number;
  deals: ConfirmedDeal[];
  alert: AlertStatus;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export async function runDealScan(): Promise<ScanResult> {
  const result: ScanResult = {
    scanned: WATCHED_ITEMS.length,
    priceCheckFailed: 0,
    buildingHistory: 0,
    notAtLow: 0,
    smallSaving: 0,
    unapprovedBrand: 0,
    confirmed: 0,
    deals: [],
    alert: { status: "no_deals" },
  };

  const allNewPoints: Parameters<typeof appendPrices>[0] = [];

  await Promise.all(
    WATCHED_ITEMS.map(async (item) => {
      // ── Check current price (approved-brand results only) ───────────
      const price = await checkPrice(item);
      if (!price) {
        result.priceCheckFailed++;
        return;
      }
      allNewPoints.push(...price.points);

      // ── Load prior 12-month history from Supabase ───────────────────
      // Today's price is deliberately NOT part of the baseline: comparing it
      // with a minimum that includes itself made every saving ≤ 0%.
      const prior = (await getPriceHistory(item.id, BRAND_FILTERED_SINCE)).map((p) => p.price);
      if (prior.length < MIN_HISTORY_POINTS) {
        result.buildingHistory++;
        return;
      }
      const priorMin = Math.min(...prior);
      const typical = median(prior);

      // ── Gate 1: price floor ─────────────────────────────────────────
      if (price.currentPrice > priorMin * (1 + DEAL_TOLERANCE)) {
        result.notAtLow++;
        return;
      }
      const pctSaving = typical > 0 ? ((typical - price.currentPrice) / typical) * 100 : 0;
      if (pctSaving < MIN_SAVING_PCT) {
        result.smallSaving++;
        return;
      }

      // ── Gate 2: brand approval — of the brand actually being sold ───
      const approval = getApproval(price.brand, item.category);
      if (!approval) {
        result.unapprovedBrand++;
        return;
      }

      // ── Confirmed deal ──────────────────────────────────────────────
      const deal: ConfirmedDeal = {
        item_id: item.id,
        item_label: item.label,
        brand: approval.brand,
        current_price: price.currentPrice,
        twelve_mo_min: Math.min(priorMin, price.currentPrice),
        pct_saving: pctSaving, // vs the 12-month median
        retailer: price.retailer,
        buy_url: price.buyUrl,
        approval_source: approval.sources[0],
        confirmed_at: new Date().toISOString(),
      };

      result.deals.push(deal);
      result.confirmed++;
      await logDeal(deal);
    })
  );

  // ── Persist all new price points ────────────────────────────────────
  await appendPrices(allNewPoints);

  // ── Notify if anything cleared both gates ───────────────────────────
  if (result.deals.length > 0) {
    // Sort critical items first
    const priorityOrder = { critical: 0, important: 1, nice: 2 };
    result.deals.sort((a, b) => {
      const ia = WATCHED_ITEMS.find((i) => i.id === a.item_id);
      const ib = WATCHED_ITEMS.find((i) => i.id === b.item_id);
      return (priorityOrder[ia?.priority ?? "nice"] ?? 2) - (priorityOrder[ib?.priority ?? "nice"] ?? 2);
    });
    result.alert = await sendDealAlert(result.deals);
  }

  return result;
}
