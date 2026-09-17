# Route Redesign — S/V *Sabbatical*: Chicago → Old Saybrook

**Boat:** Beneteau Oceanis 30.1 · 4 crew · ~6 kn under power · 130 L / 34 gal diesel · 42 gal water · 14'6" air-draft design target mast-down
**Window:** Summer 2027, 8-week sabbatical (56 calendar days)
**Implements:** TRIP-PLAN.MD §11 items P0-1, P0-2, P0-3, P1-9, P2-14, P2-15, P2-16 (and P1-12 bail-out naming)

---

## A. Rationale

### The slack decision — named reserve days *and* a floating pool, not one or the other

**The plan now spends 52 of the 56 available days and carries slack in three separate forms:**

1. **Six named reserve/layover days inside the numbered itinerary** — Day 8 (Mackinac), Day 15 (Baie Fine second night), Day 17 (Killarney), Day 25 (Cleveland), Day 46 (NYC), Day 51 (Mystic). These are real `ItineraryDay` entries with `distanceNm: 0`.
2. **Four unallocated floating pool days** held at the end of the calendar and drawn against by a running ledger (§G).
3. **Three recoverable days inside the Erie Canal**, which is the only weather-immune stretch on the route. Days 31+32, 35+36, and 38+39 can each be merged into a single long canal day to claw back schedule if the Lakes eat the pool.

**Total usable slack: 13 days.** The critique demanded 10–12.

**Why both mechanisms and not just a pool.** A floating pool loses to crew psychology every time. If the printed schedule says "Day 12: Killarney → Tobermory" and the buffer lives in a spreadsheet somewhere, the crew reads the schedule and the skipper feels the pressure. Putting the reserve day *in the numbered plan* makes "we are not moving today" the default, not a concession someone has to argue for at 0500 in the rain. But a named day can only sit where you guessed the gale would be, and gales do not read itineraries — hence the pool. The named days buy *permission*; the pool buys *transferability*. You need both.

**Why these six ports specifically.** Each named reserve sits at a genuine weather gate *and* is a place where being stuck is itself a good day:

| Reserve | Gate it protects | Why the day is never wasted |
|---|---|---|
| D8 Mackinac | Provisioning/fuel/CBSA prep before the remote Channel | Fort Mackinac, the perimeter ride, the fudge |
| D15 Baie Fine | None — this one is pure gain | The swim, the dinghy to Topaz Lake, the dark-sky night |
| D17 Killarney | The Georgian Bay crossing (highest-probability pin on the route) | La Cloche quartzite hiking, Herbert's, Killarney Provincial Park |
| D25 Cleveland | Lake Erie, the deadliest water on the trip | Rock Hall, West Side Market provisioning, a real city |
| D46 NYC | The Hell Gate slack window and the LIS forecast | It's New York |
| D51 Mystic | Late-summer squall lines and tropical remnants | Mystic Seaport and the *Charles W. Morgan* |

### What else changed structurally

- **Three unrunnable days split.** Old D25 (95 mi + 9 locks against the 2:30 pm Waterford Flight cutoff) is now three days ending with a 20 mi / 6 lock final day that reaches Lock E-6 by 0910. Old D23 (88 mi + 6 locks + Oneida Lake) is now three days with a deliberate service half-day at Ess-Kay Yards in Brewerton and a **dawn Oneida crossing**. Old D14 (85 nm exposed lee shore ending in a CBP clearance) is now 65 / 27 / 58 down the Ontario shore with Goderich — the only all-weather harbour of refuge on that coast — inserted as the mid-point.
- **The longest open-water day drops from 85 nm to 70 nm**, and the count of 70+ nm days drops from eight to one. Nothing else exceeds 68.
- **Four gems added that the critique named and the old plan skipped:** Beaver Island, the Benjamin Islands, Lyons, and Mystic. Three of the four also *shorten* the days on either side of them — they are safety improvements that happen to be beautiful.
- **A rigging day at Catskill (D42).** Not in the original punch list, and it is a real finding. The old plan allotted "2–3 hrs" for the mast re-step. Crane time is 2–3 hours; re-reeving halyards, re-tuning a rig that has been lying on deck for three weeks, reconnecting masthead wind/VHF/nav instruments, and bending on sails is a day. Sailing into the Hudson Highlands on an untuned rig is how you lose a mast.
- **The Manhattan landfall is staged, not hoped for.** Poughkeepsie → NYC is split at Haverstraw so the final approach is a 33 nm afternoon run you can start whenever the light demands.

### Distances

Total nm-equivalent is **1,709** against the old plan's 1,711 — the same voyage, twenty more days, essentially no extra miles. The old plan's mileage was never the problem; the calendar was. New legs are measured port-to-port with explicit dogleg waypoints (headland standoffs, channel routing, canal mile markers) and carry a 3–5% helming allowance. Canal mileages are taken from the published Erie Canal distance tables (338.75 statute mi, Lock E-2 Waterford to the Niagara River at Tonawanda) and are internally consistent with the 34-lock count.

### Departure date — engineer the Saturday

Day 19 (Tobermory → Kincardine) must land on a Saturday for the bagpiper-at-the-lighthouse ceremony. Day 19 is 18 days after Day 1, so **Day 1 must be a Tuesday**.

> **Recommended: depart Chicago Tuesday 22 June 2027.** Kincardine falls Saturday 10 July. Erie Canal transit 21 July – 31 July, comfortably inside extended lock hours (which ended 10 Sep in 2026). Old Saybrook Thursday 12 August, or 16 August if all four pool days are spent. That clears Long Island Sound before the mid-August hurricane peak and puts the Channel in early July when Ontario services are fully open.
>
> **Cascading caveat:** Beaver Island's Municipal Marina *North* — the one with the fuel dock — did not open until 29 June in the 2025 season. Day 6 on a 22 June departure is 27 June. Marina South (25 slips, power and water) opens 10 June, so you will have a berth, but **do not plan on Beaver Island diesel.** Top off at Frankfort on Day 4 and again at Leland or Northport. Alternative: depart Tuesday 29 June and accept a crowded Beaver Island over the 4 July weekend.

### Leg union type

**No new `Leg` id is required.** All 52 days map onto the existing eight, and each leg occupies one contiguous block of day numbers, which `legGroups()` in `stats.ts` requires:

`lake-michigan` 1–8 · `north-channel` 9–18 · `lake-huron` 19–21 · `st-clair` 22 · `lake-erie` 23–29 · `erie-canal` 30–40 · `hudson` 41–46 · `sound-saybrook` 47–52

---

## B. The complete new day-by-day table

`distanceMi` is omitted (undefined) on all non-canal days. Canal days carry `distanceNm: 0` and a `distanceMi` value.

| Day | From | To | nm | mi | Locks | Leg | Overnight |
|---:|---|---|---:|---:|---:|---|---|
| 1 | Chicago, IL | St. Joseph, MI | 53 | — | 0 | lake-michigan | Anchor's Way / St. Joseph Municipal Marina |
| 2 | St. Joseph, MI | Grand Haven, MI | 60 | — | 0 | lake-michigan | Grand Haven Municipal Marina |
| 3 | Grand Haven, MI | Pentwater, MI | 46 | — | 0 | lake-michigan | Pentwater Municipal Marina |
| 4 | Pentwater, MI | Frankfort, MI | 56 | — | 0 | lake-michigan | Frankfort Municipal Marina, Betsie Lake |
| 5 | Frankfort, MI | Leland, MI | 40 | — | 0 | lake-michigan | Leland (Fishtown) — call ahead |
| 6 | Leland, MI | Beaver Island, MI | 47 | — | 0 | lake-michigan | Beaver Island Municipal Marina, St. James |
| 7 | Beaver Island, MI | Mackinac Island, MI | 42 | — | 0 | lake-michigan | Mackinac Island State Harbor Marina |
| 8 | Mackinac Island | Mackinac Island | 0 | — | 0 | lake-michigan | Mackinac Island State Harbor Marina |
| 9 | Mackinac Island, MI | Drummond Island, MI | 39 | — | 0 | north-channel | Drummond Island Yacht Haven |
| 10 | Drummond Island, MI | Meldrum Bay, ON | 30 | — | 0 | north-channel | Meldrum Bay Marina |
| 11 | Meldrum Bay, ON | Gore Bay, ON | 30 | — | 0 | north-channel | Gore Bay Marina |
| 12 | Gore Bay, ON | Benjamin Islands, ON | 16 | — | 0 | north-channel | Anchor, N/S Benjamin Islands |
| 13 | Benjamin Islands, ON | Little Current, ON | 26 | — | 0 | north-channel | Spider Bay Marina, Little Current |
| 14 | Little Current, ON | Baie Fine / The Pool, ON | 26 | — | 0 | north-channel | Anchor, The Pool |
| 15 | Baie Fine / The Pool | Baie Fine / The Pool | 0 | — | 0 | north-channel | Anchor, The Pool |
| 16 | Baie Fine / The Pool, ON | Killarney, ON | 20 | — | 0 | north-channel | Killarney Mountain Lodge / Municipal Marina |
| 17 | Killarney, ON | Killarney, ON | 0 | — | 0 | north-channel | Killarney Mountain Lodge / Municipal Marina |
| 18 | Killarney, ON | Tobermory, ON | 48 | — | 0 | north-channel | Big Tub Harbour, Tobermory |
| 19 | Tobermory, ON | Kincardine, ON | 65 | — | 0 | lake-huron | Kincardine Marina |
| 20 | Kincardine, ON | Goderich, ON | 27 | — | 0 | lake-huron | Maitland Valley Marina, Goderich |
| 21 | Goderich, ON | Sarnia, ON / Port Huron, MI | 58 | — | 0 | lake-huron | Sarnia Bay Marina or Port Huron area |
| 22 | Port Huron, MI | Detroit, MI | 68 | — | 0 | st-clair | Detroit City Marina / Wyandotte |
| 23 | Detroit, MI | Put-in-Bay, OH | 55 | — | 0 | lake-erie | South Bass Island mooring or dock |
| 24 | Put-in-Bay, OH | Cleveland, OH | 70 | — | 0 | lake-erie | North Coast Harbor / Edgewater Marina |
| 25 | Cleveland, OH | Cleveland, OH | 0 | — | 0 | lake-erie | North Coast Harbor / Edgewater Marina |
| 26 | Cleveland, OH | Ashtabula, OH | 50 | — | 0 | lake-erie | Harbor Yacht Club & Marina, Ashtabula |
| 27 | Ashtabula, OH | Erie, PA | 40 | — | 0 | lake-erie | Presque Isle State Park Marina |
| 28 | Erie, PA | Dunkirk, NY | 42 | — | 0 | lake-erie | Chadwick Bay Marina, Dunkirk |
| 29 | Dunkirk, NY | Buffalo / Tonawanda, NY | 40 | — | 1 | lake-erie | Smith Boys or Wardell's, Tonawanda |
| 30 | Tonawanda (mast unstep) | Tonawanda, NY | 0 | — | 0 | erie-canal | Tonawanda boatyard |
| 31 | Tonawanda, NY | Medina, NY | 0 | 35 | 2 | erie-canal | Medina canal basin wall |
| 32 | Medina, NY | Pittsford, NY | 0 | 51 | 2 | erie-canal | Schoen Place dock, Pittsford |
| 33 | Pittsford, NY | Lyons, NY | 0 | 32 | 5 | erie-canal | Lyons canal wall, Abbey Park |
| 34 | Lyons, NY | Baldwinsville, NY | 0 | 49 | 3 | erie-canal | Lock E-24 wall / Paper Mill Island |
| 35 | Baldwinsville, NY | Brewerton, NY | 0 | 22 | 1 | erie-canal | Ess-Kay Yards, Brewerton |
| 36 | Brewerton, NY | Rome, NY | 0 | 35 | 2 | erie-canal | Bellamy Harbor Park, Rome |
| 37 | Rome, NY | Little Falls, NY | 0 | 36 | 3 | erie-canal | Rotary Park / Canal Place, Little Falls |
| 38 | Little Falls, NY | Canajoharie, NY | 0 | 18 | 4 | erie-canal | Canajoharie village wall |
| 39 | Canajoharie, NY | Schenectady, NY | 0 | 40 | 6 | erie-canal | Mohawk Harbor Marina, Schenectady |
| 40 | Schenectady, NY | Waterford, NY | 0 | 20 | 6 | erie-canal | Waterford Visitor Center Dock |
| 41 | Waterford, NY | Catskill, NY | 40 | — | 1 | hudson | Hop-O-Nose Marina, Catskill Creek |
| 42 | Catskill, NY | Catskill, NY | 0 | — | 0 | hudson | Hop-O-Nose Marina, Catskill Creek |
| 43 | Catskill, NY | Poughkeepsie, NY | 60 | — | 0 | hudson | Shadows Marina / Poughkeepsie YC |
| 44 | Poughkeepsie, NY | Haverstraw, NY | 34 | — | 0 | hudson | Haverstraw Marina |
| 45 | Haverstraw, NY | New York City | 33 | — | 0 | hudson | Liberty Landing Marina, Jersey City |
| 46 | New York City | New York City | 0 | — | 0 | hudson | Liberty Landing Marina |
| 47 | New York Harbor | Oyster Bay, NY | 28 | — | 0 | sound-saybrook | Oyster Bay / Cold Spring Harbor marina |
| 48 | Oyster Bay, NY | Port Jefferson, NY | 38 | — | 0 | sound-saybrook | Port Jefferson Harbor |
| 49 | Port Jefferson, NY | Greenport, NY | 40 | — | 0 | sound-saybrook | Mitchell Park Marina, Greenport |
| 50 | Greenport, NY | Mystic, CT | 28 | — | 0 | sound-saybrook | Mystic Seaport Museum Marina |
| 51 | Mystic, CT | Mystic, CT | 0 | — | 0 | sound-saybrook | Mystic Seaport Museum Marina |
| 52 | Mystic, CT | Old Saybrook, CT | 20 | — | 0 | sound-saybrook | Saybrook Point Marina |

