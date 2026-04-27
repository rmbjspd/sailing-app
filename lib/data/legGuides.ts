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
    subtitle: "Days 1–6 · ~500 nm · Chicago to Mackinac Island",
    captainIntro: `Chicago's lakefront drops away fast once you clear the breakwaters at DuSable Harbor — and right there is your first lesson in Great Lakes humility. You're on a freshwater sea now, 307 miles of open fetch to the north, and she doesn't care about your feelings. June is the transition month: the lake is cold (surface temps still 50–55°F in early June), air-sea temperature differences can produce fog banks that materialize without warning, and afternoon thunderstorms are Lake Michigan's summer calling card.

Your strategy for the whole leg: launch early, push hard before noon, and be tucked into a harbor before the afternoon sea breeze builds toward the Michigan shore. The eastern shoreline is your friend — a string of well-maintained harbor towns spaced 40–80 nm apart, each with fuel, pump-out, and a cold beer waiting. Follow the eastern shore north, and Lake Michigan will feel manageable. Try to cut corners in the middle and she'll remind you who's in charge.

The payoff for doing it right is the approach to Mackinac — threading the Straits under that 5-mile suspension bridge with the smell of fudge drifting out from the island. There's no arrival in the Great Lakes quite like Mackinac Island for the first time.`,
    sailingTips: [
      "Best winds are NE to SW in mornings before the afternoon sea breeze sets in from the west. Plan to be at anchor or in a slip by 3–4pm if you can.",
      "The 25L diesel tank is your limiting factor on calm days. Carry two 5-gallon jerry cans and top off at every fuel stop — some legs (Grand Haven to Ludington) will tax the range in light air.",
      "Big Sable Point is a notorious wind accelerator. Rounding it before noon dramatically reduces your exposure.",
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
      "Saugatuck, MI (Day 2 alternate): One of the prettiest towns on Lake Michigan. Galleries, restaurants, a schooner bar. Worth a half-day if schedule allows.",
      "Sleeping Bear Dunes (Day 4): The dunes are visible from offshore — magnificent 400-foot sand bluffs. If you have time, anchor off Empire and dinghy in.",
      "Mackinac Island (Day 5–6): Car-free, horse-drawn carriages, Fort Mackinac, Arch Rock. Grand Hotel porch is open for a drink (jacket required after 6pm — pack one). The fudge shops are unironically excellent.",
    ],
  },

  {
    legId: "lake-huron",
    title: "Lake Huron",
    subtitle: "Days 7–10 · ~300 nm · Mackinac to Detroit",
    captainIntro: `You cross from Lake Michigan into Huron under the Mackinac Bridge — 199 feet of clearance, but you'll feel like a toy boat under it regardless. Huron is the quieter, longer, somehow older-feeling Great Lake. Michigan's 'Sunrise Coast' faces east and wears its name honestly: you'll have spectacular dawns breaking over the water with the forested shore to your left.

Huron is less trafficked by recreational sailors than Michigan, which means the anchorages are quieter and the marinas less crowded, but the service infrastructure is also thinner. Harbor Beach is well-equipped. The towns in between are small and self-sufficient. Plan your fuel stops carefully.

The star of this leg is the St. Clair River — one of the great maritime spectacles in North America. The world's largest freshwater ships, the 1,000-foot lakers, squeeze through a channel that's barely 600 feet wide in places, making a combined-forces approach toward your boat feel like an air traffic control problem. Give them enormous space. Monitor VHF 13 the entire transit. It's exhilarating, it's humbling, and it's absolutely not a place to be off your game.`,
    sailingTips: [
      "Lake Huron generates a steep, short chop faster than Lake Michigan because it's slightly shallower in the southern basin. Northerly and southerly winds are worst — both have a very long fetch.",
      "Alpena (Thunder Bay National Marine Sanctuary) is an excellent diversion stop and a good bailout point if weather deteriorates south of Rogers City. The shipwreck diver community there is friendly and informative.",
      "The St. Clair River current runs 2–3 knots southbound. You'll feel it push you through. But so will the freighters behind you — don't dally in the channel.",
      "Lake St. Clair (between the St. Clair and Detroit Rivers) looks like a puddle on the chart but it can kick up a serious chop in 15+ knots. Follow the marked shipping channel — it's dredged to 27 feet; outside it, 6–8 feet is common.",
      "The Detroit River has some of the heaviest commercial traffic in freshwater. VHF 13. Eyes up. Stay in your lane.",
    ],
    watchFor: [
      "Fog on Lake Huron — the temperature differential between the cold lake water and warm summer air can produce morning fog banks that burn off by 10am. Don't rush an early departure if you can't see a mile.",
      "Freighter passing zones in the St. Clair River — the overtaking/meeting situation between two 1,000-foot ships is not subtle. Give them the whole channel.",
      "Lake St. Clair's shoal areas outside the main channel — the shoal draft helps (4.3ft) but stay in the buoyed lane.",
    ],
    bestStops: [
      "Rogers City, MI: Limestone quarry town with a quiet marina and a walk worth taking. The Presque Isle lighthouse (10 nm farther) is beautiful if you have time for the alternate.",
      "Alpena, MI: Thunder Bay National Marine Sanctuary has an incredible collection of shallow, diveable Great Lakes shipwrecks. The Glass Bottom Boat tours are excellent if you're not a diver.",
      "Detroit: The Riverwalk from GM Renaissance Center to the Ambassador Bridge is one of the best urban waterfront walks in the Midwest. If you have a crew day off, the Henry Ford Museum/Greenfield Village in nearby Dearborn is extraordinary — a full day easily.",
    ],
  },

  {
    legId: "lake-erie",
    title: "Lake Erie",
    subtitle: "Days 11–15 · ~250 nm · Detroit to Buffalo",
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
    subtitle: "Days 15–20 · 338 statute miles · 34 locks · Tonawanda to Waterford",
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
      "Low bridges — your air draft must be under 15.5 feet. Double-check after mast-step at Tonawanda that every antenna, GPS puck, and wind instrument is either removed or below the limit.",
      "Lift bridges in small towns — most open automatically when they see you coming, but some require a VHF hail (Ch. 13) or a wave. Slow down and be patient.",
      "The Oneida Lake crossing (Day 18) — 20 miles of open water that can get choppy. The only truly open-water section on the canal. Cross in the morning before afternoon winds build.",
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
    subtitle: "Days 21–24 · ~134 nm · Waterford to New York City",
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
    legId: "coast-philly",
    title: "NJ Offshore Coast → Philadelphia",
    subtitle: "Days 25–29 · ~230 nm · New York to Penn's Landing",
    captainIntro: `The New Jersey coastal run is where the trip earns its offshore stripes. You're on saltwater now, properly, and the rhythm is different — tide tables replace lock schedules, inlet timing replaces bridge openings, and the Atlantic weather forecast governs your day in a way the inland route never quite did.

Fair warning: the prevailing summer wind on the Jersey coast is SW, which means it's directly on the nose for most of your southward run. You will mostly motorsail. Embrace it. The coast ticks by — the barrier beaches, the Atlantic City skyline emerging from the dunes, the first sight of Cape May's lighthouse. This is not the sailing highlight of the trip, but it is the transition. You're almost there.

The Delaware Bay is the last test. Wind against flood tide in the bay produces a short, steep chop that can be uncomfortable in a 30-foot boat. Get it right: depart Cape May in the morning after any fog burns off, ride the flood north, and let the current do the work. By the time you pass the Delaware Memorial Bridge and catch your first sight of the Philadelphia skyline, you've earned what's waiting at Penn's Landing.`,
    sailingTips: [
      "Time every inlet entry near slack or favorable current — Manasquan and Absecon (Atlantic City) both have notable tidal flow. Arriving on a strong ebb with onshore wind is the scenario to avoid.",
      "Delaware Bay fog is common in summer mornings. Don't rush the pre-dawn departure from Cape May — a 9–10am departure after burn-off is safer than a 5am start in pea soup.",
      "Wind-against-tide in Delaware Bay can produce confused 4–5 foot seas surprisingly quickly. If the forecast shows 15+ knots from the south against a northbound flood, wait.",
      "Monitor VHF 13 continuously on the Delaware River — large ships give position reports at the bridges. You'll hear them announce well in advance.",
      "Penn's Landing arrival: call ahead to the marina. The Delaware River current can be surprising if you arrive on a flooding tide — plan your dock approach accordingly.",
    ],
    watchFor: [
      "Crab pot lines along the Jersey coast — they're everywhere in 20–40 feet of water, poorly marked, and prop-eating. Keep a watch forward and slow down when transiting inshore of 2 miles.",
      "The Cape May–Lewes ferry — fast catamaran ferry crossing your path at Cape May Inlet. It moves fast. Check ferry schedules.",
      "Ship traffic on the Delaware — the river is deep and narrow and the ships fill it. They won't stop for you.",
    ],
    bestStops: [
      "Cape May, NJ: The most beautiful Victorian town in America. Washington Street Mall, the beachfront, the lighthouse. If the schedule allows a rest day, this is where to take it.",
      "Delaware City, DE: Tiny, unpretentious, perfectly placed. Fort Delaware on Pea Patch Island is a short ferry ride and genuinely interesting. The marina staff are seasoned Loopers and will give you excellent Delaware River timing advice.",
      "Philadelphia, PA: Penn's Landing puts you literally at the doorstep of the Independence Seaport Museum — board the USS Olympia (Spanish-American War cruiser) and the WWII submarine Becuna. Independence Hall and the Liberty Bell are a 15-minute walk. Eat a cheesesteak from Pat's or Geno's. You're done.",
    ],
  },

  {
    legId: "sound-saybrook",
    title: "Long Island Sound → Old Saybrook",
    subtitle: "Days 25–29 · ~150 nm · New York to the Connecticut River",
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
