import type { ItineraryDay } from "../types";

// The voyage, day by day. This file is the single source of truth: every
// distance, lock count and day range shown anywhere in the app is derived from
// it by lib/data/stats.ts.
//
// The plan spends 44 of the 56 available sabbatical days, leaving twelve as a
// floating reserve. Seven scheduled days cover no distance on purpose: five
// named reserve/layover days at the route's real weather gates (Mackinac D6,
// Baie Fine D12, Killarney D14, Cleveland D22, NYC D40), plus mast-unstep at
// Tonawanda (D26) and the rigging day at Catskill (D37).
//
// Days 1–3 are the hardest stretch of the trip and they come first: starting
// at Winthrop Harbor means the lake is 60+ nm wide and no short first hop goes
// the right direction. Sail a shakedown out of North Point the afternoon
// before, and treat the Day 3 split at Frankfort as the first pool day to
// spend if the opening is too much.
export const itinerary: ItineraryDay[] = [
  // ---- LAKE MICHIGAN (Days 1–6) ----
  {
    day: 1, from: "Winthrop Harbor, IL", to: "Holland, MI", distanceNm: 74, locks: 0,
    leg: "lake-michigan", overnight: "Eldean Shipyard or Yacht Basin Marina, Lake Macatawa",
    highlights: ["The widest open-water crossing of Lake Michigan on the whole route — out of sight of both shores for a couple of hours in the middle", "Lake Macatawa: a two-mile inland lake behind a narrow channel, fully protected in any weather, with 'Big Red' lighthouse on the south pier"],
    warnings: ["The hardest day of the trip is day one. Sail a shakedown out of North Point Marina the afternoon before — find your problems 3nm from the dock, not 35. Depart 0430", "Diversions for the first two-thirds: Chicago (25nm), Michigan City (50nm), St. Joseph (63nm). Past the midpoint you are committed to the Michigan shore"],
    notes: "Starting at Winthrop Harbor puts you 25nm up the lake but commits you to a long first crossing — the lake is 60+nm wide here and there is no short hop that goes the right direction. North Point is the largest marina on the Great Lakes (1,500 slips, gas and diesel at the fuel dock, pump-out) so leave with everything full. Treat the forecast as a hard gate; this is the widest water until Georgian Bay. Both Eldean Shipyard and Yacht Basin Marina on Lake Macatawa take transients and both have diesel and pump-out."
  },
  {
    day: 2, from: "Holland, MI", to: "Ludington, MI", distanceNm: 74, locks: 0,
    leg: "lake-michigan", overnight: "Ludington Municipal Marina",
    highlights: ["The Michigan shore at its most hospitable: Grand Haven, Muskegon, White Lake and Pentwater all passed within reach", "Ludington — the best resupply town on the eastern shore, and the staging harbour for Big Sable Point"],
    warnings: ["Bail-outs every 12–15nm: Grand Haven (26nm), Muskegon (38nm), White Lake (50nm), Pentwater (63nm). This is why a 74nm day is acceptable here", "Afternoon NW winds build a 2–4ft short-period chop off this shore. Underway by 0500 and aim to be inside the piers by 1600"],
    notes: "Long but low-commitment — you are never more than eight miles from a harbour entrance. Ludington sits 8nm SOUTH of Big Sable Point, which is the whole reason it is the overnight: the point gets rounded tomorrow morning on a fresh crew rather than this afternoon on a tired one. Full fuel, water and pump-out here. Last certain diesel before the Manitou Passage."
  },
  {
    day: 3, from: "Ludington, MI", to: "Leland, MI", distanceNm: 76, locks: 0,
    leg: "lake-michigan", overnight: "Leland (Fishtown) — call ahead",
    highlights: ["Big Sable Point and Point Betsie rounded in the morning, then Sleeping Bear's 400ft perched dunes to starboard through the Manitou Passage", "Optional: anchor two hours in South Manitou Harbor and dinghy ashore to the Valley of the Giants old-growth cedars and the wreck of the Francisco Morazan (adds ~4nm)"],
    warnings: ["Bail-outs: Manistee (30nm), Onekama/Portage Lake (40nm), Frankfort (48nm). After Frankfort the shelter thins out until Leland", "Manitou Passage generates confused seas when wind opposes lake swell. If it is up, skip South Manitou and run straight through. South Manitou Harbor is open E and SE and is a fair-weather stop only"],
    notes: "The longest day on Lake Michigan and the third 75 in a row — if the crew is flagging, this is the right place to spend a pool day and split it at Frankfort. Big Sable at dawn, Point Betsie mid-morning, then the passage. Leland's Fishtown basin is tiny and does not take reservations reliably; if it is full, anchor in the lee north of the harbour or run 12nm to Northport. Fuel at Leland or Northport — do not count on Beaver Island tomorrow. Carlson's Fish Market for smoked whitefish before they close."
  },
  {
    day: 4, from: "Leland, MI", to: "Beaver Island, MI", distanceNm: 47, locks: 0,
    leg: "lake-michigan", overnight: "Beaver Island Municipal Marina, St. James",
    highlights: ["Beaver Island: the most isolated inhabited island on the Great Lakes, with a genuine Irish-heritage culture and a nineteenth-century Mormon-kingdom history nobody believes until they read it", "Paradise Bay / St. James Harbor — a deep, protected natural harbour with a light on the point, and courtesy bikes at the marina"],
    warnings: ["Do not plan on Beaver Island diesel. The fuel dock is at Municipal Marina North, which did not open until 29 June in the 2025 season; Day 4 on a 25 June departure is 28 June. Fill at Leland or Northport", "Rounding Cathead Point off the Leelanau tip: the shoal extends well north of the point and the seas stand up there. Give it a mile, then it is 34nm of open crossing with no shelter"],
    notes: "A relief after three 75s, and the first genuinely committing forecast gate of the trip — once past Cathead Point there is nothing until St. James. Ride out to the Beaver Head Light or the Protar cabin on the courtesy bikes. The night sky here is as dark as anything before the North Channel."
  },
  {
    day: 5, from: "Beaver Island, MI", to: "Mackinac Island, MI", distanceNm: 42, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Grays Reef Passage and the Straits of Mackinac — the funnel where all upper-lakes traffic converges", "Threading under the five-mile Mackinac Bridge with the island ahead: the best landfall on Lake Michigan"],
    warnings: ["Straits currents run 2–3kt and reverse; a wind-against-current chop in the Straits is short, steep and out of proportion to the wind strength", "Reserve Mackinac Island State Harbor in advance — it is small, it fills, and there is no anchoring refuge if you arrive with it full and a blow coming"],
    notes: "Depart St. James at dawn. Grays Reef Passage is well marked but busy with commercial traffic — monitor VHF 16. Because Beaver Island took 35nm out of the old Leland-to-Mackinac run, this arrival happens in the early afternoon with the crew awake and on deck, which is how it should be. Have the coffee up and everybody topside for the bridge."
  },
  {
    day: 6, from: "Mackinac Island", to: "Mackinac Island", distanceNm: 0, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Fort Mackinac, Arch Rock, and the eight-mile perimeter road by bicycle — no cars on the island", "Last thorough provisioning and fuel before the North Channel"],
    warnings: ["With Gore Bay cut, Little Current is now FOUR days away. Provision to that gap plus three days, not to the next night — Meldrum Bay has basics only and the Benjamins have nothing at all", "Fill diesel, both jerry cans, the water tank and all three water jugs. Confirm every passport and read the CBSA telephone reporting procedure before you need it"],
    notes: "Named reserve day and the trip's first hard buffer. If the first five days ran clean, spend it on the island. If they did not — and three 75s will tell — this is where you get level. Top up all fuel and water, buy fresh perishables that will last to Little Current, and eat down what will not. Grand Hotel porch for a drink; jacket after 6pm for men. Verify the Garmin inReach plan covers Canada before you cross."
  },

  // ---- NORTH CHANNEL / GEORGIAN BAY (Days 7–15) ----
  {
    day: 7, from: "Mackinac Island, MI", to: "Drummond Island, MI", distanceNm: 39, locks: 0,
    leg: "north-channel", overnight: "Drummond Island Yacht Haven",
    highlights: ["Les Cheneaux Islands archipelago — a taste of what's ahead", "Drummond Island: last US stop before Canadian waters"],
    warnings: ["Passports required for all crew — CBSA check-in required upon first Canadian landfall", "Check Canadian cell data roaming before departure"],
    notes: "Short hop east through the scenic Les Cheneaux Islands. Drummond Island Yacht Haven has fuel, good docks, and a CBSA phone. Confirm check-in protocol before crossing."
  },
  {
    day: 8, from: "Drummond Island, MI", to: "Meldrum Bay, ON", distanceNm: 30, locks: 0,
    leg: "north-channel", overnight: "Meldrum Bay Marina",
    highlights: ["First Canadian landfall", "West end of Manitoulin Island — rugged, remote, spectacular", "North Channel proper begins: pink granite, clear water, pine shoreline"],
    warnings: ["Phone CBSA immediately on arrival — Meldrum Bay is a designated Canadian port of entry. Have passports, vessel registration, MMSI and crew details ready, and keep the clearance number for re-entry", "Fill water here. The next dock water is Little Current, two days away, and tomorrow night is at anchor with no services of any kind"],
    notes: "Cross into Canada. Meldrum Bay is peaceful and unhurried — good fishing and a genuine taste of the North Channel character. Phone CBSA, get your clearance number, and enjoy the quiet."
  },
  {
    day: 9, from: "Meldrum Bay, ON", to: "Benjamin Islands, ON", distanceNm: 40, locks: 0,
    leg: "north-channel", overnight: "Anchor, North / South Benjamin Islands",
    highlights: ["The Benjamin Islands: bare pink granite domes rising straight out of clear water — the anchorage everyone means when they say 'the North Channel'", "Swim off the rock, climb the dome on North Benjamin at sunset, and watch the whole anchorage go copper"],
    warnings: ["No services of any kind. Water, fuel, food and holding-tank capacity all came from Meldrum Bay this morning and Mackinac three days ago", "Forty miles means arriving mid-afternoon, not noon. The main anchorage between North and South Benjamin fills by 1500 in July — if it is full, the outer coves work but are exposed to a northwesterly"],
    notes: "This day absorbed the old Gore Bay stop, which is the one cut most readily reversed if you put a pool day back. Along Manitoulin's north shore past Clapperton and Croker. The main anchorage is the bay between the north shore of South Benjamin and the south shore of North Benjamin, at roughly 46°05.3'N 082°15.2'W — approach slowly, the bottom is rock and weed over granite and you want the anchor set properly the first time. Rode out to 5:1. Then stop, and let the place work."
  },
  {
    day: 10, from: "Benjamin Islands, ON", to: "Little Current, ON", distanceNm: 26, locks: 0,
    leg: "north-channel", overnight: "Spider Bay Marina, Little Current",
    highlights: ["Kagawong: tie to the dock, walk twenty minutes to Bridal Veil Falls, and swim under it", "Little Current swing bridge — the whole channel gathers and waits for the top of the hour together"],
    warnings: ["The swing bridge opens on the hour and only on the hour. Arrive with fifteen minutes in hand and hold station in neutral; the channel current will set you onto the piers if you stop paying attention", "Spider Bay fills in summer — call ahead. This is the last well-equipped town until Kincardine, six days away"],
    notes: "South out of the Benjamins to Kagawong for lunch and the falls, then 14nm east to Little Current. Stock up hard: grocery, LCBO, hardware, fuel, water, pump-out. With Gore Bay cut, this is the only proper resupply on Manitoulin. Buy the CHS paper charts for Frazer Bay and Baie Fine here if you do not already have them."
  },
  {
    day: 11, from: "Little Current, ON", to: "Baie Fine / The Pool, ON", distanceNm: 26, locks: 0,
    leg: "north-channel", overnight: "Anchor, The Pool",
    highlights: ["Ten miles up a fjord between 200ft granite walls — there is nothing else like it in fresh water on this continent", "The Pool: anchor in 40–50ft of water so clear you can watch the anchor set"],
    warnings: ["The entrance bar at the mouth of Baie Fine is shallow at low water — favour the north side and go in at idle with someone on the bow", "Anchoring in 45ft means 225ft of rode at 5:1. The old 150ft spec does not cover this anchorage. Chain-led Rocna or Mantus, sized one up, and set a snubber"],
    notes: "Through the Little Current bridge on the hour, east up Landsdowne Channel into Frazer Bay, then turn into Baie Fine and motor ten miles between the walls. Arrive before 1700 in peak season for a spot in The Pool. Take the dinghy to the head and hike the trail up to Topaz Lake — thirty minutes, steep at the top, and the water in that lake is the colour of the name."
  },
  {
    day: 12, from: "Baie Fine / The Pool", to: "Baie Fine / The Pool", distanceNm: 0, locks: 0,
    leg: "north-channel", overnight: "Anchor, The Pool",
    highlights: ["A full day at anchor in The Pool: swim off the bow into 70°F surface water over 50ft of visibility, granite walls all around, no engine noise anywhere", "Kill every light aboard after dark. The Milky Way here is the version most of the crew has never actually seen"],
    warnings: ["Check your set before you relax — reset the anchor alarm and take two transit bearings on the walls", "Second night with no shore power. Watch the house bank against the fridge draw; run the engine an hour in the morning if you must, then shut it off and leave it off"],
    notes: "This is the day the trip is for, and it survived the compression for that reason. Dinghy to the head of the pool at first light for the mist coming off the water, hike Topaz Lake if you did not yesterday, swim all afternoon, and put everyone on deck after dark."
  },
  {
    day: 13, from: "Baie Fine / The Pool, ON", to: "Killarney, ON", distanceNm: 20, locks: 0,
    leg: "north-channel", overnight: "Killarney Mountain Lodge / Killarney Municipal Marina",
    highlights: ["Back down the fjord in morning light, then around into Killarney through the narrow channel between the town and George Island", "Herbert's Fisheries for the pickerel, eaten standing on the dock like everyone else"],
    warnings: ["The Killarney channel is narrow with a current and constant small-boat traffic — no sailing through, engine on, slow", "Fuel here. It is the last diesel before Tobermory and the Georgian Bay crossing"],
    notes: "Short day out of the fjord and around Badgeley Point. Fill diesel, water and both jerry cans at Killarney and pump out. Walk the east lighthouse point in the evening for the view back at the La Cloche ridge — white quartzite, which is why the hills look snow-covered in August."
  },
  {
    day: 14, from: "Killarney, ON", to: "Killarney, ON", distanceNm: 0, locks: 0,
    leg: "north-channel", overnight: "Killarney Mountain Lodge / Killarney Municipal Marina",
    highlights: ["Killarney Provincial Park: the Granite Ridge or Cranberry Bog trails start a short taxi ride from the marina, and the La Cloche quartzite is 3.5 billion years old", "The Killarney Mountain Lodge deck for a drink with the whole channel in front of you"],
    warnings: ["This is the weather gate for tomorrow's Georgian Bay crossing. If wind is forecast above 18kt from W or NW, you do not go — that is what this day is for, and you may need more than one of them", "If you are drawing on the floating pool, draw it here. There is no better place on the route to be stuck"],
    notes: "Named reserve day, at the single highest-probability pin point on the route, and the one not to cut under any amount of compression. Northern Georgian Bay builds a steep westerly swell that a 30-footer will not enjoy for nine hours. Get the marine forecast twice today, watch the barometer, and make the go/no-go call the evening before rather than at 0500. If it is a go, prep tonight: jacklines rigged, tethers laid out, a hot meal cooked and in a thermos, and the crew briefed on the cold-water MOB plan."
  },
  {
    day: 15, from: "Killarney, ON", to: "Tobermory, ON", distanceNm: 48, locks: 0,
    leg: "north-channel", overnight: "Big Tub Harbour, Tobermory",
    highlights: ["Georgian Bay open-water crossing — most exposed day since Lake Michigan", "Tobermory: Fathom Five National Marine Park, crystal-clear shipwrecks visible from the surface", "Flowerpot Island ferry trip if you have an afternoon"],
    warnings: ["The most exposed crossing between Lake Michigan and Lake Erie — nine hours with no shelter once you clear Badgeley Point. Go only on a clean forecast made the night before", "There is no mid-crossing bail-out. Your options are Killarney behind you or Tobermory ahead; make the decision at the dock, not at the halfway point"],
    notes: "Cross northern Georgian Bay to Tobermory at the tip of the Bruce Peninsula. Check the forecast the night before and depart at dawn. Fathom Five has some of the most photographed freshwater wrecks in the world. Big Tub Harbour is well-protected and stunning."
  },

  // ---- LAKE HURON (Days 16–18) ----
  {
    day: 16, from: "Tobermory, ON", to: "Kincardine, ON", distanceNm: 65, locks: 0,
    leg: "lake-huron", overnight: "Kincardine Marina",
    highlights: ["The Bruce Peninsula's limestone cliffs falling away to port for the first twenty miles", "Kincardine's Saturday-evening bagpiper ceremony: a lone piper walks out to the lighthouse at sunset and plays the boats home. Twenty minutes, free, and the best thing on this coast"],
    warnings: ["Bail-outs: Southampton (48nm) and Port Elgin (52nm). Both are river-mouth harbours that shoal — enter only in settled conditions, and do not treat either as an all-weather refuge", "Ontario's Lake Huron shore is a lee shore in any westerly. A 65nm day with two marginal bail-outs means the forecast is the go/no-go, not the conditions at the dock"],
    notes: "Engineer this day to fall on a Saturday — a Friday departure from Winthrop Harbor does it. Depart Big Tub at first light. The run down the Bruce is beautiful and exposed; the wind farms south of Port Elgin tell you exactly how much breeze the coast gets. Arrive Kincardine mid-afternoon, get a slip, and be on the lighthouse pier by sunset. Fuel and provision here — it is the best-equipped stop since Little Current."
  },
  {
    day: 17, from: "Kincardine, ON", to: "Goderich, ON", distanceNm: 27, locks: 0,
    leg: "lake-huron", overnight: "Maitland Valley Marina, Goderich",
    highlights: ["Goderich: laid out as an octagonal 'Square' around the courthouse, and reasonably called the prettiest town in Canada", "The Sifto salt mine runs under the lake for miles — the harbour is a working one and the ships loading salt are worth watching"],
    warnings: ["Short day by design, and it is also the Lake Huron weather gate. If the forecast is bad, stay in Kincardine — Goderich is only four and a half hours away and can be run on any morning", "Bayfield, 10nm further south, looks tempting and is prettier, but its river-mouth entrance carries only 6–8ft and breaks in an onshore sea. Goderich is the harbour of refuge on this coast; Bayfield is not"],
    notes: "Twenty-seven miles and half a day ashore, deliberately kept through the compression pass because the alternative is the old 85nm lee-shore run ending in a customs call. Maitland Valley Marina on the north shore of the river has the most transient berths; Snug Harbour Municipal is inside the inner harbour with 22ft alongside and fuel, water and pump-out nearby, but few transient slips — call both. Walk the Menesetung Bridge trail, do the Square, and be rested for tomorrow."
  },
  {
    day: 18, from: "Goderich, ON", to: "Sarnia, ON / Port Huron, MI", distanceNm: 58, locks: 0,
    leg: "lake-huron", overnight: "Sarnia Bay Marina (Canada) or Port Huron area marina (US)",
    highlights: ["The Blue Water Bridge twin spans rising out of the haze — the gateway to the St. Clair River and the lower lakes", "Back in US waters, and the last customs formality of the trip"],
    warnings: ["Bail-outs: Bayfield (12nm, fair weather only), Grand Bend (30nm, shallow entrance), and Harbor Beach, MI (40nm across, a genuine artificial harbour of refuge and the right choice if it turns nasty)", "CRITICAL: contact US CBP the moment you are in US waters — 1-800-973-2867 or the CBP videophone at the marina. Have all passports, vessel documentation and your CBSA clearance number in hand before you tie up"],
    notes: "Fifty-eight miles instead of eighty-five, and the customs call happens after a nine-hour day rather than a fifteen-hour one. Traffic density climbs sharply in the last ten miles — monitor VHF 16 and switch to 13 for the river. Do the CBP call before anyone goes to dinner. Fuel and pump out before the river transit; there is a strong current below the bridge and you do not want to be looking for a fuel dock in it."
  },

  // ---- ST. CLAIR RIVER / DETROIT (Day 19) ----
  {
    day: 19, from: "Port Huron, MI", to: "Detroit, MI", distanceNm: 68, locks: 0,
    leg: "st-clair", overnight: "Detroit City Marina or Wyandotte area",
    highlights: ["St. Clair River 2–3 knot current carries you south at a satisfying pace", "1,000-foot lake freighters sharing the same narrow channel", "Detroit Riverwalk and skyline"],
    warnings: ["Heavy commercial traffic on the St. Clair River — monitor VHF 13 continuously and give every downbound freighter the whole channel. Never cross ahead of one; the current is adding 2–3kt to their speed", "Lake St. Clair is shallow outside the buoyed lane and the 30.1 draws about 5ft. St. Clair, MI (20nm) and Algonac (35nm) are easy stops if you want to break the day"],
    notes: "The St. Clair current is free speed — enjoy it. Across Lake St. Clair (follow the channel), then the Detroit River. Fuel and rest in Detroit."
  },

  // ---- LAKE ERIE (Days 20–25) ----
  {
    day: 20, from: "Detroit, MI", to: "Put-in-Bay, OH", distanceNm: 55, locks: 0,
    leg: "lake-erie", overnight: "South Bass Island mooring or dock",
    highlights: ["Perry's Victory & International Peace Memorial (352ft) — take the elevator up for views", "Golf cart rentals for island tour", "Lively boating scene and live music"],
    warnings: ["Lake Erie is the shallowest Great Lake and builds a steep 4-second sea in under two hours on a NW front. Check the 48-hour forecast, not yesterday's conditions", "Detroit and Put-in-Bay are both legitimate hold points — this is the leg where the floating pool gets spent, and spending it here is correct"],
    notes: "Enter Lake Erie via Detroit River. Arrive Put-in-Bay by early afternoon to secure a mooring."
  },
  {
    day: 21, from: "Put-in-Bay, OH", to: "Cleveland, OH", distanceNm: 70, locks: 0,
    leg: "lake-erie", overnight: "North Coast Harbor or Edgewater Marina, Cleveland",
    highlights: ["Seventy miles of open western-basin Erie with a harbour entrance never more than eight miles away", "Cleveland's skyline coming up out of a flat green shore — an improbably dramatic approach from the lake"],
    warnings: ["Bail-outs, all with easy breakwater entrances: Huron (28nm), Vermilion (36nm), Lorain (48nm), Rocky River (60nm)", "Afternoon thunderstorms track northeast across the lake. If you see building cumulonimbus to the west, duck into Lorain and finish tomorrow"],
    notes: "Depart Put-in-Bay at first light. Low-commitment despite the number — the Ohio shore has a harbour every 12–15nm, which is what makes a 70nm day acceptable here and nowhere else on Erie. North Coast Harbor puts you a ten-minute walk from the Rock & Roll Hall of Fame; Edgewater is quieter and has better fuel access."
  },
  {
    day: 22, from: "Cleveland, OH", to: "Cleveland, OH", distanceNm: 0, locks: 0,
    leg: "lake-erie", overnight: "North Coast Harbor or Edgewater Marina, Cleveland",
    highlights: ["Rock & Roll Hall of Fame and the Great Lakes Science Center, both walking distance from North Coast Harbor", "West Side Market for the best provisioning between the start and New York — go early, go with a cart, and buy for four days"],
    warnings: ["This is the Lake Erie weather gate and the only named reserve on the leg. The two days after it are short by design (50 and 40nm) so this day can absorb a front without the schedule bleeding", "Last real chandlery and parts access until Buffalo. Audit the engine spares kit here and replace whatever you have used"],
    notes: "Named reserve day on the deadliest water of the trip, kept through the compression pass. If the forecast is clean, spend it: the Warehouse District and East 4th Street are genuinely good, and a full provisioning run here carries you to the canal. Change the engine oil and both fuel filters — you will have run roughly 170 motoring hours by now and the canal ahead is 339 miles of continuous engine time."
  },
  {
    day: 23, from: "Cleveland, OH", to: "Ashtabula, OH", distanceNm: 50, locks: 0,
    leg: "lake-erie", overnight: "Harbor Yacht Club & Marina, Ashtabula",
    highlights: ["Ashtabula Harbor: eleven marinas on one river, a working ore-and-coal waterfront, and the Bridge Street historic district with its 1925 lift bridge", "Fairport Harbor (25nm) makes a good lunch stop — the marine museum is in the old keeper's dwelling and the lighthouse is climbable"],
    warnings: ["Fairport Harbor (25nm) is the only good mid-run shelter on the emptiest stretch of the Ohio shore", "The Ashtabula River entrance is a commercial channel with ore-carrier traffic. Monitor VHF 13 on approach and do not cut the breakwall corner"],
    notes: "This day and the next replace the old plan's 80nm Cleveland-to-Erie run, which was the most committing day on the lake. Fifty and forty is better arithmetic and the split was kept through the compression pass. Harbor Yacht Club is half a mile up the river past the lighthouse and takes transients; the Port Authority's free transient dock on Bridge Street is day-use only (two hours) but has the only public pump-out on Lake Erie. Walk Bridge Street for dinner."
  },
  {
    day: 24, from: "Ashtabula, OH", to: "Erie, PA", distanceNm: 40, locks: 0,
    leg: "lake-erie", overnight: "Presque Isle State Park Marina",
    highlights: ["Presque Isle: a seven-mile sand peninsula enclosing the best natural harbour on Lake Erie, with swimming beaches on the outside", "The U.S. Brig Niagara at the Erie Maritime Museum — Perry's flagship, rebuilt, and she sails"],
    warnings: ["Conneaut (12nm) is the mid-run bail-out; after it there is nothing until the Presque Isle channel", "The Presque Isle entrance channel is narrow and the currents across it set east. Enter under power, stay in the marked channel"],
    notes: "Forty easy miles. Get in by early afternoon, then take the afternoon at Presque Isle — this is the best swimming water on the route east of Lake Michigan and the crew has been in foul weather gear for a month. Fuel, water and pump-out at the state park marina. Last fuel before Buffalo. Make the mast-unstep crane call to Wardell's or Smith Boys tonight if you have not already."
  },
  {
    day: 25, from: "Erie, PA", to: "Buffalo/Tonawanda, NY", distanceNm: 70, locks: 1,
    leg: "lake-erie", overnight: "Smith Boys or Wardell's Marina, Tonawanda",
    highlights: ["Black Rock Lock: hail the tender on VHF 13 well out. It bypasses the Niagara River current and drops you into the canal feeder", "Buffalo Canalside on the way through — USS Little Rock and the restored commercial slip where the original canal terminated"],
    warnings: ["Bail-outs: Barcelona Harbor (20nm, small and shallow — confirm depth) and Dunkirk/Chadwick Bay (42nm, a proper marina behind a breakwater). After Dunkirk there is only Sturgeon Point", "The Niagara River current accelerates below the Buffalo breakwall and runs toward the falls. Do not drift past the harbour entrance without the Black Rock Lock arranged and the engine running well"],
    notes: "Restored to a single 70nm day in the compression pass; Dunkirk is now a named bail-out rather than an overnight. Depart Presque Isle at first light so the Niagara approach happens with plenty of daylight. Tonawanda is the last major parts source until New York — West Marine, big-box stores, both boatyards. Confirm the crane time, buy extra cotter and clevis pins, and get the Niagara Falls trip done tonight; it is twenty minutes by car and it is not optional."
  },

  // ---- ERIE CANAL (Days 26–35) ----
  {
    day: 26, from: "Tonawanda (mast prep)", to: "Tonawanda", distanceNm: 0, locks: 0,
    leg: "erie-canal", overnight: "Tonawanda boatyard",
    highlights: ["Mast down — major transition from Great Lakes sailing to canal mode"],
    warnings: ["Verify air draft meets the 14 ft 6 in (≈4.4 m) design target after unstep — measure to the top of every antenna, GPS puck, and wind transducer, not just the mast", "Secure all deck hardware that could snag under low bridges", "Mast must be well-padded and tied — it will overhang bow or stern"],
    notes: "Unstep and cradle mast. Rig extra fenders (8+ needed for locks — both sides). Set up dedicated lock lines (2× 50ft). Fill water tank. Grocery run."
  },
  {
    day: 27, from: "Tonawanda, NY", to: "Albion, NY", distanceNm: 0, distanceMi: 46, locks: 2,
    leg: "erie-canal", overnight: "Albion canal wall",
    highlights: ["Locks E-35 and E-34 at Lockport: a paired flight lifting about 49ft, with the 1825 'Flight of Five' preserved alongside", "Medina at mile 35 — a whole downtown built of local red sandstone, and the Culvert Road, the only place a road passes underneath the canal"],
    warnings: ["First locks of the trip and a paired flight straight away. Fenders both sides, fender board rigged, two crew on lines fore and aft, engine in gear for steerage, and nobody's fingers between hull and wall", "Verify your air draft before the first fixed bridge. Measure to the top of every antenna, GPS puck and wind transducer, not just the mast crutch. Design target is 14ft 6in"],
    notes: "Seven and a half hours, and after Lockport there is not another lock for sixty miles. Medina at mile 35 is the natural lunch stop and was the overnight before the compression pass — worth an hour ashore for the sandstone and the Culvert Road. Albion has a free canal wall by the Main Street lift bridge and a good village around it."
  },
  {
    day: 28, from: "Albion, NY", to: "Fairport, NY", distanceNm: 0, distanceMi: 46, locks: 2,
    leg: "erie-canal", overnight: "Fairport canal dock",
    highlights: ["Brockport, Spencerport and the Rochester land cut — lift-bridge towns where the operator sees you coming and stops traffic", "Fairport: the red lift bridge, the towpath, and Moonlight Creamery. The most photogenic town on the canal"],
    warnings: ["Only two locks, but 46 miles of 7mph water. Underway by 0700, and remember the limit is 10mph on the main canal and 5mph in towns and past moored boats", "The Rochester section collects floating debris after rain — logs just awash will foul a prop. Go slow through weedy stretches and keep a mask and a sharp knife where you can reach them"],
    notes: "Pittsford's Schoen Place at mile 40 is the better-known stop and was the overnight before compression; Fairport is six miles further, has the better waterfront and a canal dock, and buys you six miles for tomorrow. Either works — take Pittsford if you arrive tired."
  },
  {
    day: 29, from: "Fairport, NY", to: "Clyde, NY", distanceNm: 0, distanceMi: 36, locks: 6,
    leg: "erie-canal", overnight: "Clyde canal wall",
    highlights: ["Palmyra and Newark — the heart of the old canal, with the Erie Canal Museum at Palmyra a short walk from Lock E-29", "Lyons at mile 118: the peppermint capital of America, and the town genuinely smells of it in summer. Tie up for lunch"],
    warnings: ["Six locks in 36 miles, all descending. Budget 25 minutes each including approach — two and a half hours of the day spent stationary in chambers", "There is no Lock E-31 on the modern canal. If your lock list or plotter shows one, it is wrong; the sequence runs E-32 to E-30"],
    notes: "Short mileage, lock-heavy day. Lyons was the overnight before the compression pass and is now the lunch stop — still worth the hour for the H.G. Hotchkiss peppermint museum. Clyde has a small free wall and a quiet park; if it is taken, Lyons (10mi back) has a better one at Abbey Park."
  },
  {
    day: 30, from: "Clyde, NY", to: "Brewerton, NY", distanceNm: 0, distanceMi: 61, locks: 3,
    leg: "erie-canal", overnight: "Ess-Kay Yards, Brewerton",
    highlights: ["Montezuma National Wildlife Refuge — the canal runs through the middle of it. Herons, eagles, ospreys and turtles on every bank", "The Cayuga-Seneca Canal junction at May's Point, and Baldwinsville's lock-side village at mile 167"],
    warnings: ["Longest canal day at about ten hours. Underway at 0630 and keep the stops short. Baldwinsville (mile 167) is the fallback if you are running late — free wall beside Lock E-24", "The Seneca River section between May's Point and Three Rivers is a natural river, not a land cut — it winds, it shoals outside the channel, and the marks matter"],
    notes: "Ten hours but flat, straight and only three locks. This day absorbed the old Baldwinsville overnight in the compression pass. Ess-Kay Yards at Brewerton is the best-equipped marina on the canal system — diesel, pump-out, laundry, showers, chandlery, full service department. Book ahead in July and August. Fill everything tonight and get to bed early: tomorrow starts at 0530."
  },
  {
    day: 31, from: "Brewerton, NY", to: "Rome, NY", distanceNm: 0, distanceMi: 35, locks: 2,
    leg: "erie-canal", overnight: "Bellamy Harbor Park, Rome",
    highlights: ["Oneida Lake at first light: 21 miles of glass, with the sun coming up over Sylvan Beach at the far end", "Sylvan Beach for lunch — a 1900s lakeside amusement park with a Ferris wheel next to a canal lock, which is exactly as strange as it sounds"],
    warnings: ["Cross Oneida at dawn. It is the only genuinely open water on the canal, it is shallow, and it gets rough on an afternoon breeze. Underway by 0530 puts you at Sylvan Beach before 1000", "Oneida's buoyed channel matters — the lake shoals badly outside it, particularly at the eastern end"],
    notes: "Twenty-one miles of lake and fourteen of canal, with the lake done before the wind wakes up. This is the fix for the old plan's 88-mile day, which crossed Oneida in the afternoon at the end of an exhausted day. Sylvan Beach for a long lunch and the boardwalk, then two locks into Rome. Bellamy Harbor Park is a Canal Corporation dock with 50-amp power and a summer welcome center, and Fort Stanwix National Monument is a mile and a half up the road — the fort that held the Mohawk Valley in 1777, rebuilt full-scale."
  },
  {
    day: 32, from: "Rome, NY", to: "Little Falls, NY", distanceNm: 0, distanceMi: 36, locks: 3,
    leg: "erie-canal", overnight: "Rotary Park / Canal Place, Little Falls",
    highlights: ["The Mohawk Valley proper — the canal becomes a canalized river and the scenery improves sharply", "Little Falls: the canal threads a limestone gorge past Moss Island, whose glacial potholes are a twenty-minute walk from the free Rotary Park dock"],
    warnings: ["Ilion Municipal Marina (26mi) is the last good pump-out and fuel point before the Hudson — stop and use it even if you do not need it yet", "Lock E-17 sits immediately east of the Little Falls dock. Do not attempt it this evening; it is the deepest single lock on the canal at 40.5ft and it deserves a fresh crew"],
    notes: "Six and a half hours with a fuel and pump-out stop at Ilion in the middle. Little Falls is the best town on the eastern canal: Canal Place, the limestone cliffs, the potholes, and a free dock in a park. Climb Moss Island in the evening — the potholes were drilled by meltwater from a glacial lake draining through here 12,000 years ago and some are twenty feet deep."
  },
  {
    day: 33, from: "Little Falls, NY", to: "Canajoharie, NY", distanceNm: 0, distanceMi: 18, locks: 4,
    leg: "erie-canal", overnight: "Canajoharie village wall",
    highlights: ["Lock E-17 as the first lock of the morning: a 40.5ft drop, the deepest on the Erie, with a guillotine gate that comes down over your head", "The Arkell Museum at Canajoharie — a Beech-Nut baby-food fortune spent on Winslow Homer, Mary Cassatt and Gilbert Stuart, in a village of 2,000 people"],
    warnings: ["Four locks in 18 miles; short in distance, long in chamber time. Budget four and a half hours and start at 0730 so E-17 is the first thing you do", "Canajoharie's village wall is short and has limited power. If it is taken, Fort Plain (4mi back) and St. Johnsville Marina (9mi back) both have walls"],
    notes: "The one light day left in the canal, and the crew will have earned it after a ten-hour day and a 0530 start in the preceding three. Through E-17 first thing, then three more locks and tied up by noon. The Arkell is a genuinely surprising collection, and the Canajoharie Gorge trail in Wintergreen Park is a half-hour walk from the wall with swimming holes at the top."
  },
  {
    day: 34, from: "Canajoharie, NY", to: "Schenectady, NY", distanceNm: 0, distanceMi: 41, locks: 6,
    leg: "erie-canal", overnight: "Mohawk Harbor Marina, Schenectady",
    highlights: ["Schoharie Crossing at Fort Hunter — the 1841 Schoharie Aqueduct ruins, where the enlarged canal crossed a creek on stone arches", "Amsterdam's Riverlink Park at mile 22: floating docks, an elevated walkway into town, showers and laundry"],
    warnings: ["Six locks and 41 miles, roughly eight hours. Underway at 0700 and keep the lunch stop short", "Mohawk Harbor sits between Locks E-7 and E-8. Hail the dock attendant on VHF 13 before entering the basin — slips take up to 35ft LOA, linear dockage for anything longer"],
    notes: "The last long day on the canal. Riverlink Park at Amsterdam is the natural lunch and pump-out stop ($2/ft if you stay). Mohawk Harbor is a modern basin with restaurants on the quay and, critically, it is the right place to stage for the Waterford Flight. Do not push past it — that is what broke the original plan."
  },
  {
    day: 35, from: "Schenectady, NY", to: "Waterford, NY", distanceNm: 0, distanceMi: 20, locks: 6,
    leg: "erie-canal", overnight: "Waterford Visitor Center Dock (free 48hr, power, water)",
    highlights: ["The Waterford Flight: five locks dropping 169ft in a mile and a half, the steepest lock flight in the world when it opened in 1915", "MILESTONE — Great Lakes to Atlantic, connected. The Visitor Center volunteers at the bottom have been known to hand arriving crews a beer"],
    warnings: ["Reach the top of the Flight (Lock E-6) by 2:30pm at the absolute latest — once you enter you go through all five without stopping. Departing Mohawk Harbor at 0730 puts you at E-6 around 0910, which is the margin this day exists to give you", "Do not raise the mast at Waterford. The Troy Federal Lock is tomorrow and Hop-O-Nose in Catskill has the crane"],
    notes: "Twenty miles, six locks, and you are at the bottom of the Flight before lunch. The original plan asked for 95 miles and 9 locks against this same 2:30 deadline, which was not physically possible; this is the fix and it survived the compression pass intact. Lock through E-7 at Niskayuna, then the Flight. Look up at the walls as you drop. Free 48-hour dock with power and water at the Visitor Center, and the afternoon is yours."
  },

  // ---- HUDSON RIVER (Days 36–40) ----
  {
    day: 36, from: "Waterford, NY", to: "Catskill, NY", distanceNm: 40, locks: 1,
    leg: "hudson", overnight: "Hop-O-Nose Marina, Catskill Creek",
    highlights: ["Troy Federal Lock: last lock, 14ft drop, free, hail VHF 13", "Now in tidal Hudson — current changes with tide", "MAST RE-STEP at Hop-O-Nose Marina, Catskill Creek (call ahead for crane)"],
    warnings: ["Tidal timing: high tide at Troy is ~5–6hrs AFTER high tide at NYC Battery — check Troy specifically on a tide app", "Hop-O-Nose is 1nm up Catskill Creek from the Hudson — easy approach in calm water"],
    notes: "Through the Troy Federal Lock (last lock of the trip, 14ft, free, hail VHF 13) and you are in the tidal Hudson. High water at Troy runs 5–6 hours later than at the Battery — check Troy specifically. Past Albany at mile 145 and into Catskill Creek at mile 112; Hop-O-Nose is 1nm up the creek. Get the mast stepped this afternoon. Tomorrow is for making it right."
  },
  {
    day: 37, from: "Catskill, NY", to: "Catskill, NY", distanceNm: 0, locks: 0,
    leg: "hudson", overnight: "Hop-O-Nose Marina, Catskill Creek",
    highlights: ["Tune the rig properly, bend on the sails, and get the masthead instruments talking to the plotter again", "The town of Hudson across the river is an art-and-antiques enclave and a good taxi ride for dinner"],
    warnings: ["A mast that has lain on deck for ten days needs a full re-tune, not a quick turnbuckle check. Set the rake, get the shrouds even, and re-check after the first hour of sailing tomorrow", "Re-seize every turnbuckle with stainless wire and re-pin every clevis. Check the masthead VHF antenna and the wind transducer before you leave the dock — you will not want to go aloft in the Highlands"],
    notes: "Kept through the compression pass. The original plan allotted two to three hours for the mast re-step; crane time is two to three hours, and re-reeving halyards, tuning the rig, reconnecting masthead wiring, bending on sails and doing a shakedown motor down the creek is a day. You are about to sail into the Hudson Highlands, where the geography gusts a 12-knot day to 25."
  },
  {
    day: 38, from: "Catskill, NY", to: "Poughkeepsie, NY", distanceNm: 60, locks: 0,
    leg: "hudson", overnight: "Shadows Marina or Poughkeepsie YC",
    highlights: ["Hudson-Athens Lighthouse", "Kingston/Rondout Creek: Hudson River Maritime Museum (optional stop)", "Catskill Mountains backdrop to the west"],
    warnings: ["Ride the ebb south — depart 1–2 hours after local high water. On a good cycle it runs 1.5–2.5kt in your favour", "Bail-outs: Kingston/Rondout Creek (20nm, and worth the stop for the Hudson River Maritime Museum) and Norrie Point (36nm)"],
    notes: "Mostly sailing now, on a rig you tuned yesterday. SW breezes common in the afternoon. Ride the ebb, motorsail if wind is light."
  },
  {
    day: 39, from: "Poughkeepsie, NY", to: "New York City", distanceNm: 75, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina, Jersey City",
    highlights: ["The Hudson Highlands in the morning: Bannerman's Castle on Pollepel Island, Storm King, West Point on its bluff, Bear Mountain Bridge", "The Palisades, the George Washington Bridge, then the Statue of Liberty and the Manhattan skyline on the final approach — staged for golden hour, with the whole crew on deck"],
    warnings: ["Twelve hours. Work the tide: you get roughly six hours of favourable ebb and then six against the flood. Departing 0730 typically lands you in the harbour around 1930, which is golden hour in July and August. If the tide cycle does not align, do not force it", "Bail-out and fallback: Haverstraw Marina at 34nm. If the light or the tide is going wrong, stop there and run the last 33nm tomorrow afternoon. That costs one pool day out of twelve and it is the right trade"],
    notes: "The compression pass merged the old Haverstraw overnight back into a single day. It works, but it gives up control over the arrival time, so the Haverstraw fallback is written into the warnings on purpose — the Manhattan landfall is the emotional summit of the trip and it is worth a pool day to get the light right. The last 15nm is dense with ferries, tugs, tour boats and Coast Guard traffic, all moving fast: running lights on, AIS transmitting, one crew doing nothing but watching. Reserve Liberty Landing weeks ahead."
  },
  {
    day: 40, from: "New York City", to: "New York City", distanceNm: 0, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina",
    highlights: ["Rest, reprovisioning, city sightseeing"],
    warnings: ["Check the East River current tables for Hell Gate specifically — not generic NYC tides — and pick tomorrow's departure hour from them before you commit to anything else", "Last major provisioning and parts access of the trip. West Marine in Weehawken; full fuel, full water, and a complete gear audit"],
    notes: "Buffer day. Full fuel and water. Audit all gear before the Long Island Sound leg up to Old Saybrook."
  },

  // ---- LONG ISLAND SOUND → OLD SAYBROOK (Days 41–44) ----
  {
    day: 41, from: "New York Harbor", to: "Oyster Bay or Cold Spring Harbor, NY", distanceNm: 28, locks: 0,
    leg: "sound-saybrook", overnight: "Oyster Bay or Cold Spring Harbor marina",
    highlights: ["East River transit through Manhattan — dramatic urban sailing", "Long Island Sound opens up — excellent sailing begins", "SW sea breezes = beam reaching east"],
    warnings: ["CRITICAL: Time the East River / Hell Gate carefully. Currents reach 4–5 knots at Hell Gate. Aim to pass Hell Gate at or just before slack water on a favorable ebb.", "Do NOT attempt Hell Gate on a strong opposing current"],
    notes: "Short day to get onto LIS. Once through Hell Gate, the sailing is typically glorious — consistent SW sea breeze for a beam reach east."
  },
  {
    day: 42, from: "Oyster Bay, NY", to: "Port Jefferson, NY", distanceNm: 38, locks: 0,
    leg: "sound-saybrook", overnight: "Port Jefferson Harbor",
    highlights: ["Classic Long Island Sound beam reach", "Port Jefferson: beautiful harbor, ferry terminal, great waterfront restaurants"],
    warnings: ["Summer SW sea breezes fill in by mid-morning — get out early before traffic", "Ferry traffic is constant across the harbor mouth — cross astern of them, never ahead"],
    notes: "Beautiful sailing day. Port Jefferson has full services."
  },
  {
    day: 43, from: "Port Jefferson, NY", to: "Greenport, NY", distanceNm: 40, locks: 0,
    leg: "sound-saybrook", overnight: "Mitchell Park Marina, Greenport",
    highlights: ["North Fork wine country — some of the best in the Northeast", "Shelter Island accessible by short ferry from Greenport", "Eastern LIS: more open water, great sailing"],
    warnings: ["Tomorrow starts through Plum Gut, which runs to 5kt. Work the current tables tonight, not in the morning", "If you are carrying spare pool days at this point, this is one of the best places on the route to spend one"],
    notes: "Another excellent sailing day. Greenport is a great overnight — walk to wine tasting or ferry to Shelter Island."
  },
  {
    day: 44, from: "Greenport, NY", to: "Old Saybrook, CT", distanceNm: 20, locks: 0,
    leg: "sound-saybrook", overnight: "Saybrook Point Marina",
    highlights: ["Out of Gardiners Bay through Plum Gut — one of the fiercest tidal gates on the East Coast — and across the mouth of the Sound", "Mouth of the Connecticut River — a beautiful finish", "Essex (5nm upriver): one of the prettiest New England towns, Essex Steam Train connects to river boat tours", "Saybrook Point lighthouse"],
    warnings: ["Plum Gut runs to 5kt. Take it on the early ebb heading north; against a flood it is a wall. The Race lies east of this route — running out through it and back adds about 10nm and is a detour for the ride, not the way to Old Saybrook", "The Connecticut River entrance shoals and the bar shifts. Follow the marked channel, not the rhumb line, and take it on a rising tide"],
    notes: "Twenty miles: east around Orient Point, north through Plum Gut, then northwest across the eastern Sound to Saybrook Point. Short enough to time both ends — Plum Gut on the ebb, the river entrance on a flood — which gives you the current up the river and the option of running straight on to Essex, 5nm upstream, the same afternoon. Forty-four days and 1,641 nautical miles from North Point Marina."
  },
];