**Column sums:** nm 1,415 · canal mi 338 · locks 36 · days 52 (44 travel, 8 at zero distance).

---

## C. Per-day prose fields

### Lake Michigan

**Day 1 — Chicago → St. Joseph, 53 nm.** UNCHANGED from current Day 1.

**Day 2 — St. Joseph → Grand Haven, 60 nm.** UNCHANGED from current Day 2 except distance (75 → 60, measured) and warnings:
- warnings: `["South Haven (25nm) and Saugatuck/Holland (42nm) are your bail-out harbors — both have easy breakwater entrances in an onshore sea", "Afternoon NW winds build 2–4ft short-period chop off this shore; plan to be inside the piers by 3pm"]`

**Day 3 — Grand Haven → Pentwater, 46 nm.**
- highlights: `["Muskegon and White Lake passed en route — two of the easiest bail-outs on the eastern shore", "Pentwater Lake: a quiet, fully protected inland harbor behind a short channel, with Mears State Park beach a ten-minute walk away"]`
- warnings: `["Pentwater Municipal has no fuel dock — diesel is at the private yards on Pentwater Lake, or 12nm north at Ludington. Call ahead or plan to fill at Ludington tomorrow morning", "Little Sable Point accelerates a NW breeze; stand two miles off and round it before the afternoon build"]`
- notes: `"Deliberately short. This day exists so that Big Sable Point gets rounded tomorrow morning on a fresh crew rather than this afternoon on a tired one. Muskegon (18nm) and White Lake (34nm) are both easy diversions. The Pentwater channel is narrow and shallows on its north side — favor the middle and go slow. 44 slips, 22 of them transient, reservable through the Michigan DNR system."`

**Day 4 — Pentwater → Frankfort, 56 nm.**
- highlights: `["Big Sable Point rounded before noon — the wind accelerator on this coast, taken at the right time of day", "Point Betsie Light on the approach to Frankfort, with the first of the Sleeping Bear bluffs rising behind it"]`
- warnings: `["Ludington (12nm) is your certain diesel and pump-out stop — top off there, do not push past it on a partial tank", "Manistee (30nm) and Onekama/Portage Lake (40nm) are the mid-run bail-outs if a NW front arrives early"]`
- notes: `"Leave at first light. Ludington is 12nm up the coast and is the last full-service fuel dock before the Manitou Passage — go in, fill diesel and water, and be out again by 0900. Frankfort's entrance into Betsie Lake is well marked and holds in almost any weather, which is why it is the correct staging harbor for the Manitou Passage. Walk the beach to Point Betsie in the evening."`

**Day 5 — Frankfort → Leland (via South Manitou Island), 40 nm.**
- highlights: `["South Manitou Island: anchor in the harbor for two hours, dinghy ashore to the Valley of the Giants old-growth cedars and the wreck of the Francisco Morazan on the south shore", "The Manitou Passage under sail with Sleeping Bear's 400ft perched dunes to starboard"]`
- warnings: `["South Manitou Harbor is open to the E and SE — it is a fair-weather stop only, and not an overnight unless the forecast is settled from the W", "Manitou Passage generates confused seas when wind opposes lake swell; if it is up, bypass the island and run straight to Leland"]`
- notes: `"Short mileage, long day — that is the point. Anchor in South Manitou Harbor in 20–25ft over sand, take the dinghy in, and give the crew three hours ashore. Then 14nm east to Leland. Leland's Fishtown basin is tiny and does not take reservations reliably; if it is full, anchor in the lee north of the harbor or run 12nm to Northport. Carlson's Fish Market for smoked whitefish before they close."`

**Day 6 — Leland → Beaver Island (St. James), 47 nm.**
- highlights: `["Beaver Island: the most isolated inhabited island on the Great Lakes, with a genuine Irish-heritage culture and a nineteenth-century Mormon-kingdom history nobody believes until they read it", "Paradise Bay / St. James Harbor — a deep, protected natural harbor with a harbor light on the point"]`
- warnings: `["Do not plan on Beaver Island diesel — the fuel dock is at Municipal Marina North, which did not open until 29 June in the 2025 season. Fill at Leland or Northport before departing", "Rounding Cathead Point off the Leelanau tip: the shoal extends well north of the point and the seas stand up there. Give it a mile"]`
- notes: `"Round Cathead Point (12nm) and then it is a 34nm open crossing to St. James, with no shelter in between — this is the one genuinely committing day in northern Lake Michigan, so treat the forecast as a hard gate. Courtesy bikes at the municipal marina; ride out to the Beaver Head Light or the Protar cabin. The night sky here is as dark as anything before the North Channel."`

**Day 7 — Beaver Island → Mackinac Island, 42 nm.**
- highlights: `["Grays Reef Passage and the Straits of Mackinac — the funnel where all upper-lakes traffic converges", "Threading under the five-mile Mackinac Bridge with the island ahead: the best landfall on Lake Michigan"]`
- warnings: `["Straits currents run 2–3kt and reverse; a wind-against-current chop in the Straits is short, steep, and out of proportion to the wind strength", "Reserve Mackinac Island State Harbor in advance — it is small, it fills, and there is no anchoring refuge if you arrive with it full and a blow coming"]`
- notes: `"Depart St. James at dawn. Grays Reef Passage is well marked but busy with commercial traffic — monitor VHF 16. Because Beaver Island took 35nm out of the old Leland-to-Mackinac run, this arrival happens in the early afternoon with the crew awake and on deck, which is how it should be. Have the coffee up and everybody topside for the bridge."`

**Day 8 — Mackinac Island layover / RESERVE.**
- highlights: `["Fort Mackinac, Arch Rock, and the eight-mile perimeter road by bicycle — no cars on the island", "Last thorough provisioning and fuel before the North Channel"]`
- warnings: `["Provision to the next resupply gap plus three days, not to the next night — Gore Bay is five days away and Little Current is seven", "Fill diesel, both jerry cans, the water tank and both 5-gal jugs. Confirm every passport and read the CBSA telephone reporting procedure before you need it"]`
- notes: `"Named reserve day and the trip's first hard buffer. If the previous week ran clean, spend it on the island. If it did not, this is where you get level. Top up all fuel and water, buy fresh perishables that will last to Gore Bay, and eat down what will not. Grand Hotel porch for a drink — jacket after 6pm for men. Verify the Garmin inReach plan covers Canada before you cross."`

### North Channel & Georgian Bay

**Day 9 — Mackinac Island → Drummond Island, 39 nm.** UNCHANGED from current Day 7 (distance 38 → 39).

**Day 10 — Drummond Island → Meldrum Bay, 30 nm.** UNCHANGED from current Day 8 (distance 35 → 30).

**Day 11 — Meldrum Bay → Gore Bay, 30 nm.** UNCHANGED from current Day 9 (distance 35 → 30).

