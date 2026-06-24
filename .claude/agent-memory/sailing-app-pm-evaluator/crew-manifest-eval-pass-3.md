---
name: crew-manifest-eval-pass-3
description: CM-005 confirmation pass for commit c88fd3e (2026-06-24). Calendar dates verified all 8 legs. No regression. Backlog empty. Feature complete.
metadata:
  type: project
---

## Crew Manifest — Eval Pass 3 / CM-005 Confirmation (2026-06-24)

**Commit tested:** c88fd3e (CM-005: calendar dates on crew leg cards)
**Scope:** Focused confirmation pass — date rendering, regression spot-check. Full AC suite not re-run (all 12 passed in pass 2; no auth/API/store/proxy changes in this commit).

### What was added
- `lib/data/voyage.ts`: VOYAGE_START_DATE = "2027-06-19"; `dateForDay(n)` and `formatVoyageDateRange(start, end)` UTC helpers.
- `lib/crew/legs.ts`: `CrewLeg.dateRange` field, derived from `formatVoyageDateRange`.
- `lib/crew/types.ts`: `RosterLeg.dateRange: string` added.
- `lib/crew/roster.ts`: passes `dateRange` through from `crewLegs()`.
- `CrewManifest.tsx`: renders "Days {dayRange} · {dateRange}" in the card subtitle.

### Date Correctness Verification
Independent Python calculation against itinerary day ranges (verified match) vs. developer-stated values:

| Leg | Days | API dateRange | Expected | Match |
|---|---|---|---|---|
| lake-michigan | 1–6 | Jun 19–24 | Jun 19–24 | PASS |
| north-channel | 7–12 | Jun 25–30 | Jun 25–30 | PASS |
| lake-huron | 13–14 | Jul 1–2 | Jul 1–2 | PASS |
| st-clair | 15 | Jul 3 | Jul 3 | PASS |
| lake-erie | 16–19 | Jul 4–7 | Jul 4–7 | PASS |
| erie-canal | 20–27 | Jul 8–15 | Jul 8–15 | PASS |
| hudson | 28–31 | Jul 16–19 | Jul 16–19 | PASS |
| sound-saybrook | 32–35 | Jul 20–23 | Jul 20–23 | PASS |

All 8 correct. The en-dash and same-month format (Jun 19–24 not "Jun 19 – Jun 24") is correct per the `formatVoyageDateRange` logic.

### Erie Canal confirmation
Rendered: "Days 20–27 · Jul 8–15" with Reserved badge. No reason stated. Privacy preserved.

### Regression checks
- tsc --noEmit: clean
- next build: clean (11 routes, same as pass 2)
- Existing pages /, /map, /itinerary, /checklists, /journal: all 200
- Auth gate (/crew no cookie → 307; forged cookie on API → 401): confirmed
- Erie Canal POST → 403: confirmed
- Sign-up flow (lake-huron): 201, roster returns dateRange field correctly

### Privacy
Same README.md "font family for Vercel" boilerplate (pre-existing). Zero crew-feature hits. voyage.ts contains no private information.

### Revised Scores (affected dimensions only)
- Domain Fit (Sailing): 4/5 → **5/5** — Crew members can now evaluate legs by actual calendar date (e.g., "Jul 4–7 for Lake Erie" tells a potential crew member exactly when to request time off). The one real sailor gap from pass 2 is resolved.
- Visual & Interaction Polish: 4/5 → **5/5** — The "Days 7–12 · Jun 25–30" format is clean, scannable, and doesn't add visual noise. Same-month compaction (Jun 19–24 not Jun 19 – Jun 24) is the right call.

**Updated average: (5+5+5+5+5+5+5)/7 = 5.0/5.0** — or more precisely, not lower than 4.86 given the two dimensions moving from 4 to 5.

### CM-005 Status: RESOLVED
Acceptance: "Each leg card shows a calendar date range derived from the voyage start date. Erie Canal shows its date range but remains closed with no reason. Dates are correct per Day 1 = June 19, 2027."

### Backlog Status: EMPTY
No open items. Feature complete on claude/task-4t29bo.
