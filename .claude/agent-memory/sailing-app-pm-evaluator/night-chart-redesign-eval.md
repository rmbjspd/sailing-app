---
name: night-chart-redesign-eval
description: Eval of the Night Chart / 3D voyage-world redesign (commits 5821c1b..ddd8613, tested 2026-10-04) - findings, canonical numbers, test recipes
metadata:
  type: project
---

Verdict NEEDS WORK (no P0). Canonical numbers now: 35 days, 1,711 nm (1,417 nm + 338 statute mi canal), 36 locks (34 Erie + Black Rock + Troy), 8 legs, 33 ports, 134 checklist items (52 critical), Day 1 = Jun 19 2027, T-258 days from 2026-10-04. All pages agreed on these.

Top defects found:
- StaticChart (no-WebGL / terrain-decode-failure fallback) wrapper has inline `position: relative` overriding `absolute inset-0` -> height 0 -> hero, story and /map render EMPTY with no WebGL.
- /map on mobile: port list + "whole route" button are `hidden md:*`, so no port directory on phones.
- Reduced-motion hydration mismatch (Reveal) still reproduces in dev on /, /itinerary, /checklists, /journal.
- text-ink-4 (#3d4b5f) is 2.2:1 contrast, used 21x (source credits, hints, placeholders).
- Fixed nav pill / mobile brand chip are near-transparent; sticky headings and content collide with them on every page.
- Fig 1A staircase waits for IntersectionObserver; under load (SwiftShader) stayed blank ~8 s.

Why: working tree was being edited live by another agent during the eval (HEAD moved 3 commits; dev server returned 500 for a few minutes on a half-renamed export TRACK_DEPTH_FT -> TRACK_FLOOR_FT).
How to apply: re-run these checks first on next eval; confirm via `git log` which commit is live.

Test recipes (scratchpad pm-*.mjs): checklist storage key "checklist:", journal key "journal:"; reset button disabled when nothing stowed; crew sign-up leg selector `#leg-<id> button[aria-label^="Take a berth"]`; use `p[role=alert]` (route announcer also has role=alert). Disable WebGL with chromium args --disable-webgl --disable-3d-apis.
