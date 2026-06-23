---
name: project-voyage-state
description: Current canonical state of the S/V Sabbatical voyage plan — days, distance, locks, key structural facts, and what has been evaluated/shipped
metadata:
  type: project
---

## Voyage: Chicago → Old Saybrook, CT (Summer 2027)

**Current state (post-merge claude/task-4t29bo, 2026-06-23):**
- 35 sailing days (was 33 before the great-lakes-passage-critic backlog)
- ~1,711 nm total distance (unchanged through all restructuring)
- 28 locks total (unchanged)
- Boat: Oceanis 30.1 "Sabbatical"
- Route: Lake Michigan → North Channel → Lake Huron → St. Clair/Detroit → Lake Erie → Erie Canal → Hudson River → Long Island Sound

**Key structural change (Phase 1, commit 9c43470):**
- Old Day 23 (Pittsford→Sylvan Beach, 88mi/6 locks, Oneida Lake) → split into:
  - Day 23: Pittsford/Newark → Brewerton, NY (68mi, 6 locks)
  - Day 24: Brewerton → Sylvan Beach (20mi, 0 locks — lake crossing AM)
- Old Day 25 (Ilion→Waterford, 95mi/9 locks) → split into:
  - Day 26: Ilion/Little Falls → Amsterdam (55mi, 5 locks)
  - Day 27: Amsterdam → Waterford (40mi, 4 locks — Flight at dawn)
- All subsequent days renumbered in lockstep: itinerary.ts and waypoints.ts

**Erie Canal section now:** Days 20–27 (was 20–25)
**Hudson River:** Days 28–31
**Long Island Sound:** Days 32–35

**Why:** TP-2 and TP-3 from the passage critique — original Day 23 and Day 25 were physically infeasible (too many miles/locks for a realistic canal day, plus Oneida Lake timing risk).

**How to apply:** Any future evaluation must verify "35 days" on hero; Days 23-27 use the split schedule; Brewerton and Amsterdam are the new waypoints.

## Layover days (share prior overnight's waypoint — no dedicated waypoint entry):
- Day 6 (Mackinac Island layover)
- Day 20 (Tonawanda mast-prep layover)
- Day 31 (NYC layover)

## Evaluation history:
- Eval pass 10 (04b96bc): 9.5/10 SHIP, all 12 criteria met, locked as baseline
- Eval pass 11 (claude/task-4t29bo, 2026-06-23): 9.6/10 SHIP, merged to main
