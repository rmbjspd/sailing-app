---
name: env-run-quirks
description: How to start and test the sailing app in this environment — runtime quirks, known constraints, test patterns
metadata:
  type: project
---

## Starting the app

1. `npm install` — must run first if deps aren't installed (fresh container scenario)
2. `npx next build` — builds the static Next.js app; all 6 routes are static
3. `npx next start -p 3000 &` — serves the built app; check with `curl http://localhost:3000/`

Next.js version: 16.2.4 (non-standard with breaking changes — check node_modules/next/dist/docs/ before coding)

## Pages / routes:
- `/` — homepage / hero stats (35 days, ~1,711 nm, 28 locks)
- `/itinerary` — day-by-day cards, all 35 days
- `/checklists` — provisioning/gear lists (7 categories, ~134 total items)
- `/map` — JS-rendered (Leaflet), returns "Loading map..." in curl. Not testable via curl.
- `/journal` — captain's log / journal page
- `/checklists` — checklist with browser localStorage persistence for checked state

## Testing patterns:
- Use `curl -s <url> -o /tmp/page.html` then Python HTMLParser to extract text
- Static pages all render server-side; JS-heavy map page is the only exception
- All data lives in: lib/data/itinerary.ts, lib/data/waypoints.ts, lib/data/legGuides.ts, lib/data/checklists.ts
- Day continuity check: grep for `day:` in itinerary.ts — must be 1..35 contiguous
- Waypoints skip days 6/20/31 (layover days) — correct by design
- Lock total verification: sum all `locks:` in itinerary.ts should equal 28
- Distance verification: sum of distanceNm (~1417) + distanceMi/1.15078 (~294) = ~1711 nm

## Known WebFetch limitation:
WebFetch tool fails for localhost URLs (invalid URL error). Use curl + Python extraction instead.

## Crew Manifest feature run pattern (added 2026-06-24):
```bash
# Build + start with isolated DB and test password
CREW_DB_PATH=/tmp/eval-crew.sqlite CREW_PASSWORD=test-crew-2027 npx next build
CREW_DB_PATH=/tmp/eval-crew.sqlite CREW_PASSWORD=test-crew-2027 npx next start -p 3120 &
# Poll until ready, then test
# Kill when done: fuser -k 3120/tcp

# Get session token
SESSION=$(curl -si -X POST http://localhost:3120/api/crew/login -H "Content-Type: application/json" -d '{"password":"test-crew-2027"}' | grep -i set-cookie | sed 's/set-cookie: //' | cut -d';' -f1 | tr -d '\r')

# sqlite3 not available in this env — verify row counts via /api/crew/roster instead
```

New routes added by crew feature:
- /crew/login — password gate (public)
- /crew — manifest (auth required, server component + client CrewManifest)
- /api/crew/login, /api/crew/logout — auth endpoints (public)
- /api/crew/roster — GET (auth required)
- /api/crew/signup — POST (auth required)
- /api/crew/signup/[id] — DELETE (auth required)
