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
    subtitle: "Chicago to Mackinac Island",
    captainIntro: `Chicago's lakefront drops away fast once you clear the breakwaters at DuSable Harbor — and right there is your first lesson in Great Lakes humility. You're on a freshwater sea now, 307 miles of open fetch to the north, and she doesn't care about your feelings. June is the transition month: the lake is cold (surface temps still 50–55°F in early June), air-sea temperature differences can produce fog banks that materialize without warning, and afternoon thunderstorms are Lake Michigan's summer calling card.

Your strategy for the whole leg: launch early, push hard before noon, and be tucked into a harbor before the afternoon sea breeze builds toward the Michigan shore. The eastern shoreline is your friend — a string of well-maintained harbor towns spaced 40–80 nm apart, each with fuel, pump-out, and a cold beer waiting. Follow the eastern shore north, and Lake Michigan will feel manageable. Try to cut corners in the middle and she'll remind you who's in charge.

The payoff for doing it right is the approach to Mackinac — threading the Straits under that 5-mile suspension bridge with the smell of fudge drifting out from the island. There's no arrival in the Great Lakes quite like Mackinac Island for the first time.`,
    sailingTips: [
      "Best winds are NE to SW in mornings before the afternoon sea breeze sets in from the west. Plan to be at anchor or in a slip by 3–4pm if you can.",
      "The 130 L / 34 US gal diesel tank gives you 350+ nm of motoring range — a realistic safety margin for the entire Lake Michigan leg. Carry two 5-gallon jerry cans anyway, but reserve them for the North Channel where fuel docks are sparse (Little Current to Kincardine). Top off at every fuel stop on Lake Michigan as a matter of discipline, not emergency.",
      "Big Sable Point is a notorious wind accelerator. Rounding it before noon dramatically reduces your exposure.",
      "The Manitou Passage between North and South Manitou Islands and the mainland concentrates and accelerates wind. When the lake forecast and passage forecast disagree, believe the passage.",
      "Don't ignore NOAA WX3 and WX4 — the Great Lakes-specific weather radio channels. Check them every morning before departing, and again at noon.",
      "Lake Michigan water temps stay below 60°F well into July. If someone goes overboard, cold water incapacitation is your biggest danger — jacklines and tethers for all crew whenever offshore.",
      "Standing order for the open Lakes: inflatable PFD-harnesses worn and tethers clipped on every open-water leg, day or night. Brief a cold-water MOB recovery (Lifesling-and-winch hoist) before you leave Chicago — the plan is recovery, not just retrieval.",
      "For the long open-water days, run a simple two-watch rotation so the helm is always fresh and rested — fatigue is the quiet hazard on 70–85 nm passages. If conditions deteriorate, the natural haul-out / wait-it-out points down the route are Mackinac, Detroit, Buffalo, and NYC; don't be too proud to use them.",
    ],
    watchFor: [
      "Afternoon convective thunderstorms — they build fast over the warm land and move east over the lake. If you see anvil-top cumulonimbus to the west, get in.",
      "The 'Lake Michigan Gale' — a northwest frontal system can turn a 2-foot chop into 8-foot breaking seas in four hours. The barometer is your friend.",
      "Barge traffic running the shipping lanes — stay east of the marked lanes when possible.",
      "Shallow water near the Michigan shoreline — the coastal shelf is gradual but 10-foot depths extend farther offshore than you'd expect in some spots.",
    ],
    bestStops: [
      "Saugatuck, MI (Day 2 alternate): One of the prettiest towns on Lake Michigan. Galleries, restaurants, a schooner bar. Worth a half-day if schedule allows.",
      "Sleeping Bear Dunes (Day 4): The dunes are visible from offshore — magnificent 400-foot sand bluffs. If you have time, anchor off Empire and dinghy in.",
      "Mackinac Island (Day 5–6): Car-free, horse-drawn carriages, Fort Mackinac, Arch Rock. Grand Hotel porch is open for a drink (jacket required after 6pm — pack one). The fudge shops are unironically excellent.",
    ],
  },

  {
    legId: "north-channel",
    title: "North Channel & Manitoulin Island",
    subtitle: "Mackinac to Port Huron via Ontario",
    captainIntro: `Most sailors who do the Great Lakes run miss the North Channel entirely — they peel south off Mackinac and run the Sunrise Coast down Michigan's thumb to Port Huron. It's efficient. It's also the greatest mistake they make on the trip.

The North Channel runs east from the Straits of Mackinac between the Canadian mainland and Manitoulin Island — the largest freshwater island in the world — through 200 miles of pink granite shore, clear anchorages, and small Ontario towns where the population is still measured in hundreds. The Benjamin Islands. Baie Fine. Killarney. These are names whispered by Great Lakes sailors the way Atlantic cruisers talk about the Chesapeake or the Maine coast. The water is cold and gin-clear. The anchorages are mostly empty. The skies at night are genuinely dark.

The logistics are modest: passports for everyone, a CBSA phone check-in at Meldrum Bay, and a US CBP check-in when you return to Port Huron. The rest is sailing through some of the most beautiful freshwater in North America — at anchor, mostly, which is where the North Channel reveals itself best.`,
    sailingTips: [
      "CBSA (Canadian Customs) check-in is mandatory at your first Canadian port. Meldrum Bay is a designated entry point — phone the CBSA immediately on arrival. Have all passports, vessel registration, MMSI, and crew details ready. You receive a clearance number; keep it for re-entry.",
      "US CBP re-entry is required at Port Huron when you return. Call 1-800-973-2867 or use the CBP videophone at the marina. Have your CBSA clearance number and all passports ready.",
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
      "Baie Fine / The Pool: Anchor here. There is no argument. A 10-mile fjord off the North Channel ending in a granite bowl of 50-foot-deep turquoise water. No marina, no services — just silence, herons, and reflections that look painted. Take the dinghy to the head of the pool.",
      "Killarney, ON: Historic fishing village with a character that hasn't been sanded down. Herbert's fish & chips (order the pickerel), the Killarney Mountain Lodge for a drink with a view, and the clearest freshwater you will see on this trip. Provincial Park hiking on the La Cloche quartzite ridge if you have a day.",
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

The day 14 run (85 nm from Kincardine to Port Huron) is the longest single open-water day of the entire voyage. Pre-dawn departure, eyes on the barometer, and consider intermediate bail-outs at Bayfield or Grand Bend on the Ontario side if the weather turns.`,
    sailingTips: [
      "Day 13 (Tobermory → Kincardine, 65 nm) is long and relatively exposed. Southampton or Port Elgin (~45 nm from Tobermory) make natural intermediate bail-outs if the forecast sours — worth noting for peace of mind.",
      "Day 14 (Kincardine → Port Huron, 85 nm) is the longest open-water day of the whole trip. Pre-dawn departure is not optional. Bayfield or Grand Bend (Ontario side, ~40 nm) or Harbor Beach (Michigan side, ~55 nm) are your mid-run shelters.",
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
      "Kincardine, ON (Day 13): Scottish heritage town with a genuine character. The Saturday-evening bagpiper-at-the-lighthouse ceremony is the most unexpectedly moving 20 minutes on the Ontario coast. Try to schedule Day 13 for a Saturday.",
      "Southampton/Port Elgin, ON: Quiet, photogenic Lake Huron towns with basic marina services. Good bail-out or optional lunch stop on Day 13.",
    ],
  },

  {
    legId: "st-clair",
    title: "St. Clair River · Lake St. Clair · Detroit River",
    subtitle: "Port Huron to Detroit",
    captainIntro: `Welcome back to the United States — and to the most traffic-dense water you've seen since leaving Chicago. The St. Clair River is 40 miles of regulated shipping highway running from Port Huron south to Lake St. Clair, carrying a substantial fraction of all commercial tonnage between the upper and lower Great Lakes. You will share this channel with 1,000-foot self-unloading lakers, Canadian salties, and cement ships — all moving faster than you, all unable to stop quickly, and none of whom can yield their lane.

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
      "Detroit, MI (Day 15): The Detroit Riverwalk has transformed the waterfront. Detroit City Marina is well-positioned for a night in the city. Fuel up before Lake Erie.",
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
      "Start planning the mast-unstep during this leg — call Wardell's or Smith Boys in Tonawanda before you leave Erie to schedule the crane. This is not a walk-up service in peak summer.",
    ],
    watchFor: [
      "Northwest frontal passages — the most dangerous condition on Lake Erie. Check the 48-hour forecast before each departure. If a front is due, wait.",
      "Commercial ferry traffic near Port Clinton and around the Bass Islands — the passenger ferries run fast and on tight schedules.",
      "Shoaling around the Bass Islands — chart your entrance carefully. The island anchorages are pretty but require attention.",
      "The Niagara River current — don't drift past the breakwall at Buffalo without the Black Rock Lock sorted. The current accelerates toward Niagara Falls downstream.",
    ],
    bestStops: [
      "Put-in-Bay, South Bass Island: Perry's Victory Monument. Golf cart rentals (the classic way to tour the island — rent them at the dock). Live music. Ohio's most inexplicably cheerful party town. Worth a night.",
      "Cleveland, OH: North Coast Harbor marina is walking distance to the Rock & Roll Hall of Fame and the Great Lakes Science Center. The Warehouse District and East 4th Street have excellent restaurants.",
      "Erie, PA: Presque Isle State Park for swimming and birding. The Brig Niagara at the Erie Maritime Museum is a painstaking replica of the ship that won the Battle of Lake Erie in 1813.",
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
      "Lock hours: officially 7am–5pm, with extended on-demand operations to 10pm during summer. Don't count on 10pm — be through your last lock by 4:30pm to be safe, especially for multiple-lock flights.",
      "Canal town walls are free or cheap ($5–15/night for power). First come, first served. Arriving by 4pm almost always gets you a spot. After 6pm in peak summer, you might be rafting.",
      "The holding tank rules are enforced. Do not discharge overboard. Use pump-outs at Ilion, Ess-Kay at Brewerton, and other equipped marinas.",
      "Weeds and floating debris ('canalligators' in canal lore — logs and branches just awash) can foul your prop. Go slow through weedy stretches and have a mask and sharp knife ready.",
    ],
    watchFor: [
      "Low bridges — design to a 14 ft 6 in (≈4.4 m) air-draft target, not 15 ft. The controlling westbound clearance (Guard Gate West at max pool) is approximately 14 ft 8 in. Double-check after mast-step at Tonawanda: measure to the top of every antenna, GPS puck, and wind instrument — not just the mast truck.",
      "Lift bridges in small towns — most open automatically when they see you coming, but some require a VHF hail (Ch. 13) or a wave. Slow down and be patient.",
      "The Oneida Lake crossing (Day 24) — 20 miles of open water that can get choppy. The only truly open-water section on the canal. Stage at Brewerton the evening before and cross in the morning calm before afternoon winds build.",
      "Lock E-17 at Little Falls — the highest single lock at 40.5 feet. It's dramatic but well-operated. Follow crew instructions from the lock tender exactly.",
      "The Waterford Flight (Locks E-6 to E-2) — arrive at the top lock (E-6) by 2:30pm at the absolute latest. Once you start, you go through all five without stopping.",
    ],
    bestStops: [
      "Lockport, NY: The 'Flight of Five' — the original 1825 canal locks run parallel to the modern ones. The Lockport Cave tour goes underneath the canal. Fascinating.",
      "Fairport, NY: The red liftbridge, the towpath trail, Moonlight Creamery ice cream. The most photogenic canal town. Great lunch stop.",
      "Lyons, NY: The town smells like peppermint. This is not a joke — it's the peppermint oil capital of America. Stop for a walk.",
      "Sylvan Beach, NY: Retro amusement park at the east end of Oneida Lake. Something surreal about a Ferris wheel next to a canal lock.",
      "Little Falls, NY: Nestled in limestone cliffs. The Rotary Park dock is free and pretty. Moss Island and its glacial potholes are a 20-minute walk. Strongly recommend.",
      "Waterford, NY: Oldest continuously inhabited settlement in the US (they say). The welcome center at the bottom of the Flight often has volunteers who will literally hand you a beer. True story.",
    ],
  },

  {
    legId: "hudson",
    title: "The Hudson River",
    subtitle: "Waterford to New York City",
    captainIntro: `The Hudson changes everything. You lock through at Troy — the last lock, the Federal Lock, 14 feet down, no fee — and suddenly the water is different. It has a pulse. The tide is in it. You're no longer on a canal or a lake; you're on a tidal estuary that reaches 150 miles from the sea, and the Atlantic Ocean is now calling the shots on your departure times.

The mast goes back up at Catskill, around mile 112. Hop-O-Nose Marina is on a quiet creek off the river — row up the creek, have the crane done by late afternoon, reconnect your electronics. The next morning you're a sailor again, and the Hudson has sails to fill.

This is one of America's great rivers, and it looks it. The Catskill Mountains pile up to the west in their blue-green June haze. The Hudson Highlands — Storm King, Bear Mountain, Black Rock Forest — constrict the river into a dramatic gorge around West Point. Bannerman's Island Arsenal sits in the middle of the river like a drowned castle, which it basically is. And then, on a slow curve somewhere below Tarrytown, the towers of Manhattan materialize out of the haze, and it dawns on you: you sailed here from Chicago.`,
    sailingTips: [
      "Tidal current is your friend if you use it right. High tide at Troy happens 5–6 hours AFTER high tide at the Battery in NYC. Check a tide app for 'Troy, NY' specifically — not NYC. Plan departures to ride the ebb south.",
      "The ebb typically runs 1.5–2.5 knots south on a good cycle. A headwind of 10 knots + 2 knots of ebb still moves you along; a headwind of 20 against a flooding tide is uncomfortable.",
      "The Hudson Highlands (Storm King, West Point area) constrict and accelerate both wind and current. The 'Hudson River Valley effect' can produce 20–25 knot gusts in a 12-knot day when the geography focuses the flow.",
      "NYC Harbor is extremely busy — ferries, tug-and-barge, tourist boats, Coast Guard, and container ships, all going fast. Monitor VHF 16, have your running lights working, and approach Liberty Landing during daytime only.",
      "Re-check and retension all rigging the morning after mast-step. The mast settles when you first load it with the sails and it's normal for turnbuckles to need adjustment.",
    ],
    watchFor: [
      "Tidal timing near NYC — aim to arrive at Battery/Harbor on a slack or early ebb, not a strong flood pushing you north. The ferry traffic is unforgiving.",
      "The Mario Cuomo (Tappan Zee) Bridge area is busy with shipping traffic turning in the wide lower river. The river bends there and sight lines are limited.",
      "Anchorage restrictions near the river — some areas have cable crossings or restricted military zones. Check your chart before dropping the hook.",
      "Bannerman's Island Castle is beautiful from the river but the currents around Pollepel Island are irregular. Don't anchor close.",
    ],
    bestStops: [
      "Catskill Creek / Hop-O-Nose Marina: Lovely spot. Walk up into the town of Catskill after mast-step for dinner. The nearby town of Hudson (across the river) is an art and antiques enclave — worth a taxi ride.",
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

The Sound is one of the great cruising grounds on the East Coast, and it's at its best in June and July. Oyster Bay, Port Jefferson, Greenport, Mystic — every stop is interesting, the food is good, and the sailing between them is better. Old Saybrook at the Connecticut River mouth is a genteel finish to a raucous journey.`,
    sailingTips: [
      "Hell Gate timing is mission-critical. The current reaches 5 knots and the eddies are violent on a big spring tide. Check admiralty tables for 'Hell Gate, NY' — the window of manageable current around slack is only 45–60 minutes. Don't miss it.",
      "SW sea breeze on Long Island Sound is highly reliable from mid-May through August. It typically builds from the SW in the morning, peaks 12–18 knots in early afternoon, and lays down by early evening. Plan departures to use it.",
      "Plum Gut (between Orient Point on Long Island and Plum Island) has strong tidal currents up to 5 knots — similar precautions to Hell Gate apply. Cross near slack.",
      "The Connecticut River entrance at Old Saybrook has a shifting sandbar at the mouth — follow the marked channel, not the straight-line course on the chart.",
      "Long Island Sound thunderstorms in summer build rapidly over the land and track east-northeast. Watch the northwest horizon in the afternoon.",
    ],
    watchFor: [
      "Hell Gate current — see above. It's not dangerous if timed correctly; it's exciting and potentially damaging if not.",
      "High ferry and commercial traffic density between Port Jefferson and Bridgeport — the cross-Sound ferries run on fixed schedules and move fast.",
      "Race Rock and The Race (Block Island Sound entrance) — tidal currents are fierce at Race Rock at the eastern end of the Sound. If you push beyond Greenport, plan the passage for slack.",
      "Mystic River drawbridge — has a limited opening schedule. Call ahead.",
    ],
    bestStops: [
      "Oyster Bay, NY: Theodore Roosevelt's Sagamore Hill home is here. Beautiful harbor. Brilliant for a first-night stop after the East River chaos.",
      "Port Jefferson, NY: Deep harbor, charming town, excellent waterfront restaurants. One of the best natural harbors on the Sound's south shore.",
      "Greenport, NY: The gem of the North Fork. Mitchell Park Marina is well-run. The town has excellent wine tasting rooms (North Fork AVA is seriously good), a maritime museum, and good restaurants. Shelter Island is accessible by ferry from here.",
      "Mystic, CT: Mystic Seaport Museum is outstanding — Charles W. Morgan, the last surviving wooden whaleship, is here. The town is charming, the seafood is exceptional.",
      "Old Saybrook / Essex, CT: The Connecticut River at its most beautiful. Essex (5 nm upriver) is arguably the most handsome town in New England. The Griswold Inn has been operating since 1776. Steam train connects to a riverboat tour. A genuinely lovely place to end a voyage.",
    ],
  },
];
