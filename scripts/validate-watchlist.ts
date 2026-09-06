// Validates the deal-hunter watch list against the approved-brands list.
//
// The failure this exists to prevent: adding a watched item whose brands are
// not approved in its category. Such an item passes the price gate, silently
// fails the brand gate on every run, and never alerts — a watch that looks
// configured but is dead. This happened three times (B&G, Airmar, Battle Born)
// before it was caught by hand.
//
// Run: npm run validate:watchlist

import { WATCHED_ITEMS } from "../lib/cron/items";
import { getApproval, APPROVED_BRANDS } from "../lib/cron/approvedBrands";

// Declared locally so this runs without @types/node resolution.
declare const process: { exit(code: number): never };

let errors = 0;
let warnings = 0;

function fail(msg: string) {
  console.error(`  ERROR  ${msg}`);
  errors++;
}
function warn(msg: string) {
  console.warn(`  WARN   ${msg}`);
  warnings++;
}

console.log("\nDeal-hunter watch list validation\n" + "=".repeat(50));

// ── 1. Duplicate item IDs ────────────────────────────────────────────────
console.log("\n[1] Duplicate item IDs");
const seen = new Map<string, number>();
for (const item of WATCHED_ITEMS) {
  seen.set(item.id, (seen.get(item.id) ?? 0) + 1);
}
const dupes = [...seen.entries()].filter(([, n]) => n > 1);
if (dupes.length === 0) {
  console.log("  ok — all ids unique");
} else {
  for (const [id, n] of dupes) fail(`id "${id}" appears ${n} times`);
}

// ── 2. Gate 2 reachability ───────────────────────────────────────────────
// Every item needs at least one brand approved in its own category, or it
// can never produce an alert.
console.log("\n[2] Brand-gate reachability");
let unreachable = 0;
for (const item of WATCHED_ITEMS) {
  const approved = item.brands.filter((b) => getApproval(b, item.category));
  if (approved.length === 0) {
    fail(
      `"${item.id}" (${item.label}) — no brand approved in category "${item.category}". ` +
        `Brands: ${item.brands.join(", ")}. This item can never alert.`
    );
    unreachable++;
  }
}
if (unreachable === 0) {
  console.log(`  ok — all ${WATCHED_ITEMS.length} items can reach an alert`);
}

// ── 3. Partially-approved items ──────────────────────────────────────────
// Not fatal, but a brand listed on an item that isn't approved will be
// silently ignored by the gate. Usually means a missing approval entry.
console.log("\n[3] Unapproved brands on otherwise-valid items");
let partial = 0;
for (const item of WATCHED_ITEMS) {
  for (const b of item.brands) {
    if (!getApproval(b, item.category)) {
      warn(`"${item.id}" lists brand "${b}" which is not approved for "${item.category}"`);
      partial++;
    }
  }
}
if (partial === 0) console.log("  ok — every listed brand is approved in its category");

// ── 4. Unused approvals ──────────────────────────────────────────────────
// Dead entries aren't harmful, just noise. Reported for housekeeping.
console.log("\n[4] Approved brands not used by any watched item");
const usedPairs = new Set(
  WATCHED_ITEMS.flatMap((i) => i.brands.map((b) => `${b.toLowerCase()}|${i.category}`))
);
const unused = APPROVED_BRANDS.filter((ab) =>
  ab.categories.every((c) => !usedPairs.has(`${ab.brand.toLowerCase()}|${c}`))
);
if (unused.length === 0) {
  console.log("  ok — every approved brand is referenced");
} else {
  console.log(`  info — ${unused.length} unused: ${unused.map((u) => u.brand).join(", ")}`);
}

// ── Summary ──────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(50));
console.log(
  `${WATCHED_ITEMS.length} watched items · ${APPROVED_BRANDS.length} approved brands · ` +
    `${errors} error(s) · ${warnings} warning(s)\n`
);

if (errors > 0) {
  console.error("FAILED — items above can never alert. Fix before relying on the scan.\n");
  process.exit(1);
}
console.log("PASSED\n");
