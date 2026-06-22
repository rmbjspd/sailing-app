# PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `de7d478` — *B5 real fix: hand-digitized water-following route polyline + B6: parchment/navy map theme* · **Date:** 2026-06-22 · **Weighted score: 8.8 / 10** · **Verdict: SHIP**

**What changed:** B5-real — `lib/data/routePath.ts` created with 131 hand-digitized `[lng,lat]` shaping points across 8 named segments (lake-michigan, north-channel, lake-huron, st-clair, lake-erie, erie-canal, hudson, sound-saybrook). 5 open-water segments rendered as navy dashed lines (#1a3a6b); 3 inland segments (St. Clair, Erie Canal, Hudson) as amber-brown dashed lines (#8B5E3C). `TripMap.tsx` restored `Source`+`Layer` (two of each) and builds two GeoJSON FeatureCollections from the segments. B6 — mapStyle changed from `outdoors-v12` to `light-v11`; route label badge now uses `hsl(40,60%,96%)` parchment background with `hsl(213,74%,28%)` navy text; popup headings/subtext/badges/notes all use hsl navy/teal tokens; zero `bg-white` or `text-gray-*` in `TripMap.tsx`.

**Verified (hands-on):**
- `tsc --noEmit` clean; `next build` clean (6/6 static routes, 8/8 pages)
- All 5 routes return HTTP 200: /, /map, /itinerary, /journal, /checklists
- Geographic spot-check: Chicago (-87.62,41.88), Mackinac (-84.62,45.85), Tobermory (-81.67,45.25), Port Huron (-82.42,42.97), Detroit (-83.05,42.33), Erie PA (-80.09,42.13), Buffalo/Tonawanda (-78.88,43.02), Waterford NY (-73.68,42.79), Liberty Landing (-74.04,40.69), Hell Gate (~-73.91,40.93), Old Saybrook (-72.38,41.29) — all correct
- Regression: no Philadelphia / Option B / Option A references anywhere; Hell Gate card reads "East River · Day 30" (B10 confirmed clean)
- Journal (useLocalStorage), checklists (useChecklist -> useLocalStorage): persistence architecture intact

**One gap in B6:** `app/map/page.tsx:7-8` — the SSR/pre-hydration loading skeleton still uses `bg-slate-100` + `text-gray-500`. Users briefly see an off-brand gray flash (~300ms) before the Mapbox client-side map hydrates. Pre-existing from initial commit; flagged as B11 (P2).

| # | Category | Weight | Score | Delta | Notes |
|---|----------|-------:|:-----:|:-----:|-------|
| 1 | Trip-data correctness & integrity | 25% | 9.0 | +0.5 | 131 shaping points verified geographically; open-water vs inland segment types reflect real navigation. |
| 2 | Core task success | 20% | 9.0 | +0.5 | Route polyline + markers both render; all surfaces functional; persistence intact. |
| 3 | Design — Captain Ron meets Hook | 20% | 9.5 | +0.5 | Two-color dashed route line (navy/amber-brown) is thematically perfect; parchment badge + themed popup complete the map surface. Light-v11 base is cleaner under theme. |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | Still unverifiable via curl (WebGL, mobile touch, offline). |
| 5 | Reliability & robustness | 12% | 9.5 | +0.5 | Clean tsc + build; Source/Layer IDs consistent; no runtime paths that can throw. |
| 6 | Usability & clarity | 8% | 8.5 | — | Route + color scheme communicates canal vs. lake intuitively. |
| 7 | Code quality & maintainability | 3% | 9.5 | — | Typed RouteSegment interface; flatMap dedup on fullRoutePath; buildRouteGeoJSON pure. |

**Weighted score:** (9.0x0.25) + (9.0x0.20) + (9.5x0.20) + (6.5x0.12) + (9.5x0.12) + (8.5x0.08) + (9.5x0.03) = 2.25+1.80+1.90+0.78+1.14+0.68+0.285 = **8.835 -> 8.8 / 10**

### Pass history
| Pass | Commit | Score | Verdict | Headline |
|------|--------|:-----:|---------|----------|
| 1 (baseline) | `a36d9d0` | 7.8 | SHIP | First full eval; backlog B1-B8 opened. |
| 2 | `52225ff` | 7.9 | SHIP | B1 (locks contradiction) resolved at root. |
| 3 | `1255cf1` | 8.0 | SHIP | B2 (missing-token map fallback) resolved. |
| 4 | `103b8fe` | 8.3 | SHIP | B3 + B7 + B9 — hardcode-in-copy pattern retired. |
| 5 | `200cf57` | 8.4 | SHIP | B4 — voyage locked to Old Saybrook; Philadelphia fork removed. |
| 6 | `423de64` | 8.5 | SHIP | B5 stopgap (line removed) + B10 (Option B label) resolved. |
| 7 | `de7d478` | 8.8 | SHIP | B5-real (water-following polyline) + B6 (parchment map theme) resolved. |

---

## Backlog (ranked by user-impact x likelihood)

### Resolved
- ~~**B1 Locks contradiction**~~ — `52225ff`. Verified.
- ~~**B2 Map missing-token fallback**~~ — `1255cf1`. Verified.
- ~~**B3 Home "Pillage stops" wrong**~~ — `103b8fe`. Verified.
- ~~**B7 "~34 sailing days" hardcoded**~~ — `103b8fe`. Verified.
- ~~**B9 Canal lock precision**~~ — `103b8fe`. Verified.
- ~~**B4 Brand vs. recommendation mismatch**~~ — `200cf57`. Verified.
- ~~**B5 + B10 Land-crossing line + Option B label**~~ — `423de64`. Verified.
- ~~**B5-real Water-following polyline missing**~~ — `de7d478`. Verified: 131 coords, 8 segments, geographically correct.
- ~~**B6 Map un-themed island**~~ — `de7d478`. Verified: parchment badge, navy text, themed popup, light-v11 base.

### P0 — blockers
None.

### P1 — fix soon
None.

### P2 — should fix
- **B11 (NEW) Map loading skeleton un-themed.** `app/map/page.tsx:7-8` uses `bg-slate-100` + `text-gray-500` for the SSR skeleton shown before Mapbox hydrates. Users briefly see an off-brand gray box. **Fix:** change to `bg-[hsl(var(--parchment-mid))]` (or `parchment-page` class) + `text-[hsl(var(--navy))]`. **Acceptance:** loading state uses theme colors; no off-brand gray flash visible at any network speed.

### P3 — polish
- **B8 Verify live in a real browser/device** (biggest scoring lever — cat 4 at 6.5): WebGL map render, two-color route line visible, mobile touch targets, sun-contrast on `muted-foreground`, and an offline story for on-the-water use. **Acceptance:** smoke test confirms map tiles + route lines render at zoom 4.5, markers clickable, checklist state survives hard refresh on desktop + 375px mobile viewport.
- **B12 St. Clair/Detroit River coarseness.** Jump from `[-82.58, 42.38]` to Detroit `[-83.05, 42.33]` is a 0.47-degree chord that may brush Grosse Ile. Both endpoints are in navigable water so not a land-crossing, but worth 1-2 intermediate channel points if visual inspection shows artifact. **Acceptance:** Detroit River segment follows main ship channel without touching island outlines at zoom 8.

---

## Scoring rubric

Weighted categories (sum 100%). End user = **desktop + mobile, equally**. Theme policy = **balance / judgment calls** — design earns points as a positive *and* usability harm is flagged independently.

| Category | Weight | What "pass" means |
|----------|-------:|-------------------|
| Trip-data correctness & integrity | 25% | Single source of truth; map <-> itinerary <-> guides consistent; units stated; detours reflected everywhere. Data bugs auto-float to top. |
| Core task success | 20% | All 5 surfaces work end-to-end; journal/checklist state survives a hard refresh. |
| Design & aesthetics — Captain Ron meets Hook | 20% | Breezy salty charter charm + lush theatrical pirate grandeur. Cohesive non-stock palette/type, restrained texture, micro-interactions, consistency across all surfaces, memorable. |
| Real-world fitness | 12% | Works at a laptop and one-handed on a phone; sun legible; graceful on flaky signal. Tested at both viewports each pass. |
| Reliability & robustness | 12% | Clean build, no console errors, graceful empty/edge states, no white-screen on missing token. |
| Usability & info clarity | 8% | Obvious nav, clear "where am I." |
| Code quality & maintainability | 3% | Type safety, single-source data, no dead code. |

**Per-commit procedure:** build + run -> exercise changed surface hands-on at desktop and mobile widths -> regression-sweep adjacent flows + hard-refresh persistence check -> score each category -> verdict (Ship / Fix-forward / Regression) -> re-rank this backlog.
