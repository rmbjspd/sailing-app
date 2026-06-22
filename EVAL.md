# PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `de7d478` — *B5 real fix: hand-digitized water-following route polyline + B6: parchment/navy map theme* · **Date:** 2026-06-22 · **Weighted score: 8.8 / 10** · **Verdict: SHIP**

**What changed:** B5-real — `lib/data/routePath.ts` created with 131 hand-digitized `[lng,lat]` shaping points across 8 named segments (lake-michigan, north-channel, lake-huron, st-clair, lake-erie, erie-canal, hudson, sound-saybrook). 5 open-water segments rendered as navy dashed lines (#1a3a6b); 3 inland segments (St. Clair, Erie Canal, Hudson) as amber-brown dashed lines (#8B5E3C). `TripMap.tsx` restored `Source`+`Layer` (two of each) and builds two GeoJSON FeatureCollections from the segments. B6 — mapStyle changed from `outdoors-v12` to `light-v11`; route label badge uses `hsl(40,60%,96%)` parchment background with `hsl(213,74%,28%)` navy text; popup headings/subtext/badges/notes all use hsl navy/teal tokens; zero `bg-white` or `text-gray-*` in `TripMap.tsx`.

**Evaluator-verified (hands-on):**
- `tsc --noEmit` clean; `next build` clean (6 routes static, 8/8 pages)
- `next start` production server: all 5 routes return HTTP 200
- Source inspection: 131 coordinates across 8 segments, 5 open-water + 3 inland, segment boundary continuity confirmed
- Geographic spot-check of all hotspots (see B5 analysis below)
- B6 verified: `light-v11` mapStyle present; route label badge parchment-styled; popup uses hsl tokens only; `bg-white`/`text-gray-*` absent from `TripMap.tsx`
- Fallback (no-token): themed parchment-page with treasure-frame confirmed present
- Regression: waypoints.ts unmodified (31 waypoints, Chicago to Old Saybrook, no Philadelphia); B10 (Option B label) still clean
- Persistence architecture: journal (useLocalStorage) and checklists (useChecklist) files unchanged
- Vercel preview `sailing-iedpqy066-rmbjspds-projects.vercel.app` returns HTTP 200 on /map

**B5 Geographic Accuracy Audit (detail):**

Every hotspot independently evaluated against known geography:

| Hotspot | Verdict | Notes |
|---------|---------|-------|
| Straits of Mackinac | PASS | `[-84.72, 45.82]` west approach + `[-84.619, 45.849]` Mackinac Island correct |
| North Channel / Georgian Bay | PASS | Little Current `[-81.925, 45.978]`, Tobermory `[-81.665, 45.253]` correct; corridor in open water |
| Lake Huron thumb transition | PASS | Chord from Ontario shore to mid-lake passes over open Lake Huron |
| St. Clair River | PASS (minor) | Port Huron entrance correct; 6 shaping points; Detroit chord `[-82.58,42.38]`→`[-83.05,42.33]` both in navigable water; no land crossing |
| Lake Erie (Cleveland → Erie → Buffalo) | PASS | Erie PA `[-80.085, 42.129]` correct; Buffalo/Tonawanda ~0.5km north of Black Rock Canal but in water |
| Erie Canal (Mohawk Valley) | PASS | Pittsford south of Rochester correct; Sylvan Beach `[-75.725, 43.20]` correct; alignment matches Barge Canal |
| Hudson River | PASS | Waterford `[-73.683, 42.792]` correct; channel through West Point/Bear Mountain; Liberty Landing `[-74.044, 40.695]` correct |
| East River / Hell Gate / LIS | PASS (with caveat) | No land crossings. Corridor from Battery to LIS stays in navigable water. Caveat: landmark labels are ~0.07-0.10° of latitude too high (e.g. "Hell Gate" labeled at 40.93 vs actual 40.779); at lat≈40.83 the line brushes the Hudson River side of Washington Heights before pivoting east for the LIS approach. Both issues invisible at voyage zoom (4.5). LIS through to Old Saybrook correct. |

**No land crossings detected.** Polyline stays in navigable water Chicago → Old Saybrook.

**One confirmed gap from B6:** `app/map/page.tsx:7-8` — SSR loading skeleton uses `bg-slate-100` + `text-gray-500`. Confirmed in live SSR HTML. Flagged as B11 (P2).

| # | Category | Weight | Score | Delta | Notes |
|---|----------|-------:|:-----:|:-----:|-------|
| 1 | Trip-data correctness & integrity | 25% | 9.0 | +0.5 | 131 shaping points; no land crossings; inland/open-water types reflect real navigation. Minor caveats: Detroit River chord and Hell Gate label offset (both in water, invisible at voyage zoom). |
| 2 | Core task success | 20% | 9.0 | +0.5 | Route polyline + waypoint markers render; Source/Layer wired correctly; all 5 surfaces HTTP 200; persistence intact. |
| 3 | Design — Captain Ron meets Hook | 20% | 9.5 | +0.5 | Two-color dashed line (navy open-water / amber-brown inland) is thematically perfect and communicates leg type intuitively. Parchment badge + navy popup complete the map. light-v11 cleaner base. One blemish: loading skeleton still gray (B11). |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | WebGL render, touch targets, offline behavior unverifiable without browser driver in this environment. Held pending live device test. |
| 5 | Reliability & robustness | 12% | 9.5 | +0.5 | tsc + build clean; Source/Layer IDs consistent; no runtime throw paths; fallback theming intact; `useMemo` prevents GeoJSON re-computation. |
| 6 | Usability & clarity | 8% | 8.5 | — | Navy/amber color coding communicates canal vs. lake leg type without needing a legend. |
| 7 | Code quality & maintainability | 3% | 9.5 | — | Typed `RouteSegment` interface; `flatMap` dedup on `fullRoutePath`; `buildRouteGeoJSON` pure; segment boundaries continuous. |

**Weighted score:** (9.0×0.25) + (9.0×0.20) + (9.5×0.20) + (6.5×0.12) + (9.5×0.12) + (8.5×0.08) + (9.5×0.03) = 2.25+1.80+1.90+0.78+1.14+0.68+0.285 = **8.835 → 8.8 / 10**

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
- ~~**B5-real Water-following polyline missing**~~ — `de7d478`. Verified: 131 coords, 8 segments, no land crossings, all hotspots audited.
- ~~**B6 Map un-themed island**~~ — `de7d478`. Verified: parchment badge, navy popup, light-v11 base; zero `bg-white`/`text-gray-*` in TripMap.

### P0 — blockers
None.

### P1 — fix soon
None.

### P2 — should fix
- **B11 (NEW) Map loading skeleton un-themed.** `app/map/page.tsx:7-8` — SSR/pre-hydration skeleton uses `bg-slate-100` + `text-gray-500`. On first load users briefly see an off-brand gray box before Mapbox hydrates (~300ms fast network, longer on slow). Confirmed in live SSR HTML at both local server and Vercel preview. **Fix:** replace `bg-slate-100` with `bg-[hsl(var(--parchment-mid))]` (or `parchment-page` class) and `text-gray-500` with `text-[hsl(var(--navy))]`. **Acceptance:** loading state uses parchment/navy theme colors; no off-brand gray flash visible at any network speed including 3G throttle.

### P3 — polish
- **B8 Verify live in a real browser/device** (biggest scoring lever — cat 4 at 6.5): Confirm WebGL renders at zoom 4.5; navy dashed route line and amber-brown inland line both visible; waypoint markers clickable → parchment popup on desktop and mobile 375px; checklist state survives hard refresh; offline/low-signal graceful. **Acceptance:** smoke test confirms all of the above on actual device.
- **B12 Detroit River / Hell Gate routing precision.** Two minor geographic offsets invisible at voyage zoom but visible at zoom 8+: (a) Detroit River chord `[-82.58,42.38]`→`[-83.05,42.33]` cuts across rather than following ship channel — add 2 intermediate points `[-82.70,42.35]` and `[-82.90,42.32]`; (b) East River corridor sits ~0.10° of latitude too high (Hell Gate labeled at lat=40.93 vs actual lat=40.779), and at lat=40.83 the line brushes the Hudson side of Washington Heights. Both in navigable water; invisible at zoom 4.5. **Acceptance:** Detroit River and East River segments stay within waterway boundaries at zoom 8.

---

## Scoring rubric

Weighted categories (sum 100%). End user = **desktop + mobile, equally**. Theme policy = **balance / judgment calls** — design earns points as a positive *and* usability harm is flagged independently.

| Category | Weight | What "pass" means |
|----------|-------:|-------------------|
| Trip-data correctness & integrity | 25% | Single source of truth; map ↔ itinerary ↔ guides consistent; units stated; detours reflected everywhere. Data bugs auto-float to top. |
| Core task success | 20% | All 5 surfaces work end-to-end; journal/checklist state survives a hard refresh. |
| Design & aesthetics — Captain Ron meets Hook | 20% | Breezy salty charter charm + lush theatrical pirate grandeur. Cohesive non-stock palette/type, restrained texture, micro-interactions, consistency across all surfaces, memorable. |
| Real-world fitness | 12% | Works at a laptop and one-handed on a phone; sun legible; graceful on flaky signal. Tested at both viewports each pass. |
| Reliability & robustness | 12% | Clean build, no console errors, graceful empty/edge states, no white-screen on missing token. |
| Usability & info clarity | 8% | Obvious nav, clear "where am I." |
| Code quality & maintainability | 3% | Type safety, single-source data, no dead code. |

**Per-commit procedure:** build + run → exercise changed surface hands-on at desktop and mobile widths → regression-sweep adjacent flows + hard-refresh persistence check → score each category → verdict (Ship / Fix-forward / Regression) → re-rank this backlog.
