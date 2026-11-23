import type { WatchedItem } from "./items";
import type { PricePoint } from "./db";
import { matchBrand, queriesFor } from "./brandMatch";

export interface PriceResult {
  itemId: string;
  currentPrice: number;
  brand: string;        // which of item.brands the cheapest result is for
  title: string;        // the shopping result's product title
  retailer: string;
  buyUrl: string | null;
  points: PricePoint[]; // new points to append to history
}

// ── Serper.dev Google Shopping ────────────────────────────────────────────────
// Returns the lowest price across West Marine, Defender, Hamilton Marine,
// Jamestown Distributors and any other Google Shopping result — counting ONLY
// results whose title names one of the item's brands (see brandMatch.ts).
//
// Sign up at serper.dev — 2,500 free credits, then $0.30/1,000 queries.
// Items whose search term doesn't name a brand run one query per brand; the
// current list is 38 queries/week ≈ 2,000/year ≈ $0.60/yr after the free
// credits. `npm run validate:watchlist` prints the exact weekly count.
//
// Set SERPER_API_KEY in Vercel environment variables.

interface SerperShoppingResult {
  title?: string;
  price?: string;   // "$49.99" — string with currency symbol
  source?: string;
  link?: string;
  rating?: number;
  ratingCount?: number;
}

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return isFinite(n) && n > 0 ? n : null;
}

async function serperShopping(key: string, q: string): Promise<SerperShoppingResult[]> {
  const res = await fetch("https://google.serper.dev/shopping", {
    method: "POST",
    headers: {
      "X-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q, gl: "us", num: 20 }),
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json?.shopping ?? [];
}

async function serperPrice(item: WatchedItem): Promise<PriceResult | null> {
  const key = process.env.SERPER_API_KEY;
  if (!key) return null;

  const resultSets = await Promise.all(queriesFor(item).map((q) => serperShopping(key, q)));

  let best: { price: number; brand: string; title: string; source: string; link: string } | null = null;
  for (const r of resultSets.flat()) {
    const price = parsePrice(r.price);
    if (price === null) continue;
    // Skip results that aren't one of the item's brands — otherwise the
    // cheapest no-name product sets the price.
    const brand = matchBrand(r.title, item.brands);
    if (!brand) continue;
    if (!best || price < best.price) {
      best = { price, brand, title: r.title ?? "", source: r.source ?? "unknown", link: r.link ?? "" };
    }
  }

  if (!best) return null;

  const now = new Date().toISOString();
  return {
    itemId: item.id,
    currentPrice: best.price,
    brand: best.brand,
    title: best.title,
    retailer: best.source,
    buyUrl: best.link || null,
    points: [{ item_id: item.id, price: best.price, retailer: best.source, source: "serpapi", checked_at: now }],
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Checks current price for an item via Google Shopping (Serper.dev). */
export async function checkPrice(item: WatchedItem): Promise<PriceResult | null> {
  return serperPrice(item);
}
