---
name: project-backlog
description: Current prioritized backlog for the sailing app — updated after each eval pass
metadata:
  type: project
---

## Backlog — Updated 2026-06-24 (Crew Manifest Eval Pass 1)

### Active Items — Crew Manifest (B6–B8 phase)

#### P1 — Major friction / must fix before exit
- **CM-001** — Loading/error state missing for roster refetch. After signup or withdraw, the UI silently refetches with no spinner or error fallback. If session expires mid-use, the user gets no feedback — roster appears stale. Fix: show loading state in CrewManifest during refetch(); show error banner if refetch fails (B6 work).

#### P2 — Polish, notable UX gap
- **CM-002** — Form inputs in SignAboard lack `<label>` elements or `aria-label`. Placeholder-only is not accessible. Screen readers won't announce field names when focused after typing begins. Fix: add visible labels OR aria-label to name/contact/note fields (B7 work).
- **CM-003** — No visual affordance that crew member rows are expandable (chevron is subtle). Users may not discover they can tap/click to reveal contact info. Fix: add a "tap to expand" hint or style the row as clearly interactive (underline name, hover state) (B7 work).
- **CM-004** — Browser tab `<title>` on /crew and /crew/login pages not verified. May be generic Next.js default instead of "Crew Manifest | S/V Sabbatical". Fix: add metadata export to both page.tsx files (B7/B8 work).

#### P3 — Nice-to-have
- **CM-005** — No double-submit guard on the "Sign aboard" toggler button (the one that opens the form). If a user rapidly clicks "Sign aboard" on different cards, multiple forms could theoretically open. The actual submit handler has busy=true guard. Low risk. Fix: disable the toggler while any form is busy (B6 work).
- **CM-006** — "Sign out" label hidden on mobile (<sm breakpoint). Icon-only. Acceptable for tech-savvy crew but could confuse casual users. Consider showing abbreviated text or tooltip (B7 polish).

### Previously Resolved (pre Crew Manifest)
All great-lakes-passage-critic items TP-1 through TP-18 were resolved as of 2026-06-23.
All prior eval pass items B1-B18 (from original app evaluation) were resolved as of 2026-06-23.

### Known non-bugs / design decisions:
- Map page renders "Loading map..." in static curl — JS-rendered client-side (Leaflet). Expected behavior.
- Waypoints skip day numbers 6/20/31 (layover days share prior overnight's waypoint). Correct by design.
- Crew withdraw is open to any authenticated user (deliberate footgun-accepted per contract §1D).
- Contact info visible to all authenticated users (deliberate per contract §1F).
- "family" appears in page HTML only as CSS font-family property (system-ui fallback) — not a privacy leak.

### Loop Exit Criteria Tracking
- [ ] AC1-AC12 all pass on single eval pass — AC10 partial until B6/B7 complete
- [ ] Zero P0/P1 defects — CM-001 is P1 (open)
- [ ] tsc + next build clean — PASS (as of pass 1)
- [ ] Average dimension score ≥ 4.5/5.0 — NOT YET (scored 4.0 avg, see pass 1 report)
- [ ] Privacy sign-off — PASS (AC7 confirmed clean)
