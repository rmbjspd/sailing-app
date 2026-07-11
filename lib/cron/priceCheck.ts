import type { WatchedItem } from "./items";
import type { PricePoint } from "./db";

export interface PriceResult {
  itemId: string;
  currentPrice: number;
  retailer: string;
  buyUrl: string | null;
  points: PricePoint[]; // new points to append to history
}

// ── Keepa ────────────────────────────────────────────────────────────────────
// Keepa API returns price history as a flat array: [unix_min, price, unix_min, price, ...]
// Prices are in cents × 10 (divide by 100 to get dollars).
// Token cost: 1 token per ASIN per request. Free plan: 250/day.

async function keepaPrice(item: WatchedItem): Promise<PriceResult | null> {
  if (!item.asin) return null;
  const key = process.env.KEEPA_API_KEY;
  if (!key) return null;

  const url =
    `https://api.keepa.com/product?key=${key}&domain=1&asin=${item.asin}&history=1&days=7`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();

  const product = json?.products?.[0];
  if (!product) return null;

  // csv[0] = Amazon price history array. Index the last pair for current price.
  // TODO: parse the full csv[0] array if you want Keepa's own 365-day history
  // rather than relying on your Supabase records. For now we just take the
  // current price from Keepa and store everything else ourselves.
  const csv: number[] = product.csv?.[0] ?? [];
  if (csv.length < 2) return null;

  // Last valid price entry (Keepa uses -1 for "out of stock")
  let currentPriceCents: number | null = null;
  for (let i = csv.length - 1; i >= 1; i -= 2) {
    if (csv[i] > 0) { currentPriceCents = csv[i]; break; }
  }
  if (!currentPriceCents) return null;

  const price = currentPriceCents / 100;
  const now = new Date().toISOString();

  return {
    itemId: item.id,
    currentPrice: price,
    retailer: "Amazon",
    buyUrl: `https://amazon.com/dp/${item.asin}`,
    points: [{ item_id: item.id, price, retailer: "Amazon", source: "keepa", checked_at: now }],
  };
}

// ── SerpAPI Google Shopping ───────────────────────────────────────────────────
// Returns the lowest price found across West Marine, Defender, Hamilton Marine,
// Jamestown Distributors, and any other Google Shopping result.

async function serpapiPrice(item: WatchedItem): Promise<PriceResult | null> {
  const key = process.env.SERPAPI_KEY;
  if (!key) return null;

  const q = encodeURIComponent(`${item.searchTerm}`);
  const url = `https://serpapi.com/search?engine=google_shopping&q=${q}&gl=us&api_key=${key}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();

  const results: Array<{ price?: number; extracted_price?: number; source?: string; link?: string }> =
    json?.shopping_results ?? [];

  // Find the lowest price with a numeric value
  let best: { price: number; source: string; link: string } | null = null;
  for (const r of results) {
    const price = r.price ?? r.extracted_price;
    if (typeof price === "number" && price > 0) {
      if (!best || price < best.price) {
        best = { price, source: r.source ?? "unknown", link: r.link ?? "" };
      }
    }
  }

  if (!best) return null;

  const now = new Date().toISOString();
  return {
    itemId: item.id,
    currentPrice: best.price,
    retailer: best.source,
    buyUrl: best.link,
    points: [{ item_id: item.id, price: best.price, retailer: best.source, source: "serpapi", checked_at: now }],
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Checks current price for an item, preferring Keepa for ASINs, SerpAPI otherwise. */
export async function checkPrice(item: WatchedItem): Promise<PriceResult | null> {
  const [keepa, serpapi] = await Promise.allSettled([
    keepaPrice(item),
    serpapiPrice(item),
  ]);

  const keepaResult = keepa.status === "fulfilled" ? keepa.value : null;
  const serpapiResult = serpapi.status === "fulfilled" ? serpapi.value : null;

  // Return whichever gave the lower price; merge their history points
  const candidates = [keepaResult, serpapiResult].filter(Boolean) as PriceResult[];
  if (candidates.length === 0) return null;

  const best = candidates.reduce((a, b) => (a.currentPrice <= b.currentPrice ? a : b));
  best.points = candidates.flatMap((c) => c.points);
  return best;
}