**Day 12 — Gore Bay → Benjamin Islands, 16 nm.**
- highlights: `["The Benjamin Islands: bare pink granite domes rising straight out of clear water — the most photographed anchorage in the North Channel and the one everyone means when they say 'the North Channel'", "Swim off the rock, climb the dome on North Benjamin at sunset, and watch the whole anchorage go copper"]`
- warnings: `["No services of any kind. Water, fuel, food and holding-tank capacity all come from Gore Bay this morning", "Arrive by early afternoon — the main anchorage between North and South Benjamin fills by 1500 in July, and the outer coves are exposed to a northwesterly"]`
- notes: `"Sixteen miles, and you should be anchored by noon. That is the entire design. Fill water and diesel at Gore Bay first, buy groceries for four days, and pump out. The main anchorage is the bay between the north shore of South Benjamin and the south shore of North Benjamin, at roughly 46°05.3'N 082°15.2'W — approach slowly, the bottom is rock and weed over granite and you want the anchor set properly the first time. Rode out to 5:1. Then stop, and let the place work."`

**Day 13 — Benjamin Islands → Little Current (via Kagawong), 26 nm.**
- highlights: `["Kagawong: tie to the dock, walk twenty minutes to Bridal Veil Falls, and swim under it", "Little Current swing bridge — the whole channel gathers and waits for the top of the hour together"]`
- warnings: `["The swing bridge opens on the hour and only on the hour. Arrive with fifteen minutes in hand and hold station in neutral; the channel current will set you onto the piers if you stop paying attention", "Spider Bay fills in summer — call ahead. This is the last well-equipped town until Kincardine, six days away"]`
- notes: `"South out of the Benjamins to Kagawong for lunch and the falls, then 14nm east to Little Current. Stock up hard: grocery, LCBO, hardware, fuel, water, pump-out. Everything between here and Kincardine is either an anchorage or a village with one store. Buy the CHS paper charts for Frazer Bay and Baie Fine here if you do not already have them."`

**Day 14 — Little Current → Baie Fine / The Pool, 26 nm.**
- highlights: `["Ten miles up a fjord between 200ft granite walls — there is nothing else like it in fresh water on this continent", "The Pool: anchor in 40–50ft of water so clear you can watch the anchor set"]`
- warnings: `["The entrance bar at the mouth of Baie Fine is shallow at low water — favor the north side and go in at idle with someone on the bow", "Anchoring in 45ft means 225ft of rode at 5:1. The old 150ft spec does not cover this anchorage. Chain-led Rocna or Mantus, sized one up, and set a snubber"]`
- notes: `"Through the Little Current bridge on the hour, east up Landsdowne Channel into Frazer Bay, then turn into Baie Fine and motor ten miles between the walls. Arrive before 1700 in peak season for a spot in The Pool. Take the dinghy to the head and hike the trail up to Topaz Lake — thirty minutes, steep at the top, and the water in that lake is the color of the name."`

**Day 15 — Baie Fine / The Pool, second night.**
- highlights: `["A full day at anchor in The Pool: swim off the bow into 70°F surface water over 50ft of visibility, with granite walls all around and no engine noise anywhere", "Kill every light aboard after dark. The Milky Way here is the version most of the crew has never actually seen"]`
- warnings: `["Check your set before you relax — reset the anchor alarm on the plotter and take two transit bearings on the walls", "No shore power for two nights. Watch the house bank against the fridge draw; run the engine an hour in the morning if you must, then shut it off and leave it off"]`
- notes: `"This is the day the trip is for. Dinghy to the head of the pool at first light for the mist coming off the water, hike Topaz Lake if you did not yesterday, swim all afternoon, and put everyone on deck after dark. The critique called this the single most memorable hour available on the route — it is worth a whole day, and now it has one."`

**Day 16 — Baie Fine / The Pool → Killarney, 20 nm.**
- highlights: `["Back down the fjord in morning light, then around into Killarney through the narrow channel between the town and George Island", "Herbert's Fisheries for the pickerel, eaten standing on the dock like everyone else"]`
- warnings: `["The Killarney channel is narrow with a current and constant small-boat traffic — no sailing through, engine on, slow", "Fuel here. It is the last diesel before Tobermory and the Georgian Bay crossing"]`
- notes: `"Short day out of the fjord and around Badgeley Point. Fill diesel, water and both jerry cans at Killarney and pump out. Walk the east lighthouse point in the evening for the view back at the La Cloche ridge — white quartzite, which is why the hills look snow-covered in August."`

**Day 17 — Killarney, RESERVE.**
- highlights: `["Killarney Provincial Park: the Granite Ridge or Cranberry Bog trails start a short taxi ride from the marina, and the La Cloche quartzite is 3.5 billion years old", "The Killarney Mountain Lodge deck for a drink with the whole channel in front of you"]`
- warnings: `["This is the weather gate for tomorrow's Georgian Bay crossing. If wind is forecast above 18kt from W or NW, you do not go — that is what this day is for, and you may need more than one of them", "If you are using the floating pool here, spend it here. There is no better place on the route to be stuck"]`
- notes: `"Named reserve day, placed at the single highest-probability pin point on the route. Northern Georgian Bay builds a steep westerly swell that a 30-footer will not enjoy for nine hours. Get the marine forecast twice today, watch the barometer, and make the go/no-go call the evening before rather than at 0500. If it is a go, prep the boat tonight: jacklines rigged, tethers laid out, a hot meal cooked and in a thermos, and the crew briefed on the cold-water MOB plan."`

**Day 18 — Killarney → Tobermory, 48 nm.** UNCHANGED from current Day 12, with warnings revised:
- warnings: `["The most exposed crossing between Lake Michigan and Lake Erie — nine hours with no shelter once you clear Badgeley Point. Go only on a clean forecast made the night before", "There is no mid-crossing bail-out. Your options are Killarney behind you or Tobermory ahead; make the decision at the dock, not at the halfway point"]`

### Lake Huron

**Day 19 — Tobermory → Kincardine, 65 nm.** *(Engineer this day to fall on a Saturday — see §A.)*
- highlights: `["The Bruce Peninsula's limestone cliffs falling away to port for the first twenty miles", "Kincardine's Saturday-evening bagpiper ceremony: a lone piper walks out to the lighthouse at sunset and plays the boats home. Twenty minutes, free, and the best thing on this coast"]`
- warnings: `["Bail-outs: Southampton (48nm) and Port Elgin (52nm). Both are river-mouth harbors that shoal — enter only in settled conditions, and do not treat either as an all-weather refuge", "Ontario's Lake Huron shore is a lee shore in any westerly. A 65nm day with two marginal bail-outs means the forecast is the go/no-go, not the conditions at the dock"]`
- notes: `"Depart Big Tub at first light. The run down the Bruce is beautiful and exposed; the wind farms south of Port Elgin tell you exactly how much breeze the coast gets. Arrive Kincardine mid-afternoon, get a slip, and be on the lighthouse pier by sunset. Fuel and provision here — it is the best-equipped stop since Little Current."`

**Day 20 — Kincardine → Goderich, 27 nm.**
- highlights: `["Goderich: laid out as an octagonal 'Square' around the courthouse, and reasonably called the prettiest town in Canada", "The Sifto salt mine runs under the lake for miles — the harbor is a working one and the ships loading salt are worth watching"]`
- warnings: `["Short day by design, and it is also the Lake Huron weather gate. If the forecast is bad, stay in Kincardine — Goderich is only four and a half hours away and can be run on any morning", "Bayfield, 10nm further south, looks tempting and is prettier, but its river-mouth entrance carries only 6–8ft and breaks in an onshore sea. Goderich is the harbour of refuge on this coast; Bayfield is not"]`
- notes: `"Twenty-seven miles and half a day ashore, deliberately inserted where the old plan had an 85nm lee-shore slog. Maitland Valley Marina on the north shore of the Maitland River has the most transient berths; Snug Harbour Municipal is inside the inner harbour with 22ft alongside and fuel, water and pump-out nearby, but few transient slips — call both. Walk up the Menesetung Bridge trail, do the Square, and be rested for tomorrow."`

**Day 21 — Goderich → Sarnia / Port Huron, 58 nm.**
- highlights: `["The Blue Water Bridge twin spans rising out of the haze — the gateway to the St. Clair River and the lower lakes", "Back in US waters, and the last customs formality of the trip"]`
- warnings: `["Bail-outs: Bayfield (12nm, fair weather only), Grand Bend (30nm, shallow entrance), and Harbor Beach, MI (40nm across, a genuine artificial harbour of refuge and the right choice if it turns nasty)", "CRITICAL: contact US CBP the moment you are in US waters — 1-800-973-2867 or the CBP videophone at the marina. Have all passports, vessel documentation and your CBSA clearance number in hand before you tie up"]`
- notes: `"Fifty-eight miles instead of eighty-five, and the customs call happens after a nine-hour day rather than a fifteen-hour one. That is the whole reason this day was split. Traffic density climbs sharply in the last ten miles — monitor VHF 16 and switch to 13 for the river. Do the CBP call before anyone goes to dinner. Fuel and pump out before the river transit; there is a strong current below the bridge and you do not want to be looking for a fuel dock in it."`

### St. Clair River / Detroit

**Day 22 — Port Huron → Detroit, 68 nm.** UNCHANGED from current Day 15, with the stale "rejoined the main route" language removed and one warning added:
- warnings: `["Heavy commercial traffic on the St. Clair River — monitor VHF 13 continuously and give every downbound freighter the whole channel. Never cross ahead of one; the current is adding 2–3kt to their speed", "Lake St. Clair is shallow outside the buoyed lane and the 30.1 draws about 5ft. St. Clair, MI (20nm) and Algonac (35nm) are easy stops if you want to break the day"]`

### Lake Erie

**Day 23 — Detroit → Put-in-Bay, 55 nm.** UNCHANGED from current Day 16, with one warning revised:
- warnings: `["Lake Erie is the shallowest Great Lake and builds a steep 4-second sea in under two hours on a NW front. Check the 48-hour forecast, not yesterday's conditions", "Detroit and Put-in-Bay are both legitimate hold points — this is the leg where the floating pool gets spent, and spending it here is correct"]`

**Day 24 — Put-in-Bay → Cleveland, 70 nm.**
- highlights: `["The longest open-water day of the redesigned route, and the only one over 68nm", "Cleveland's skyline coming up out of a flat green shore — an improbably dramatic approach from the lake"]`
- warnings: `["Bail-outs, all with easy breakwater entrances: Huron (28nm), Vermilion (36nm), Lorain (48nm) and Rocky River (60nm). The Ohio shore has a harbor every 12–15nm, which is what makes a 70nm day acceptable here and nowhere else on Erie", "Afternoon thunderstorms track northeast across the lake. If you see building cumulonimbus to the west, duck into Lorain and finish tomorrow"]`
- notes: `"Depart Put-in-Bay at first light. This is a low-commitment 70nm despite the number — you are never more than eight miles from a harbor entrance. North Coast Harbor puts you a ten-minute walk from the Rock & Roll Hall of Fame; Edgewater is quieter and has better fuel access. Either way, arrive with enough afternoon left to provision."`

