import { createClient } from "@supabase/supabase-js";

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export interface PricePoint {
  item_id: string;
  price: number;
  retailer: string;
  source: "serpapi";
  checked_at: string; // ISO timestamp
}

// Brand-matched prices are stored under a separate key. Rows under the bare
// item id were the cheapest result of ANY brand — written by the old price
// check, or by any old deployment still running — and would hold the
// 12-month minimum artificially low, so they are never read back. Using a key
// rather than a new column means no database migration is needed.
const historyKey = (itemId: string) => `${itemId}~brand`;

export interface ConfirmedDeal {
  item_id: string;
  item_label: string;
  brand: string;
  current_price: number;
  twelve_mo_min: number;
  pct_saving: number;
  retailer: string;
  buy_url: string | null;
  approval_source: string;
  confirmed_at: string;
}

/** Returns the 12-month brand-matched price history for an item, oldest first. */
export async function getPriceHistory(itemId: string): Promise<PricePoint[]> {
  const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client()
    .from("deal_price_history")
    .select("item_id, price, retailer, source, checked_at")
    .eq("item_id", historyKey(itemId))
    .gte("checked_at", since)
    .order("checked_at", { ascending: true });
  if (error) throw new Error(`price history query failed: ${error.message}`);
  return ((data ?? []) as PricePoint[]).map((p) => ({ ...p, item_id: itemId }));
}

/** Appends a batch of today's brand-matched price points. */
export async function appendPrices(points: PricePoint[]): Promise<void> {
  if (points.length === 0) return;
  const rows = points.map((p) => ({ ...p, item_id: historyKey(p.item_id) }));
  const { error } = await client().from("deal_price_history").insert(rows);
  if (error) throw new Error(`price history insert failed: ${error.message}`);
}

/** Logs a confirmed deal that passed both gates. */
export async function logDeal(deal: ConfirmedDeal): Promise<void> {
  const { error } = await client().from("deal_confirmed").insert(deal);
  if (error) throw new Error(`deal log failed: ${error.message}`);
}
