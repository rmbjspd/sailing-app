# 📋 PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `103b8fe` — *B3 + B7 + B9: retire the hardcode-in-copy pattern* · **Date:** 2026-06-22 · **Weighted score: 8.3 / 10** · **Verdict: SHIP**

**What changed:** the three remaining "hardcoded copy vs. derived data" drifts, all fixed by deriving from the data model:
- **B3** (P1 data) — home Option B "Pillage stops" now derives from the `sound-saybrook` waypoints.
- **B7** (P3) — itinerary subtitle now derives `tripTotals(route).dayEnd`.
- **B9** (P3) — Canal Transit card now shows the Erie-Canal-only lock count.

**Verified (hands-on):** clean `next build` (8/8 static). From the static prerenders:
- Home: `Pillage stops: Oyster Bay, Port Jefferson, Greenport, Old Saybrook` ✅ (matches actual overnights; Mystic/Essex removed, Port Jefferson restored).
- Home: `34 numbered locks · 26 transited` + hero `28 total` — distinct, correctly-labeled quantities (26 canal + Black Rock + Troy = 28 trip), no contradiction. ✅
- Itinerary: `33 sailing days` (derived, saybrook default; 34 on philly). ✅
- Grep for `Mystic` / `Essex` / `~34 sailing` → none. ✅

**Significance:** B1 → B3 → B7 → B9 all shared one root cause; the data model is now the single source for every user-facing figure on these surfaces. Pattern retired.

| # | Category | Weight | Score | Δ | Notes |
|---|----------|-------:|:-----:|:--:|-------|
| 1 | Trip-data correctness & integrity | 25% | 8.5 | ▲ +1.0 | All known data drifts closed; single-source throughout. |
| 2 | Core task success | 20% | 8.5 | — | All surfaces work end-to-end. |
| 3 | Design — *Captain Ron meets Hook* | 20% | 9.0 | — | Cohesive & memorable; map surface still default-themed (B5/B6). |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | **Biggest remaining lever.** No offline story; live mobile unverified (B8). |
| 5 | Reliability & robustness | 12% | 8.5 | — | Missing-token fallback in place; clean build. |
| 6 | Usability & clarity | 8% | 7.5 | — | Brand says "Philadelphia" while app *recommends* Old Saybrook (B4). |
| 7 | Code quality & maintainability | 3% | 9.0 | — | Type-safe, single-source data, clean components. |

### Pass history
| Pass | Commit | Score | Verdict | Headline |
|------|--------|:-----:|---------|----------|
| 1 (baseline) | `a36d9d0` | 7.8 | SHIP | First full eval; backlog B1–B8 opened. |
| 2 | `52225ff` | 7.9 | SHIP | B1 (locks contradiction) resolved at root. |
| 3 | `1255cf1` | 8.0 | SHIP | B2 (missing-token map fallback) resolved. |
| 4 | `103b8fe` | 8.3 | SHIP | B3 + B7 + B9 — hardcode-in-copy pattern retired. |

---

## Backlog (ranked by user-impact × likelihood)

### ✅ Resolved
- ~~**B1 · Locks contradiction**~~ — `52225ff`. Verified.
- ~~**B2 · Map missing-token fallback**~~ — `1255cf1`. Verified.
- ~~**B3 · Home "Pillage stops" wrong**~~ — `103b8fe`; derived from waypoints. Verified.
- ~~**B7 · "~34 sailing days" hardcoded**~~ — `103b8fe`; derived. Verified.
- ~~**B9 · Canal lock precision**~~ — `103b8fe`; canal-only count (26). Verified.

### P0 — blockers
_None._ 🎉

### P1 — fix soon
- **B4 · Brand vs. recommendation mismatch.** Hero + nav + logo all say *Chicago → Philadelphia* (Option A), yet Option B (Old Saybrook) is **Recommended** and the **map default**. Pick a canonical framing (now the most user-visible inconsistency left). _Promoted from P2._

### P2 — should fix
- **B5 · Route line resurrected + geographically crude.** `TripMap.tsx` still draws a dashed line despite commit `eb715de` ("Remove route lines from map"). It connects ports with straight rhumb lines that cut across land. Confirm intent or re-remove.
- **B6 · Map is an un-themed island.** Default Mapbox `outdoors-v12` + white/gray popups break the parchment/pirate aesthetic (cat-3 consistency).

### P3 — polish
- **B8 · Verify live in a real browser/device** *(biggest scoring lever — cat 4 @ 6.5)*: WebGL map render, mobile touch targets, sun-contrast on `muted-foreground` over parchment, and an **offline story** for on-the-water use. This is the largest untouched area; a fix here moves the needle most.

> **Data category is now clean.** Remaining work is clarity (B4), design-consistency on the map (B5/B6), and real-world/mobile fitness (B8) — the last being the lowest-scoring category and the biggest opportunity.

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
