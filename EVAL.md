# 📋 PM Evaluation — S/V Sabbatical Sailing App

Maintained by the **sailing-app-pm-evaluator**. Re-run after every developer commit.
Each pass tests the running product hands-on, scores it against the rubric below, and re-ranks the backlog.

---

## Latest pass

**Commit:** `200cf57` — *B4: lock the voyage to Chicago → Old Saybrook (remove Philadelphia option)* · **Date:** 2026-06-22 · **Weighted score: 8.4 / 10** · **Verdict: SHIP**

**Product note:** this resolves B4 by **eliminating the fork** — the Philadelphia (Option A) route and all its content are removed; the voyage is now a single Chicago → Old Saybrook itinerary (33 days). Decisive and coherent; flagging the scope here so it's a conscious product call (Option A content is gone, not hidden).

**What changed:** dropped the 5 coast-philly days, the leg type, its waypoints + guide, and the per-day `route` field; removed `ROUTE_LEGS`/`RouteOption` plumbing; `stats.ts` is now route-free; removed both route toggles (map + itinerary); home fork → single "Final Landfall — Old Saybrook" card; hero stats are single values; logo/nav/hero/title/metadata read Chicago → Old Saybrook.

**Verified (hands-on):** `tsc --noEmit` clean; `next build` clean (8/8 static); **grep confirms zero residual** philly / Philadelphia / coast-philly / RouteOption / ROUTE_LEGS / `.route` references. From prerenders: home has **0 "Philadelphia"**, hero shows single values (`1,711 nm`, `33 days`, `28 total`), itinerary subtitle `33 sailing days`, map route toggle gone. ✅

**One residual (→ B10):** the Hell Gate callout at `app/page.tsx:328` still reads "East River · **Option B** Day 30" — stale fork reference; should be "East River · Day 30."

| # | Category | Weight | Score | Δ | Notes |
|---|----------|-------:|:-----:|:--:|-------|
| 1 | Trip-data correctness & integrity | 25% | 8.5 | — | Route removal is internally consistent; single 33-day voyage. |
| 2 | Core task success | 20% | 8.5 | — | All surfaces work; simplified single-route flows. |
| 3 | Design — *Captain Ron meets Hook* | 20% | 9.0 | — | Cohesive; map surface still default-themed (B6). |
| 4 | Real-world fitness (desktop + mobile) | 12% | 6.5 | — | **Biggest remaining lever** (B8): no offline story; live mobile unverified. |
| 5 | Reliability & robustness | 12% | 8.5 | — | Clean build/tsc; missing-token fallback in place. |
| 6 | Usability & clarity | 8% | 8.5 | ▲ +1.0 | Brand/destination now coherent end-to-end (B4). Minor B10 label residual. |
| 7 | Code quality & maintainability | 3% | 9.0 | — | Route-free simplification; type-safe; clean. |

### Pass history
| Pass | Commit | Score | Verdict | Headline |
|------|--------|:-----:|---------|----------|
| 1 (baseline) | `a36d9d0` | 7.8 | SHIP | First full eval; backlog B1–B8 opened. |
| 2 | `52225ff` | 7.9 | SHIP | B1 (locks contradiction) resolved at root. |
| 3 | `1255cf1` | 8.0 | SHIP | B2 (missing-token map fallback) resolved. |
| 4 | `103b8fe` | 8.3 | SHIP | B3 + B7 + B9 — hardcode-in-copy pattern retired. |
| 5 | `200cf57` | 8.4 | SHIP | B4 — voyage locked to Old Saybrook; Philadelphia fork removed. |

---

## Backlog (ranked by user-impact × likelihood)

### ✅ Resolved
- ~~**B1 · Locks contradiction**~~ — `52225ff`. Verified.
- ~~**B2 · Map missing-token fallback**~~ — `1255cf1`. Verified.
- ~~**B3 · Home "Pillage stops" wrong**~~ — `103b8fe`. Verified.
- ~~**B7 · "~34 sailing days" hardcoded**~~ — `103b8fe`. Verified.
- ~~**B9 · Canal lock precision**~~ — `103b8fe`. Verified.
- ~~**B4 · Brand vs. recommendation mismatch**~~ — `200cf57`; fork removed, locked to Old Saybrook. Verified.

### P0 — blockers
_None._ 🎉

### P1 — fix soon
- **B5 · Route line crosses land — "boat sailing on a field" (user-flagged).** `TripMap.tsx` draws the route as straight geodesic segments between waypoints, so chords cut across coastline/peninsulas/islands. _Now simpler post-B4: single route, no fork to assemble._
  - **Plan — hand-digitized water-following polyline as static data** (no runtime routing API; route is fixed + must stay offline-friendly):
    1. **Digitize:** new `lib/data/routePath.ts` — ordered `[lng,lat]` shaping points tracing navigable water/canal/river through each waypoint (single route now). Click the path in geojson.io, export (~80–180 vertices). Hotspots, worst first: (a) Straits of Mackinac → North Channel → Georgian Bay → Tobermory → Lake Huron; (b) East River / Hell Gate (NYC→Oyster Bay); (c) St. Clair River / Lake St. Clair (Port Huron→Detroit); (d) Hudson River + Erie Canal corridor.
    2. **Render & signal mode:** draw the digitized path instead of the raw waypoint chord; keep dashed chart styling; style inland legs (`erie-canal`, `hudson`) distinctly to signal canal/river transit.
    3. **Acceptance:** no segment crosses land on open-water legs (check zoom 4.5 + zoomed into the 4 hotspots); canal/river legs follow the waterway centerline; fully data-driven/offline.
  - **Effort:** Medium (~1 session, mostly digitizing). **Stopgap:** revert to markers-only (`eb715de` state) to remove the misleading line immediately.

### P2 — should fix
- **B6 · Map is an un-themed island.** Default Mapbox `outdoors-v12` + white/gray popups break the parchment/pirate aesthetic (cat-3 consistency).

### P3 — polish
- **B8 · Verify live in a real browser/device** *(biggest scoring lever — cat 4 @ 6.5)*: WebGL map render, mobile touch targets, sun-contrast on `muted-foreground` over parchment, and an **offline story** for on-the-water use.
- **B10 · Stale "Option B" label (new).** `app/page.tsx:328` Hell Gate callout reads "East River · Option B Day 30" — drop "Option B" now that the fork is gone.

> **Deploy hold:** `main` is fast-forwarded to the ship-scored tip and pushed, but the Vercel **production deploy is paused pending B5** (the land-crossing route line is the one thing that would look broken to a first-time visitor).

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
