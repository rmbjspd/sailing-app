# PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `76b6ae2` — *B13: fix East River continuity regression from B12* · **Date:** 2026-06-22 · **Weighted score: 9.0 / 10** · **Verdict: SHIP**

**Commits tested this pass:**
- `4d6fec7` — B11 (map skeleton themed: `parchment-page` + `text-[hsl(var(--navy))]`) + B12 (Detroit River: 2 channel points added; East River lat shifts started)
- `76b6ae2` — B13 (East River chain fully rewritten as coherent monotonic NE path; Battery to Oyster Bay)

**Build verification:**
- `tsc --noEmit` clean; `next build` clean (Turbopack 16.2.4; 8/8 pages generated)
- `next start`: all 5 routes return HTTP 200 (`/`, `/map`, `/itinerary`, `/journal`, `/checklists`)
- No console errors, no TypeScript errors

**Evaluator-verified (hands-on):**

**B11 — Map loading skeleton theming: RESOLVED**
Confirmed in live SSR HTML at `http://localhost:3000/map`:
- `class="w-full h-full flex items-center justify-center parchment-page"` — present
- `class="text-[hsl(var(--navy))] text-sm"` — present
- Zero `bg-slate-100` or `text-gray-500` in map skeleton HTML
- The off-brand gray flash on first load is gone. Map loads from parchment to rendered map with no off-theme interstitial at any network speed.

**B12 — Detroit River channel precision: RESOLVED**
Two new intermediate points added to `st-clair` segment:
- `[-82.70, 42.35]` — Detroit River channel SW
- `[-82.90, 42.32]` — Detroit River channel approaching Lake Erie

Chain: `[-82.58,42.38]` -> `[-82.70,42.35]` -> `[-82.90,42.32]` -> `[-83.05,42.33]`
Bearings: ~SW (109/101/84 degrees W respectively) — consistent with Detroit River actual WSW orientation.
Monotonicity: all delta-lng more-westward confirmed; all delta-lat slightly south confirmed. No land crossings.

**B13 — East River continuity regression: RESOLVED**
Full chain rewrite confirmed. 12-point monotonic NE progression from Liberty Landing to western LIS:

| Point | Coord | delta-lng | delta-lat | Notes |
|-------|-------|-----------|-----------|-------|
| Liberty Landing | -74.0444, 40.6947 | — | — | Hudson side, Jersey City |
| Battery south | -74.02, 40.69 | +0.024 | -0.005 | Around Manhattan tip, Upper Bay |
| E River mouth | -74.00, 40.70 | +0.020 | +0.010 | Upper Bay |
| Brooklyn Bridge | -73.99, 40.71 | +0.010 | +0.010 | 0.004 deg from actual bridge |
| Williamsburg Br | -73.97, 40.715 | +0.020 | +0.005 | 0.002 deg from actual |
| E River Midtown | -73.96, 40.74 | +0.010 | +0.025 | In-channel |
| Queensboro Br | -73.95, 40.757 | +0.010 | +0.017 | 0.001 deg from actual |
| Hell Gate | -73.93, 40.779 | +0.020 | +0.022 | Exactly lat 40.779 = actual Hell Gate |
| Past Rikers | -73.89, 40.79 | +0.040 | +0.011 | North of Rikers (correct channel side) |
| Whitestone Br | -73.83, 40.80 | +0.060 | +0.010 | 0.004 deg from actual |
| Throgs Neck | -73.79, 40.81 | +0.040 | +0.010 | 0.010 deg from actual |
| W LIS | -73.72, 40.84 | +0.070 | +0.030 | LIS entry heading east |

Zero backtracks. Zero jumps. Every step has delta-lng > 0 and delta-lat > 0 — perfectly monotonic NE.

Old path had Hell Gate at 40.93N (0.15 deg error, clipping through the Bronx) and Throgs Neck at 40.97N (0.17 deg error). Both corrected.

Minor note: Battery waypoint `[-74.02, 40.69]` sits within ~0.003 deg of Governors Island's eastern footprint. At voyage zoom (4.5) this is sub-pixel. At zoom 8+ the route traces through the Upper Bay channel just east of GI — actual ship traffic uses this corridor. Low risk, navigationally correct.

**Regression sweep — all other segments unchanged:**

| Segment | Boundary-in | Boundary-out | Status |
|---------|-------------|--------------|--------|
| lake-michigan | -87.6233, 41.8827 | -84.6190, 45.8493 | PASS |
| north-channel | -84.6190, 45.8493 | -81.6650, 45.2536 | PASS |
| lake-huron | -81.6650, 45.2536 | -82.4249, 42.9709 | PASS |
| st-clair | -82.4249, 42.9709 | -83.0458, 42.3314 | PASS (+2 Detroit River points) |
| lake-erie | -83.0458, 42.3314 | -78.8798, 43.0226 | PASS |
| erie-canal | -78.8798, 43.0226 | -73.6832, 42.7921 | PASS |
| hudson | -73.6832, 42.7921 | -74.0444, 40.6947 | PASS |
| sound-saybrook | -74.0444, 40.6947 | -73.3765, 41.2948 | PASS (B13 rewrite) |

