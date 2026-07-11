import type { WatchedItem } from "./items";
import type { PricePoint } from "./db";

export interface PriceResult {
  itemId: string;
  currentPrice: number;
  retailer: string;
  buyUrl: string | null;
  points: PricePoint[]; // new points to append to history
}

// ── Serper.dev Google Shopping ────────────────────────────────────────────────
// Returns the lowest price found across West Marine, Defender, Hamilton Marine,
// Jamestown Distributors, and any other Google Shopping result.
//
// Sign up at serper.dev — 2,500 free credits, then $0.30/1,000 queries.
// 18 items × 52 weeks ≈ 936 queries/year ≈ $0.28/yr after the free credits.
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

async function serperPrice(item: WatchedItem): Promise<PriceResult | null> {
  const key = process.env.SERPER_API_KEY;
  if (!key) return null;

  const res = await fetch("https://google.serper.dev/shopping", {
    method: "POST",
    headers: {
      "X-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: item.searchTerm, gl: "us", num: 20 }),
  });

  if (!res.ok) return null;
  const json = await res.json();

  const results: SerperShoppingResult[] = json?.shopping ?? [];

  let best: { price: number; source: string; link: string } | null = null;
  for (const r of results) {
    const price = parsePrice(r.price);
    if (price !== null && (!best || price < best.price)) {
      best = { price, source: r.source ?? "unknown", link: r.link ?? "" };
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

/** Checks current price for an item via Google Shopping (Serper.dev). */
export async function checkPrice(item: WatchedItem): Promise<PriceResult | null> {
  return serperPrice(item);
}
