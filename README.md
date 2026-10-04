# S/V Sabbatical — Chicago → Old Saybrook, Summer 2027

Planning site for a 35-day, ~1,711 nm passage on an Oceanis 30.1: Lake Michigan,
the North Channel, Lake Huron, the St. Clair and Detroit rivers, Lake Erie, the
Erie Canal (mast down), the Hudson and Long Island Sound.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## What's where

| Route | What it is |
| --- | --- |
| `/` | Scroll-driven 3D voyage (pinned WebGL scene sails the route leg by leg), "The Voyage in Numbers" data essay, links into the rest of the site |
| `/map` | The Chart: free-flight 3D chart with port directory, fly-to, day scrubber and voyage replay |
| `/itinerary` | The Ship's Log: every day, berth, lock and hazard, with a sticky chart that follows along |
| `/checklists` | Provisioning, with readiness gauge (state in `localStorage`) |
| `/journal` | The Logbook (state in `localStorage`) |
| `/crew` | Crew Manifest — sign up for legs (password-gated, see below) |

**Design system** — "Night Chart": tokens and utilities in `app/globals.css`, per-leg
colours in `lib/data/legStyle.ts`, shared primitives in `components/kit`. Fonts:
Fraunces (display), Geist (text), Geist Mono (numbers).

**Data** — `lib/data/itinerary.ts` is the single source of truth; every distance,
lock count and date shown anywhere is derived from it (`lib/data/stats.ts`).
`lib/data/waterProfile.ts` holds the Erie Canal lock lifts behind the staircase chart.

**3D world** — `components/world` (react-three-fiber). Terrain is a real DEM baked
into textures by the scripts in `scripts/geo/` (needs Python with pillow, numpy, scipy):

```bash
python3 scripts/geo/bake-terrain.py   # public/geo/terrain.png  (AWS Terrain Tiles + Natural Earth)
python3 scripts/geo/bake-water.py     # public/geo/water-level.png (per-lake surface levels)
python3 scripts/geo/bake-route.py     # lib/data/routePath.ts (water-following track)
python3 scripts/geo/audit-route.py    # reports any stretch of route over land (should be ~0 nm)
python3 scripts/geo/bake-chart.py     # public/geo/chart-dark*.webp (2D night-chart raster)
python3 scripts/geo/bake-profile.py   # lib/data/vizBathymetry.ts
```

The route is generated, not hand-drawn: each overnight passage is a least-cost
path through navigable water (Natural Earth coast and lakes, plus the canal and
river channels listed in `scripts/geo/waterways.py`), kept a mile or two
offshore on open water. To change the track, move a waypoint, add a `VIA`
point in `bake-route.py`, or adjust a channel in `waterways.py`, then re-run the
bakes in order.

Projection and bounds live in `lib/geo/projection.ts` and must match the bake scripts.
The source DEM has no Great Lakes bathymetry (lakes are flat at their surface), so
depth contours are only drawn where real depths exist (Long Island Sound / Atlantic).
Without WebGL2 the world falls back to a static chart.

## Crew Manifest (`/crew`)

The Crew Manifest lets shipmates sign up as crew for individual voyage legs. It
is gated by a single shared password (no usernames).

- Set `CREW_PASSWORD` in your environment (see `.env.example`). For local work,
  `.env.local` is used. Rotating the password and restarting the server signs
  everyone out.
- Crew sign-ups are stored server-side. **Local dev:** SQLite at
  `./data/crew.sqlite` (override with `CREW_DB_PATH`; git-ignored).
- **Production / serverless (e.g. Vercel — read-only filesystem):** set
  `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to use Supabase/Postgres
  instead. Run `supabase/schema.sql` once in the Supabase SQL Editor, then add
  both env vars (service-role key is server-only) and redeploy. When these are
  set, SQLite is not used.
- Each leg accepts up to 3 crew. Some legs may be reserved and not open for
  sign-up.
