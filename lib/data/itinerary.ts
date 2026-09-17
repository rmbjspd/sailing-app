import type { ItineraryDay } from "../types";

// The voyage, day by day. This file is the single source of truth: every
// distance, lock count and day range shown anywhere in the app is derived from
// it by lib/data/stats.ts.
//
// The plan spends 52 of the 56 available sabbatical days. Eight of those days
// cover zero distance — they are named reserve/layover days placed at the
// route's real weather gates (Mackinac D8, Baie Fine D15, Killarney D17,
// Cleveland D25, NYC D46, Mystic D51) plus the mast-unstep day at Tonawanda
// (D30) and the rigging day at Catskill (D42). Four further days are held
// unallocated as a floating pool, and three canal days (31+32, 35+36, 38+39)
// can be merged to claw back schedule. Total usable slack: 13 days.
export const itinerary: ItineraryDay[] = [
  // ---- LAKE MICHIGAN (Days 1–8) ----
  {
    day: 1, from: "Chicago, IL", to: "St. Joseph, MI", distanceNm: 53, locks: 0,
    leg: "lake-michigan", overnight: "Anchor's Way / St. Joseph Municipal Marina",
    highlights: ["First open-water crossing of southern Lake Michigan", "St. Joseph's beach and waterfront restaurants — 'Riviera of the Midwest'"],
    warnings: ["Depart early — afternoon thunderstorms common on Lake Michigan in June", "Michigan City (35nm) is the mid-run bail-out if a squall line forms behind you"],
    notes: "Depart DuSable Harbor at first light. Set a course SE across southern Lake Michigan. Arrive by late afternoon. Refuel on arrival."
  },
  {
    day: 2, from: "St. Joseph, MI", to: "Grand Haven, MI", distanceNm: 60, locks: 0,
    leg: "lake-michigan", overnight: "Grand Haven Municipal Marina",
    highlights: ["Pass South Haven and Saugatuck en route", "Grand Haven waterfront music fountain show in the evenings"],
    warnings: ["South Haven (25nm) and Saugatuck/Holland (42nm) are your bail-out harbors — both have easy breakwater entrances in an onshore sea", "Afternoon NW winds build 2–4ft short-period chop off this shore; plan to be inside the piers by 3pm"],
    notes: "Day sail hugging Michigan's eastern shore. Refuel and pump out at Grand Haven."
  },
  {
    day: 3, from: "Grand Haven, MI", to: "Pentwater, MI", distanceNm: 46, locks: 0,
    leg: "lake-michigan", overnight: "Pentwater Municipal Marina",
    highlights: ["Muskegon and White Lake passed en route — two of the easiest bail-outs on the eastern shore", "Pentwater Lake: a quiet, fully protected inland harbor behind a short channel, with Mears State Park beach a ten-minute walk away"],
    warnings: ["Pentwater Municipal has no fuel dock — diesel is at the private yards on Pentwater Lake, or 12nm north at Ludington. Call ahead or plan to fill at Ludington tomorrow morning", "Little Sable Point accelerates a NW breeze; stand two miles off and round it before the afternoon build"],
    notes: "Deliberately short. This day exists so that Big Sable Point gets rounded tomorrow morning on a fresh crew rather than this afternoon on a tired one. Muskegon (18nm) and White Lake (34nm) are both easy diversions. The Pentwater channel is narrow and shallows on its north side — favor the middle and go slow. 44 slips, 22 of them transient, reservable through the Michigan DNR system."
  },
  {
    day: 4, from: "Pentwater, MI", to: "Frankfort, MI", distanceNm: 56, locks: 0,
    leg: "lake-michigan", overnight: "Frankfort Municipal Marina, Betsie Lake",
    highlights: ["Big Sable Point rounded before noon — the wind accelerator on this coast, taken at the right time of day", "Point Betsie Light on the approach to Frankfort, with the first of the Sleeping Bear bluffs rising behind it"],
    warnings: ["Ludington (12nm) is your certain diesel and pump-out stop — top off there, do not push past it on a partial tank", "Manistee (30nm) and Onekama/Portage Lake (40nm) are the mid-run bail-outs if a NW front arrives early"],
    notes: "Leave at first light. Ludington is 12nm up the coast and is the last full-service fuel dock before the Manitou Passage — go in, fill diesel and water, and be out again by 0900. Frankfort's entrance into Betsie Lake is well marked and holds in almost any weather, which is why it is the correct staging harbor for the Manitou Passage. Walk the beach to Point Betsie in the evening."
  },
  {
    day: 5, from: "Frankfort, MI", to: "Leland, MI", distanceNm: 40, locks: 0,
    leg: "lake-michigan", overnight: "Leland (Fishtown) — limited slips, call ahead",
    highlights: ["South Manitou Island: anchor in the harbor for two hours, dinghy ashore to the Valley of the Giants old-growth cedars and the wreck of the Francisco Morazan on the south shore", "The Manitou Passage under sail with Sleeping Bear's 400ft perched dunes to starboard"],
    warnings: ["South Manitou Harbor is open to the E and SE — it is a fair-weather stop only, and not an overnight unless the forecast is settled from the W", "Manitou Passage generates confused seas when wind opposes lake swell; if it is up, bypass the island and run straight to Leland"],
    notes: "Short mileage, long day — that is the point. Anchor in South Manitou Harbor in 20–25ft over sand, take the dinghy in, and give the crew three hours ashore. Then 14nm east to Leland. Leland's Fishtown basin is tiny and does not take reservations reliably; if it is full, anchor in the lee north of the harbor or run 12nm to Northport. Carlson's Fish Market for smoked whitefish before they close."
  },
  {
    day: 6, from: "Leland, MI", to: "Beaver Island, MI", distanceNm: 47, locks: 0,
    leg: "lake-michigan", overnight: "Beaver Island Municipal Marina, St. James",
    highlights: ["Beaver Island: the most isolated inhabited island on the Great Lakes, with a genuine Irish-heritage culture and a nineteenth-century Mormon-kingdom history nobody believes until they read it", "Paradise Bay / St. James Harbor — a deep, protected natural harbor with a harbor light on the point"],
    warnings: ["Do not plan on Beaver Island diesel — the fuel dock is at Municipal Marina North, which did not open until 29 June in the 2025 season. Fill at Leland or Northport before departing", "Rounding Cathead Point off the Leelanau tip: the shoal extends well north of the point and the seas stand up there. Give it a mile"],
    notes: "Round Cathead Point (12nm) and then it is a 34nm open crossing to St. James, with no shelter in between — this is the one genuinely committing day in northern Lake Michigan, so treat the forecast as a hard gate. Courtesy bikes at the municipal marina; ride out to the Beaver Head Light or the Protar cabin. The night sky here is as dark as anything before the North Channel."
  },
  {
    day: 7, from: "Beaver Island, MI", to: "Mackinac Island, MI", distanceNm: 42, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Grays Reef Passage and the Straits of Mackinac — the funnel where all upper-lakes traffic converges", "Threading under the five-mile Mackinac Bridge with the island ahead: the best landfall on Lake Michigan"],
    warnings: ["Straits currents run 2–3kt and reverse; a wind-against-current chop in the Straits is short, steep, and out of proportion to the wind strength", "Reserve Mackinac Island State Harbor in advance — it is small, it fills, and there is no anchoring refuge if you arrive with it full and a blow coming"],
    notes: "Depart St. James at dawn. Grays Reef Passage is well marked but busy with commercial traffic — monitor VHF 16. Because Beaver Island took 35nm out of the old Leland-to-Mackinac run, this arrival happens in the early afternoon with the crew awake and on deck, which is how it should be. Have the coffee up and everybody topside for the bridge."
  },
  {
    day: 8, from: "Mackinac Island", to: "Mackinac Island", distanceNm: 0, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Fort Mackinac, Arch Rock, and the eight-mile perimeter road by bicycle — no cars on the island", "Last thorough provisioning and fuel before the North Channel"],
    warnings: ["Provision to the next resupply gap plus three days, not to the next night — Gore Bay is five days away and Little Current is seven", "Fill diesel, both jerry cans, the water tank and both 5-gal jugs. Confirm every passport and read the CBSA telephone reporting procedure before you need it"],
    notes: "Named reserve day and the trip's first hard buffer. If the previous week ran clean, spend it on the island. If it did not, this is where you get level. Top up all fuel and water, buy fresh perishables that will last to Gore Bay, and eat down what will not. Grand Hotel porch for a drink — jacket after 6pm for men. Verify the Garmin inReach plan covers Canada before you cross."
  },

  // ---- NORTH CHANNEL / GEORGIAN BAY (Days 9–18) ----
  {
    day: 9, from: "Mackinac Island, MI", to: "Drummond Island, MI", distanceNm: 39, locks: 0,
    leg: "north-channel", overnight: "Drummond Island Yacht Haven",
    highlights: ["Les Cheneaux Islands archipelago — a taste of what's ahead", "Drummond Island: last US stop before Canadian waters"],
    warnings: ["Passports required for all crew — CBSA check-in required upon first Canadian landfall", "Check Canadian cell data roaming before departure"],
    notes: "Short hop east through the scenic Les Cheneaux Islands. Drummond Island Yacht Haven has fuel, good docks, and a CBSA phone. Confirm check-in protocol before crossing."
  },
  {
    day: 10, from: "Drummond Island, MI", to: "Meldrum Bay, ON", distanceNm: 30, locks: 0,
    leg: "north-channel", overnight: "Meldrum Bay Marina",
    highlights: ["First Canadian landfall", "West end of Manitoulin Island — rugged, remote, spectacular", "North Channel proper begins: pink granite, clear water, pine shoreline"],
    warnings: ["Phone CBSA immediately on arrival at Meldrum Bay — it is a designated Canadian port of entry", "Meldrum Bay has limited services: fuel and basics only. Gore Bay is the next proper provisioning stop."],
    notes: "Cross into Canada. Meldrum Bay is peaceful and unhurried — good fishing and a genuine taste of the North Channel character. Phone CBSA, get your clearance number, and enjoy the quiet."
  },
  {
    day: 11, from: "Meldrum Bay, ON", to: "Gore Bay, ON", distanceNm: 30, locks: 0,
    leg: "north-channel", overnight: "Gore Bay Marina",
    highlights: ["Gore Bay town — grocery, restaurants, best services on Manitoulin's north shore", "Cliffs and forested shoreline of the North Channel in full form"],
    warnings: ["Phone ahead for a slip in peak summer — Gore Bay fills fast on weekends", "Last full provisioning before four nights with no services: fill water, fuel and the galley here"],
    notes: "Easy day along Manitoulin's north shore. Gore Bay is the best provisioning stop on the island — top off groceries, fuel, and water. Walk the town."
  },
  {
    day: 12, from: "Gore Bay, ON", to: "Benjamin Islands, ON", distanceNm: 16, locks: 0,
    leg: "north-channel", overnight: "Anchor, North / South Benjamin Islands",
    highlights: ["The Benjamin Islands: bare pink granite domes rising straight out of clear water — the most photographed anchorage in the North Channel and the one everyone means when they say 'the North Channel'", "Swim off the rock, climb the dome on North Benjamin at sunset, and watch the whole anchorage go copper"],
    warnings: ["No services of any kind. Water, fuel, food and holding-tank capacity all come from Gore Bay this morning", "Arrive by early afternoon — the main anchorage between North and South Benjamin fills by 1500 in July, and the outer coves are exposed to a northwesterly"],
    notes: "Sixteen miles, and you should be anchored by noon. That is the entire design. Fill water and diesel at Gore Bay first, buy groceries for four days, and pump out. The main anchorage is the bay between the north shore of South Benjamin and the south shore of North Benjamin, at roughly 46°05.3'N 082°15.2'W — approach slowly, the bottom is rock and weed over granite and you want the anchor set properly the first time. Rode out to 5:1. Then stop, and let the place work."
  },
  {
    day: 13, from: "Benjamin Islands, ON", to: "Little Current, ON", distanceNm: 26, locks: 0,
    leg: "north-channel", overnight: "Spider Bay Marina, Little Current",
    highlights: ["Kagawong: tie to the dock, walk twenty minutes to Bridal Veil Falls, and swim under it", "Little Current swing bridge — the whole channel gathers and waits for the top of the hour together"],
    warnings: ["The swing bridge opens on the hour and only on the hour. Arrive with fifteen minutes in hand and hold station in neutral; the channel current will set you onto the piers if you stop paying attention", "Spider Bay fills in summer — call ahead. This is the last well-equipped town until Kincardine, six days away"],
    notes: "South out of the Benjamins to Kagawong for lunch and the falls, then 14nm east to Little Current. Stock up hard: grocery, LCBO, hardware, fuel, water, pump-out. Everything between here and Kincardine is either an anchorage or a village with one store. Buy the CHS paper charts for Frazer Bay and Baie Fine here if you do not already have them."
  },
  {
    day: 14, from: "Little Current, ON", to: "Baie Fine / The Pool, ON", distanceNm: 26, locks: 0,
    leg: "north-channel", overnight: "Anchor, The Pool",
    highlights: ["Ten miles up a fjord between 200ft granite walls — there is nothing else like it in fresh water on this continent", "The Pool: anchor in 40–50ft of water so clear you can watch the anchor set"],
    warnings: ["The entrance bar at the mouth of Baie Fine is shallow at low water — favor the north side and go in at idle with someone on the bow", "Anchoring in 45ft means 225ft of rode at 5:1. The old 150ft spec does not cover this anchorage. Chain-led Rocna or Mantus, sized one up, and set a snubber"],
    notes: "Through the Little Current bridge on the hour, east up Landsdowne Channel into Frazer Bay, then turn into Baie Fine and motor ten miles between the walls. Arrive before 1700 in peak season for a spot in The Pool. Take the dinghy to the head and hike the trail up to Topaz Lake — thirty minutes, steep at the top, and the water in that lake is the color of the name."
  },
  {
    day: 15, from: "Baie Fine / The Pool", to: "Baie Fine / The Pool", distanceNm: 0, locks: 0,
    leg: "north-channel", overnight: "Anchor, The Pool",
    highlights: ["A full day at anchor in The Pool: swim off the bow into 70°F surface water over 50ft of visibility, with granite walls all around and no engine noise anywhere", "Kill every light aboard after dark. The Milky Way here is the version most of the crew has never actually seen"],
    warnings: ["Check your set before you relax — reset the anchor alarm on the plotter and take two transit bearings on the walls", "No shore power for two nights. Watch the house bank against the fridge draw; run the engine an hour in the morning if you must, then shut it off and leave it off"],
    notes: "This is the day the trip is for. Dinghy to the head of the pool at first light for the mist coming off the water, hike Topaz Lake if you did not yesterday, swim all afternoon, and put everyone on deck after dark. Worth a whole day, and now it has one."
  },
  {
    day: 16, from: "Baie Fine / The Pool, ON", to: "Killarney, ON", distanceNm: 20, locks: 0,
    leg: "north-channel", overnight: "Killarney Mountain Lodge / Killarney Municipal Marina",
    highlights: ["Back down the fjord in morning light, then around into Killarney through the narrow channel between the town and George Island", "Herbert's Fisheries for the pickerel, eaten standing on the dock like everyone else"],
    warnings: ["The Killarney channel is narrow with a current and constant small-boat traffic — no sailing through, engine on, slow", "Fuel here. It is the last diesel before Tobermory and the Georgian Bay crossing"],
    notes: "Short day out of the fjord and around Badgeley Point. Fill diesel, water and both jerry cans at Killarney and pump out. Walk the east lighthouse point in the evening for the view back at the La Cloche ridge — white quartzite, which is why the hills look snow-covered in August."
  },
  {
    day: 17, from: "Killarney, ON", to: "Killarney, ON", distanceNm: 0, locks: 0,
    leg: "north-channel", overnight: "Killarney Mountain Lodge / Killarney Municipal Marina",
    highlights: ["Killarney Provincial Park: the Granite Ridge or Cranberry Bog trails start a short taxi ride from the marina, and the La Cloche quartzite is 3.5 billion years old", "The Killarney Mountain Lodge deck for a drink with the whole channel in front of you"],
    warnings: ["This is the weather gate for tomorrow's Georgian Bay crossing. If wind is forecast above 18kt from W or NW, you do not go — that is what this day is for, and you may need more than one of them", "If you are using the floating pool here, spend it here. There is no better place on the route to be stuck"],
    notes: "Named reserve day, placed at the single highest-probability pin point on the route. Northern Georgian Bay builds a steep westerly swell that a 30-footer will not enjoy for nine hours. Get the marine forecast twice today, watch the barometer, and make the go/no-go call the evening before rather than at 0500. If it is a go, prep the boat tonight: jacklines rigged, tethers laid out, a hot meal cooked and in a thermos, and the crew briefed on the cold-water MOB plan."
  },
  {
    day: 18, from: "Killarney, ON", to: "Tobermory, ON", distanceNm: 48, locks: 0,
    leg: "north-channel", overnight: "Big Tub Harbour, Tobermory",
    highlights: ["Georgian Bay open-water crossing — most exposed day since Lake Michigan", "Tobermory: Fathom Five National Marine Park, crystal-clear shipwrecks visible from the surface", "Flowerpot Island ferry trip if you have an afternoon"],
    warnings: ["The most exposed crossing between Lake Michigan and Lake Erie — nine hours with no shelter once you clear Badgeley Point. Go only on a clean forecast made the night before", "There is no mid-crossing bail-out. Your options are Killarney behind you or Tobermory ahead; make the decision at the dock, not at the halfway point"],
    notes: "Cross northern Georgian Bay to Tobermory at the tip of the Bruce Peninsula. Check the forecast the night before and depart at dawn. Fathom Five has some of the most photographed freshwater wrecks in the world. Big Tub Harbour is well-protected and stunning."
  },

  // ---- LAKE HURON (Days 19–21) ----
  {
    day: 19, from: "Tobermory, ON", to: "Kincardine, ON", distanceNm: 65, locks: 0,
    leg: "lake-huron", overnight: "Kincardine Marina",
    highlights: ["The Bruce Peninsula's limestone cliffs falling away to port for the first twenty miles", "Kincardine's Saturday-evening bagpiper ceremony: a lone piper walks out to the lighthouse at sunset and plays the boats home. Twenty minutes, free, and the best thing on this coast"],
    warnings: ["Bail-outs: Southampton (48nm) and Port Elgin (52nm). Both are river-mouth harbors that shoal — enter only in settled conditions, and do not treat either as an all-weather refuge", "Ontario's Lake Huron shore is a lee shore in any westerly. A 65nm day with two marginal bail-outs means the forecast is the go/no-go, not the conditions at the dock"],
    notes: "Engineer this day to fall on a Saturday — a Tuesday departure from Chicago does it. Depart Big Tub at first light. The run down the Bruce is beautiful and exposed; the wind farms south of Port Elgin tell you exactly how much breeze the coast gets. Arrive Kincardine mid-afternoon, get a slip, and be on the lighthouse pier by sunset. Fuel and provision here — it is the best-equipped stop since Little Current."
  },
  {
    day: 20, from: "Kincardine, ON", to: "Goderich, ON", distanceNm: 27, locks: 0,
    leg: "lake-huron", overnight: "Maitland Valley Marina, Goderich",
    highlights: ["Goderich: laid out as an octagonal 'Square' around the courthouse, and reasonably called the prettiest town in Canada", "The Sifto salt mine runs under the lake for miles — the harbor is a working one and the ships loading salt are worth watching"],
    warnings: ["Short day by design, and it is also the Lake Huron weather gate. If the forecast is bad, stay in Kincardine — Goderich is only four and a half hours away and can be run on any morning", "Bayfield, 10nm further south, looks tempting and is prettier, but its river-mouth entrance carries only 6–8ft and breaks in an onshore sea. Goderich is the harbour of refuge on this coast; Bayfield is not"],
    notes: "Twenty-seven miles and half a day ashore, deliberately inserted where the old plan had an 85nm lee-shore slog. Maitland Valley Marina on the north shore of the Maitland River has the most transient berths; Snug Harbour Municipal is inside the inner harbour with 22ft alongside and fuel, water and pump-out nearby, but few transient slips — call both. Walk up the Menesetung Bridge trail, do the Square, and be rested for tomorrow."
  },
  {
    day: 21, from: "Goderich, ON", to: "Sarnia, ON / Port Huron, MI", distanceNm: 58, locks: 0,
    leg: "lake-huron", overnight: "Sarnia Bay Marina (Canada) or Port Huron area marina (US)",
    highlights: ["The Blue Water Bridge twin spans rising out of the haze — the gateway to the St. Clair River and the lower lakes", "Back in US waters, and the last customs formality of the trip"],
    warnings: ["Bail-outs: Bayfield (12nm, fair weather only), Grand Bend (30nm, shallow entrance), and Harbor Beach, MI (40nm across, a genuine artificial harbour of refuge and the right choice if it turns nasty)", "CRITICAL: contact US CBP the moment you are in US waters — 1-800-973-2867 or the CBP videophone at the marina. Have all passports, vessel documentation and your CBSA clearance number in hand before you tie up"],
    notes: "Fifty-eight miles instead of eighty-five, and the customs call happens after a nine-hour day rather than a fifteen-hour one. That is the whole reason this day was split. Traffic density climbs sharply in the last ten miles — monitor VHF 16 and switch to 13 for the river. Do the CBP call before anyone goes to dinner. Fuel and pump out before the river transit; there is a strong current below the bridge and you do not want to be looking for a fuel dock in it."
  },

  // ---- ST. CLAIR RIVER / DETROIT (Day 22) ----
  {
    day: 22, from: "Port Huron, MI", to: "Detroit, MI", distanceNm: 68, locks: 0,
    leg: "st-clair", overnight: "Detroit City Marina or Wyandotte area",
    highlights: ["St. Clair River 2–3 knot current carries you south at a satisfying pace", "1,000-foot lake freighters sharing the same narrow channel", "Detroit Riverwalk and skyline"],
    warnings: ["Heavy commercial traffic on the St. Clair River — monitor VHF 13 continuously and give every downbound freighter the whole channel. Never cross ahead of one; the current is adding 2–3kt to their speed", "Lake St. Clair is shallow outside the buoyed lane and the 30.1 draws about 5ft. St. Clair, MI (20nm) and Algonac (35nm) are easy stops if you want to break the day"],
    notes: "The St. Clair current is free speed — enjoy it. Across Lake St. Clair (follow the channel), then the Detroit River. Fuel and rest in Detroit."
  },

  // ---- LAKE ERIE (Days 23–29) ----
  {
    day: 23, from: "Detroit, MI", to: "Put-in-Bay, OH", distanceNm: 55, locks: 0,
    leg: "lake-erie", overnight: "South Bass Island mooring or dock",
    highlights: ["Perry's Victory & International Peace Memorial (352ft) — take the elevator up for views", "Golf cart rentals for island tour", "Lively boating scene and live music"],
    warnings: ["Lake Erie is the shallowest Great Lake and builds a steep 4-second sea in under two hours on a NW front. Check the 48-hour forecast, not yesterday's conditions", "Detroit and Put-in-Bay are both legitimate hold points — this is the leg where the floating pool gets spent, and spending it here is correct"],
    notes: "Enter Lake Erie via Detroit River. Arrive Put-in-Bay by early afternoon to secure a mooring."
  },
  {
    day: 24, from: "Put-in-Bay, OH", to: "Cleveland, OH", distanceNm: 70, locks: 0,
    leg: "lake-erie", overnight: "North Coast Harbor or Edgewater Marina, Cleveland",
    highlights: ["The longest open-water day of the route, and the only one over 68nm", "Cleveland's skyline coming up out of a flat green shore — an improbably dramatic approach from the lake"],
    warnings: ["Bail-outs, all with easy breakwater entrances: Huron (28nm), Vermilion (36nm), Lorain (48nm) and Rocky River (60nm). The Ohio shore has a harbor every 12–15nm, which is what makes a 70nm day acceptable here and nowhere else on Erie", "Afternoon thunderstorms track northeast across the lake. If you see building cumulonimbus to the west, duck into Lorain and finish tomorrow"],
    notes: "Depart Put-in-Bay at first light. This is a low-commitment 70nm despite the number — you are never more than eight miles from a harbor entrance. North Coast Harbor puts you a ten-minute walk from the Rock & Roll Hall of Fame; Edgewater is quieter and has better fuel access. Either way, arrive with enough afternoon left to provision."
  },
  {
    day: 25, from: "Cleveland, OH", to: "Cleveland, OH", distanceNm: 0, locks: 0,
    leg: "lake-erie", overnight: "North Coast Harbor or Edgewater Marina, Cleveland",
    highlights: ["Rock & Roll Hall of Fame and the Great Lakes Science Center, both walking distance from North Coast Harbor", "West Side Market for the best provisioning between Chicago and New York — go early, go with a cart, and buy for four days"],
    warnings: ["This is the Lake Erie weather gate. The next three days are short by design (50, 40, 42nm) precisely so this day can absorb a front without the schedule bleeding", "Last real chandlery and parts access until Buffalo. Audit the engine spares kit here and replace whatever you have used"],
    notes: "Named reserve day, placed on the deadliest water of the trip. If the forecast is clean, spend it: the Warehouse District and East 4th Street are genuinely good, and a full provisioning run here carries you to the canal. Change the engine oil and both fuel filters — you will have run roughly 180 motoring hours by now and the canal ahead is 338 miles of continuous engine time."
  },
  {
    day: 26, from: "Cleveland, OH", to: "Ashtabula, OH", distanceNm: 50, locks: 0,
    leg: "lake-erie", overnight: "Harbor Yacht Club & Marina, Ashtabula",
    highlights: ["Ashtabula Harbor: eleven marinas on one river, a working ore-and-coal waterfront, and the Bridge Street historic district with its 1925 lift bridge", "Fairport Harbor (25nm) makes a good lunch stop — the Fairport Harbor Marine Museum is in the old keeper's dwelling and the lighthouse is climbable"],
    warnings: ["Fifty miles across the emptiest stretch of the Ohio shore. Fairport Harbor (25nm) is the only good mid-run shelter — after it, the next real harbor is Ashtabula", "The Ashtabula River entrance is a commercial channel with ore-carrier traffic. Monitor VHF 13 on approach and do not cut the breakwall corner"],
    notes: "This day and the next replace the old plan's 80nm Cleveland-to-Erie run, which was the most committing day on the lake with only two bail-outs. Fifty and forty is better arithmetic. Harbor Yacht Club is half a mile up the river past the lighthouse and takes transients; the Port Authority's free transient dock on Bridge Street is day-use only (two hours) but has the only public pump-out on Lake Erie. Walk Bridge Street for dinner."
  },
  {
    day: 27, from: "Ashtabula, OH", to: "Erie, PA", distanceNm: 40, locks: 0,
    leg: "lake-erie", overnight: "Presque Isle State Park Marina",
    highlights: ["Presque Isle: a seven-mile sand peninsula enclosing the best natural harbor on Lake Erie, with swimming beaches on the outside", "The U.S. Brig Niagara at the Erie Maritime Museum — Perry's flagship, rebuilt, and she sails"],
    warnings: ["Conneaut (12nm) is the mid-run bail-out; after it there is nothing until the Presque Isle channel", "The Presque Isle entrance channel is narrow and the currents across it set east. Enter under power and stay in the marked channel — the shoals either side are unforgiving"],
    notes: "Forty easy miles. Get in by early afternoon, then take the afternoon at Presque Isle — this is the best swimming water on the route east of Lake Michigan and the crew has been in foul weather gear for a month. Fuel, water and pump-out at the state park marina. Last fuel before Buffalo."
  },
  {
    day: 28, from: "Erie, PA", to: "Dunkirk, NY", distanceNm: 42, locks: 0,
    leg: "lake-erie", overnight: "Chadwick Bay Marina, Dunkirk",
    highlights: ["Barcelona Harbor (20nm) — a tiny stone-pier harbor under the oldest lighthouse on the lake, worth a lunch stop", "Dunkirk Lighthouse and the Chadwick Bay waterfront: a quiet, unfussy last night in the US before the Niagara transit"],
    warnings: ["Barcelona (20nm) is the only shelter between Erie and Dunkirk, and it is small and shallow — confirm depth before committing to it in a blow", "CALL AHEAD NOW: book the mast-unstep crane at Wardell's or Smith Boys in Tonawanda. It is not a walk-up service in peak summer and Day 30 depends on it"],
    notes: "Short, easy day along the Chautauqua shore. Chadwick Bay Marina at Dunkirk has transient dockage behind the breakwater. Use the evening to make the crane call, confirm the boatyard has mast-cradle materials, and start stripping the boat for mast-down: coil and label halyards, tape spreader ends, bag the windex."
  },
  {
    day: 29, from: "Dunkirk, NY", to: "Buffalo/Tonawanda, NY", distanceNm: 40, locks: 1,
    leg: "lake-erie", overnight: "Smith Boys or Wardell's Marina, Tonawanda",
    highlights: ["Black Rock Lock: hail the tender on VHF 13 well out. It bypasses the Niagara River current and drops you into the canal feeder", "Buffalo Canalside on the way through — USS Little Rock and the restored commercial slip where the original canal terminated"],
    warnings: ["The Niagara River current accelerates below the Buffalo breakwall and runs toward the falls. Do not drift past the harbor entrance without the Black Rock Lock arranged and the engine running well", "Sturgeon Point (25nm) is the only mid-run shelter and it is a small-craft harbor. This shore has very little to duck into"],
    notes: "Forty miles instead of seventy, arriving with the whole afternoon free for logistics. Tonawanda is the last major parts source until New York — West Marine, big-box stores, and both boatyards. Confirm the crane time, buy the extra cotter and clevis pins, buy or borrow eight fenders and two dedicated 50ft lock lines if you do not already have them, and get the Niagara Falls trip done tonight (twenty minutes by car — go)."
  },

  // ---- ERIE CANAL (Days 30–40) ----
  {
    day: 30, from: "Tonawanda (mast prep)", to: "Tonawanda", distanceNm: 0, locks: 0,
    leg: "erie-canal", overnight: "Tonawanda boatyard",
    highlights: ["Mast down — major transition from Great Lakes sailing to canal mode"],
    warnings: ["Verify air draft meets the 14 ft 6 in (≈4.4 m) design target after unstep — measure to the top of every antenna, GPS puck, and wind transducer, not just the mast", "Secure all deck hardware that could snag under low bridges", "Mast must be well-padded and tied — it will overhang bow or stern"],
    notes: "Unstep and cradle mast. Rig extra fenders (8+ needed for locks — both sides). Set up dedicated lock lines (2× 50ft). Fill water tank. Grocery run."
  },
  {
    day: 31, from: "Tonawanda, NY", to: "Medina, NY", distanceNm: 0, distanceMi: 35, locks: 2,
    leg: "erie-canal", overnight: "Medina canal basin wall",
    highlights: ["Locks E-35 and E-34 at Lockport: a paired flight lifting about 49ft, with the 1825 'Flight of Five' preserved alongside", "Medina: a whole downtown built of the local red sandstone, plus the Culvert Road — the only place a road passes underneath the canal"],
    warnings: ["First locks of the trip and a paired flight straight away. Fenders both sides, fender board rigged, two crew on lines fore and aft, engine in gear for steerage, and nobody's fingers between hull and wall", "Verify your air draft before the first fixed bridge. Measure to the top of every antenna, GPS puck and wind transducer, not just the mast crutch. Design target is 14ft 6in"],
    notes: "Short first canal day by design — 35 miles and 5–6 hours, ending in a good town. Learn to lock before you have to do five of them. After Lockport there is not another lock for sixty miles, so the afternoon is a quiet cruise through the lift-bridge villages of Orleans County. Free wall with power at the Medina canal basin; the Medina Railroad Museum has one of the largest HO layouts in the country if that is your thing."
  },
  {
    day: 32, from: "Medina, NY", to: "Pittsford, NY", distanceNm: 0, distanceMi: 51, locks: 2,
    leg: "erie-canal", overnight: "Schoen Place dock, Pittsford (power/water)",
    highlights: ["Sixty lock-free miles through Albion, Holley, Brockport and Spencerport — lift-bridge towns where the operator sees you coming and stops traffic", "The Genesee River aqueduct and the Rochester land cut, then Schoen Place at Pittsford: canal-side dock with power and water and restaurants on the towpath"],
    warnings: ["Longest canal day by mileage. Underway by 0700, and remember the speed limit is 10mph on the main canal and 5mph in towns and past moored boats", "The Rochester section collects floating debris after rain — logs just awash will foul a prop. Go slow through weedy and wooded stretches and keep a mask and a sharp knife where you can reach them"],
    notes: "Eight hours but only two locks, and the water is flat and straight. Brockport's canal visitor center makes a good lunch tie-up. Pittsford's Schoen Place is one of the two or three best overnights on the canal — power, water, a bakery, and a towpath full of people who will want to know where you came from."
  },
  {
    day: 33, from: "Pittsford, NY", to: "Lyons, NY", distanceNm: 0, distanceMi: 32, locks: 5,
    leg: "erie-canal", overnight: "Lyons canal wall, Abbey Park",
    highlights: ["Fairport, 6 miles on: the red lift bridge, the towpath, and Moonlight Creamery. Tie up for an hour and have the ice cream", "Lyons: the peppermint capital of America, and the town genuinely smells of it in summer. Free wall at Abbey Park"],
    warnings: ["Five locks in 32 miles, all descending. Budget 25 minutes each including approach — that is two hours of the day spent stationary in chambers", "There is no Lock E-31 on the modern canal. If your lock list or plotter shows one, it is wrong; the sequence runs E-32 to E-30"],
    notes: "Short mileage, lock-heavy day. Start at 0730, take the Fairport stop, and still be tied up at Lyons by mid-afternoon. This is the stop the leg guide advertised and the old plan motored straight past. Walk into town, find the H.G. Hotchkiss peppermint museum, and understand why a canal town in Wayne County once supplied most of the world's peppermint oil."
  },
  {
    day: 34, from: "Lyons, NY", to: "Baldwinsville, NY", distanceNm: 0, distanceMi: 49, locks: 3,
    leg: "erie-canal", overnight: "Lock E-24 wall / Paper Mill Island, Baldwinsville",
    highlights: ["Montezuma National Wildlife Refuge: the canal runs through the middle of it. Herons, eagles, ospreys and turtles on every bank", "The Cayuga-Seneca Canal junction at May's Point — the door to the Finger Lakes, which you are not taking, but it is worth seeing"],
    warnings: ["Longest lock-day mileage on the canal. Underway by 0700; Lock E-24 at Baldwinsville is the day's gate and you want to be through it by mid-afternoon", "The Seneca River section between May's Point and Baldwinsville is a natural river, not a land cut — it winds, it shoals outside the channel, and the marks matter"],
    notes: "Eight and a half hours. Clyde has a small free wall if you need to stop short. Baldwinsville's Lock E-24 wall and the Paper Mill Island park put you in the middle of a pleasant village with restaurants a two-minute walk away. Fill water here."
  },
  {
    day: 35, from: "Baldwinsville, NY", to: "Brewerton, NY", distanceNm: 0, distanceMi: 22, locks: 1,
    leg: "erie-canal", overnight: "Ess-Kay Yards, Brewerton",
    highlights: ["Three Rivers Junction, where the Seneca and Oneida rivers meet and the Oswego Canal branches north to Lake Ontario", "Ess-Kay Yards: the best-equipped marina on the canal system — diesel, pump-out, laundry, showers, chandlery and a full service department"],
    warnings: ["Deliberate half-day. Do not be tempted to push across Oneida Lake this afternoon — the lake builds a short, nasty chop on an afternoon southwesterly and there is no shelter in the middle of it", "Book Ess-Kay ahead in July and August; the transient docks are popular and it is the obvious staging point for the lake"],
    notes: "Three and a half hours underway and then a working afternoon. This is the day the old plan did not have, and it is the reason the Oneida crossing stops being a gamble. Fill diesel and water, pump out, do the laundry, have the yard look at anything that has been bothering you, and get the boat right. Then get up early."
  },
  {
    day: 36, from: "Brewerton, NY", to: "Rome, NY", distanceNm: 0, distanceMi: 35, locks: 2,
    leg: "erie-canal", overnight: "Bellamy Harbor Park, Rome",
    highlights: ["Oneida Lake at first light: 21 miles of glass, with the sun coming up over Sylvan Beach at the far end", "Sylvan Beach for lunch — a 1900s lakeside amusement park with a Ferris wheel next to a canal lock, which is exactly as strange as it sounds"],
    warnings: ["Cross Oneida at dawn. It is the only genuinely open water on the canal, it is shallow, and it gets rough on an afternoon breeze. Underway by 0530 puts you at Sylvan Beach before 1000", "Oneida's buoyed channel matters — the lake shoals badly outside it, particularly at the eastern end"],
    notes: "Twenty-one miles of lake and fourteen of canal, with the lake done before the wind wakes up. Sylvan Beach for a long lunch and the boardwalk, then two locks and into Rome. Bellamy Harbor Park is a Canal Corporation dock with 50-amp power, a summer welcome center, and Fort Stanwix National Monument a mile and a half up the road — the fort that held the Mohawk Valley in 1777, rebuilt full-scale."
  },
  {
    day: 37, from: "Rome, NY", to: "Little Falls, NY", distanceNm: 0, distanceMi: 36, locks: 3,
    leg: "erie-canal", overnight: "Rotary Park / Canal Place, Little Falls",
    highlights: ["The Mohawk Valley proper — the canal becomes a canalized river and the scenery improves sharply", "Little Falls: the canal threads a limestone gorge past Moss Island, whose glacial potholes are a twenty-minute walk from the free Rotary Park dock"],
    warnings: ["Ilion Municipal Marina (26mi) is the last good pump-out and fuel point before the Hudson — stop and use it even if you do not need it yet", "Lock E-17 sits immediately east of the Little Falls dock. Do not attempt it this evening; it is the deepest single lock on the canal at 40.5ft and it deserves a fresh crew"],
    notes: "Six and a half hours with a fuel and pump-out stop at Ilion in the middle. Little Falls is the best town on the eastern canal: Canal Place, the limestone cliffs, the Moss Island potholes, and a free dock in a park. Climb Moss Island in the evening — the potholes were drilled by meltwater from a glacial lake draining through here 12,000 years ago and some are twenty feet deep."
  },
  {
    day: 38, from: "Little Falls, NY", to: "Canajoharie, NY", distanceNm: 0, distanceMi: 18, locks: 4,
    leg: "erie-canal", overnight: "Canajoharie village wall",
    highlights: ["Lock E-17 as the first lock of the morning: a 40.5ft drop, the deepest on the Erie, with a guillotine gate that comes down over your head", "The Arkell Museum at Canajoharie — a Beech-Nut baby-food fortune spent on Winslow Homer, Mary Cassatt and Gilbert Stuart, in a village of 2,000 people"],
    warnings: ["Four locks in 18 miles; the day is short in distance and long in chamber time. Budget four and a half hours and start at 0730 so E-17 is the first thing you do", "Canajoharie's village wall is short and has limited power. If it is taken, Fort Plain (4mi back) and St. Johnsville Marina (9mi back) both have walls"],
    notes: "A deliberately light day between two heavier ones, and the crew will have earned it by now. Through E-17 first thing, then three more locks and tied up by noon. The Arkell is a genuinely surprising collection, and the Canajoharie Gorge trail in Wintergreen Park is a half-hour walk from the wall with swimming holes at the top."
  },
  {
    day: 39, from: "Canajoharie, NY", to: "Schenectady, NY", distanceNm: 0, distanceMi: 40, locks: 6,
    leg: "erie-canal", overnight: "Mohawk Harbor Marina, Schenectady",
    highlights: ["Schoharie Crossing at Fort Hunter — the 1841 Schoharie Aqueduct ruins, where the enlarged canal crossed a creek on stone arches", "Amsterdam's Riverlink Park at the halfway mark: floating docks, an elevated walkway into town, and showers"],
    warnings: ["Six locks and 40 miles: the heaviest canal day at roughly eight hours. Underway at 0700 and keep the lunch stop short", "Mohawk Harbor sits between Locks E-7 and E-8. Hail the dock attendant on VHF 13 before entering the basin for a slip assignment — slips take up to 35ft LOA, linear dockage for anything longer"],
    notes: "The last long day on the canal. Amsterdam's Riverlink Park at mile 20 is the natural lunch and pump-out stop ($2/ft if you stay, free if you do not). Mohawk Harbor at Schenectady is a modern basin with restaurants on the quay, and — critically — it is the right place to stage for the Waterford Flight. Do not push past it."
  },
  {
    day: 40, from: "Schenectady, NY", to: "Waterford, NY", distanceNm: 0, distanceMi: 20, locks: 6,
    leg: "erie-canal", overnight: "Waterford Visitor Center Dock (free 48hr, power, water)",
    highlights: ["The Waterford Flight: five locks dropping 169ft in a mile and a half, the steepest lock flight in the world when it opened in 1915", "MILESTONE — Great Lakes to Atlantic, connected. The Visitor Center volunteers at the bottom have been known to hand arriving crews a beer"],
    warnings: ["Reach the top of the Flight (Lock E-6) by 2:30pm at the absolute latest — once you enter you go through all five without stopping. Departing Mohawk Harbor at 0730 puts you at E-6 around 0910, which is the margin this day was created to give you", "Do not raise the mast at Waterford. The Troy Federal Lock is tomorrow and Hop-O-Nose in Catskill has the crane"],
    notes: "Twenty miles, six locks, and you are at the bottom of the Flight before lunch. The old plan asked for 95 miles and 9 locks against this same 2:30 deadline, which was not physically possible; this is the fix. Lock through E-7 at Niskayuna, then the Flight. Look up at the walls as you drop — those stones have been doing this job since 1915. Free 48-hour dock with power and water at the Waterford Visitor Center, and the afternoon is yours."
  },

  // ---- HUDSON RIVER (Days 41–46) ----
  {
    day: 41, from: "Waterford, NY", to: "Catskill, NY", distanceNm: 40, locks: 1,
    leg: "hudson", overnight: "Hop-O-Nose Marina, Catskill Creek",
    highlights: ["Troy Federal Lock: last lock, 14ft drop, free, hail VHF 13", "Now in tidal Hudson — current changes with tide", "MAST RE-STEP at Hop-O-Nose Marina, Catskill Creek (call ahead for crane)"],
    warnings: ["Tidal timing: high tide at Troy is ~5–6hrs AFTER high tide at NYC Battery — check Troy specifically on a tide app", "Hop-O-Nose is 1nm up Catskill Creek from the Hudson — easy approach in calm water"],
    notes: "Through the Troy Federal Lock (last lock of the trip, 14ft, free, hail VHF 13) and you are in the tidal Hudson. High water at Troy runs 5–6 hours later than at the Battery — check Troy specifically. Past Albany at mile 145 and into Catskill Creek at mile 112; Hop-O-Nose is 1nm up the creek. Get the mast stepped this afternoon. Tomorrow is for making it right."
  },
  {
    day: 42, from: "Catskill, NY", to: "Catskill, NY", distanceNm: 0, locks: 0,
    leg: "hudson", overnight: "Hop-O-Nose Marina, Catskill Creek",
    highlights: ["Tune the rig properly, bend on the sails, and get the masthead instruments talking to the plotter again", "The town of Hudson across the river is an art-and-antiques enclave and a good taxi ride for dinner"],
    warnings: ["A mast that has been lying on deck for three weeks needs a full re-tune, not a quick turnbuckle check. Set the rake, get the shrouds even, and re-check after the first hour of sailing tomorrow", "Re-seize every turnbuckle with stainless wire and re-pin every clevis. Check the masthead VHF antenna and the wind transducer before you leave the dock — you will not want to go aloft in the Highlands"],
    notes: "The old plan allotted two to three hours for this. Crane time is two to three hours; re-reeving halyards, tuning the rig, reconnecting masthead wiring, bending on main and headsail, and doing a shakedown motor down the creek is a day. You are about to sail into the Hudson Highlands, where the geography gusts a 12-knot day to 25. Do it properly here."
  },
  {
    day: 43, from: "Catskill, NY", to: "Poughkeepsie, NY", distanceNm: 60, locks: 0,
    leg: "hudson", overnight: "Shadows Marina or Poughkeepsie YC",
    highlights: ["Hudson-Athens Lighthouse", "Kingston/Rondout Creek: Hudson River Maritime Museum (optional stop)", "Catskill Mountains backdrop to the west"],
    warnings: ["Ride the ebb south — depart 1–2 hours after local high water. On a good cycle it runs 1.5–2.5kt in your favor", "Bail-outs: Kingston/Rondout Creek (20nm, and worth the stop for the Hudson River Maritime Museum) and Norrie Point (36nm)"],
    notes: "Mostly sailing now, on a rig you tuned yesterday. SW breezes common in the afternoon. Ride the ebb, motorsail if wind is light."
  },
  {
    day: 44, from: "Poughkeepsie, NY", to: "Haverstraw, NY", distanceNm: 34, locks: 0,
    leg: "hudson", overnight: "Haverstraw Marina",
    highlights: ["The Hudson Highlands in a single day: Bannerman's Castle on Pollepel Island, Storm King, West Point on its bluff, Bear Mountain Bridge", "Haverstraw Bay, where the Hudson is 3.5 miles wide and behaves like a small sea"],
    warnings: ["The Highlands constrict and accelerate both wind and current. Expect gusts well above the forecast and a nasty short chop when a southerly meets the ebb between Cold Spring and Peekskill", "Do not anchor close to Pollepel Island — the currents around it are irregular and the bottom is foul"],
    notes: "Thirty-four miles of the best river scenery in America, done at a pace that lets you look at it. Haverstraw Marina is one of the largest on the Hudson with full service and fuel. The real purpose of this day is tomorrow: stopping here means the Manhattan approach is a 33nm afternoon run you can start whenever the light demands, instead of the tail end of a ten-hour slog."
  },
  {
    day: 45, from: "Haverstraw, NY", to: "New York City", distanceNm: 33, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina, Jersey City",
    highlights: ["Departure timed so the last ten miles happen in golden hour: the Palisades, the George Washington Bridge, then Manhattan building ahead the whole way down", "The Statue of Liberty and Ellis Island on the final approach to Liberty Landing — and the realization that you sailed here from Chicago"],
    warnings: ["Work backwards from sunset. In mid-August, sunset at NY Harbor is about 2000; leaving Haverstraw at 1400 on the ebb puts you at the GWB around 1830 and Liberty Landing by 1930. Adjust for the actual tide — do not fight a flood to make the light", "The last 15nm is dense with ferries, tugs, tour boats and Coast Guard traffic, all moving fast. Running lights on, AIS transmitting, and one crew doing nothing but watching"],
    notes: "Stage this. The whole crew on deck for the last two hours, cameras out, engine on and sails down before the harbor gets busy. This is the emotional summit of the trip and the old plan left it to chance at the end of a 75nm day. Reserve Liberty Landing weeks ahead — NYC slips do not appear on demand in August."
  },
  {
    day: 46, from: "New York City", to: "New York City", distanceNm: 0, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina",
    highlights: ["Rest, reprovisioning, city sightseeing"],
    warnings: ["Check the East River current tables for Hell Gate specifically — not generic NYC tides — and pick tomorrow's departure hour from them before you commit to anything else", "Last major provisioning and parts access of the trip. West Marine in Weehawken; full fuel, full water, and a complete gear audit"],
    notes: "Buffer day. Full fuel and water. Audit all gear before the Long Island Sound leg up to Old Saybrook."
  },

  // ---- LONG ISLAND SOUND → OLD SAYBROOK (Days 47–52) ----
  {
    day: 47, from: "New York Harbor", to: "Oyster Bay or Cold Spring Harbor, NY", distanceNm: 28, locks: 0,
    leg: "sound-saybrook", overnight: "Oyster Bay or Cold Spring Harbor marina",
    highlights: ["East River transit through Manhattan — dramatic urban sailing", "Long Island Sound opens up — excellent sailing begins", "SW sea breezes = beam reaching east"],
    warnings: ["CRITICAL: Time the East River / Hell Gate carefully. Currents reach 4–5 knots at Hell Gate. Aim to pass Hell Gate at or just before slack water on a favorable ebb.", "Do NOT attempt Hell Gate on a strong opposing current"],
    notes: "Short day to get onto LIS. Once through Hell Gate, the sailing is typically glorious — consistent SW sea breeze for a beam reach east."
  },
  {
    day: 48, from: "Oyster Bay, NY", to: "Port Jefferson, NY", distanceNm: 38, locks: 0,
    leg: "sound-saybrook", overnight: "Port Jefferson Harbor",
    highlights: ["Classic Long Island Sound beam reach", "Port Jefferson: beautiful harbor, ferry terminal, great waterfront restaurants"],
    warnings: ["Summer SW sea breezes fill in by mid-morning — get out early before traffic", "Ferry traffic is constant across the harbor mouth — cross astern of them, never ahead"],
    notes: "Beautiful sailing day. Port Jefferson has full services."
  },
  {
    day: 49, from: "Port Jefferson, NY", to: "Greenport, NY", distanceNm: 40, locks: 0,
    leg: "sound-saybrook", overnight: "Mitchell Park Marina, Greenport",
    highlights: ["North Fork wine country — some of the best in the Northeast", "Shelter Island accessible by short ferry from Greenport", "Eastern LIS: more open water, great sailing"],
    warnings: ["Tomorrow is the tidal-gate day. Work the Plum Gut and Race current tables tonight, not in the morning", "If you are carrying spare pool days at this point, this is one of the two best places on the route to spend one"],
    notes: "Another excellent sailing day. Greenport is a great overnight — walk to wine tasting or ferry to Shelter Island."
  },
  {
    day: 50, from: "Greenport, NY", to: "Mystic, CT", distanceNm: 28, locks: 0,
    leg: "sound-saybrook", overnight: "Mystic Seaport Museum Marina",
    highlights: ["Plum Gut and The Race in one morning — the two fiercest tidal gates on the East Coast, taken on a fair current with the ebb behind you", "Up the Mystic River past Noank to the Seaport, where the Charles W. Morgan — the last wooden whaleship afloat, launched 1841 — is lying at the dock"],
    warnings: ["Plum Gut and The Race each run to 5kt. They are about an hour apart in current phase; work the tables so you take Plum Gut on the early ebb and carry it through The Race rather than trying to hit both at slack", "The Mystic River Bascule Bridge is on a restricted schedule. In 2026 CTDOT had it down to four openings a day (0740, 1140, 1440, 1840) pending repairs; normal season schedule is hourly at :40. Confirm before you leave Greenport and hail on VHF 13 — Mystic Seaport's marina is north of both the railroad and highway bridges"],
    notes: "Short day, big water. Out of Greenport, north through Plum Gut on the early ebb, across the mouth of The Race, and into Fishers Island Sound south of Fishers — a genuinely exhilarating hour if timed right and a miserable one if not. If the bridge schedule does not work, Seaport Marine is immediately south of the bascule and you can walk to town, or anchor off Noank for the night and go up in the morning. Mystic Seaport Museum Marina takes reservations through Dockwa; attendants 0900–1700, May to October."
  },
  {
    day: 51, from: "Mystic, CT", to: "Mystic, CT", distanceNm: 0, locks: 0,
    leg: "sound-saybrook", overnight: "Mystic Seaport Museum Marina",
    highlights: ["Mystic Seaport Museum: the Charles W. Morgan, the Sabino, the shipsmith and cooperage, and the preservation shipyard where they are always rebuilding something", "Walk the drawbridge at the top of the hour and watch it lift — it has been doing it since 1922"],
    warnings: ["This is also the late-summer weather reserve. Squall lines and tropical remnants are the LIS risk in August; if one is tracking up the seaboard, this is the day you sit", "Fuel, water and pump-out before you leave. Old Saybrook tomorrow is an arrival, not a provisioning stop"],
    notes: "The leg guide has called Mystic outstanding since the first draft and the old plan never stopped there. Now it does. Give the Seaport a full day — go aboard the Morgan below decks, not just the weather deck, and find the shipyard where they are re-planking something with steam-bent white oak. It is the right last full day of a voyage that began on the Chicago lakefront."
  },
  {
    day: 52, from: "Mystic, CT", to: "Old Saybrook, CT", distanceNm: 20, locks: 0,
    leg: "sound-saybrook", overnight: "Saybrook Point Marina",
    highlights: ["A short, unhurried final passage west along the Connecticut shore past Noank, the Thames at New London, and Niantic Bay", "The Connecticut River opening up at Saybrook Point — and Essex, 5nm upriver, arguably the handsomest town in New England, with the Griswold Inn pouring since 1776"],
    warnings: ["The Connecticut River entrance shoals and the bar shifts. Follow the marked channel, not the rhumb line, and take it on a rising tide", "Time the departure so you arrive on the flood — you want the current with you going up the river, and it gives you the option of running straight on to Essex the same afternoon"],
    notes: "Twenty miles and done. No tidal gates on this leg — The Race is behind you — so it is a genuinely relaxed last morning, which is the right way to finish. Out of the Mystic River on the first opening, west past Groton Long Point and the Thames, past Black Point and Cornfield Point, and in past Saybrook Point Light. Arrive early enough to spend the afternoon on the river. Fifty-two days and 1,709 nautical miles from DuSable Harbor."
  },
];
