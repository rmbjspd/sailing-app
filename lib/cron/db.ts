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
  brand: string | null; // which watched brand; null on rows from before brand filtering
  checked_at: string; // ISO timestamp
}

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

/**
 * Returns the 12-month price history for a given item, oldest first. Only
 * brand-matched points count: rows with no `brand` were the cheapest result
 * of any brand and would hold the 12-month minimum artificially low.
 */
export async function getPriceHistory(itemId: string): Promise<PricePoint[]> {
  const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client()
    .from("deal_price_history")
    .select("item_id, price, retailer, source, brand, checked_at")
    .eq("item_id", itemId)
    .not("brand", "is", null)
    .gte("checked_at", since)
    .order("checked_at", { ascending: true });
  if (error) throw new Error(`price history query failed: ${error.message}`);
  return (data ?? []) as PricePoint[];
}

/** Appends a batch of today's price points. */
export async function appendPrices(points: PricePoint[]): Promise<void> {
  if (points.length === 0) return;
  const { error } = await client().from("deal_price_history").insert(points);
  if (error) throw new Error(`price history insert failed: ${error.message}`);
}

/** Logs a confirmed deal that passed both gates. */
export async function logDeal(deal: ConfirmedDeal): Promise<void> {
  const { error } = await client().from("deal_confirmed").insert(deal);
  if (error) throw new Error(`deal log failed: ${error.message}`);
}
