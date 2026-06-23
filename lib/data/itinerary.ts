import type { ItineraryDay } from "../types";

export const itinerary: ItineraryDay[] = [
  // ---- LAKE MICHIGAN ----
  {
    day: 1, from: "Chicago, IL", to: "St. Joseph, MI", distanceNm: 53, locks: 0,
    leg: "lake-michigan", overnight: "Anchor's Way / St. Joseph Municipal Marina",
    highlights: ["First open-water crossing of southern Lake Michigan", "St. Joseph's beach and waterfront restaurants — 'Riviera of the Midwest'"],
    warnings: ["Depart early — afternoon thunderstorms common on Lake Michigan in June", "Keep a close eye on fuel: 53nm motoring in calm = most of your tank"],
    notes: "Depart DuSable Harbor at first light. Set a course SE across southern Lake Michigan. Arrive by late afternoon. Refuel on arrival."
  },
  {
    day: 2, from: "St. Joseph, MI", to: "Grand Haven, MI", distanceNm: 75, locks: 0,
    leg: "lake-michigan", overnight: "Grand Haven Municipal Marina",
    highlights: ["Pass South Haven and Saugatuck en route", "Grand Haven waterfront music fountain show in the evenings"],
    warnings: ["Longest Lake Michigan day — ensure full tank departing St. Joseph", "Afternoon NW winds can build 2–4ft chop; plan to be in by 3pm", "Bail-out harbors if it kicks up: Holland (~35 nm) or South Haven (~20 nm)"],
    notes: "Long day sail hugging Michigan's eastern shore. Refuel and pump out at Grand Haven."
  },
  {
    day: 3, from: "Grand Haven, MI", to: "Ludington, MI", distanceNm: 80, locks: 0,
    leg: "lake-michigan", overnight: "Ludington Municipal Marina",
    highlights: ["Sleeping Bear Dunes visible from offshore", "Ludington is a major refueling and resupply point"],
    warnings: ["Big Sable Point: afternoon westerlies can generate steep, short chop — round the point before noon if possible", "Pentwater (~40nm) is a good fuel and weather check stop if conditions look dicey; the 130 L tank easily covers this day, but topping off is good practice"],
    notes: "Pass Muskegon (possible fuel stop at 40nm) and Pentwater en route. Arrive Ludington by mid-afternoon."
  },
  {
    day: 4, from: "Ludington, MI", to: "Leland, MI", distanceNm: 70, locks: 0,
    leg: "lake-michigan", overnight: "Leland (Fishtown) — limited slips, call ahead",
    highlights: ["Sleeping Bear Dunes National Lakeshore scenery along this stretch", "Leland Fishtown: historic net sheds and smokehouses, Carlson's Fish Market"],
    warnings: ["Manitou Passage can have confused seas when wind opposes lake swell — check forecast carefully", "If Manitou Passage is rough, divert to Frankfort or Manistee and recombine next day"],
    notes: "Scenic run through the Manitou Passage. North and South Manitou Islands visible. Leland is charming but small; anchor off if marina full."
  },
  {
    day: 5, from: "Leland, MI", to: "Mackinac Island, MI", distanceNm: 80, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Mackinac Bridge: 5-mile suspension bridge at the Straits — a dramatic gateway", "First major milestone: top of Lake Michigan complete"],
    warnings: ["Depart pre-dawn — long run, and Straits currents can be strong", "Mackinac Bridge has 199ft clearance at center span — no issue, but impressive"],
    notes: "Pre-dawn departure recommended. Straits of Mackinac can have 2–3kt currents. Arrive Mackinac Island by evening."
  },
  {
    day: 6, from: "Mackinac Island", to: "Mackinac Island", distanceNm: 0, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Car-free island with Victorian charm", "Fort Mackinac, Arch Rock, bike the perimeter road", "Famous Mackinac Island fudge"],
    warnings: ["Grand Hotel: jacket required after 6pm for men if dining there", "Re-provision groceries and top up ALL fuel — limited options in the North Channel"],
    notes: "Rest day and weather buffer. Stock up thoroughly here — the North Channel is remote. Confirm passports for all crew. Check CBSA check-in procedure."
  },

  // ---- NORTH CHANNEL / MANITOULIN ----
  {
    day: 7, from: "Mackinac Island, MI", to: "Drummond Island, MI", distanceNm: 38, locks: 0,
    leg: "north-channel", overnight: "Drummond Island Yacht Haven",
    highlights: ["Les Cheneaux Islands archipelago — a taste of what's ahead", "Drummond Island: last US stop before Canadian waters"],
    warnings: ["Passports required for all crew — CBSA check-in required upon first Canadian landfall", "Check Canadian cell data roaming before departure"],
    notes: "Short hop east through the scenic Les Cheneaux Islands. Drummond Island Yacht Haven has fuel, good docks, and a CBSA phone. Confirm check-in protocol before crossing."
  },
  {
    day: 8, from: "Drummond Island, MI", to: "Meldrum Bay, ON", distanceNm: 35, locks: 0,
    leg: "north-channel", overnight: "Meldrum Bay Marina",
    highlights: ["First Canadian landfall", "West end of Manitoulin Island — rugged, remote, spectacular", "North Channel proper begins: pink granite, clear water, pine shoreline"],
    warnings: ["Phone CBSA immediately on arrival at Meldrum Bay — it is a designated Canadian port of entry", "Meldrum Bay has limited services: fuel and basics only. Gore Bay is the next proper provisioning stop."],
    notes: "Cross into Canada. Meldrum Bay is peaceful and unhurried — good fishing and a genuine taste of the North Channel character. Phone CBSA, get your clearance number, and enjoy the quiet."
  },
  {
    day: 9, from: "Meldrum Bay, ON", to: "Gore Bay, ON", distanceNm: 35, locks: 0,
    leg: "north-channel", overnight: "Gore Bay Marina",
    highlights: ["Gore Bay town — grocery, restaurants, best services on Manitoulin's north shore", "Cliffs and forested shoreline of the North Channel in full form"],
    warnings: ["Phone ahead for a slip in peak summer — Gore Bay fills fast on weekends"],
    notes: "Easy day along Manitoulin's north shore. Gore Bay is the best provisioning stop on the island — top off groceries, fuel, and water. Walk the town."
  },
  {
    day: 10, from: "Gore Bay, ON", to: "Little Current, ON", distanceNm: 37, locks: 0,
    leg: "north-channel", overnight: "Spider Bay Marina or Anchor Inn dock, Little Current",
    highlights: ["Kagawong: Bridal Veil Falls — 20-min walk from dock, worth the stop", "Little Current swing bridge — opens on the hour, on the hour, and not a moment sooner", "Best-provisioned town in the North Channel: grocery, LCBO, fuel, hardware"],
    warnings: ["Little Current bridge opens ONLY on the hour — do not arrive at the bridge mid-hour expecting it to open", "Spider Bay fills in summer — call ahead"],
    notes: "The hub of the North Channel. The swing bridge at Little Current opens on the hour — arrive with a few minutes to spare and wait with the engine in neutral. Stock up here: last well-equipped stop until Kincardine."
  },
  {
    day: 11, from: "Little Current, ON", to: "Baie Fine / The Pool, or Killarney, ON", distanceNm: 42, locks: 0,
    leg: "north-channel", overnight: "Anchor in Baie Fine 'The Pool', or slip at Killarney Municipal Marina",
    highlights: ["Baie Fine: a 10-mile fjord ending in 'The Pool' — pink granite walls, gin-clear water, absolute silence", "Benjamin Islands (detour south): legendary anchorage on bare pink granite islands", "Killarney: charming historic fishing village, Herbert's fish & chips"],
    warnings: ["Baie Fine entrance bar is shallow at low water — favor the north side and go slow", "If anchoring in The Pool, arrive before 5pm in peak summer for a spot", "Carry full water reserves through here — potable water is scarce until Kincardine; top off all tanks and jugs at Little Current"],
    notes: "The crown jewel of the North Channel. If you anchor anywhere on this entire voyage, The Pool in Baie Fine is it — granite walls 200 feet above, the water runs 50 feet clear to the bottom. Killarney (10nm further) has fuel and a marina if you prefer a dock. Advisory: a second night at anchor here is the best schedule splurge on the trip — the buffer days at Mackinac and NYC give you the slack to take it if the weather is kind."
  },
  {
    day: 12, from: "Killarney, ON", to: "Tobermory, ON", distanceNm: 48, locks: 0,
    leg: "north-channel", overnight: "Big Tub Harbour, Tobermory",
    highlights: ["Georgian Bay open-water crossing — most exposed day since Lake Michigan", "Tobermory: Fathom Five National Marine Park, crystal-clear shipwrecks visible from the surface", "Flowerpot Island ferry trip if you have an afternoon"],
    warnings: ["Georgian Bay crossing can be rough with westerly or northwesterly swell — check forecast carefully before departing Killarney", "Depart early — the bay is unforgiving if afternoon wind builds"],
    notes: "Cross northern Georgian Bay to Tobermory at the tip of the Bruce Peninsula. Check the forecast the night before and depart at dawn. Fathom Five has some of the most photographed freshwater wrecks in the world. Big Tub Harbour is well-protected and stunning."
  },
  {
    day: 13, from: "Tobermory, ON", to: "Kincardine, ON", distanceNm: 65, locks: 0,
    leg: "lake-huron", overnight: "Kincardine Marina",
    highlights: ["Scottish heritage town — famous Saturday evening bagpiper ceremony at sunset", "Wind farm coast along Ontario's Lake Huron shore", "Good restaurant options and a genuine local character"],
    warnings: ["Long day — depart Tobermory early", "Ontario's Lake Huron shore has fewer emergency harbors than Michigan's side — watch the forecast"],
    notes: "Head south down Ontario's Lake Huron coast. Kincardine is welcoming with a solid marina. If you arrive Saturday, the bagpiper ceremony at the lighthouse at sunset is not to be missed."
  },
  {
    day: 14, from: "Kincardine, ON", to: "Sarnia, ON / Port Huron, MI", distanceNm: 85, locks: 0,
    leg: "lake-huron", overnight: "Sarnia Bay Marina (Canada) or Port Huron area marina (US)",
    highlights: ["Blue Water Bridge twin spans mark the St. Clair River entrance", "Re-entering US waters after Ontario's finest"],
    warnings: ["CRITICAL: Contact US Customs and Border Protection immediately upon re-entering US waters — Port Huron is a formal entry point. Call 1-800-973-2867 or use CBP videophone at marina.", "Longest open-water day of the trip (85 nm) on an exposed lee shore — pre-dawn departure from Kincardine is not optional", "Plan staged shelters in case the forecast sours: Bayfield or Grand Bend (ON side, ~40 nm) or Harbor Beach (MI side, ~55 nm)"],
    notes: "Long push south. Re-clear US Customs at Port Huron. Once cleared, the St. Clair River current will carry you south toward Detroit. Fuel up before the river transit."
  },
  {
    day: 15, from: "Port Huron, MI", to: "Detroit, MI", distanceNm: 68, locks: 0,
    leg: "st-clair", overnight: "Detroit City Marina or Wyandotte area",
    highlights: ["St. Clair River 2–3 knot current carries you south at a satisfying pace", "1,000-foot lake freighters sharing the same narrow channel", "Detroit Riverwalk and skyline"],
    warnings: ["Heavy commercial traffic on St. Clair River — monitor VHF 13 continuously, give freighters the whole channel", "Lake St. Clair is shallow outside the marked channel — stay in the buoyed lane"],
    notes: "The St. Clair current is free speed — enjoy it. Across Lake St. Clair (follow the channel), then the Detroit River. Fuel and rest in Detroit."
  },

  // ---- LAKE ERIE ----
  {
    day: 16, from: "Detroit, MI", to: "Put-in-Bay, OH", distanceNm: 55, locks: 0,
    leg: "lake-erie", overnight: "South Bass Island mooring or dock",
    highlights: ["Perry's Victory & International Peace Memorial (352ft) — take the elevator up for views", "Golf cart rentals for island tour", "Lively boating scene and live music"],
    warnings: ["Lake Erie is the shallowest Great Lake — moderate winds create short, steep waves quickly", "Check forecast carefully; if Erie is kicking up, wait it out in Detroit"],
    notes: "Enter Lake Erie via Detroit River. Arrive Put-in-Bay by early afternoon to secure a mooring."
  },
  {
    day: 17, from: "Put-in-Bay, OH", to: "Cleveland, OH", distanceNm: 70, locks: 0,
    leg: "lake-erie", overnight: "Edgewater Marina or North Coast Harbor",
    highlights: ["Rock & Roll Hall of Fame — 10min walk from North Coast Harbor", "Great Lakes Science Center adjacent"],
    warnings: ["Open lake run; watch afternoon weather"],
    notes: "Arrive Cleveland by evening. Good city stop for reprovisioning."
  },
  {
    day: 18, from: "Cleveland, OH", to: "Erie, PA", distanceNm: 80, locks: 0,
    leg: "lake-erie", overnight: "Presque Isle State Park Marina",
    highlights: ["Presque Isle State Park: sandy beaches and calm bay", "U.S. Brig Niagara replica at Erie Maritime Museum"],
    warnings: ["Another long day — early departure", "Bail-out harbors along the south shore: Fairport Harbor (~20 nm) or Ashtabula (~45 nm)"],
    notes: "Presque Isle Bay is well-protected. Last fuel before Buffalo."
  },
  {
    day: 19, from: "Erie, PA", to: "Buffalo/Tonawanda, NY", distanceNm: 70, locks: 1,
    leg: "lake-erie", overnight: "Smith Boys or Wardell's Marina, Tonawanda",
    highlights: ["Black Rock Lock: hail VHF 13, bypasses Niagara River current", "Buffalo Canalside: USS Little Rock, waterfront dining", "Niagara Falls 20min by Uber from Tonawanda"],
    warnings: ["CRITICAL: Call Wardell's or Smith Boys NOW to schedule crane for mast-unstep tomorrow", "Buffalo/Tonawanda is the last chance to source major parts until NYC", "Bail-out harbor if eastern Erie turns: Dunkirk, NY (~35 nm) before committing to the Buffalo approach"],
    notes: "Final Great Lakes leg. Arrive by late afternoon. Begin mast-unstep logistics. Stock up at big-box stores (West Marine is here)."
  },
  {
    day: 20, from: "Tonawanda (mast prep)", to: "Tonawanda", distanceNm: 0, locks: 0,
    leg: "erie-canal", overnight: "Tonawanda boatyard",
    highlights: ["Mast down — major transition from Great Lakes sailing to canal mode"],
    warnings: ["Verify air draft meets the 14 ft 6 in (≈4.4 m) design target after unstep — measure to the top of every antenna, GPS puck, and wind transducer, not just the mast", "Secure all deck hardware that could snag under low bridges", "Mast must be well-padded and tied — it will overhang bow or stern"],
    notes: "Unstep and cradle mast. Rig extra fenders (8+ needed for locks — both sides). Set up dedicated lock lines (2× 50ft). Fill water tank. Grocery run."
  },

  // ---- ERIE CANAL ----
  {
    day: 21, from: "Tonawanda, NY", to: "Medina or Brockport, NY", distanceNm: 0, distanceMi: 40, locks: 2,
    leg: "erie-canal", overnight: "Canal village wall (Medina or Brockport)",
    highlights: ["Locks E-35 and E-34 at Lockport: lift ~49ft combined — 'Flight of Five' history", "Medina's sandstone buildings and railroad museum", "Brockport canal visitor center wall"],
    warnings: ["First locks of the trip — go slow, fenders on both sides, crew fore and aft on lines", "Speed limit 10mph on canal"],
    notes: "After Lockport, no locks for ~60 miles. Pass through lift-bridge towns (operators see you and open). ~30–40 statute miles today."
  },
  {
    day: 22, from: "Medina/Brockport, NY", to: "Pittsford, NY", distanceNm: 0, distanceMi: 60, locks: 5,
    leg: "erie-canal", overnight: "Pittsford canal park dock (power/water)",
    highlights: ["Fairport: famous red liftbridge, Moonlight Creamery ice cream, great lunch stop", "Genesee River aqueduct crossing"],
    warnings: ["5 locks today (E-33 to E-29) — get an early start", "If locks are slow, Newark (before E-28) has a free dock as fallback"],
    notes: "Locks E-33/32 around Rochester (~25ft drop each). Locks E-31, E-30, E-29 toward Palmyra. ~60 statute miles."
  },
  {
    day: 23, from: "Pittsford/Newark, NY", to: "Brewerton, NY", distanceNm: 0, distanceMi: 68, locks: 6,
    leg: "erie-canal", overnight: "Ess-Kay Yards / Winter Harbor Marina, Brewerton",
    highlights: ["Montezuma National Wildlife Refuge: herons, eagles, turtles", "Seneca-Cayuga Canal junction at Montezuma", "Brewerton: full-service marinas at the calm west end of Oneida Lake"],
    warnings: ["Lock E-24 at Baldwinsville: arrive before 5pm to ensure passage", "Stage at Brewerton for the night — do NOT push across Oneida Lake late in the day"],
    notes: "Run the lock-heavy stretch through Montezuma and Baldwinsville and stop on the west shore of Oneida Lake. Ess-Kay Yards has fuel, pump-out, and laundry. Cross the lake fresh tomorrow morning."
  },
  {
    day: 24, from: "Brewerton, NY", to: "Sylvan Beach, NY", distanceNm: 0, distanceMi: 20, locks: 0,
    leg: "erie-canal", overnight: "Sylvan Beach wall or marina slip",
    highlights: ["Oneida Lake crossing — 20 miles of open water, the only true open stretch on the canal", "Sylvan Beach: retro amusement park, sandy beach"],
    warnings: ["Oneida Lake can be choppy — cross in the morning calm with a good forecast only", "No locks today: a deliberate short day so the lake is crossed fresh and early"],
    notes: "Cross Oneida Lake first thing while the water is flat. A short, easy day by design — arrive Sylvan Beach with the afternoon free."
  },
  {
    day: 25, from: "Sylvan Beach, NY", to: "Ilion or Little Falls, NY", distanceNm: 0, distanceMi: 55, locks: 4,
    leg: "erie-canal", overnight: "Ilion Municipal Marina or Little Falls Rotary Park dock",
    highlights: ["Now on the canalized Mohawk River — scenery improves", "Ilion Marina: full services, laundry, grocery 5min away", "Little Falls: limestone cliff scenery, Moss Island glacial potholes"],
    warnings: ["Ilion is the best pump-out/fuel point before the final push to the Hudson", "Little Falls: Lock E-17 just past town is the deepest single lock (40.5ft) — tackle it next morning"],
    notes: "Locks E-22, 21, 20 through Herkimer area. Stop at Ilion or push to Little Falls."
  },
  {
    day: 26, from: "Ilion/Little Falls, NY", to: "Amsterdam, NY", distanceNm: 0, distanceMi: 55, locks: 5,
    leg: "erie-canal", overnight: "Amsterdam Riverlink Park dock (free wall, power, water)",
    highlights: ["Lock E-17 at Little Falls: 40.5ft drop — highest single lock on the Erie Canal", "Canajoharie: Arkell Museum and the 'Canajoharie Boiling Pot' gorge", "Amsterdam's pedestrian bridge and revitalized Mohawk waterfront"],
    warnings: ["Tackle Lock E-17 early while you're fresh — it's dramatic but well-operated", "Stage at Amsterdam so the Waterford Flight can be run first thing tomorrow, not against the afternoon clock"],
    notes: "Through Little Falls, Canajoharie, and Fonda down the Mohawk Valley. Stop at Amsterdam's free Riverlink Park wall — this sets up an unhurried, dawn run at the Waterford Flight."
  },
  {
    day: 27, from: "Amsterdam, NY", to: "Waterford, NY", distanceNm: 0, distanceMi: 40, locks: 4,
    leg: "erie-canal", overnight: "Waterford Visitor Center Dock (free 48hr, power, water)",
    highlights: ["Waterford Flight (E-6 to E-2): 169ft descent in 1.5 miles — one of the great feats of 19th-century engineering", "MILESTONE: Great Lakes to Atlantic connected!"],
    warnings: ["Run the Waterford Flight in the morning with the whole day in hand — once you start E-6, you go through all five without stopping", "Locks E-13 through E-7 come in succession ahead of the Flight — an early start clears them with margin"],
    notes: "A short morning down the lower Mohawk into the Waterford Flight. Staging at Amsterdam last night means you reach Lock E-6 with hours to spare instead of racing a 2:30pm cutoff. Celebrate at the bottom."
  },

  // ---- HUDSON RIVER ----
  {
    day: 28, from: "Waterford, NY", to: "Catskill, NY", distanceNm: 40, locks: 1,
    leg: "hudson", overnight: "Hop-O-Nose Marina, Catskill Creek",
    highlights: ["Troy Federal Lock: last lock, 14ft drop, free, hail VHF 13", "Now in tidal Hudson — current changes with tide", "MAST RE-STEP at Hop-O-Nose Marina, Catskill Creek (call ahead for crane)"],
    warnings: ["Tidal timing: high tide at Troy is ~5–6hrs AFTER high tide at NYC Battery — check Troy specifically on a tide app", "Hop-O-Nose is 1nm up Catskill Creek from the Hudson — easy approach in calm water"],
    notes: "Through Albany (mile 145). Arrive Catskill (mile 112) by early-to-mid afternoon to complete mast-step before dark. Allow 2–3hrs for re-rigging. Reconnect all electronics after stepping."
  },
  {
    day: 29, from: "Catskill, NY", to: "Poughkeepsie or Newburgh, NY", distanceNm: 60, locks: 0,
    leg: "hudson", overnight: "Shadows Marina or Poughkeepsie YC; or anchor at Newburgh",
    highlights: ["Hudson-Athens Lighthouse", "Kingston/Rondout Creek: Hudson River Maritime Museum (optional stop)", "Catskill Mountains backdrop to the west"],
    warnings: ["Ride the ebb tide south — time departure for 1–2hrs after high water at your location"],
    notes: "Mostly sailing now! SW breezes common in afternoon. Ride the ebb, motorsail if wind is light."
  },
  {
    day: 30, from: "Poughkeepsie, NY", to: "New York City", distanceNm: 75, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina, Jersey City",
    highlights: ["Bannerman's Castle ruins on Pollepel Island, just north of West Point", "West Point Military Academy perched on the bluffs", "Statue of Liberty and Ellis Island on approach to NY Harbor", "Time the final approach for golden hour — the Manhattan skyline lit by the low evening sun is the landfall of the whole voyage"],
    warnings: ["Time the ebb through the Hudson Highlands — can run 2kt", "High ferry and commercial traffic near NYC; stay alert last 20nm", "Reserve Liberty Landing in advance — NYC slips fill fast"],
    notes: "Arrive NYC mid-to-late afternoon. Day 31 is a layover: refuel, West Marine run, provision, enjoy the city."
  },
  {
    day: 31, from: "New York City", to: "New York City", distanceNm: 0, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina",
    highlights: ["Rest, reprovisioning, city sightseeing"],
    warnings: ["Check the extended Long Island Sound forecast — especially the Hell Gate slack-water window — before committing to a departure day"],
    notes: "Buffer day. Full fuel and water. Audit all gear before the Long Island Sound leg up to Old Saybrook."
  },

  // ---- LONG ISLAND SOUND → OLD SAYBROOK ----
  {
    day: 32, from: "New York Harbor", to: "Oyster Bay or Cold Spring Harbor, NY", distanceNm: 28, locks: 0,
    leg: "sound-saybrook", overnight: "Oyster Bay or Cold Spring Harbor marina",
    highlights: ["East River transit through Manhattan — dramatic urban sailing", "Long Island Sound opens up — excellent sailing begins", "SW sea breezes = beam reaching east"],
    warnings: ["CRITICAL: Time the East River / Hell Gate carefully. Currents reach 4–5 knots at Hell Gate. Aim to pass Hell Gate at or just before slack water on a favorable ebb.", "Do NOT attempt Hell Gate on a strong opposing current"],
    notes: "Short day to get onto LIS. Once through Hell Gate, the sailing is typically glorious — consistent SW sea breeze for a beam reach east."
  },
  {
    day: 33, from: "Oyster Bay, NY", to: "Port Jefferson, NY", distanceNm: 38, locks: 0,
    leg: "sound-saybrook", overnight: "Port Jefferson Harbor",
    highlights: ["Classic Long Island Sound beam reach", "Port Jefferson: beautiful harbor, ferry terminal, great waterfront restaurants"],
    warnings: ["Summer SW sea breezes fill in by mid-morning — get out early before traffic"],
    notes: "Beautiful sailing day. Port Jefferson has full services."
  },
  {
    day: 34, from: "Port Jefferson, NY", to: "Greenport, NY", distanceNm: 40, locks: 0,
    leg: "sound-saybrook", overnight: "Mitchell Park Marina, Greenport",
    highlights: ["North Fork wine country — some of the best in the Northeast", "Shelter Island accessible by short ferry from Greenport", "Eastern LIS: more open water, great sailing"],
    warnings: ["Plum Gut (between Plum Island and Orient Point) has strong tidal currents — time your approach"],
    notes: "Another excellent sailing day. Greenport is a great overnight — walk to wine tasting or ferry to Shelter Island."
  },
  {
    day: 35, from: "Greenport, NY", to: "Old Saybrook, CT", distanceNm: 50, locks: 0,
    leg: "sound-saybrook", overnight: "Saybrook Point Marina",
    highlights: ["Plum Gut to Race Rock — exhilarating tidal current if timed right", "Mouth of the Connecticut River — a beautiful finish", "Essex (5nm upriver): one of the prettiest New England towns, Essex Steam Train connects to river boat tours", "Saybrook Point lighthouse"],
    warnings: ["Connecticut River entrance can shoal; follow the marked channel", "Race Rock and The Race: tidal currents are fierce — cross near slack"],
    notes: "ARRIVAL. A direct run across the Sound's eastern end. Time Race Rock near slack water, then follow the Connecticut River channel in. Arrive early and spend the afternoon on the river. The Connecticut River Valley is the perfect place to end a voyage."
  },
];