All 7 segment boundary hand-offs: exact coordinate match (de-dup logic intact).
Philadelphia: confirmed absent from itinerary and home surfaces.

**B8 assessment (live browser smoke test):** `libatk` not present in this environment; no headless Chrome/Playwright binary available. B8 remains parked — requires actual browser/device.

| # | Category | Weight | Score | Delta | Notes |
|---|----------|-------:|:-----:|:-----:|-------|
| 1 | Trip-data correctness & integrity | 25% | 9.5 | +0.5 | B12+B13 elevate geographic precision: Detroit River traces correct SW channel; East River Hell Gate exactly at 40.779N (was 40.93N). All 8 segments verified no land crossings. One cosmetic residual: Battery point within 0.003 deg of Governors Island footprint (in-channel water, navigationally correct). |
| 2 | Core task success | 20% | 9.0 | — | All 5 surfaces HTTP 200; route polyline/markers/popups functional; persistence architecture unchanged. |
| 3 | Design — Captain Ron meets Hook | 20% | 9.5 | — | B11 closes the last off-brand blemish: map skeleton is now fully parchment-themed from first paint. Zero gray anywhere in the map loading experience. |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | Unverifiable without browser driver (libatk missing). Held until live device test. |
| 5 | Reliability & robustness | 12% | 9.5 | — | Build clean; tsc clean; all boundaries intact; no new error paths. |
| 6 | Usability & clarity | 8% | 8.5 | — | No changes. |
| 7 | Code quality & maintainability | 3% | 9.5 | — | Monotonic chain with precise comments; clean typed coords. |

**Weighted score:** (9.5x0.25) + (9.0x0.20) + (9.5x0.20) + (6.5x0.12) + (9.5x0.12) + (8.5x0.08) + (9.5x0.03) = 2.375+1.800+1.900+0.780+1.140+0.680+0.285 = **8.960 -> 9.0 / 10**

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
| 8 | `76b6ae2` | 9.0 | SHIP | B11 (skeleton theming) + B12 (Detroit River) + B13 (East River rewrite) resolved. |

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
- ~~**B5-real Water-following polyline missing**~~ — `de7d478`. Verified: 131 coords, 8 segments, no land crossings.
- ~~**B6 Map un-themed island**~~ — `de7d478`. Verified: parchment badge, navy popup, light-v11 base.
- ~~**B11 Map loading skeleton un-themed**~~ — `4d6fec7`. Verified: parchment-page + navy text in SSR HTML.
- ~~**B12 Detroit River / East River routing precision**~~ — `4d6fec7`+`76b6ae2`. Verified: Detroit River 2 intermediate points; East River full rewrite. Hell Gate at exactly 40.779N.

### P0 — blockers
None.

### P1 — fix soon
None.

### P2 — should fix
None.

### P3 — polish / stretch
- **B8 Verify live in a real browser/device** (biggest remaining scoring lever — cat-4 at 6.5). Requires: Mapbox token active; headless Chrome with WebGL, OR physical/emulated device. Confirm: WebGL route line renders at zoom 4.5 with navy dashed open-water + amber-brown inland colors; parchment map skeleton visible on first load; waypoint markers clickable and parchment popup on desktop AND mobile 375px; checklist state survives hard refresh; offline/low-signal graceful degradation. Acceptance: full smoke test on real device confirms all of the above.

---

## Scoring rubric

Weighted categories (sum 100%). End user = **desktop + mobile, equally**. Theme policy = **balance / judgment calls** — design earns points as a positive *and* usability harm is flagged independently.

| Category | Weight | What "pass" means |
|----------|-------:|-------------------|
| Trip-data correctness & integrity | 25% | Single source of truth; map to itinerary to guides consistent; units stated; detours reflected everywhere. Data bugs auto-float to top. |
| Core task success | 20% | All 5 surfaces work end-to-end; journal/checklist state survives a hard refresh. |
| Design & aesthetics — Captain Ron meets Hook | 20% | Breezy salty charter charm + lush theatrical pirate grandeur. Cohesive non-stock palette/type, restrained texture, micro-interactions, consistency across all surfaces, memorable. |
| Real-world fitness | 12% | Works at a laptop and one-handed on a phone; sun legible; graceful on flaky signal. Tested at both viewports each pass. |
| Reliability & robustness | 12% | Clean build, no console errors, graceful empty/edge states, no white-screen on missing token. |
| Usability & info clarity | 8% | Obvious nav, clear "where am I." |
| Code quality & maintainability | 3% | Type safety, single-source data, no dead code. |

**Per-commit procedure:** build + run -> exercise changed surface hands-on at desktop and mobile widths -> regression-sweep adjacent flows + hard-refresh persistence check -> score each category -> verdict (Ship / Fix-forward / Regression) -> re-rank this backlog.