**Day 25 — Cleveland, layover / RESERVE.**
- highlights: `["Rock & Roll Hall of Fame and the Great Lakes Science Center, both walking distance from North Coast Harbor", "West Side Market for the best provisioning between Chicago and New York — go early, go with a cart, and buy for four days"]`
- warnings: `["This is the Lake Erie weather gate. The next three days are short by design (50, 40, 42nm) precisely so this day can absorb a front without the schedule bleeding", "Last real chandlery and parts access until Buffalo. Audit the engine spares kit here and replace whatever you have used"]`
- notes: `"Named reserve day, placed on the deadliest water of the trip. If the forecast is clean, spend it: the Warehouse District and East 4th Street are genuinely good, and a full provisioning run here carries you to the canal. Change the engine oil and both fuel filters — you will have run roughly 180 motoring hours by now and the canal ahead is 338 miles of continuous engine time."`

**Day 26 — Cleveland → Ashtabula, 50 nm.**
- highlights: `["Ashtabula Harbor: eleven marinas on one river, a working ore-and-coal waterfront, and the Bridge Street historic district with its 1925 lift bridge", "Fairport Harbor (25nm) makes a good lunch stop — the Fairport Harbor Marine Museum is in the old keeper's dwelling and the lighthouse is climbable"]`
- warnings: `["Fifty miles across the emptiest stretch of the Ohio shore. Fairport Harbor (25nm) is the only good mid-run shelter — after it, the next real harbor is Ashtabula", "The Ashtabula River entrance is a commercial channel with ore-carrier traffic. Monitor VHF 13 on approach and do not cut the breakwall corner"]`
- notes: `"This day and the next replace the old plan's 80nm Cleveland-to-Erie run, which was the most committing day on the lake with only two bail-outs. Fifty and forty is better arithmetic. Harbor Yacht Club is half a mile up the river past the lighthouse and takes transients; the Port Authority's free transient dock on Bridge Street is day-use only (two hours) but has the only public pump-out on Lake Erie. Walk Bridge Street for dinner."`

**Day 27 — Ashtabula → Erie, PA, 40 nm.**
- highlights: `["Presque Isle: a seven-mile sand peninsula enclosing the best natural harbor on Lake Erie, with swimming beaches on the outside", "The U.S. Brig Niagara at the Erie Maritime Museum — Perry's flagship, rebuilt, and she sails"]`
- warnings: `["Conneaut (12nm) is the mid-run bail-out; after it there is nothing until the Presque Isle channel", "The Presque Isle entrance channel is narrow and the currents across it set east. Enter under power and stay in the marked channel — the shoals either side are unforgiving"]`
- notes: `"Forty easy miles. Get in by early afternoon, then take the afternoon at Presque Isle — this is the best swimming water on the route east of Lake Michigan and the crew has been in foul weather gear for a month. Fuel, water and pump-out at the state park marina. Last fuel before Buffalo."`

**Day 28 — Erie, PA → Dunkirk, NY, 42 nm.**
- highlights: `["Barcelona Harbor (20nm) — a tiny stone-pier harbor under the oldest lighthouse on the lake, worth a lunch stop", "Dunkirk Lighthouse and the Chadwick Bay waterfront: a quiet, unfussy last night in the US before the Niagara transit"]`
- warnings: `["Barcelona (20nm) is the only shelter between Erie and Dunkirk, and it is small and shallow — confirm depth before committing to it in a blow", "CALL AHEAD NOW: book the mast-unstep crane at Wardell's or Smith Boys in Tonawanda. It is not a walk-up service in peak summer and Day 30 depends on it"]`
- notes: `"Short, easy day along the Chautauqua shore. Chadwick Bay Marina at Dunkirk has transient dockage behind the breakwater. Use the evening to make the crane call, confirm the boatyard has mast-cradle materials, and start stripping the boat for mast-down: coil and label halyards, tape spreader ends, bag the windex."`

**Day 29 — Dunkirk → Buffalo / Tonawanda, 40 nm, 1 lock.** Replaces current Day 19 (Erie → Tonawanda, 70nm).
- highlights: `["Black Rock Lock: hail the tender on VHF 13 well out. It bypasses the Niagara River current and drops you into the canal feeder", "Buffalo Canalside on the way through — USS Little Rock and the restored commercial slip where the original canal terminated"]`
- warnings: `["The Niagara River current accelerates below the Buffalo breakwall and runs toward the falls. Do not drift past the harbor entrance without the Black Rock Lock arranged and the engine running well", "Sturgeon Point (25nm) is the only mid-run shelter and it is a small-craft harbor. This shore has very little to duck into"]`
- notes: `"Forty miles instead of seventy, arriving with the whole afternoon free for logistics. Tonawanda is the last major parts source until New York — West Marine, big-box stores, and both boatyards. Confirm the crane time, buy the extra cotter and clevis pins, buy or borrow eight fenders and two dedicated 50ft lock lines if you do not already have them, and get the Niagara Falls trip done tonight (twenty minutes by car — go)."`

### Erie Canal

**Day 30 — Tonawanda, mast unstep.** UNCHANGED from current Day 20.

**Day 31 — Tonawanda → Medina, 35 mi, 2 locks (E-35, E-34).**
- highlights: `["Locks E-35 and E-34 at Lockport: a paired flight lifting about 49ft, with the 1825 'Flight of Five' preserved alongside", "Medina: a whole downtown built of the local red sandstone, plus the Culvert Road — the only place a road passes underneath the canal"]`
- warnings: `["First locks of the trip and a paired flight straight away. Fenders both sides, fender board rigged, two crew on lines fore and aft, engine in gear for steerage, and nobody's fingers between hull and wall", "Verify your air draft before the first fixed bridge. Measure to the top of every antenna, GPS puck and wind transducer, not just the mast crutch. Design target is 14ft 6in"]`
- notes: `"Short first canal day by design — 35 miles and 5–6 hours, ending in a good town. Learn to lock before you have to do five of them. After Lockport there is not another lock for sixty miles, so the afternoon is a quiet cruise through the lift-bridge villages of Orleans County. Free wall with power at the Medina canal basin; the Medina Railroad Museum has one of the largest HO layouts in the country if that is your thing."`

**Day 32 — Medina → Pittsford, 51 mi, 2 locks (E-33 Henrietta, E-32 Pittsford).**
- highlights: `["Sixty lock-free miles through Albion, Holley, Brockport and Spencerport — lift-bridge towns where the operator sees you coming and stops traffic", "The Genesee River aqueduct and the Rochester land cut, then Schoen Place at Pittsford: canal-side dock with power and water and restaurants on the towpath"]`
- warnings: `["Longest canal day by mileage. Underway by 0700, and remember the speed limit is 10mph on the main canal and 5mph in towns and past moored boats", "The Rochester section collects floating debris after rain — logs just awash will foul a prop. Go slow through weedy and wooded stretches and keep a mask and a sharp knife where you can reach them"]`
- notes: `"Eight hours but only two locks, and the water is flat and straight. Brockport's canal visitor center makes a good lunch tie-up. Pittsford's Schoen Place is one of the two or three best overnights on the canal — power, water, a bakery, and a towpath full of people who will want to know where you came from."`

**Day 33 — Pittsford → Lyons, 32 mi, 5 locks (E-30, E-29, E-28B, E-28A, E-27).**
- highlights: `["Fairport, 6 miles on: the red lift bridge, the towpath, and Moonlight Creamery. Tie up for an hour and have the ice cream", "Lyons: the peppermint capital of America, and the town genuinely smells of it in summer. Free wall at Abbey Park"]`
- warnings: `["Five locks in 32 miles, all descending. Budget 25 minutes each including approach — that is two hours of the day spent stationary in chambers", "There is no Lock E-31 on the modern canal. If your lock list or plotter shows one, it is wrong; the sequence runs E-32 to E-30"]`
- notes: `"Short mileage, lock-heavy day. Start at 0730, take the Fairport stop, and still be tied up at Lyons by mid-afternoon. This is the stop the old plan advertised in the leg guide and then motored straight past. Walk into town, find the H.G. Hotchkiss peppermint museum, and understand why a canal town in Wayne County once supplied most of the world's peppermint oil."`

