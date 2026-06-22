# 📋 PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `52225ff` — *B1: resolve landing-page locks contradiction* · **Date:** 2026-06-22 · **Weighted score: 7.9 / 10** · **Verdict: SHIP**

**What changed:** Canal Transit card detail went from hardcoded `"34 locks · E-2 through E-35"` to derived `` `34 numbered locks · ${sayb.locks} transited` ``. Both the hero stat and the card now flow from `tripTotals`, so they can no longer disagree.

**Verified (hands-on):** clean `next build` (compiled OK, 8/8 static); read the static prerender of `/` — hero shows **"28 total"**, Canal Transit shows **"34 numbered locks · 28 transited"**, zero leftover `34 locks ·` literals; independently summed `itinerary.ts` locks = **28**. ✅ Contradiction resolved at the root (derivation, not a re-typed constant).

**Minor note (not a reopen):** "28 transited" under the *Canal Transit* heading includes Black Rock + Troy Federal locks, which aren't Erie Canal numbered locks (canal-only = 26). Figures now agree, so this is cosmetic precision only — logged as B9 (P3).

| # | Category | Weight | Score | Δ | Notes |
|---|----------|-------:|:-----:|:--:|-------|
| 1 | Trip-data correctness & integrity | 25% | 7.5 | ▲ +0.5 | B1 fixed at root; B3 & B7 (same hardcode-in-copy pattern) still open. |
| 2 | Core task success | 20% | 8.5 | — | All surfaces work; journal CRUD + empty state; checklist toggle/reset/progress; map route toggle. |
| 3 | Design — *Captain Ron meets Hook* | 20% | 9.0 | — | Cohesive & memorable. Pirata One + IM Fell + Special Elite; parchment/rope/treasure-frame; salty voice. |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | Responsive patterns present; no offline story; live mobile unverified. |
| 5 | Reliability & robustness | 12% | 7.5 | — | Clean build, good empty states, SSR-safe storage. Map hard-crashes if Mapbox token missing (B2). |
| 6 | Usability & clarity | 8% | 7.5 | — | Charming labels, but brand says "Philadelphia" while app *recommends* Old Saybrook (B4). |
| 7 | Code quality & maintainability | 3% | 9.0 | — | Type-safe, single-source data, clean components. |

### Pass history
| Pass | Commit | Score | Verdict | Headline |
|------|--------|:-----:|---------|----------|
| 1 (baseline) | `a36d9d0` | 7.8 | SHIP | First full eval; backlog B1–B8 opened. |
| 2 | `52225ff` | 7.9 | SHIP | B1 (locks contradiction) resolved at root. |

---

## Backlog (ranked by user-impact × likelihood)

### ✅ Resolved
- ~~**B1 · Locks contradiction**~~ — fixed in `52225ff`; both figures now derive from `tripTotals` (28). Verified.

### P0 — blockers
_None._ 🎉

### P1 — fix soon
- **B2 · Map has no missing-token fallback.** `TripMap.tsx:8` `TOKEN = process.env…!` → blank map if `NEXT_PUBLIC_MAPBOX_TOKEN` is unset on a deploy. Add a guard + friendly "chart unavailable" panel.

### P2 — should fix
- **B3 · Home "Pillage stops" list is wrong (data).** `app/page.tsx:313` advertises *"Oyster Bay, Greenport, Mystic, Essex"* — but Mystic & Essex aren't overnight stops, and Port Jefferson (a real stop) is omitted. Align with `waypoints.ts`. _Same hardcode-in-copy root cause as the old B1._
- **B4 · Brand vs. recommendation mismatch.** Hero + nav + logo all say *Chicago → Philadelphia* (Option A), yet Option B (Old Saybrook) is **Recommended** and the **map default**. Pick a canonical framing.
- **B5 · Route line resurrected + geographically crude.** `TripMap.tsx:57-70` still draws a dashed line despite commit `eb715de` ("Remove route lines from map"). It connects ports with straight rhumb lines that cut across land. Confirm intent or re-remove.
- **B6 · Map is an un-themed island.** Default Mapbox `outdoors-v12` + white/gray popups break the parchment/pirate aesthetic (cat-3 consistency).

### P3 — polish
- **B7 · `app/itinerary/page.tsx:47`** hardcodes "~34 sailing days" — derive (33 saybrook / 34 philly). _Same root cause as the old B1 / B3._
- **B8 · Verify live in a real browser/device:** WebGL map render, mobile touch targets, sun-contrast on `muted-foreground` over parchment.
- **B9 · Canal lock precision (new).** "28 transited" under *Canal Transit* counts Black Rock + Troy (non-canal); Erie-Canal-only is 26. Cosmetic — figures already agree.

> **Recurring theme:** B3 and B7 share the root cause B1 just fixed — hardcoded values in presentational copy contradicting the derived data model. Knocking those out next would close the pattern entirely.

---

## Scoring rubric

Weighted categories (sum 100%). End user = **desktop + mobile, equally**. Theme policy = **balance / judgment calls** — design earns points as a positive *and* usability harm is flagged independently.

| Category | Weight | What "pass" means |
|----------|-------:|-------------------|
| Trip-data correctness & integrity | 25% | Single source of truth; map ↔ itinerary ↔ guides consistent; units stated; detours reflected everywhere. **Data bugs auto-float to top.** |
| Core task success | 20% | All 5 surfaces work end-to-end; journal/checklist state survives a hard refresh. |
| Design & aesthetics — *Captain Ron meets Hook* | 20% | Breezy salty charter charm + lush theatrical pirate grandeur. Cohesive non-stock palette/type, restrained texture, micro-interactions, consistency across all surfaces, memorable. |
| Real-world fitness | 12% | Works at a laptop *and* one-handed on a phone; sun legible; graceful on flaky signal. Tested at both viewports each pass. |
| Reliability & robustness | 12% | Clean build, no console errors, graceful empty/edge states, no white-screen on missing token. |
| Usability & info clarity | 8% | Obvious nav, clear "where am I." |
| Code quality & maintainability | 3% | Type safety, single-source data, no dead code. |

**Per-commit procedure:** build + run → exercise changed surface hands-on at desktop **and** mobile widths → regression-sweep adjacent flows + hard-refresh persistence check → score each category → verdict (Ship / Fix-forward / Regression) → re-rank this backlog.
