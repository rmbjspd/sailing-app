export interface LegGuide {
  legId: string;
  title: string;
  subtitle: string;
  captainIntro: string;
  sailingTips: string[];
  watchFor: string[];
  bestStops: string[];
}

export const legGuides: LegGuide[] = [
  {
    legId: "lake-michigan",
    title: "Lake Michigan",
    subtitle: "Winthrop Harbor to Mackinac Island",
    captainIntro: `The first day out of North Point Marina at Winthrop Harbor is the hardest day of the trip: 74 nm straight across the lake to Holland, out of sight of both shores for a couple of hours in the middle. The lake is 60+ nm wide here and no shorter first hop goes the right direction. Sail a shakedown the afternoon before, leave at 0430, and treat Chicago (25 nm), Michigan City (50 nm) and St. Joseph (63 nm) as the diversions until you pass the midpoint. June is the transition month: the lake is cold (surface temps still 50–55°F in early June), air-sea temperature differences can produce fog banks without warning, and afternoon thunderstorms are common.

Your strategy for the whole leg: launch early, push hard before noon, and be tucked into a harbor before the afternoon sea breeze builds toward the Michigan shore. Once you are across, the eastern shoreline has a harbor every 12–15 nm, each with fuel and pump-out — that spacing is what makes the 74 nm and 76 nm days on Days 2 and 3 acceptable. Days 1–3 are three long days in a row. If the crew is flagging after two, split Day 3 at Frankfort: it is the first pool day the plan expects you to spend.

The payoff for doing it right is the approach to Mackinac — threading the Straits under that 5-mile suspension bridge with the smell of fudge drifting out from the island. There's no arrival in the Great Lakes quite like Mackinac Island for the first time.`,
    sailingTips: [
      "Best winds are NE to SW in mornings before the afternoon sea breeze sets in from the west. Plan to be at anchor or in a slip by 3–4pm if you can.",
      "The 130 L / 34 US gal diesel tank gives you 350+ nm of motoring range — a realistic safety margin for the entire Lake Michigan leg. Carry two 5-gallon jerry cans anyway, but reserve them for the North Channel where fuel docks are sparse (Little Current to Kincardine). Top off at every fuel stop on Lake Michigan as a matter of discipline, not emergency.",
      "Big Sable Point is a notorious wind accelerator. It is rounded on the morning of Day 3 out of Ludington, which sits 8 nm south of it — that is why Ludington is the Day 2 overnight rather than a harbor further north.",
      "The Manitou Passage between North and South Manitou Islands and the mainland concentrates and accelerates wind. When the lake forecast and passage forecast disagree, believe the passage.",
      "Don't ignore NOAA WX3 and WX4 — the Great Lakes-specific weather radio channels. Check them every morning before departing, and again at noon.",
      "Lake Michigan water temps stay below 60°F well into July. If someone goes overboard, cold water incapacitation is your biggest danger — jacklines and tethers for all crew whenever offshore.",
    ],
    watchFor: [
      "Afternoon convective thunderstorms — they build fast over the warm land and move east over the lake. If you see anvil-top cumulonimbus to the west, get in.",
      "The 'Lake Michigan Gale' — a northwest frontal system can turn a 2-foot chop into 8-foot breaking seas in four hours. The barometer is your friend.",
      "Barge traffic running the shipping lanes — stay east of the marked lanes when possible.",
      "Shallow water near the Michigan shoreline — the coastal shelf is gradual but 10-foot depths extend farther offshore than you'd expect in some spots.",
    ],
    bestStops: [
      "Saugatuck, MI (Day 1 alternate landfall, just south of Holland): One of the prettiest towns on Lake Michigan. Galleries, restaurants, a schooner bar.",
      "Sleeping Bear Dunes (Day 3): The dunes are visible from offshore — magnificent 400-foot sand bluffs, best seen from the Manitou Passage.",
      "South Manitou Island (Day 3, optional two-hour stop): Anchor in the harbor over sand in 20–25 ft and take the dinghy in. The Valley of the Giants holds old-growth white cedar, and the freighter Francisco Morazan sits wrecked on the south shore in shallow water. Fair-weather stop only — the harbor is open to the E and SE.",
      "Beaver Island, MI (Day 4): The most isolated inhabited island on the Great Lakes, with an Irish-heritage culture and a nineteenth-century Mormon-kingdom history nobody believes until they read it. Courtesy bikes at the municipal marina. Note the fuel: Marina North has the diesel dock and did not open until 29 June in 2025 — fill at Leland or Northport instead.",
      "Mackinac Island (Days 5–6): Car-free, horse-drawn carriages, Fort Mackinac, Arch Rock. Grand Hotel porch is open for a drink (jacket required after 6pm — pack one). The fudge shops are unironically excellent. Day 6 is a named reserve day and the last real provisioning before the North Channel — with Gore Bay cut, Little Current is four days on.",
    ],
  },

  {
    legId: "north-channel",
    title: "North Channel & Manitoulin Island",
    subtitle: "Mackinac to Tobermory via Manitoulin and Georgian Bay",
    captainIntro: `Most sailors who do the Great Lakes run miss the North Channel entirely — they peel south off Mackinac and run the Sunrise Coast down Michigan's thumb to Port Huron. It's efficient. It's also the greatest mistake they make on the trip.

The North Channel runs east from the Straits of Mackinac between the Canadian mainland and Manitoulin Island — the largest freshwater island in the world — through 200 miles of pink granite shore, clear anchorages, and small Ontario towns where the population is still measured in hundreds. The Benjamin Islands. Baie Fine. Killarney. These are names whispered by Great Lakes sailors the way Atlantic cruisers talk about the Chesapeake or the Maine coast. The water is cold and gin-clear. The anchorages are mostly empty. The skies at night are genuinely dark.

The logistics are modest: passports for everyone and a CBSA phone check-in at Meldrum Bay. The rest is sailing through some of the most beautiful freshwater in North America — at anchor, mostly, which is where the North Channel is at its best. Nine days are given to it, with three nights at anchor and two days standing still, against six days in the original plan.`,
    sailingTips: [
      "CBSA (Canadian Customs) check-in is mandatory at your first Canadian port. Meldrum Bay is a designated entry point — phone the CBSA immediately on arrival. Have all passports, vessel registration, MMSI, and crew details ready. You receive a clearance number; keep it for re-entry.",
      "Day 14 at Killarney is a named reserve day and it is the go/no-go gate for the Georgian Bay crossing. Make the call the evening before, not at 0500 in the rain, and be willing to spend a second day — there is no better place on the route to be stuck.",
      "Days 9, 11 and 12 are three nights at anchor with no services at all. Gore Bay is not a stop in this plan, so Mackinac (Day 6) and Meldrum Bay (Day 8) must carry you to Little Current on Day 10, and Little Current must carry you through Baie Fine to Killarney on Day 13. Provision to the gap plus three days.",
      "Little Current swing bridge opens on the hour ONLY — not on demand. Do not arrive mid-hour expecting it to open. Plan your approach and idle outside with the engine in neutral. The current through the channel will set you if you're not paying attention.",
      "The Georgian Bay crossing from Killarney to Tobermory (~48 nm) is the most exposed water of this leg. Plan for an early departure and check the forecast carefully the evening before — a westerly swell on northern Georgian Bay can be steep and uncomfortable in a 30-footer.",
      "Top off fuel and groceries at Little Current — the last well-equipped town until Kincardine on the Ontario shore. Meldrum Bay, Kagawong, and Killarney have limited supplies.",
      "Use Canadian Hydrographic Service (CHS) charts or Navionics with Canadian coverage. The North Channel has rocks the chart does not always emphasize clearly. Go slow when exploring anchorages you haven't read recent notes on.",
    ],
    watchFor: [
      "Shoals throughout the North Channel — beautiful but rocky. Respect the chart. Don't assume a cove is safe because it looks safe from the cockpit.",
      "Baie Fine entrance bar — the outer sill is shallow at low water. Favor the north side and enter slowly. Worth every bit of caution.",
      "Unlit markers in some sections of the North Channel — do not push arrivals into new anchorages after dark.",
      "Georgian Bay westerly swell — if wind is forecast above 18 knots from the west or northwest, wait at Killarney before the Tobermory crossing. The bay can build quickly.",
    ],
    bestStops: [
      "Benjamin Islands, ON (Day 9): Bare pink granite domes rising straight out of clear water — the anchorage everyone means when they say 'the North Channel.' Anchor between the north shore of South Benjamin and the south shore of North Benjamin, swim off the rock, and climb the dome at sunset. Rock-and-weed bottom, so set the hook properly the first time. No services of any kind, and it fills by 1500 in July — after 40 nm from Meldrum Bay you arrive mid-afternoon, so the outer coves are the fallback.",
      "Baie Fine / The Pool (Days 11–12): Anchor here, for two nights. There is no argument. A 10-mile fjord off the North Channel ending in a granite bowl of 50-foot-deep turquoise water. No marina, no services — just silence, herons, and reflections that look painted. Take the dinghy to the head of the pool and hike the steep half-hour up to Topaz Lake. Kill every light aboard after dark.",
      "Killarney, ON (Days 13–14): Historic fishing village with a character that hasn't been sanded down. Herbert's fish & chips (order the pickerel), the Killarney Mountain Lodge for a drink with a view, and the clearest freshwater you will see on this trip. Provincial Park hiking on the La Cloche quartzite ridge if you have a day.",
      "Little Current, ON: Best-provisioned stop on Manitoulin — grocery, LCBO, hardware, fuel, multiple marinas. The swing bridge opening at the top of each hour has a theatrical quality. The whole channel watches and waits together.",
      "Kagawong, ON: Blink-and-miss-it village. Bridal Veil Falls is a 10-minute walk from the dock. Genuinely quiet in a way that even the North Channel's other stops are not. Worth a lunch stop at minimum.",
      "Tobermory, ON: Gateway to Fathom Five National Marine Park. Glass-bottom boat tours over 19th-century shipwrecks in water so clear you can count the bolts from the surface. Big Tub Harbour is one of the most photographed anchorages in Ontario.",
    ],
  },


  {
    legId: "lake-huron",
    title: "Lake Huron",
    subtitle: "Tobermory to Port Huron via the Ontario Shore",
    captainIntro: `After the North Channel's granite intimacy, Lake Huron's Ontario shore is a different kind of sailing — open, exposed, and honest. Tobermory to Port Huron runs 150 nautical miles down Ontario's eastern shore of Lake Huron, past the nuclear-plant chimneys at Kincardine, across the lake's wide southern basin, and through the Blue Water Bridge into the controlled current of the St. Clair River.

This is a working stretch. The Ontario shore has fewer emergency harbors than Michigan's side — the plan is correct to note this, and correct to advise watching the forecast. In good conditions it rewards patience: the water is deeper and more settled than Erie, the coast has a quiet dignity, and Kincardine's Scottish heritage makes for a memorable stop. If a Saturday alignment is possible, the bagpiper ceremony at the lighthouse at sunset is one of those quietly extraordinary moments that stays with you.

This leg used to be run as 65 nm and then 85 nm — the second of those was the longest open-water day of the voyage, on a lee shore, ending in a customs clearance. It is now 65 / 27 / 58 with a night at Goderich in the middle. Goderich is the only all-weather harbour of refuge on this coast, the short middle day doubles as the leg's weather gate, and the CBP call at Port Huron now happens after nine hours instead of fifteen. Nothing on Lake Huron exceeds 65 nm; the longest days on the route are the three at the start, on Lake Michigan.`,
    sailingTips: [
      "Day 16 (Tobermory → Kincardine, 65 nm) is the longest day on this leg and is relatively exposed. Southampton (48 nm) and Port Elgin (52 nm) are the intermediate bail-outs, but both are river-mouth harbors that shoal — enter only in settled conditions and do not treat either as an all-weather refuge.",
      "Day 17 (Kincardine → Goderich, 27 nm) is short on purpose and is the leg's weather gate. It can be run on any morning, so if the forecast is bad, stay in Kincardine. Bayfield, 10 nm further on, is prettier than Goderich but its river entrance carries only 6–8 ft and breaks in an onshore sea — Goderich is the harbour of refuge, Bayfield is not.",
      "Day 18 (Goderich → Port Huron, 58 nm) bail-outs: Bayfield (12 nm, fair weather only), Grand Bend (30 nm, shallow entrance), and Harbor Beach, MI (40 nm across) — the last is a genuine artificial harbour of refuge and the right call if it turns nasty.",
      "Re-entering US waters at Port Huron requires immediate contact with US CBP — call 1-800-973-2867 or use the CBP videophone at the marina. Have all passports, vessel documents, and your CBSA clearance number ready. Don't tie up and go to dinner first.",
      "Fuel up before leaving Kincardine — Lake Huron's open-water stretch between Tobermory and Port Huron has fewer stops than you'd like.",
      "Watch for shoaling near the Michigan 'Thumb' peninsula as you round into the southern approach to Port Huron. The chart is your friend.",
    ],
    watchFor: [
      "The Ontario lee shore — if a NW front builds while you're between Kincardine and Port Huron, your options are limited. Treat a 24-hour forecast deterioration as a go/no-go signal before departure.",
      "Shipping traffic increases dramatically approaching Port Huron and the St. Clair River entrance. Monitor VHF 16 and switch to VHF 13 for the river.",
      "Shoal water off Harbor Beach and the Michigan Thumb — stay in the deeper water when rounding south.",
      "Lake St. Clair current begins immediately after the Blue Water Bridge — the current has you now. Plan accordingly.",
    ],
    bestStops: [
      "Kincardine, ON (Day 16): Scottish heritage town with a genuine character. The Saturday-evening bagpiper-at-the-lighthouse ceremony is the most unexpectedly moving 20 minutes on the Ontario coast. Day 16 falls on a Saturday if you leave Winthrop Harbor on a Friday — 25 June 2027 is the recommended departure.",
      "Goderich, ON (Day 17): Laid out as an octagonal 'Square' around the courthouse and reasonably called the prettiest town in Canada. Also the only all-weather harbour of refuge on this shore, which is why the night here exists. Maitland Valley Marina on the north shore of the river has the most transient berths; Snug Harbour Municipal is closer to town with less space. Walk the Menesetung Bridge trail and watch the salt ships load.",
      "Southampton/Port Elgin, ON: Quiet, photogenic Lake Huron towns with basic marina services. Good bail-out or optional lunch stop on Day 16.",
    ],
  },

  {
    legId: "st-clair",
    title: "St. Clair River · Lake St. Clair · Detroit River",
    subtitle: "Port Huron to Detroit",
    captainIntro: `Welcome back to the United States — and to the most traffic-dense water of the trip so far. The St. Clair River is 40 miles of regulated shipping highway running from Port Huron south to Lake St. Clair, carrying a substantial fraction of all commercial tonnage between the upper and lower Great Lakes. You will share this channel with 1,000-foot self-unloading lakers, Canadian salties, and cement ships — all moving faster than you, all unable to stop quickly, and none of whom can yield their lane.

The good news: the current is with you. Two to three knots of south-flowing current adds free speed throughout the river transit. From Port Huron to Detroit is roughly 68 nautical miles, but your effective made-good will be 8–9 knots in the river — it's the most efficient nautical miles of the whole trip.

The discipline here is lane discipline. Stay out of the dredged commercial channel where depth allows, monitor VHF 13 continuously, and give every downbound freighter the entire channel. Lake St. Clair, at the midpoint, is shallow (average 11 feet) with a well-marked commercial channel — follow the buoyed lane without deviation. The Detroit River on the south end is busier still. Watch the commercial traffic, enjoy the skyline, and fuel up in Detroit before Lake Erie.`,
    sailingTips: [
      "Monitor VHF 13 (bridge-to-bridge) continuously from the moment you enter the St. Clair River. This is how freighters communicate their intentions and positions — it's not optional.",
      "Never cross ahead of a downbound freighter in the St. Clair current. The river current is adding 2–3 kn to their speed and their stopping distance is measured in miles. Cross behind, not ahead.",
      "Lake St. Clair's 'Middle Channel' is the marked commercial lane. The Oceanis 30.1 draws ~5 ft, and there is effectively no margin outside the buoyed lane in the western and southern portions. Stay in the channel.",
      "Fuel up in Detroit before entering Lake Erie — it's your last convenient fuel stop before the open-lake run east.",
      "The Detroit River has some of the most complex traffic of the entire trip — ferries, casino boat shuttles, tugs, commercial vessels, and pleasure craft all converging. Remain alert from Grosse Ile north to the river mouth.",
    ],
    watchFor: [
      "1,000-foot lakers — they have right of way, they fill the channel, and their wake is impressive. Treat every downbound laker as a channel obstruction and maneuver accordingly.",
      "Shoal water outside the buoyed channel on Lake St. Clair. The marked channel is the route — deviation is not rewarded.",
      "Commercial traffic density increases approaching the Ambassador Bridge and Detroit River. This is not a leg for distraction.",
      "Reconfirm US CBP clearance is complete before departing Port Huron. Running the St. Clair without cleared customs status is a federal violation.",
    ],
    bestStops: [
      "Detroit, MI (Day 19): The Detroit Riverwalk has transformed the waterfront. Detroit City Marina is well-positioned for a night in the city. Fuel up before Lake Erie.",
    ],
  },

  {
    legId: "lake-erie",
    title: "Lake Erie",
    subtitle: "Detroit to Buffalo",
    captainIntro: `Lake Erie is the troublemaker of the Great Lakes family — shallow, warm, and prone to violent mood swings. At an average depth of only 62 feet (compared to Huron's 195), Erie has no thermal mass to absorb the energy of a northwest blow. What that means in practice is that a 30-knot front can transform the lake from a millpond to a confused 8-foot maelstrom in under two hours. Generations of Great Lakes sailors have been humbled by Erie, and a handful have been killed.

Here is what you do: check the forecast obsessively, start early, and never — not once — trust the weather from the previous day's passage. The Toledo-to-Buffalo corridor is not where you want to get caught out.

The flip side: Erie in good conditions is a delight. The Ohio shore is flat and green, the Bass Islands cluster are a boater's playground, and Cleveland's skyline looks improbably dramatic as you approach from the lake. If you get a benign northwest breeze for the crossing of the open middle lake, you'll have a fast, comfortable sail. Just always have a harbor in range and an eye on the northwest horizon.`,
    sailingTips: [
      "The 'Lake Erie Triangle' between Toledo, Cleveland, and Dunkirk is where the most dangerous seas develop. If crossing the open lake, have a waypoint plan and the ability to duck into Sandusky Bay or Lorain if conditions deteriorate.",
      "Afternoon thunderstorms track northeast across the lake — if you see them building to the west in the afternoon, get in. Erie's shallow depth makes lightning strikes an outsized risk.",
      "The Bass Islands (Put-in-Bay, Middle Bass) are worth a dedicated stop. Arrive before noon on summer weekends — the mooring field fills fast.",
      "Black Rock Lock at Buffalo: hail the tender on VHF 13 well before you arrive. The lock bypasses the Niagara River current and puts you directly into the Erie Canal feeder. It's quick but requires attention.",
      "Start planning the mast-unstep during this leg — call Wardell's or Smith Boys in Tonawanda from Erie on Day 24 to schedule the crane. This is not a walk-up service in peak summer, and Day 26 depends on it.",
      "Days 23 and 24 are deliberately short — 50 and 40 nm — so that the reserve day at Cleveland (Day 22) can absorb a northwest front without the rest of the leg bleeding. Resist the urge to combine them when the weather is good; the slack is the point.",
      "Day 21 (Put-in-Bay → Cleveland, 70 nm) is acceptable only because the Ohio shore has a harbor every 12–15 nm. Huron (28 nm), Vermilion (36 nm), Lorain (48 nm) and Rocky River (60 nm) all have easy breakwater entrances. Day 25 (Erie → Tonawanda, 70 nm) has much less: Barcelona (20 nm, small and shallow) and Dunkirk (42 nm, a proper marina behind a breakwater), then only Sturgeon Point.",
    ],
    watchFor: [
      "Northwest frontal passages — the most dangerous condition on Lake Erie. Check the 48-hour forecast before each departure. If a front is due, wait.",
      "Commercial ferry traffic near Port Clinton and around the Bass Islands — the passenger ferries run fast and on tight schedules.",
      "Shoaling around the Bass Islands — chart your entrance carefully. The island anchorages are pretty but require attention.",
      "The Niagara River current — don't drift past the breakwall at Buffalo without the Black Rock Lock sorted. The current accelerates toward Niagara Falls downstream.",
      "The empty stretch between Cleveland and Ashtabula — Fairport Harbor (25 nm) is the only good mid-run shelter on Day 23. East of Ashtabula, Conneaut (12 nm) covers Day 24, and Barcelona (20 nm) and Dunkirk (42 nm) cover Day 25.",
      "Past Dunkirk, Sturgeon Point is the only shelter on the last 28 nm into Buffalo (Day 25), and it is a small-craft harbor. Leave Presque Isle at first light so the Niagara approach happens in daylight.",
    ],
    bestStops: [
      "Put-in-Bay, South Bass Island: Perry's Victory Monument. Golf cart rentals (the classic way to tour the island — rent them at the dock). Live music. Ohio's most inexplicably cheerful party town. Worth a night.",
      "Cleveland, OH: North Coast Harbor marina is walking distance to the Rock & Roll Hall of Fame and the Great Lakes Science Center. The Warehouse District and East 4th Street have excellent restaurants.",
      "Ashtabula, OH (Day 23): Eleven marinas on one river and a working ore-and-coal waterfront. The Bridge Street historic district and its 1925 lift bridge are a short walk from Harbor Yacht Club. The Port Authority dock on Bridge Street is day-use only but has the only public pump-out on Lake Erie.",
      "Erie, PA (Day 24): Presque Isle State Park for swimming and birding — the best swimming water on the route east of Lake Michigan. The Brig Niagara at the Erie Maritime Museum is a painstaking replica of the ship that won the Battle of Lake Erie in 1813.",
      "Dunkirk, NY (Day 25 bail-out): Chadwick Bay Marina sits behind a breakwater 42 nm from Erie — the proper shelter on the 70 nm run to Buffalo, and the place to spend a pool day if the Niagara approach would come late.",
      "Niagara Falls side trip from Tonawanda: 20 minutes by Uber. Non-negotiable. Go.",
    ],
  },

  {
    legId: "erie-canal",
    title: "The Erie Canal",
    subtitle: "Tonawanda to Waterford",
    captainIntro: `Congratulations — you've crossed the Great Lakes. Now put away the sails, set the throttle to 8 mph, and welcome to America's original highway.

The Erie Canal opened in 1825 and immediately changed everything — it connected the Hudson to the Great Lakes, made New York City the dominant port on the continent, and triggered the settlement of the entire Midwest. The canal you're traveling is the 1918 re-engineering of that original ditch, deeper and wider, but following the same route through the same improbable valley. Two centuries of commerce passed through these locks before containerization made it redundant. Now it's a glorious 338-mile park.

The rules are different here. Speed limit: 10 mph. You will be passed by bicyclists on the towpath, and you will enjoy watching them go by. The water is sometimes green, sometimes brown, always calm. Great blue herons stand motionless on every other lock wall. Lock operators will tell you where to get good pizza, which town has a free pump-out, and whether the next bridge is in a hurry to open. Pay attention to them — they're running the canal and they know everything that matters.

The Waterford Flight at the end — five locks dropping 169 feet in 1.5 miles — is one of the great engineering wonders hiding in plain sight in upstate New York. Lock through it slowly and look up at the walls. Those stones were placed in the 1830s and they're still doing their job.`,
    sailingTips: [
      "Speed limit is 10 mph on the main canal, 5 mph through towns and near other boats. The bottom is silt and you can ruin your prop on a submerged obstruction if you're not paying attention.",
      "Budget 20–30 minutes per lock including approach and departure. 34 locks × 25 min = 14 hours of lock time across the canal. Factor this into your daily distance math.",
      "Lock hours: officially 7am–5pm, with extended on-demand operations to 10pm during summer. Don't count on 10pm — be through your last lock by 4:30pm to be safe, especially for multiple-lock flights. Extended hours also stop in early September, so a late transit loses the evening margin entirely.",
      "The 2:30pm rule at Lock E-6 governs the whole eastern canal. Day 35 leaves Mohawk Harbor at Schenectady at 0730 and reaches the top of the Flight around 0910 — roughly five hours of margin. The old plan asked for 95 miles and 9 locks against the same deadline, which was not physically possible.",
      "Canal town walls are free or cheap ($5–15/night for power). First come, first served. Arriving by 4pm almost always gets you a spot. After 6pm in peak summer, you might be rafting.",
      "The holding tank rules are enforced. Do not discharge overboard. Use pump-outs at Ilion, Ess-Kay at Brewerton, and other equipped marinas.",
      "Weeds and floating debris ('canalligators' in canal lore — logs and branches just awash) can foul your prop. Go slow through weedy stretches and have a mask and sharp knife ready.",
    ],
    watchFor: [
      "Low bridges — design to a 14 ft 6 in (≈4.4 m) air-draft target, not 15 ft. The controlling westbound clearance (Guard Gate West at max pool) is approximately 14 ft 8 in. Double-check after mast-step at Tonawanda: measure to the top of every antenna, GPS puck, and wind instrument — not just the mast truck.",
      "Lift bridges in small towns — most open automatically when they see you coming, but some require a VHF hail (Ch. 13) or a wave. Slow down and be patient.",
      "The Oneida Lake crossing (Day 31) — 21 miles of open water and the only open section on the canal. It is shallow and gets rough on an afternoon breeze, so Day 30 ends at Ess-Kay Yards in Brewerton and Day 31 starts at 0530, putting you at Sylvan Beach before 1000. The lake also shoals badly outside the buoyed channel, particularly at the eastern end.",
      "Lock E-17 at Little Falls — the highest single lock at 40.5 feet. It's dramatic but well-operated. Follow crew instructions from the lock tender exactly.",
      "The Waterford Flight (Locks E-6 to E-2) — arrive at the top lock (E-6) by 2:30pm at the absolute latest. Once you start, you go through all five without stopping.",
    ],
    bestStops: [
      "Lockport, NY: The 'Flight of Five' — the original 1825 canal locks run parallel to the modern ones. The Lockport Cave tour goes underneath the canal. Fascinating.",
      "Fairport, NY (Day 28): The red liftbridge, the towpath trail, Moonlight Creamery ice cream. The most photogenic canal town. Great lunch stop.",
      "Albion and Medina, NY (Day 27): Medina, 35 miles in on the first canal day, is a downtown built of the local red sandstone and makes the lunch stop; the Culvert Road just west is the only place a road passes underneath the canal. Albion, 11 miles on, has a free wall by the Main Street lift bridge.",
      "Lyons, NY (Day 29 lunch stop): The town smells like peppermint. This is not a joke — it's the peppermint oil capital of America. Free wall at Abbey Park, and the H.G. Hotchkiss museum explains why a Wayne County village once supplied most of the world's peppermint oil.",
      "Brewerton, NY (Day 30): Ess-Kay Yards is the best-equipped marina on the canal system — diesel, pump-out, laundry, chandlery, full service department. It ends the longest canal day (61 mi) and stages the dawn Oneida crossing. Baldwinsville's Lock E-24 wall is the fallback if you run late.",
      "Sylvan Beach, NY (Day 31 lunch stop): Retro amusement park at the east end of Oneida Lake. Something surreal about a Ferris wheel next to a canal lock.",
      "Rome, NY (Day 31): Bellamy Harbor Park has 50-amp power and a summer welcome center. Fort Stanwix — the fort that held the Mohawk Valley in 1777, rebuilt full-scale — is a mile and a half up the road, and the first shovelfuls of the original canal were dug near the park.",
      "Little Falls, NY (Day 32): Nestled in limestone cliffs. The Rotary Park dock is free and pretty. Moss Island and its glacial potholes are a 20-minute walk. Strongly recommend.",
      "Canajoharie, NY (Day 33): The Arkell Museum — a Beech-Nut baby-food fortune spent on Winslow Homer, Mary Cassatt and Gilbert Stuart, in a village of 2,000 people. The gorge trail and swimming holes in Wintergreen Park are a half-hour walk from the wall.",
      "Waterford, NY: Oldest continuously inhabited settlement in the US (they say). The welcome center at the bottom of the Flight often has volunteers who will literally hand you a beer. True story.",
    ],
  },

  {
    legId: "hudson",
    title: "The Hudson River",
    subtitle: "Waterford to New York City",
    captainIntro: `The Hudson changes everything. You lock through at Troy — the last lock, the Federal Lock, 14 feet down, no fee — and suddenly the water is different. It has a pulse. The tide is in it. You're no longer on a canal or a lake; you're on a tidal estuary that reaches 150 miles from the sea, and the Atlantic Ocean is now calling the shots on your departure times.

The mast goes back up at Catskill, around mile 112. Hop-O-Nose Marina is on a quiet creek off the river — motor up the creek and have the crane done on the afternoon of Day 36. Then give it Day 37. Crane time is two to three hours, but a rig that has been lying on deck for three weeks needs a full re-tune, not a turnbuckle check: set the rake, even the shrouds, re-seize every turnbuckle, re-pin every clevis, reconnect the masthead VHF and wind instruments, bend on the sails, and motor down the creek to shake it out. You are about to sail into the Hudson Highlands, where the geography gusts a 12-knot day to 25, and you will not want to go aloft there.

This is one of America's great rivers, and it looks it. The Catskill Mountains pile up to the west in their blue-green June haze. The Hudson Highlands — Storm King, Bear Mountain, Black Rock Forest — constrict the river into a dramatic gorge around West Point. Bannerman's Island Arsenal sits in the middle of the river like a drowned castle, which it basically is. And then, on a slow curve somewhere below Tarrytown, the towers of Manhattan materialize out of the haze, and it dawns on you: you sailed here from Lake Michigan.`,
    sailingTips: [
      "Tidal current is your friend if you use it right. High tide at Troy happens 5–6 hours AFTER high tide at the Battery in NYC. Check a tide app for 'Troy, NY' specifically — not NYC. Plan departures to ride the ebb south.",
      "The ebb typically runs 1.5–2.5 knots south on a good cycle. A headwind of 10 knots + 2 knots of ebb still moves you along; a headwind of 20 against a flooding tide is uncomfortable.",
      "The Hudson Highlands (Storm King, West Point area) constrict and accelerate both wind and current. The 'Hudson River Valley effect' can produce 20–25 knot gusts in a 12-knot day when the geography focuses the flow.",
      "NYC Harbor is extremely busy — ferries, tug-and-barge, tourist boats, Coast Guard, and container ships, all going fast. Monitor VHF 16, have your running lights working, and approach Liberty Landing during daytime only.",
      "Re-check and retension all rigging after the first hour of sailing on Day 38. The mast settles when you first load it and it's normal for turnbuckles to need adjustment — that is on top of the full re-tune on Day 37, not instead of it.",
      "Stage the Manhattan arrival, don't hope for it. Day 39 is 75 nm from Poughkeepsie — about twelve hours, roughly six on a favourable ebb and six against the flood. Leaving at 0730 typically lands you at Liberty Landing around 1930, golden hour in July and August. If the tide cycle or the light is going wrong, stop at Haverstraw (34 nm) and run the last 33 nm the next afternoon; one pool day for the arrival is the right trade.",
    ],
    watchFor: [
      "Tidal timing near NYC — aim to arrive at Battery/Harbor on a slack or early ebb, not a strong flood pushing you north. The ferry traffic is unforgiving.",
      "The Mario Cuomo (Tappan Zee) Bridge area is busy with shipping traffic turning in the wide lower river. The river bends there and sight lines are limited.",
      "Anchorage restrictions near the river — some areas have cable crossings or restricted military zones. Check your chart before dropping the hook.",
      "Bannerman's Island Castle is beautiful from the river but the currents around Pollepel Island are irregular. Don't anchor close.",
    ],
    bestStops: [
      "Catskill Creek / Hop-O-Nose Marina (Days 36–37): Lovely spot, and you get two nights — one for the crane, one for the rig. Walk up into the town of Catskill for dinner. The nearby town of Hudson (across the river) is an art and antiques enclave — worth a taxi ride on the rigging day.",
      "Haverstraw, NY (Day 39 fallback): One of the largest full-service marinas on the Hudson, in the river's widest reach, 34 nm below Poughkeepsie. Not a scheduled stop — it is where you break the 75 nm Day 39 if the tide or the light is going wrong, so the Manhattan approach becomes a 33 nm afternoon run.",
      "Kingston / Rondout Creek: The Hudson River Maritime Museum has an excellent collection including the last remaining Hudson River sloop. Rondout Creek is easy to navigate and the waterfront is charming.",
      "Newburgh / Beacon: Cross-river pair. Beacon has become an arts destination since Dia:Beacon opened — one of the finest contemporary art museums in the US, in a converted factory.",
      "New York City: The scope of what's possible in NYC in 24 hours is overwhelming. Prioritize: a proper dinner, the South Street Seaport (historic ships), and one long walk along the waterfront. West Marine in Weehawken for last-minute parts.",
    ],
  },

  {
    legId: "sound-saybrook",
    title: "Long Island Sound → Old Saybrook",
    subtitle: "New York to the Connecticut River",
    captainIntro: `Exit New York through the East River — a canyon of glass and steel with some of the most interesting tidal hydraulics in North America. Hell Gate, where the Harlem River, the Long Island Sound tidal flow, and the upper East River meet, runs up to 5 knots on a good spring tide. Time it correctly and you'll rocket through on rails at 9 knots; time it wrong and you'll be doing 2 knots against a wall of current while tugboats pass you in both directions. Check the tide tables for Hell Gate specifically, plan to pass at or just before slack, and enjoy the view.

Once you clear Hell Gate and the Throgs Neck Bridge, Long Island Sound opens ahead of you like a reward. This is what the whole trip was building toward: a beam reach in southwest sea breeze, 12–15 knots, flat water, the North Fork of Long Island to starboard and the Connecticut hills to port, running east at hull speed with everything up. Summer mornings on the Sound are routinely excellent — the SW sea breeze fills in by 9–10am on most June and July days and holds until early evening. You will sail. Properly.

The Sound is one of the great cruising grounds on the East Coast, and it's at its best in June and July. Oyster Bay, Port Jefferson, Greenport — every stop is interesting, the food is good, and the sailing between them is better. Old Saybrook at the Connecticut River mouth is a genteel finish to a raucous journey.`,
    sailingTips: [
      "Hell Gate timing is mission-critical. The current reaches 5 knots and the eddies are violent on a big spring tide. Check admiralty tables for 'Hell Gate, NY' — the window of manageable current around slack is only 45–60 minutes. Don't miss it.",
      "SW sea breeze on Long Island Sound is highly reliable from mid-May through August. It typically builds from the SW in the morning, peaks 12–18 knots in early afternoon, and lays down by early evening. Plan departures to use it.",
      "Plum Gut (between Orient Point and Plum Island) runs to 5 knots and is the way out of Gardiners Bay on Day 44. Take it on the early ebb heading north; against a flood it is a wall. The Race lies east of the route to Old Saybrook — it is a detour for the ride, about 10 nm extra, not a gate you have to pass.",
      "The Connecticut River entrance at Old Saybrook has a shifting sandbar at the mouth — follow the marked channel, not the straight-line course on the chart.",
      "Long Island Sound thunderstorms in summer build rapidly over the land and track east-northeast. Watch the northwest horizon in the afternoon.",
    ],
    watchFor: [
      "Hell Gate current — see above. It's not dangerous if timed correctly; it's exciting and potentially damaging if not.",
      "High ferry and commercial traffic density between Port Jefferson and Bridgeport — the cross-Sound ferries run on fixed schedules and move fast.",
      "Plum Gut on Day 44 — the only tidal gate between Greenport and Old Saybrook. Race Rock and The Race sit further east and are off the route unless you choose the detour.",
    ],
    bestStops: [
      "Oyster Bay, NY: Theodore Roosevelt's Sagamore Hill home is here. Beautiful harbor. Brilliant for a first-night stop after the East River chaos.",
      "Port Jefferson, NY: Deep harbor, charming town, excellent waterfront restaurants. One of the best natural harbors on the Sound's south shore.",
      "Greenport, NY: The gem of the North Fork. Mitchell Park Marina is well-run. The town has excellent wine tasting rooms (North Fork AVA is seriously good), a maritime museum, and good restaurants. Shelter Island is accessible by ferry from here.",
      "Mystic, CT (optional, not on the route): Mystic Seaport Museum — the Charles W. Morgan, the last wooden whaleship afloat, launched 1841, plus the Sabino and a working preservation shipyard. It is 20 nm east of Old Saybrook; the easy way is by car after arrival. Putting it back on the route costs two pool days: Greenport → Mystic through Plum Gut and The Race, a layover, then Mystic → Old Saybrook.",
      "Old Saybrook / Essex, CT: The Connecticut River at its most beautiful. Essex (5 nm upriver) is arguably the most handsome town in New England. The Griswold Inn has been operating since 1776. Steam train connects to a riverboat tour. A genuinely lovely place to end a voyage.",
    ],
  },
];