**Day 34 — Lyons → Baldwinsville, 49 mi, 3 locks (E-26 Clyde, E-25 May's Point, E-24 Baldwinsville).**
- highlights: `["Montezuma National Wildlife Refuge: the canal runs through the middle of it. Herons, eagles, ospreys and turtles on every bank", "The Cayuga-Seneca Canal junction at May's Point — the door to the Finger Lakes, which you are not taking, but it is worth seeing"]`
- warnings: `["Longest lock-day mileage on the canal. Underway by 0700; Lock E-24 at Baldwinsville is the day's gate and you want to be through it by mid-afternoon", "The Seneca River section between May's Point and Baldwinsville is a natural river, not a land cut — it winds, it shoals outside the channel, and the marks matter"]`
- notes: `"Eight and a half hours. Clyde has a small free wall if you need to stop short. Baldwinsville's Lock E-24 wall and the Paper Mill Island park put you in the middle of a pleasant village with restaurants a two-minute walk away. Fill water here."`

**Day 35 — Baldwinsville → Brewerton, 22 mi, 1 lock (E-23).**
- highlights: `["Three Rivers Junction, where the Seneca and Oneida rivers meet and the Oswego Canal branches north to Lake Ontario", "Ess-Kay Yards: the best-equipped marina on the canal system — diesel, pump-out, laundry, showers, chandlery and a full service department"]`
- warnings: `["Deliberate half-day. Do not be tempted to push across Oneida Lake this afternoon — the lake builds a short, nasty chop on an afternoon southwesterly and there is no shelter in the middle of it", "Book Ess-Kay ahead in July and August; the transient docks are popular and it is the obvious staging point for the lake"]`
- notes: `"Three and a half hours underway and then a working afternoon. This is the day the old plan did not have, and it is the reason the Oneida crossing stops being a gamble. Fill diesel and water, pump out, do the laundry, have the yard look at anything that has been bothering you, and get the boat right. Then get up early."`

**Day 36 — Brewerton → Rome, 35 mi, 2 locks (E-22, E-21).**
- highlights: `["Oneida Lake at first light: 21 miles of glass, with the sun coming up over Sylvan Beach at the far end", "Sylvan Beach for lunch — a 1900s lakeside amusement park with a Ferris wheel next to a canal lock, which is exactly as strange as it sounds"]`
- warnings: `["Cross Oneida at dawn. It is the only genuinely open water on the canal, it is shallow, and it gets rough on an afternoon breeze. Underway by 0530 puts you at Sylvan Beach before 1000", "Oneida's buoyed channel matters — the lake shoals badly outside it, particularly at the eastern end"]`
- notes: `"Twenty-one miles of lake and fourteen of canal, with the lake done before the wind wakes up. Sylvan Beach for a long lunch and the boardwalk, then two locks and into Rome. Bellamy Harbor Park is a Canal Corporation dock with 50-amp power, a summer welcome center, and Fort Stanwix National Monument a mile and a half up the road — the fort that held the Mohawk Valley in 1777, rebuilt full-scale."`

**Day 37 — Rome → Little Falls, 36 mi, 3 locks (E-20 Marcy, E-19 Frankfort, E-18 Jacksonburg).**
- highlights: `["The Mohawk Valley proper — the canal becomes a canalized river and the scenery improves sharply", "Little Falls: the canal threads a limestone gorge past Moss Island, whose glacial potholes are a twenty-minute walk from the free Rotary Park dock"]`
- warnings: `["Ilion Municipal Marina (26mi) is the last good pump-out and fuel point before the Hudson — stop and use it even if you do not need it yet", "Lock E-17 sits immediately east of the Little Falls dock. Do not attempt it this evening; it is the deepest single lock on the canal at 40.5ft and it deserves a fresh crew"]`
- notes: `"Six and a half hours with a fuel and pump-out stop at Ilion in the middle. Little Falls is the best town on the eastern canal: Canal Place, the limestone cliffs, the Moss Island potholes, and a free dock in a park. Climb Moss Island in the evening — the potholes were drilled by meltwater from a glacial lake draining through here 12,000 years ago and some are twenty feet deep."`

**Day 38 — Little Falls → Canajoharie, 18 mi, 4 locks (E-17, E-16, E-15, E-14).**
- highlights: `["Lock E-17 as the first lock of the morning: a 40.5ft drop, the deepest on the Erie, with a guillotine gate that comes down over your head", "The Arkell Museum at Canajoharie — a Beech-Nut baby-food fortune spent on Winslow Homer, Mary Cassatt and Gilbert Stuart, in a village of 2,000 people"]`
- warnings: `["Four locks in 18 miles; the day is short in distance and long in chamber time. Budget four and a half hours and start at 0730 so E-17 is the first thing you do", "Canajoharie's village wall is short and has limited power. If it is taken, Fort Plain (4mi back) and St. Johnsville Marina (9mi back) both have walls"]`
- notes: `"A deliberately light day between two heavier ones, and the crew will have earned it by now. Through E-17 first thing, then three more locks and tied up by noon. The Arkell is a genuinely surprising collection, and the Canajoharie Gorge trail in Wintergreen Park is a half-hour walk from the wall with swimming holes at the top."`

**Day 39 — Canajoharie → Schenectady (Mohawk Harbor), 40 mi, 6 locks (E-13, E-12, E-11, E-10, E-9, E-8).**
- highlights: `["Schoharie Crossing at Fort Hunt — the 1841 Schoharie Aqueduct ruins, where the enlarged canal crossed a creek on stone arches", "Amsterdam's Riverlink Park at the halfway mark: floating docks, an elevated walkway into town, and showers"]`
- warnings: `["Six locks and 40 miles: the heaviest canal day at roughly eight hours. Underway at 0700 and keep the lunch stop short", "Mohawk Harbor sits between Locks E-7 and E-8. Hail the dock attendant on VHF 13 before entering the basin for a slip assignment — slips take up to 35ft LOA, linear dockage for anything longer"]`
- notes: `"The last long day on the canal. Amsterdam's Riverlink Park at mile 20 is the natural lunch and pump-out stop ($2/ft if you stay, free if you do not). Mohawk Harbor at Schenectady is a modern basin with restaurants on the quay, and — critically — it is the right place to stage for the Waterford Flight. Do not push past it."`

**Day 40 — Schenectady → Waterford, 20 mi, 6 locks (E-7, then the Flight E-6 to E-2).**
- highlights: `["The Waterford Flight: five locks dropping 169ft in a mile and a half, the steepest lock flight in the world when it opened in 1915", "MILESTONE — Great Lakes to Atlantic, connected. The Visitor Center volunteers at the bottom have been known to hand arriving crews a beer"]`
- warnings: `["Reach the top of the Flight (Lock E-6) by 2:30pm at the absolute latest — once you enter you go through all five without stopping. Departing Mohawk Harbor at 0730 puts you at E-6 around 0910, which is the margin this day was created to give you", "Do not raise the mast at Waterford. The Troy Federal Lock is tomorrow and Hop-O-Nose in Catskill has the crane"]`
- notes: `"Twenty miles, six locks, and you are at the bottom of the Flight before lunch. The old plan asked for 95 miles and 9 locks against this same 2:30 deadline, which was not physically possible; this is the fix. Lock through E-7 at Niskayuna, then the Flight. Look up at the walls as you drop — those stones have been doing this job since 1915. Free 48-hour dock with power and water at the Waterford Visitor Center, and the afternoon is yours."`

### Hudson River

**Day 41 — Waterford → Catskill, 40 nm, 1 lock (Troy Federal).** UNCHANGED from current Day 26, with the notes revised to reflect that Day 42 now exists:
- notes: `"Through the Troy Federal Lock (last lock of the trip, 14ft, free, hail VHF 13) and you are in the tidal Hudson. High water at Troy runs 5–6 hours later than at the Battery — check Troy specifically. Past Albany at mile 145 and into Catskill Creek at mile 112; Hop-O-Nose is 1nm up the creek. Get the mast stepped this afternoon. Tomorrow is for making it right."`

**Day 42 — Catskill, rigging day.**
- highlights: `["Tune the rig properly, bend on the sails, and get the masthead instruments talking to the plotter again", "The town of Hudson across the river is an art-and-antiques enclave and a good taxi ride for dinner"]`
- warnings: `["A mast that has been lying on deck for three weeks needs a full re-tune, not a quick turnbuckle check. Set the rake, get the shrouds even, and re-check after the first hour of sailing tomorrow", "Re-seize every turnbuckle with stainless wire and re-pin every clevis. Check the masthead VHF antenna and the wind transducer before you leave the dock — you will not want to go aloft in the Highlands"]`
- notes: `"The old plan allotted two to three hours for this. Crane time is two to three hours; re-reeving halyards, tuning the rig, reconnecting masthead wiring, bending on main and headsail, and doing a shakedown motor down the creek is a day. You are about to sail into the Hudson Highlands, where the geography gusts a 12-knot day to 25. Do it properly here."`

**Day 43 — Catskill → Poughkeepsie, 60 nm.** UNCHANGED from current Day 27, with warnings revised:
- warnings: `["Ride the ebb south — depart 1–2 hours after local high water. On a good cycle it runs 1.5–2.5kt in your favor", "Bail-outs: Kingston/Rondout Creek (20nm, and worth the stop for the Hudson River Maritime Museum) and Norrie Point (36nm)"]`

**Day 44 — Poughkeepsie → Haverstraw, 34 nm.**
- highlights: `["The Hudson Highlands in a single day: Bannerman's Castle on Pollepel Island, Storm King, West Point on its bluff, Bear Mountain Bridge", "Haverstraw Bay, where the Hudson is 3.5 miles wide and behaves like a small sea"]`
- warnings: `["The Highlands constrict and accelerate both wind and current. Expect gusts well above the forecast and a nasty short chop when a southerly meets the ebb between Cold Spring and Peekskill", "Do not anchor close to Pollepel Island — the currents around it are irregular and the bottom is foul"]`
- notes: `"Thirty-four miles of the best river scenery in America, done at a pace that lets you look at it. Haverstraw Marina is one of the largest on the Hudson with full service and fuel. The real purpose of this day is tomorrow: stopping here means the Manhattan approach is a 33nm afternoon run you can start whenever the light demands, instead of the tail end of a ten-hour slog."`

**Day 45 — Haverstraw → New York City, 33 nm.**
- highlights: `["Departure timed so the last ten miles happen in golden hour: the Palisades, the George Washington Bridge, then Manhattan building ahead the whole way down", "The Statue of Liberty and Ellis Island on the final approach to Liberty Landing — and the realization that you sailed here from Chicago"]`
- warnings: `["Work backwards from sunset. In mid-August, sunset at NY Harbor is about 2000; leaving Haverstraw at 1400 on the ebb puts you at the GWB around 1830 and Liberty Landing by 1930. Adjust for the actual tide — do not fight a flood to make the light", "The last 15nm is dense with ferries, tugs, tour boats and Coast Guard traffic, all moving fast. Running lights on, AIS transmitting, and one crew doing nothing but watching"]`
- notes: `"Stage this. The whole crew on deck for the last two hours, cameras out, engine on and sails down before the harbor gets busy. This is the emotional summit of the trip and the old plan left it to chance at the end of a 75nm day. Reserve Liberty Landing weeks ahead — NYC slips do not appear on demand in August."`

**Day 46 — New York City, layover.** UNCHANGED from current Day 29, with one warning revised:
- warnings: `["Check the East River current tables for Hell Gate specifically — not generic NYC tides — and pick tomorrow's departure hour from them before you commit to anything else", "Last major provisioning and parts access of the trip. West Marine in Weehawken; full fuel, full water, and a complete gear audit"]`

### Long Island Sound → Old Saybrook

**Day 47 — New York Harbor → Oyster Bay, 28 nm.** UNCHANGED from current Day 30.

**Day 48 — Oyster Bay → Port Jefferson, 38 nm.** UNCHANGED from current Day 31.

**Day 49 — Port Jefferson → Greenport, 40 nm.** UNCHANGED from current Day 32.

**Day 50 — Greenport → Mystic, CT, 28 nm.**
- highlights: `["Plum Gut and The Race in one morning — the two fiercest tidal gates on the East Coast, taken on a fair current with the ebb behind you", "Up the Mystic River past Noank to the Seaport, where the Charles W. Morgan — the last wooden whaleship afloat, launched 1841 — is lying at the dock"]`
- warnings: `["Plum Gut and The Race each run to 5kt. They are about an hour apart in current phase; work the tables so you take Plum Gut on the early ebb and carry it through The Race rather than trying to hit both at slack", "The Mystic River Bascule Bridge is on a restricted schedule. In 2026 CTDOT had it down to four openings a day (0740, 1140, 1440, 1840) pending repairs; normal season schedule is hourly at :40. Confirm before you leave Greenport and hail on VHF 13 — Mystic Seaport's marina is north of both the railroad and highway bridges"]`
- notes: `"Short day, big water. Out of Greenport, north through Plum Gut on the early ebb, across the mouth of The Race, and into Fishers Island Sound south of Fishers — a genuinely exhilarating hour if timed right and a miserable one if not. If the bridge schedule does not work, Seaport Marine is immediately south of the bascule and you can walk to town, or anchor off Noank for the night and go up in the morning. Mystic Seaport Museum Marina takes reservations through Dockwa; attendants 0900–1700, May to October."`

**Day 51 — Mystic, layover.**
- highlights: `["Mystic Seaport Museum: the Charles W. Morgan, the Sabino, the shipsmith and cooperage, and the preservation shipyard where they are always rebuilding something", "Walk the drawbridge at the top of the hour and watch it lift — it has been doing it since 1922"]`
- warnings: `["This is also the late-summer weather reserve. Squall lines and tropical remnants are the LIS risk in August; if one is tracking up the seaboard, this is the day you sit", "Fuel, water and pump-out before you leave. Old Saybrook tomorrow is an arrival, not a provisioning stop"]`
- notes: `"The app's own leg guide has called Mystic outstanding since the first draft and then never stopped there. Now it does. Give the Seaport a full day — go aboard the Morgan below decks, not just the weather deck, and find the shipyard where they are re-planking something with steam-bent white oak. It is the right last full day of a voyage that began on the Chicago lakefront."`

**Day 52 — Mystic → Old Saybrook, CT, 20 nm. ARRIVAL.**
- highlights: `["A short, unhurried final passage west along the Connecticut shore past Noank, the Thames at New London, and Niantic Bay", "The Connecticut River opening up at Saybrook Point — and Essex, 5nm upriver, arguably the handsomest town in New England, with the Griswold Inn pouring since 1776"]`
- warnings: `["The Connecticut River entrance shoals and the bar shifts. Follow the marked channel, not the rhumb line, and take it on a rising tide", "Time the departure so you arrive on the flood — you want the current with you going up the river, and it gives you the option of running straight on to Essex the same afternoon"]`
- notes: `"Twenty miles and done. No tidal gates on this leg — The Race is behind you — so it is a genuinely relaxed last morning, which is the right way to finish. Out of the Mystic River on the first opening, west past Groton Long Point and the Thames, past Black Point and Cornfield Point, and in past Saybrook Point Light. Arrive early enough to spend the afternoon on the river. Fifty-two days and 1,709 nautical miles from DuSable Harbor."`

---

## D. New or moved waypoints

Add these entries to `waypoints.ts`. Coordinates are from published marina listings and harbor guides.

```ts
{ id: "pentwater", name: "Pentwater", state: "MI", lat: 43.7769, lng: -86.4339, day: 3, leg: "lake-michigan", marina: "Pentwater Municipal Marina", fuel: false, pumpout: true, notes: "44 slips (22 transient), DNR reservation system. No fuel dock at the municipal marina — diesel at the private yards on Pentwater Lake or 12nm north at Ludington. Short day by design so Big Sable Point gets rounded fresh tomorrow morning." }

{ id: "frankfort", name: "Frankfort", state: "MI", lat: 44.6329, lng: -86.2300, day: 4, leg: "lake-michigan", marina: "Frankfort Municipal Marina, Betsie Lake", fuel: true, pumpout: true, notes: "The correct staging harbor for the Manitou Passage — Betsie Lake holds in any weather. Point Betsie Light is a beach walk north. Verify diesel (not just gas) when you call ahead." }

{ id: "beaver-island", name: "Beaver Island (St. James)", state: "MI", lat: 45.7467, lng: -85.5189, day: 6, leg: "lake-michigan", marina: "Beaver Island Municipal Marina", fuel: true, pumpout: true, notes: "The most isolated inhabited island on the Great Lakes. Marina South (25 slips) opens ~10 June; Marina North — which has the fuel dock and 40 transient slips — did not open until 29 June in 2025. Do not plan on Beaver Island diesel for a late-June arrival. Courtesy bikes; ride to Beaver Head Light." }

{ id: "benjamin-islands", name: "Benjamin Islands", state: "ON", lat: 46.0885, lng: -82.2529, day: 12, leg: "north-channel", marina: "Anchorage only — no services", fuel: false, pumpout: false, notes: "Bare pink granite domes over clear water; the signature anchorage of the North Channel. Main anchorage lies between the north shore of South Benjamin and the south shore of North Benjamin. Rock-and-weed bottom — oversized scoop anchor, 5:1 chain-led rode. Arrive by early afternoon in July; it fills." }

{ id: "baie-fine", name: "Baie Fine / The Pool", state: "ON", lat: 46.0500, lng: -81.5500, day: 14, leg: "north-channel", marina: "Anchorage only — no services", isLayover: true, fuel: false, pumpout: false, notes: "A ten-mile fjord ending in a granite bowl, anchoring in 40–50ft of gin-clear water. Entrance bar is shallow at low water — favor the north side at idle. Two nights (Days 14–15): the swim, the dinghy to the head, the Topaz Lake hike, and the dark-sky night. Replaces the old combined baie-fine-killarney waypoint." }

{ id: "killarney", name: "Killarney", state: "ON", lat: 45.9712, lng: -81.5111, day: 16, leg: "north-channel", marina: "Killarney Mountain Lodge / Municipal Marina", isLayover: true, fuel: true, pumpout: true, notes: "Last diesel before the Georgian Bay crossing. Herbert's Fisheries on the dock; La Cloche quartzite ridge hiking in Killarney Provincial Park. Day 17 is a named reserve day — this is the highest-probability weather pin on the route. Replaces the old combined baie-fine-killarney waypoint." }

{ id: "goderich", name: "Goderich", state: "ON", lat: 43.7563, lng: -81.7068, day: 20, leg: "lake-huron", marina: "Maitland Valley Marina (or Snug Harbour Municipal)", fuel: true, pumpout: true, notes: "The only all-weather harbour of refuge on Ontario's Lake Huron shore — 22ft alongside in the inner harbour. Maitland Valley on the north shore of the river has the most transient berths; Snug Harbour Municipal is closer to town but transient space is limited. Splits the old 85nm Kincardine–Port Huron lee-shore run. Bayfield, 10nm south, is prettier but its river entrance carries only 6–8ft and breaks in an onshore sea." }

{ id: "ashtabula", name: "Ashtabula", state: "OH", lat: 41.8992, lng: -80.7967, day: 26, leg: "lake-erie", marina: "Harbor Yacht Club & Marina", fuel: true, pumpout: true, notes: "Eleven marinas on one river; a working ore-and-coal waterfront with a walkable historic Bridge Street district and a 1925 lift bridge. The Port Authority transient dock on Bridge Street is day-use only (2hr) but has the only public pump-out on Lake Erie. Splits the old 80nm Cleveland–Erie run, the most committing day on the lake." }

{ id: "dunkirk", name: "Dunkirk", state: "NY", lat: 42.4933, lng: -79.3372, day: 28, leg: "lake-erie", marina: "Chadwick Bay Marina", fuel: true, pumpout: true, notes: "Last US night before the Niagara transit. Dunkirk Lighthouse on the point; Barcelona Harbor (20nm back) under the oldest light on the lake makes a good lunch stop. Splits the old 70nm Erie–Tonawanda day and leaves a full afternoon at Tonawanda for crane logistics." }

{ id: "medina", name: "Medina", state: "NY", lat: 43.2192, lng: -78.3872, day: 31, leg: "erie-canal", marina: "Medina canal basin wall", fuel: false, pumpout: false, notes: "Free wall with power in a downtown built entirely of local red sandstone. The Culvert Road just west is the only place a road passes under the canal. Reached after the Lockport paired flight (E-35/E-34, ~49ft) — the first locks of the trip, deliberately placed on a short 35-mile day. Replaces the old medina-brockport waypoint." }

{ id: "lyons", name: "Lyons", state: "NY", lat: 43.0639, lng: -76.9885, day: 33, leg: "erie-canal", marina: "Lyons canal wall, Abbey Park", fuel: false, pumpout: false, notes: "The peppermint capital of America, and in summer the town smells of it. Free wall at Abbey Park. Advertised in legGuides.ts since the first draft and never actually stopped at until now. Fairport (26mi back, red lift bridge and Moonlight Creamery) is the lunch stop en route." }

{ id: "baldwinsville", name: "Baldwinsville", state: "NY", lat: 43.1583, lng: -76.3325, day: 34, leg: "erie-canal", marina: "Lock E-24 wall / Paper Mill Island", fuel: false, pumpout: true, notes: "Free wall beside Lock E-24 with the village a two-minute walk. Montezuma National Wildlife Refuge and the Cayuga-Seneca junction at May's Point en route. The Seneca River section is a natural river, not a land cut — it winds and shoals outside the marks." }

{ id: "brewerton", name: "Brewerton", state: "NY", lat: 43.2396, lng: -76.1268, day: 35, leg: "erie-canal", marina: "Ess-Kay Yards", fuel: true, pumpout: true, notes: "Best-equipped marina on the canal system: 200+ slips, diesel, pump-out, laundry, showers, chandlery, full service department. Deliberate 22-mile half-day so the boat gets serviced and Oneida Lake gets crossed at dawn instead of in the afternoon chop. This stop is the fix for the old 88mi/6-lock Day 23." }

{ id: "rome", name: "Rome", state: "NY", lat: 43.2078, lng: -75.4353, day: 36, leg: "erie-canal", marina: "Bellamy Harbor Park", fuel: false, pumpout: false, notes: "NYS Canal Corporation dock with 50-amp power and a summer welcome center. Fort Stanwix National Monument — the fort that held the Mohawk Valley in 1777, rebuilt full-scale — is 1.5 miles away. The first shovelfuls of the original Erie Canal were dug near this park. Sylvan Beach (21mi back, at the east end of Oneida) is the lunch and boardwalk stop." }

{ id: "little-falls", name: "Little Falls", state: "NY", lat: 43.0397, lng: -74.8594, day: 37, leg: "erie-canal", marina: "Rotary Park / Canal Place", fuel: false, pumpout: false, notes: "Free dock in a park, limestone gorge scenery, and Moss Island's glacial potholes a 20-minute walk away. Lock E-17 (40.5ft, deepest on the Erie) sits immediately east of the dock — tackle it as the first lock of the next morning, not at the end of the day. Ilion Municipal Marina (26mi back) is the last fuel and pump-out before the Hudson. Replaces the old ilion waypoint." }

{ id: "canajoharie", name: "Canajoharie", state: "NY", lat: 42.9036, lng: -74.5714, day: 38, leg: "erie-canal", marina: "Canajoharie village wall", fuel: false, pumpout: false, notes: "Short 18-mile day after E-17 first thing. The Arkell Museum here holds Winslow Homers, a Mary Cassatt and a Gilbert Stuart — a Beech-Nut fortune spent well, in a village of 2,000. Canajoharie Gorge trail and swimming holes in Wintergreen Park, a half-hour walk. Fallbacks if the wall is full: Fort Plain (4mi back) or St. Johnsville Marina (9mi back)." }

{ id: "schenectady", name: "Schenectady (Mohawk Harbor)", state: "NY", lat: 42.8180, lng: -73.9265, day: 39, leg: "erie-canal", marina: "Mohawk Harbor Marina", fuel: false, pumpout: true, notes: "Modern 50-slip basin between Locks E-7 and E-8; slips to 35ft LOA, linear dockage for longer. Hail the dock attendant on VHF 13 before entering. THIS IS THE WATERFORD FLIGHT STAGING STOP — from here it is 20mi and 6 locks to Waterford, putting you at the top of the Flight (E-6) around 0910 on an 0730 departure, against the 2:30pm cutoff. Amsterdam's Riverlink Park (20mi back) is the lunch and pump-out stop." }

{ id: "haverstraw", name: "Haverstraw", state: "NY", lat: 41.1957, lng: -73.9483, day: 44, leg: "hudson", marina: "Haverstraw Marina", fuel: true, pumpout: true, notes: "One of the largest full-service marinas on the Hudson, in the widest reach of the river. Exists so that the Manhattan landfall is a 33nm afternoon run timed for golden hour rather than the tail of a 75nm day. Bannerman's Castle, West Point and the Bear Mountain Bridge are all on today's run down from Poughkeepsie." }

{ id: "mystic", name: "Mystic", state: "CT", lat: 41.3639, lng: -71.9663, day: 50, leg: "sound-saybrook", marina: "Mystic Seaport Museum Marina", isLayover: true, fuel: true, pumpout: true, notes: "The Charles W. Morgan — last wooden whaleship afloat, launched 1841 — plus the Sabino and the preservation shipyard. Marina is north of both the railroad and highway bridges, so the bascule must open: normal season schedule is hourly at :40, but CTDOT ran a restricted four-openings-a-day schedule in 2026 pending repairs. Confirm before leaving Greenport; Seaport Marine south of the bascule is the fallback. Day 51 is a layover and the late-summer weather reserve." }
```

### Waypoints removed

| id | Reason |
|---|---|
| `ludington` | No longer an overnight — becomes a morning fuel and water stop on Day 4. Its content moves into the Day 4 notes. |
| `sylvan-beach` | No longer an overnight — becomes the lunch and boardwalk stop on Day 36, after the dawn Oneida crossing. Content moves to the `rome` waypoint notes. |
| `medina-brockport` | Replaced by `medina` (single named town, real coordinates). |
| `ilion` | Replaced by `little-falls`; Ilion survives as the Day 37 mid-run fuel/pump-out stop in that day's notes. |
| `baie-fine-killarney` | Split into `baie-fine` and `killarney`. The old entry's coordinates were Killarney's while its name and notes were mostly Baie Fine's. |

### Waypoints kept, day number changed only

`chicago` 0 → 0 · `st-joseph` 1 → 1 · `grand-haven` 2 → 2 · `leland` 4 → 5 · `mackinac-island` 5 → 7 (keep `isLayover: true`, now covering Day 8) · `drummond-island` 7 → 9 · `meldrum-bay` 8 → 10 · `gore-bay` 9 → 11 · `little-current` 10 → 13 · `tobermory` 12 → 18 · `kincardine` 13 → 19 · `port-huron` 14 → 21 · `detroit` 15 → 22 · `put-in-bay` 16 → 23 · `cleveland` 17 → 24 (add `isLayover: true` for Day 25) · `erie-pa` 18 → 27 · `tonawanda` 19 → 29 · `pittsford` 22 → 32 · `waterford` 25 → 40 · `catskill` 26 → 41 (add `isLayover: true` for the Day 42 rigging day) · `poughkeepsie` 27 → 43 · `nyc` 28 → 45 (keep `isLayover: true` for Day 46) · `oyster-bay` 30 → 47 · `port-jefferson` 31 → 48 · `greenport` 32 → 49 · `old-saybrook` 33 → 52

---

## E. Old-day → new-day mapping

| Old | Old destination | New | New destination | Change |
|---:|---|---:|---|---|
| 1 | St. Joseph | 1 | St. Joseph | — |
| 2 | Grand Haven | 2 | Grand Haven | distance 75 → 60 (measured); bail-outs named |
| 3 | Ludington | 3 | **Pentwater** | Ludington demoted to a fuel stop; Big Sable Point moved to a morning rounding |
| — | — | 4 | **Frankfort** | NEW |
| 4 | Leland | 5 | Leland | now via South Manitou Island; 70 → 40nm |
| — | — | 6 | **Beaver Island** | NEW |
| 5 | Mackinac Island | 7 | Mackinac Island | 80 → 42nm |
| 6 | Mackinac layover | 8 | Mackinac layover | — |
| 7 | Drummond Island | 9 | Drummond Island | — |
| 8 | Meldrum Bay | 10 | Meldrum Bay | — |
| 9 | Gore Bay | 11 | Gore Bay | — |
| — | — | 12 | **Benjamin Islands** | NEW |
| 10 | Little Current | 13 | Little Current | now via Kagawong from the Benjamins |
| 11 | Baie Fine / Killarney | 14 | **Baie Fine / The Pool** | split from Killarney |
| — | — | 15 | **Baie Fine, 2nd night** | NEW (P2-14) |
| — | — | 16 | **Killarney** | split from Baie Fine |
| — | — | 17 | **Killarney RESERVE** | NEW (P0-1) |
| 12 | Tobermory | 18 | Tobermory | — |
| 13 | Kincardine | 19 | Kincardine | engineer for Saturday (P2-15) |
| — | — | 20 | **Goderich** | NEW (P1-9) |
| 14 | Port Huron | 21 | Port Huron | 85 → 58nm |
| 15 | Detroit | 22 | Detroit | stale route language removed |
| 16 | Put-in-Bay | 23 | Put-in-Bay | — |
| 17 | Cleveland | 24 | Cleveland | bail-outs named |
| — | — | 25 | **Cleveland RESERVE** | NEW (P0-1) |
| — | — | 26 | **Ashtabula** | NEW |
| 18 | Erie, PA | 27 | Erie, PA | 80 → 40nm |
| — | — | 28 | **Dunkirk** | NEW |
| 19 | Tonawanda | 29 | Tonawanda | 70 → 40nm |
| 20 | mast unstep | 30 | mast unstep | — |
| 21 | Medina/Brockport | 31 | **Medina** | 40 → 35mi |
| 22 | Pittsford | 32 | Pittsford | 60 → 51mi |
| 23 | Sylvan Beach | 33 | **Lyons** | old Day 23 (88mi/6 locks + Oneida) split across new 33–36 |
| — | — | 34 | **Baldwinsville** | NEW |
| — | — | 35 | **Brewerton** | NEW (P0-3) |
| — | — | 36 | **Rome** | NEW; dawn Oneida crossing, Sylvan Beach as lunch |
| 24 | Ilion/Little Falls | 37 | **Little Falls** | Ilion becomes a mid-run fuel stop |
| 25 | Waterford | 38 | **Canajoharie** | old Day 25 (95mi/9 locks) split across new 38–40 |
| — | — | 39 | **Schenectady** | NEW (P0-2) — Flight staging |
| — | — | 40 | Waterford | 20mi / 6 locks, E-6 by 0910 |
| 26 | Catskill | 41 | Catskill | — |
| — | — | 42 | **Catskill RIG DAY** | NEW |
| 27 | Poughkeepsie | 43 | Poughkeepsie | bail-outs named |
| — | — | 44 | **Haverstraw** | NEW (P2-16) |
| 28 | New York City | 45 | New York City | 75 → 33nm, golden-hour timed |
| 29 | NYC layover | 46 | NYC layover | — |
| 30 | Oyster Bay | 47 | Oyster Bay | — |
| 31 | Port Jefferson | 48 | Port Jefferson | — |
| 32 | Greenport | 49 | Greenport | — |
| — | — | 50 | **Mystic, CT** | NEW (P2-14); Plum Gut + The Race on this day |
| — | — | 51 | **Mystic layover** | NEW (P2-14) |
| 33 | Old Saybrook | 52 | Old Saybrook | 50 → 20nm; arrival on a flood up the river |

---

## F. Knock-on edits

### `lib/data/waypoints.ts`
- Add the 19 new entries in §D, in day order, under the existing leg comment blocks.
- Delete `ludington`, `sylvan-beach`, `medina-brockport`, `ilion`, `baie-fine-killarney`.
- Renumber the 26 surviving entries per §D.
- Update the leg comment headers: `// --- Lake Michigan (Days 1–8) ---`, `// --- North Channel / Georgian Bay (Days 9–18) ---`, `// --- Lake Huron (Days 19–21) ---`, `// --- St. Clair / Detroit (Day 22) ---`, `// --- Lake Erie (Days 23–29) ---`, `// --- Erie Canal (Days 30–40) ---`, `// --- Hudson River (Days 41–46) ---`, `// --- Long Island Sound → Old Saybrook (Days 47–52) ---`.
- Add `isLayover: true` to `cleveland` (Day 25 reserve) and `catskill` (Day 42 rig day). `mackinac-island`, `nyc`, `baie-fine`, `killarney` and `mystic` all carry it already or per §D.

### `lib/data/routePath.ts`
Coordinate insertions, by segment:

- **`lake-michigan`** — replace the Ludington point with Pentwater `[-86.4339, 43.7769]`; insert Frankfort `[-86.2300, 44.6329]` and South Manitou `[-86.0925, 45.0119]` before Leland; after Leland insert Cathead Point `[-85.5930, 45.1850]`, Beaver Island `[-85.5189, 45.7467]`, and Grays Reef Passage `[-85.1300, 45.7700]` before the Straits approach. The existing Sleeping Bear shaping points at `[-86.10, 44.75]` and `[-85.95, 44.95]` can stay but should sit between Frankfort and South Manitou.
- **`north-channel`** — after Gore Bay, insert the Benjamins `[-82.2529, 46.0885]`, then Kagawong `[-82.2530, 45.8980]`, then Little Current. After Little Current, insert Landsdowne Channel `[-81.7200, 46.0100]` and the Baie Fine mouth `[-81.6800, 46.0300]`, then The Pool `[-81.5500, 46.0500]`, then back out via the mouth to Killarney `[-81.5111, 45.9712]`. The Pool is a dead end — the polyline must double back down the fjord before turning south; without that it will draw a line across the La Cloche ridge.
- **`lake-huron`** — insert Goderich `[-81.7068, 43.7563]` between Kincardine and the existing `[-81.55, 43.80]` shaping point (and move that point south of Goderich).
- **`lake-erie`** — insert Ashtabula `[-80.7967, 41.8992]` between Cleveland and Erie, replacing the `[-80.60, 41.55]` shaping point; insert Dunkirk `[-79.3372, 42.4933]` replacing `[-79.60, 42.55]`.
- **`erie-canal`** — the existing alignment is roughly right but the named stops change. Replace the Medina/Brockport point with Medina `[-78.3872, 43.2192]`; keep Pittsford; insert Lyons `[-76.9885, 43.0639]`, Baldwinsville `[-76.3325, 43.1583]` (note: Baldwinsville is north-west of the Oneida line — the canal runs up the Seneca River to Three Rivers before turning east, so add a Three Rivers shaping point `[-76.2700, 43.1700]`), Brewerton `[-76.1268, 43.2396]`, keep the Oneida crossing, add Rome `[-75.4353, 43.2078]`, Little Falls `[-74.8594, 43.0397]`, Canajoharie `[-74.5714, 42.9036]`, Amsterdam `[-74.1890, 42.9370]`, Schenectady `[-73.9265, 42.8180]`, then Waterford. Remove the `[-75.0349, 43.0137]` Ilion point or keep it as an intermediate shaping point.
- **`hudson`** — insert Haverstraw `[-73.9483, 41.1957]`, replacing the `[-74.02, 41.20]` Haverstraw Bay shaping point.
- **`sound-saybrook`** — this segment now runs **past** Old Saybrook and doubles back, so the outbound and return tracks must be geographically distinct or the map will show a single line traversed twice. After Greenport, run Plum Gut `[-72.2100, 41.1900]` → The Race `[-72.0900, 41.2300]` → south of Fishers Island `[-71.9800, 41.2700]` → Mystic River mouth `[-71.9700, 41.3200]` → Mystic Seaport `[-71.9663, 41.3639]`. Then the return: back down the river `[-71.9700, 41.3150]` → Groton Long Point `[-72.0200, 41.3050]` → mouth of the Thames `[-72.0900, 41.3050]` → Niantic Bay `[-72.1900, 41.3000]` → Cornfield Point `[-72.3400, 41.2700]` → Old Saybrook `[-72.3765, 41.2948]`. The outbound leg runs south of Fishers Island; the return runs along the Connecticut shore. They do not overlap.

### `lib/data/legGuides.ts`
- **`lake-michigan`** — `bestStops`: update the day references (Saugatuck is now a Day 2 alternate, Sleeping Bear is Day 5, Mackinac is Days 7–8). Add two entries: **South Manitou Island (Day 5)** for the Valley of the Giants and the *Francisco Morazan* wreck, and **Beaver Island (Day 6)** with the Marina North opening-date caveat. `sailingTips`: the Big Sable Point tip should now read "rounded on the morning of Day 4 from Pentwater" — the whole point of the split.
- **`north-channel`** — `subtitle` currently reads "Mackinac to Port Huron via Ontario", which is wrong now that the leg ends at Tobermory; change to "Mackinac to Tobermory via Manitoulin and Georgian Bay". Move the US CBP re-entry tip from this guide to `lake-huron` (it belongs to Day 21). `bestStops`: promote the Benjamin Islands from a passing mention in the Baie Fine entry to their own entry with the Day 12 overnight. Add a line to `sailingTips` about the Day 17 Killarney reserve day being the crossing's go/no-go gate.
- **`lake-huron`** — the `captainIntro` third paragraph is now factually stale: it describes "the day 14 run (85 nm from Kincardine to Port Huron)" as the longest open-water day of the voyage. Rewrite it around the 65/27/58 split and the fact that the longest day is now Day 24 at 70nm. `sailingTips` items 1 and 2 both reference the old day numbers and the old 85nm run — rewrite. Add Goderich to `bestStops` with the harbour-of-refuge justification and the Bayfield depth caveat.
- **`st-clair`** — `bestStops` references "Detroit, MI (Day 15)" → Day 22.
- **`lake-erie`** — `watchFor` and `bestStops` need Ashtabula, Conneaut and Dunkirk added as named bail-outs and stops. Add a `sailingTips` entry: "Days 26–28 are deliberately 50, 40 and 42nm so that Day 25 at Cleveland can absorb a NW front without the rest of the leg bleeding."
- **`erie-canal`** — `watchFor` currently says "The Oneida Lake crossing (Day 18)", which was wrong before this redesign and is now Day 36; rewrite it around the Brewerton staging and the dawn crossing. The `sailingTips` lock-hours entry should carry the 2:30pm E-6 rule *and* the fact that Day 40 now departs Schenectady with a five-hour margin on it. `bestStops`: Lyons, Little Falls and Waterford already appear and are now actually visited; add Medina (sandstone/Culvert Road), Brewerton (Ess-Kay), Rome (Fort Stanwix) and Canajoharie (Arkell Museum).
- **`hudson`** — `captainIntro` says the mast goes up at Catskill and "the next morning you're a sailor again"; amend for the Day 42 rigging day. Add a `sailingTips` entry on staging the Day 45 golden-hour arrival by working backwards from sunset. Add Haverstraw to `bestStops`.
- **`sound-saybrook`** — `bestStops` already lists Mystic; it is now an actual stop, so upgrade the entry with the Days 50–51 reference and the bascule-bridge schedule. `watchFor` item 4 ("Mystic River drawbridge — has a limited opening schedule. Call ahead.") should carry the specific schedule. `sailingTips` item 3 on Plum Gut and item 5 on Race Rock should be merged into one tip describing how to take both gates on a single ebb on Day 50 — that is now a single day's problem rather than spread across two.

### `lib/data/checklists.ts`
Route-driven additions only (the full gear punch list from TRIP-PLAN.MD §8 is separate):
- `b6` — rewrite: "Primary anchor: oversized modern scoop (Rocna/Mantus, one size up) + 200–250ft chain-led rode". The old "150ft minimum" does not cover anchoring in 45ft at The Pool on Days 14–15, which is now two nights, or the rock-and-weed bottom at the Benjamins on Day 12.
- New `b30` — "Anchor snubber + 30ft bridle, and a kellet", critical. Two consecutive nights at anchor in a deep granite bowl with no shore power.
- New `pr15` — "Third 5-gallon water jug", important. Days 12, 14 and 15 are three of four consecutive nights with no dock water; 42 gal covers roughly 1.3 days for four crew.
- New `b31` — "Block ice / perishables plan keyed to resupply towns: Mackinac (D8), Gore Bay (D11), Little Current (D13), Kincardine (D19), Cleveland (D25), Ilion (D37), NYC (D46)", important. There is currently no perishables strategy anywhere in the list.
- `b8` — amend the note: the jerry cans are for the North Channel (Days 12–18, no fuel between Little Current and Killarney) and for Beaver Island (Day 6, fuel dock may not be open before 29 June), not for Lake Michigan day-hops.
- New `s19` — "Lee cloths for both sea berths", important. Days 19, 21 and 24 all have the crew off watch in a seaway.
- New `n21` — "Laminated tide/current card: Troy-vs-Battery lag, Hell Gate slack, Plum Gut, The Race", important. All four are now single-day problems on Days 41, 47 and 50.
- `b29` — amend note to reference Day 30 at Tonawanda rather than Day 20.
- New `b32` — "Mystic River Bascule Bridge schedule confirmed (CTDOT) before departing Greenport", critical, category boat-gear. Day 50's berth is north of the bridge.

---

## G. Totals

| Metric | Old plan | New plan |
|---|---:|---:|
| Travel days | 30 | **44** |
| Zero-distance days (layover / reserve / mast / rig) | 3 | **8** |
| Calendar days scheduled | 33 | **52** |
| Floating pool days (unallocated) | 0 | **4** |
| Recoverable canal-compression days | 0 | **3** |
| **Total usable slack** | **2** | **13** |
| Open-water nm | 1,417 | **1,415** |
| Canal statute mi | 338 | **338** |
| **nm-equivalent** | **1,711** | **1,709** |
| Locks | 36 | **36** |
| Longest open-water day | 85 nm | **70 nm** |
| Days over 70 nm | 8 | **0** |
| Days at 65–70 nm | 3 | **3** |
| Heaviest canal day | 95 mi / 9 locks | **51 mi / 2 locks** or **40 mi / 6 locks** |

**Per-leg breakdown** (as `legGroups()` will compute it):

| Leg | Days | nm | Canal mi | Locks | nm-equiv |
|---|---|---:|---:|---:|---:|
| lake-michigan | 1–8 | 344 | — | 0 | 344 |
| north-channel | 9–18 | 235 | — | 0 | 235 |
| lake-huron | 19–21 | 150 | — | 0 | 150 |
| st-clair | 22 | 68 | — | 0 | 68 |
| lake-erie | 23–29 | 297 | — | 1 | 297 |
| erie-canal | 30–40 | 0 | 338 | 34 | 294 |
| hudson | 41–46 | 167 | — | 1 | 167 |
| sound-saybrook | 47–52 | 154 | — | 0 | 154 |
| **Total** | **1–52** | **1,415** | **338** | **36** | **1,709** |

### The slack ledger

Keep this as a running page in the log, updated every morning:

```
POOL: 4 days.  Spent: ___  Remaining: ___
Canal compression available (merge any of these): 
  D31+D32  Tonawanda→Pittsford   86mi / 4 locks  [-1 day]
  D35+D36  Baldwinsville→Rome    57mi / 3 locks  [-1 day, forfeits the dawn Oneida crossing]
  D38+D39  Little Falls→Schenectady 58mi/10 locks [-1 day, heavy]
```

Rules of use, in order:
1. **Never** spend a pool day to make a weather window. Pool days buy rest, repairs and better light — nothing else.
2. Spend the pool at anchorages and cities, not at fuel docks. The best places to be stuck are Killarney, Baie Fine, Cleveland, Greenport and Mystic.
3. If you reach Tonawanda (Day 29) with two or more pool days left, spend one at Greenport before Mystic. If you reach it with zero, merge D35+D36 first — it costs the least.
4. If the pool is gone *and* the canal is compressed and you are still behind at Waterford, the trip has told you something. Old Saybrook is 165 nm from Waterford through water with a harbor every fifteen miles. There is no reason to rush the end of it.
