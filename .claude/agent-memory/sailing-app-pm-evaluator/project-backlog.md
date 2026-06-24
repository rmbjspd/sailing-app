---
name: project-backlog
description: Current prioritized backlog for the sailing app — updated after each eval pass
metadata:
  type: project
---

## Backlog — Updated 2026-06-24 (Crew Manifest Eval Pass 2 — LOOP EXIT)

### Active Items

#### P3 — Nice-to-have (deferred, not exit-blocking)
- **CM-005** — Calendar dates alongside day numbers on leg cards. No canonical voyage start date exists in app data (only "2027" / "8 weeks"). Inventing a date risks inaccuracy. Flag for captain to provide start date; then derive and display calendar dates per leg.

### Crew Manifest Feature Status: COMPLETE on claude/task-4t29bo
All 12 acceptance criteria PASS. Average dimension score 4.71/5.0. Zero P0/P1/P2 defects. Privacy sign-off confirmed. Loop exit conditions met.

### Resolved Items (Crew Manifest — all fixed in dda57c7)
- CM-001 (P1): Loading/error state for roster refetch — FIXED
- CM-002 (P2): Form input aria-labels — FIXED
- CM-003 (P2): Expand affordance on member rows — FIXED
- CM-004 (P2): Browser tab titles — FIXED
- CM-006 (P3): Sign out aria-label on mobile — FIXED

### Previously Resolved (pre Crew Manifest)
All great-lakes-passage-critic items TP-1 through TP-18 were resolved as of 2026-06-23.
All prior eval pass items B1-B18 (from original app evaluation) were resolved as of 2026-06-23.

### Known non-bugs / design decisions:
- Map page renders "Loading map..." in static curl — JS-rendered client-side (Leaflet). Expected behavior.
- Waypoints skip day numbers 6/20/31 (layover days). Correct by design.
- Crew withdraw is open to any authenticated user (deliberate, accepted per contract §1D).
- Contact info visible to all authenticated users (deliberate per contract §1F).
- README "font family for Vercel" is Next.js boilerplate — not a privacy leak (confirmed AC7 sign-off).

### Loop Exit Criteria Tracking (Crew Manifest)
- [x] AC1-AC12 all pass on single eval pass — CONFIRMED (pass 2, 2026-06-24)
- [x] Zero P0/P1 defects — CONFIRMED
- [x] tsc + next build clean — CONFIRMED
- [x] Average dimension score ≥ 4.5/5.0 — CONFIRMED (4.71/5.0)
- [x] Privacy sign-off (AC7 + git log) — CONFIRMED
