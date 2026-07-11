import { WATCHED_ITEMS } from "./items";
import { getApproval } from "./approvedBrands";
import { checkPrice } from "./priceCheck";
import { getPriceHistory, appendPrices, logDeal, type ConfirmedDeal } from "./db";
import { sendDealAlert } from "./notify";

const DEAL_TOLERANCE = 0.02; // fire if price is within 2% of the 12-month minimum

export interface ScanResult {
  scanned: number;
  priceCheckFailed: number;
  notAtLow: number;
  unapprovedBrand: number;
  confirmed: number;
  deals: ConfirmedDeal[];
}

export async function runDealScan(): Promise<ScanResult> {
  const result: ScanResult = {
    scanned: WATCHED_ITEMS.length,
    priceCheckFailed: 0,
    notAtLow: 0,
    unapprovedBrand: 0,
    confirmed: 0,
    deals: [],
  };

  const allNewPoints: Parameters<typeof appendPrices>[0] = [];

  await Promise.all(
    WATCHED_ITEMS.map(async (item) => {
      // ── Check current price ─────────────────────────────────────────
      const price = await checkPrice(item);
      if (!price) {
        result.priceCheckFailed++;
        return;
      }
      allNewPoints.push(...price.points);

      // ── Load 12-month history from Supabase ─────────────────────────
      const history = await getPriceHistory(item.id);
      // Include today's new points so the very first run can compare
      const allPrices = [...history.map((p) => p.price), ...price.points.map((p) => p.price)];
      const twelveMonthMin = Math.min(...allPrices);

      // ── Gate 1: price floor ─────────────────────────────────────────
      if (price.currentPrice > twelveMonthMin * (1 + DEAL_TOLERANCE)) {
        result.notAtLow++;
        return;
      }

      // ── Gate 2: brand approval ──────────────────────────────────────
      const approval = item.brands
        .map((b) => getApproval(b, item.category))
        .find(Boolean);

      if (!approval) {
        result.unapprovedBrand++;
        return;
      }

      // ── Confirmed deal ──────────────────────────────────────────────
      const pctSaving =
        twelveMonthMin > 0
          ? ((twelveMonthMin - price.currentPrice) / twelveMonthMin) * 100
          : 0;

      const deal: ConfirmedDeal = {
        item_id: item.id,
        item_label: item.label,
        brand: approval.brand,
        current_price: price.currentPrice,
        twelve_mo_min: twelveMonthMin,
        pct_saving: pctSaving,
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
    await sendDealAlert(result.deals);
  }

  return result;
}
