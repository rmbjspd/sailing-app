# 📋 PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `1255cf1` — *B2: graceful fallback when Mapbox token is missing* · **Date:** 2026-06-22 · **Weighted score: 8.0 / 10** · **Verdict: SHIP**

**What changed:** Dropped the `!` non-null assertion on `NEXT_PUBLIC_MAPBOX_TOKEN`; when the token is absent, `TripMap` now early-returns an on-theme "Chart Unavailable" parchment panel (explains the missing env var, links to the Ship's Log) instead of a blank/erroring canvas.

**Verified (hands-on):** clean `next build` (compiled OK, 8/8 static, `/map` still prerenders). Confirmed the early-return sits **after** all hooks (`useState` ×2, `useMemo` ×2 → `if (!TOKEN)` at line 32) so rules-of-hooks holds; TS narrows `TOKEN` to `string` for the live-map path. Fallback uses `treasure-frame` + Pirata font → stays in theme. ✅

| # | Category | Weight | Score | Δ | Notes |
|---|----------|-------:|:-----:|:--:|-------|
| 1 | Trip-data correctness & integrity | 25% | 7.5 | — | B3 & B7 (hardcode-in-copy) still open. |
| 2 | Core task success | 20% | 8.5 | — | All surfaces work; journal CRUD + empty state; checklist toggle/reset/progress; map route toggle. |
| 3 | Design — *Captain Ron meets Hook* | 20% | 9.0 | — | Cohesive & memorable; fallback panel stays on-theme. |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | Responsive patterns present; no offline story; live mobile unverified (B8). |
| 5 | Reliability & robustness | 12% | 8.5 | ▲ +1.0 | Missing-token map crash fixed with a graceful, hooks-safe fallback (B2). |
| 6 | Usability & clarity | 8% | 7.5 | — | Brand says "Philadelphia" while app *recommends* Old Saybrook (B4). |
| 7 | Code quality & maintainability | 3% | 9.0 | — | Type-safe, single-source data, clean components. |

### Pass history
| Pass | Commit | Score | Verdict | Headline |
|------|--------|:-----:|---------|----------|
| 1 (baseline) | `a36d9d0` | 7.8 | SHIP | First full eval; backlog B1–B8 opened. |
| 2 | `52225ff` | 7.9 | SHIP | B1 (locks contradiction) resolved at root. |
| 3 | `1255cf1` | 8.0 | SHIP | B2 (missing-token map fallback) resolved. |

---

## Backlog (ranked by user-impact × likelihood)

### ✅ Resolved
- ~~**B1 · Locks contradiction**~~ — `52225ff`; both figures derive from `tripTotals` (28). Verified.
- ~~**B2 · Map missing-token fallback**~~ — `1255cf1`; on-theme "Chart Unavailable" panel, hooks-safe. Verified.

### P0 — blockers
_None._ 🎉

### P1 — fix soon
- **B3 · Home "Pillage stops" list is wrong (data).** `app/page.tsx:313` advertises *"Oyster Bay, Greenport, Mystic, Essex"* — but Mystic & Essex aren't overnight stops, and Port Jefferson (a real stop) is omitted. Align with `waypoints.ts`. _Data bug → auto-floated to top P1. Same hardcode-in-copy root cause as the old B1._

### P2 — should fix
- **B4 · Brand vs. recommendation mismatch.** Hero + nav + logo all say *Chicago → Philadelphia* (Option A), yet Option B (Old Saybrook) is **Recommended** and the **map default**. Pick a canonical framing.
- **B5 · Route line resurrected + geographically crude.** `TripMap.tsx` still draws a dashed line despite commit `eb715de` ("Remove route lines from map"). It connects ports with straight rhumb lines that cut across land. Confirm intent or re-remove.
- **B6 · Map is an un-themed island.** Default Mapbox `outdoors-v12` + white/gray popups break the parchment/pirate aesthetic (cat-3 consistency).

### P3 — polish
- **B7 · `app/itinerary/page.tsx:47`** hardcodes "~34 sailing days" — derive (33 saybrook / 34 philly). _Same root cause as B1 / B3._
- **B8 · Verify live in a real browser/device:** WebGL map render, mobile touch targets, sun-contrast on `muted-foreground` over parchment.
- **B9 · Canal lock precision.** "28 transited" under *Canal Transit* counts Black Rock + Troy (non-canal); Erie-Canal-only is 26. Cosmetic — figures already agree.

> **Recurring theme:** B3 and B7 share the root cause B1 fixed — hardcoded values in presentational copy contradicting the derived data model. B3 is next up; closing it (and B7) would retire the pattern entirely.

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
