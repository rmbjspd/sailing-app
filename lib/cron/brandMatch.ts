// Decides which of an item's brands (if any) a shopping result is actually for.
//
// Why this exists: Google Shopping returns whatever matches the search term,
// in any brand. Without this check the scan kept the cheapest result of ANY
// brand, then passed the brand gate on the item's own approved brands — so a
// no-name radio could alert as if it were a Standard Horizon.
//
// Pure string logic with no imports, so the watch-list validator can use it
// under plain `node`.

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function brandPattern(brand: string): RegExp {
  // Words may be joined by spaces, hyphens or nothing ("Taylor Made",
  // "Taylor-Made", "TaylorMade"). The brand must stand alone, so "Gill" does
  // not match "Gillette".
  const words = brand.trim().split(/\s+/).map(escapeRegExp);
  return new RegExp(`(^|[^a-z0-9])${words.join("[\\s-]*")}($|[^a-z0-9])`, "i");
}

/**
 * Returns the first of `brands` named in `title`, or null. Longer brand names
 * are tried first so an overlapping shorter name can't shadow them.
 */
export function matchBrand(title: string | undefined, brands: string[]): string | null {
  if (!title) return null;
  const byLength = [...brands].sort((a, b) => b.length - a.length);
  for (const brand of byLength) {
    if (brandPattern(brand).test(title)) return brand;
  }
  return null;
}

/**
 * The Google Shopping queries to run for an item. If the search term already
 * names one of the item's brands, it is used as-is. Otherwise one query per
 * brand is run with the brand prefixed, so the brand filter has results to
 * work with.
 */
export function queriesFor(item: { searchTerm: string; brands: string[] }): string[] {
  if (matchBrand(item.searchTerm, item.brands)) return [item.searchTerm];
  return item.brands.map((b) => `${b} ${item.searchTerm}`);
}
