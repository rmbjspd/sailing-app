import type { ItineraryDay } from "../types";

export const itinerary: ItineraryDay[] = [
  // ---- LAKE MICHIGAN ----
  {
    day: 1, from: "Winthrop Harbor, IL", to: "Grand Haven, MI", distanceNm: 78, locks: 0,
    leg: "lake-michigan", overnight: "Grand Haven Municipal Marina",
    highlights: ["Open-water crossing of the southern basin of Lake Michigan, out of sight of land for the middle of the day", "Grand Haven waterfront music fountain show in the evenings"],
    warnings: ["About 13–14 hours at 5.5–6 kt: leave North Point Marina around 04:45 CDT and expect to arrive 18:45–19:45 EDT — there is no 3pm arrival on a 78 nm day", "Go/no-go at 04:00: NWS open-lake forecast, NDBC buoy 45007 (South Michigan) and any Special Marine Warnings. If it is marginal, wait a day at North Point Marina", "Roughly 5–6 hours in the middle with no harbor in reach (Holland ~35 nm, South Haven ~39 nm, Saugatuck ~35 nm; Racine only helps for the first 2–3 hours). Set a point of no return about 20 nm out, leave a float plan, and wear PFDs and tethers from the dock", "Clocks go from Central to Eastern time on the crossing — Grand Haven is an hour ahead of Winthrop Harbor", "Lake water is still in the 50s to low 60s °F in mid-June: fog over cold water and late-day thunderstorms are the hazards"],
    notes: "Depart North Point Marina in the dark so you arrive in daylight, and set a course ENE across the lake to Grand Haven, skipping St. Joseph. Full tank on departure. Refuel and pump out on arrival."
  },
  {
    day: 2, from: "Grand Haven, MI", to: "Ludington, MI", distanceNm: 80, locks: 0,
    leg: "lake-michigan", overnight: "Ludington Municipal Marina",
    highlights: ["Sleeping Bear Dunes visible from offshore", "Ludington is a major refueling and resupply point"],
    warnings: ["Big Sable Point: afternoon westerlies can generate steep, short chop — round the point before noon if possible", "Pentwater (~40nm) is a good fuel and weather check stop if conditions look dicey; the 130 L tank easily covers this day, but topping off is good practice"],
    notes: "Pass Muskegon (possible fuel stop at 40nm) and Pentwater en route. Arrive Ludington by mid-afternoon."
  },
  {
    day: 3, from: "Ludington, MI", to: "Leland, MI", distanceNm: 70, locks: 0,
    leg: "lake-michigan", overnight: "Leland (Fishtown) — limited slips, call ahead",
    highlights: ["Sleeping Bear Dunes National Lakeshore scenery along this stretch", "Leland Fishtown: historic net sheds and smokehouses, Carlson's Fish Market"],
    warnings: ["Manitou Passage can have confused seas when wind opposes lake swell — check forecast carefully", "If Manitou Passage is rough, divert to Frankfort or Manistee and recombine next day"],
    notes: "Scenic run through the Manitou Passage. North and South Manitou Islands visible. Leland is charming but small; anchor off if marina full."
  },
  {
    day: 4, from: "Leland, MI", to: "Mackinac Island, MI", distanceNm: 80, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Mackinac Bridge: 5-mile suspension bridge at the Straits — a dramatic gateway", "First major milestone: top of Lake Michigan complete"],
    warnings: ["Depart pre-dawn — long run, and Straits currents can be strong", "Mackinac Bridge has 199ft clearance at center span — no issue, but impressive"],
    notes: "Pre-dawn departure recommended. Straits of Mackinac can have 2–3kt currents. Arrive Mackinac Island by evening."
  },
  {
    day: 5, from: "Mackinac Island", to: "Mackinac Island", distanceNm: 0, locks: 0,
    leg: "lake-michigan", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Car-free island with Victorian charm", "Fort Mackinac, Arch Rock, bike the perimeter road", "Famous Mackinac Island fudge"],
    warnings: ["Grand Hotel: jacket required after 6pm for men if dining there", "Re-provision groceries and top up ALL fuel — limited options in the North Channel"],
    notes: "Rest day and weather buffer. Stock up thoroughly here — the North Channel is remote. Confirm passports for all crew. Check CBSA check-in procedure."
  },

  // ---- NORTH CHANNEL / MANITOULIN ----
  {
    day: 6, from: "Mackinac Island, MI", to: "Drummond Island, MI", distanceNm: 38, locks: 0,
    leg: "north-channel", overnight: "Drummond Island Yacht Haven",
    highlights: ["Les Cheneaux Islands archipelago, passed to the south in open water (the inside channels are an optional scenic detour)", "Drummond Island: last US stop before Canadian waters"],
    warnings: ["Passports required for all crew — CBSA check-in required upon first Canadian landfall", "Check Canadian cell data roaming before departure"],
    notes: "Short hop east past the Les Cheneaux Islands — the planned track runs about 4 nm south of them in open water, so take the inside channels only if you want the scenery. Drummond Island Yacht Haven has fuel, good docks, and a CBSA phone. Confirm check-in protocol before crossing."
  },
  {
    day: 7, from: "Drummond Island, MI", to: "Meldrum Bay, ON", distanceNm: 35, locks: 0,
    leg: "north-channel", overnight: "Meldrum Bay Marina",
    highlights: ["First Canadian landfall", "West end of Manitoulin Island — rugged, remote, spectacular", "North Channel proper begins: pink granite, clear water, pine shoreline"],
    warnings: ["Confirm before you go that Meldrum Bay is a CBSA reporting site (the list of designated ports is unverified; Tobermory is the confirmed one nearby) — phone CBSA on 1-888-226-7277, report on crossing the boundary, and do not anchor before reporting", "Phone CBSA immediately on arrival at Meldrum Bay — it is a designated Canadian port of entry", "Meldrum Bay has limited services: fuel and basics only. Gore Bay is the next proper provisioning stop."],
    notes: "Cross into Canada. Meldrum Bay is peaceful and unhurried — good fishing and a genuine taste of the North Channel character. Phone CBSA, get your clearance number, and enjoy the quiet."
  },
  {
    day: 8, from: "Meldrum Bay, ON", to: "Gore Bay, ON", distanceNm: 35, locks: 0,
    leg: "north-channel", overnight: "Gore Bay Marina",
    highlights: ["Gore Bay town — grocery, restaurants, best services on Manitoulin's north shore", "Cliffs and forested shoreline of the North Channel in full form"],
    warnings: ["Phone ahead for a slip in peak summer — Gore Bay fills fast on weekends"],
    notes: "Easy day along Manitoulin's north shore. Gore Bay is the best provisioning stop on the island — top off groceries, fuel, and water. Walk the town."
  },
  {
    day: 9, from: "Gore Bay, ON", to: "Little Current, ON", distanceNm: 37, locks: 0,
    leg: "north-channel", overnight: "Spider Bay Marina or Anchor Inn dock, Little Current",
    highlights: ["Kagawong: Bridal Veil Falls — 20-min walk from dock, worth the stop", "Little Current swing bridge — opens on the hour, on the hour, and not a moment sooner", "Best-provisioned town in the North Channel: grocery, LCBO, fuel, hardware"],
    warnings: ["Confirm the Little Current swing-bridge schedule and status with the Ministry of Transportation before you go — it reopened but stayed closed to marine traffic after a 2022 closure, and its current hours are unverified", "Little Current bridge opens ONLY on the hour — do not arrive at the bridge mid-hour expecting it to open", "Spider Bay fills in summer — call ahead"],
    notes: "The hub of the North Channel. The swing bridge at Little Current opens on the hour — arrive with a few minutes to spare and wait with the engine in neutral. Stock up here: last well-equipped stop until Kincardine."
  },
  {
    day: 10, from: "Little Current, ON", to: "Baie Fine / The Pool, or Killarney, ON", distanceNm: 22, locks: 0,
    leg: "north-channel", overnight: "Anchor in Baie Fine 'The Pool', or slip at Killarney Municipal Marina",
    highlights: ["Baie Fine: a 10-mile fjord ending in 'The Pool' — pink granite walls, gin-clear water, absolute silence", "Benjamin Islands (detour south): legendary anchorage on bare pink granite islands", "Killarney: charming historic fishing village, Herbert's fish & chips"],
    warnings: ["Baie Fine entrance bar is shallow at low water — favor the north side and go slow", "If anchoring in The Pool, arrive before 5pm in peak summer for a spot", "Carry full water reserves through here — potable water is scarce until Kincardine; top off all tanks and jugs at Little Current"],
    notes: "The crown jewel of the North Channel. If you anchor anywhere on this entire voyage, The Pool in Baie Fine is it — granite walls 200 feet above, the water runs 50 feet clear to the bottom. Killarney (roughly 22 nm from Little Current by the planned track, a little further than The Pool) has fuel and a marina if you prefer a dock. Advisory: a second night at anchor here is the best schedule splurge on the trip — the buffer days at Mackinac and NYC give you the slack to take it if the weather is kind."
  },
  {
    day: 11, from: "Killarney, ON", to: "Tobermory, ON", distanceNm: 48, locks: 0,
    leg: "north-channel", overnight: "Big Tub Harbour, Tobermory",
    highlights: ["Georgian Bay open-water crossing — most exposed day since Lake Michigan", "Tobermory: Fathom Five National Marine Park, crystal-clear shipwrecks visible from the surface", "Flowerpot Island ferry trip if you have an afternoon"],
    warnings: ["Georgian Bay crossing can be rough with westerly or northwesterly swell — check forecast carefully before departing Killarney", "Depart early — the bay is unforgiving if afternoon wind builds"],
    notes: "Cross northern Georgian Bay to Tobermory at the tip of the Bruce Peninsula. Check the forecast the night before and depart at dawn. Fathom Five has some of the most photographed freshwater wrecks in the world. Big Tub Harbour is well-protected and stunning."
  },
  {
    day: 12, from: "Tobermory, ON", to: "Kincardine, ON", distanceNm: 65, locks: 0,
    leg: "lake-huron", overnight: "Kincardine Marina",
    highlights: ["Scottish heritage town — the Phantom Piper plays at the lighthouse at dusk in July and August (not Saturdays); you arrive June 30, probably a night before the season opens", "Wind farm coast along Ontario's Lake Huron shore", "Good restaurant options and a genuine local character"],
    warnings: ["Long day — depart Tobermory early", "Ontario's Lake Huron shore has fewer emergency harbors than Michigan's side — watch the forecast"],
    notes: "Head south down Ontario's Lake Huron coast. Kincardine is welcoming with a solid marina. The Phantom Piper at the lighthouse plays at dusk every evening except Saturdays, but the season is July 1 to August 31 — Day 12 is June 30, so check the Municipality of Kincardine's 2027 schedule, and if you are a day late you will catch it."
  },
  {
    day: 13, from: "Kincardine, ON", to: "Port Huron, MI", distanceNm: 85, locks: 0,
    leg: "lake-huron", overnight: "Port Huron area marina (US side)",
    highlights: ["Blue Water Bridge twin spans mark the St. Clair River entrance", "Re-entering US waters after Ontario's finest"],
    warnings: ["CRITICAL: Contact US Customs and Border Protection immediately upon re-entering US waters — Port Huron is a formal entry point. Call 1-800-973-2867 or use CBP videophone at marina.", "Longest open-water day of the trip (85 nm) on an exposed lee shore — pre-dawn departure from Kincardine is not optional", "Plan staged shelters in case the forecast sours: Bayfield or Grand Bend (ON side, ~40 nm) or Harbor Beach (MI side, ~55 nm)"],
    notes: "Long push south, ending on the US side at Port Huron rather than Sarnia. Report to US CBP on arrival. Once cleared, the St. Clair River current will carry you south toward Detroit. Fuel up before the river transit."
  },
  {
    day: 14, from: "Port Huron, MI", to: "Detroit, MI", distanceNm: 56, locks: 0,
    leg: "st-clair", overnight: "Detroit City Marina or Wyandotte area",
    highlights: ["St. Clair River 2–3 knot current carries you south at a satisfying pace", "1,000-foot lake freighters sharing the same narrow channel", "Detroit Riverwalk and skyline"],
    warnings: ["Day 14 is Friday, July 2 — the start of the holiday weekend, so expect heavy recreational traffic on the St. Clair River and Lake St. Clair as well as the freighters", "Heavy commercial traffic on St. Clair River — monitor VHF 13 continuously, give freighters the whole channel", "Lake St. Clair is shallow outside the marked channel — stay in the buoyed lane"],
    notes: "The St. Clair current is free speed — enjoy it. Across Lake St. Clair (follow the channel), then the Detroit River. Fuel and rest in Detroit."
  },

  // ---- LAKE ERIE ----
  {
    day: 15, from: "Detroit, MI", to: "Put-in-Bay, OH", distanceNm: 47, locks: 0,
    leg: "lake-erie", overnight: "South Bass Island mooring or dock",
    highlights: ["Perry's Victory & International Peace Memorial (352ft) — take the elevator up for views", "Golf cart rentals for island tour", "Lively boating scene and live music"],
    warnings: ["Lake Erie is the shallowest Great Lake — moderate winds create short, steep waves quickly", "Check forecast carefully; if Erie is kicking up, wait it out in Detroit", "This day is Saturday, July 3 (2027), the start of the July 4 holiday weekend: Put-in-Bay will be at its busiest of the year. Reserve a mooring or dock months ahead, and line up a fallback — Port Clinton, Middle Bass or Catawba"],
    notes: "Enter Lake Erie via Detroit River. Arrive Put-in-Bay by early afternoon to secure a mooring — on the holiday weekend, only if you have a reservation."
  },
  {
    day: 16, from: "Put-in-Bay, OH", to: "Cleveland, OH", distanceNm: 52, locks: 0,
    leg: "lake-erie", overnight: "Edgewater Marina or North Coast Harbor",
    highlights: ["Rock & Roll Hall of Fame — 10min walk from North Coast Harbor", "Great Lakes Science Center adjacent"],
    warnings: ["Open lake run; watch afternoon weather"],
    notes: "Arrive Cleveland by evening. Good city stop for reprovisioning."
  },
  {
    day: 17, from: "Cleveland, OH", to: "Erie, PA", distanceNm: 80, locks: 0,
    leg: "lake-erie", overnight: "Presque Isle State Park Marina",
    highlights: ["Presque Isle State Park: sandy beaches and calm bay", "U.S. Brig Niagara replica at Erie Maritime Museum"],
    warnings: ["Another long day — early departure", "Bail-out harbors along the south shore: Fairport Harbor (~20 nm) or Ashtabula (~45 nm)"],
    notes: "Presque Isle Bay is well-protected. Last fuel before Buffalo."
  },
  {
    day: 18, from: "Erie, PA", to: "Erie, PA", distanceNm: 0, locks: 0,
    leg: "lake-erie", overnight: "Presque Isle State Park Marina",
    highlights: ["Presque Isle State Park: sandy beaches and calm bay", "U.S. Brig Niagara replica at Erie Maritime Museum"],
    warnings: ["This is the voyage's mid-trip buffer: use it if weather or repairs have cost you a day. It protects the long Erie to Buffalo run and the Tonawanda crane booking behind it"],
    notes: "Weather and spare day, placed where a slip would otherwise cascade into the crane booking and the canal schedule. If you are on time, rest at Presque Isle Bay — it is well protected — and top up fuel, since this is the last fuel before Buffalo."
  },
  {
    day: 19, from: "Erie, PA", to: "Buffalo, NY", distanceNm: 70, locks: 0,
    leg: "lake-erie", overnight: "Erie Basin Marina, Buffalo",
    highlights: ["Buffalo Canalside: USS Little Rock, waterfront dining", "Buffalo is the jumping-off point for Black Rock Lock and the Niagara River tomorrow"],
    warnings: ["About 70 nm — 11–12 hours: leave at first light", "CRITICAL: Call Wardell's or Smith Boys NOW to schedule the crane for mast-unstep tomorrow", "Buffalo/Tonawanda is the last chance to source major parts until NYC", "Bail-out harbor if eastern Erie turns: Dunkirk, NY (~35 nm) before committing to the Buffalo approach"],
    notes: "Final Great Lakes leg. Arrive by late afternoon. Begin mast-unstep logistics. Stock up at big-box stores (West Marine is here). Stopping at Buffalo rather than running the extra 15 nm to Tonawanda turns an 83 nm day into a 70 nm one."
  },
  {
    day: 20, from: "Buffalo, NY", to: "Tonawanda, NY", distanceNm: 11, locks: 1,
    leg: "erie-canal", overnight: "Tonawanda boatyard",
    highlights: ["Black Rock Lock: hail VHF 13, steps around the Niagara River current", "Mast down — major transition from Great Lakes sailing to canal mode", "Kids can help pad and tie the mast, from a safe distance", "Niagara Falls is about 20 minutes away by Uber if the crane finishes early"],
    warnings: ["Verify air draft meets the 14 ft 6 in (≈4.4 m) design target after unstep — measure to the top of every antenna, GPS puck, and wind transducer, not just the mast", "Secure all deck hardware that could snag under low bridges", "Mast must be well-padded and tied — it will overhang bow or stern", "Keep the kids ashore or in the cabin during the crane lift", "Lock lockages have been paused before for high water — check Notices to Mariners"],
    notes: "A short run (about 11 nm) through Black Rock Lock in the morning, then unstep and cradle the mast. Rig extra fenders (8+ needed for locks — both sides). Set up dedicated lock lines (2× 50ft). Fill water tank. Grocery run."
  },

  // ---- ERIE CANAL ----
  {
    day: 21, from: "Tonawanda, NY", to: "Brockport, NY", distanceNm: 0, distanceMi: 58, locks: 2,
    leg: "erie-canal", overnight: "Brockport village docks (water and power; register at the Welcome Center)",
    highlights: ["Locks E-35 and E-34 at Lockport: lift ~49ft combined — the modern locks beside the 'Flight of Five' staircase", "Medina lunch stop: the Canal Basin and the Medina Railroad Museum (530 West Ave) — the best stop for the 5-year-old", "Brockport Welcome Center: showers, laundry, loaner bikes; lift-bridge watching"],
    warnings: ["First locks of the trip — kids in PFDs and seated in the cockpit centre, adults on the lines, fenders both sides. New York requires a child under 12 to wear a PFD underway on a boat this size", "About 9 hours with the locks: start at 8:00 when the locks open, or run to Lockport the afternoon before", "Brockport has train noise at the dock, and the posted fees conflict — call ahead"],
    notes: "After Lockport, no locks for ~60 miles. Pass through lift-bridge towns (operators see you and open). Lockport tours and the Erie Canal Discovery Center (24 Church St) are worth a walk if you overnighted there. Mileposts are estimates, plus or minus 3."
  },
  {
    day: 22, from: "Brockport, NY", to: "Newark, NY", distanceMi: 52, distanceNm: 0, locks: 4,
    leg: "erie-canal", overnight: "T. Spencer Knight Park / Port of Newark (free floating dock, power, water, showers)",
    highlights: ["Fairport lunch stop: the red liftbridge, canalside ice cream and the towpath", "Locks E-33 and E-32 (~25ft each) around Rochester and Pittsford, then E-30 and E-29", "Newark's floating dock is the easiest boarding for small kids on the whole canal"],
    warnings: ["About 9 hours with four locks — get an early start. If the day runs long, Fairport and Newark both have free walls", "Sam Patch tour-boat wake near Pittsford — slow down", "There is no Lock E-31 — the numbering skips it"],
    notes: "Moonlight Creamery in Fairport is unconfirmed — ask the dockmaster (VHF 13). Walk into Newark for supper; the Welcome Center is at 199 Van Buren St."
  },
  {
    day: 23, from: "Newark, NY", to: "Baldwinsville, NY", distanceMi: 55, distanceNm: 0, locks: 5,
    leg: "erie-canal", overnight: "Baldwinsville village docks (free dockage; about $5 for 30A power)",
    highlights: ["Locks E-28B, E-28A and E-27 at Newark and Lyons, then E-26 and E-25 — the kids can count them off", "The canal runs through the Montezuma marshes: herons, eagles, turtles from the boat", "Baldwinsville: restaurants and a craft brewery within walking distance"],
    warnings: ["About 9.5 hours — the longest day of the canal. Bug spray and shade for the marsh stretch", "Lyons walls are high; Clyde's dock holds only three boats — don't count on either as a fallback with small kids", "Lock E-24, tomorrow's first, is an extended-hours lock — don't rush it"],
    notes: "Lyons (peppermint capital) is a walk-around stop if you are early. The Montezuma refuge visitor center needs a car — watch the marsh from the boat instead."
  },
  {
    day: 24, from: "Baldwinsville, NY", to: "Sylvan Beach, NY", distanceMi: 42, distanceNm: 0, locks: 2,
    leg: "erie-canal", overnight: "Sylvan Beach canal wall (free; no power or water)",
    highlights: ["Locks E-24 and E-23 at Baldwinsville and Brewerton, then 20 miles of open Oneida Lake — the only open water on the canal", "Sylvan Beach: retro amusement park with kiddie rides, a carousel, an arcade, a beach and a pier", "Short enough for a beach afternoon"],
    warnings: ["Make the go/no-go at Brewerton before you enter the lake: if the westerly is over about 10 kt, stay at Ess-Kay Yards (fuel, pump-out, laundry) and cross fresh tomorrow", "Day 24 is a Tuesday: the park's published hours favour Thursday to Sunday, so it may be closed — call ahead; beach and arcade are the fallback", "Lifeguard coverage at the village beach is unconfirmed — kids in PFDs and an adult in the water with them. Watch for floating logs at the wall"],
    notes: "Cross after the 8:00 lock opening and be off the lake before the afternoon wind builds. Verona Beach State Park has a supervised beach, but its distance from the wall is unconfirmed."
  },
  {
    day: 25, from: "Sylvan Beach, NY", to: "Little Falls, NY", distanceMi: 51, distanceNm: 0, locks: 5,
    leg: "erie-canal", overnight: "Little Falls Canal Harbor / Rotary Park dock (power, water, showers)",
    highlights: ["Now on the canalized Mohawk River — the scenery improves", "Locks E-22 and E-21 at New London (the top of the climb), then E-20, E-19 and E-18 downhill", "Little Falls: limestone cliffs and Moss Island's glacial potholes (up to ~40 ft deep) — a short walk for an 8-year-old to remember"],
    warnings: ["About 9 hours with five locks — a long day for the 5-year-old; keep a quiet cabin hour after lunch", "Lock E-17, just past town, is the deepest single lock (40.5ft) — tackle it next morning, not at the end of a long day", "Rome's Bellamy Harbor Park docks are poor — skip unless you need a break"],
    notes: "Herkimer Diamond Mines (sluice mining for small kids, open daily in 2026) are the 8- and 10-year-old highlight, but need a car or taxi and a free afternoon — you have none, so treat them as a bonus if a day opens up. Ilion Marina (mile 89) is the best-equipped fallback."
  },
  {
    day: 26, from: "Little Falls, NY", to: "Amsterdam, NY", distanceMi: 44, distanceNm: 0, locks: 7,
    leg: "erie-canal", overnight: "Amsterdam Lock E-11 wall (free, power pedestals) or Riverlink Park (paid)",
    highlights: ["Lock E-17 at Little Falls: 40.5ft drop — highest single lock on the Erie Canal", "Fort Plain's Wiles Park playground and double Lock E-15 a short walk from the village; Canajoharie's Arkell Museum is ~200 yards from the wall", "Seven locks today: E-17, E-16, E-15, E-14, E-13, E-12, E-11 — a 'count the locks' game"],
    warnings: ["Tackle Lock E-17 early while you're fresh — PFDs on, kids in the cockpit, adults on the lines, and follow the lock tender exactly", "Do not swim at the Canajoharie 'Boiling Pot' — deep, and reportedly no-swimming", "The E-11 wall is rough on hulls, with trains and horns — good fenders. Riverlink Park charges per foot"],
    notes: "Stage at Amsterdam so the Waterford Flight starts the next morning with the whole day in hand."
  },
  {
    day: 27, from: "Amsterdam, NY", to: "Waterford, NY", distanceMi: 37, distanceNm: 0, locks: 9,
    leg: "erie-canal", overnight: "Waterford Visitor Center Dock (free 48hr, power, water, showers)",
    highlights: ["Waterford Flight (E-6 to E-2): 169ft descent in 1.5 miles — one of the great feats of 19th-century engineering, and the kids' favourite 'machine'", "MILESTONE: Great Lakes to Atlantic connected!", "Peebles Island State Park and the Waterford Visitor Center nearby; Cohoes's hands-on canal-lock exhibit is a short trip"],
    warnings: ["Nine locks in about 8.5 hours: leave at 8:00 sharp. Lock E-6, the top of the Flight, must be reached by 2:30–5pm at the latest — once you start E-6, you go through all five without stopping", "Locks E-10 through E-7 come in succession ahead of the Flight — an early start clears them with margin", "Mohawk Harbor (Schenectady, between Locks E-8 and E-7) is the bail-out marina if the day runs long — book it on Dockwa"],
    notes: "Down the lower Mohawk and into the Waterford Flight. Celebrate at the bottom. If the kids' leg ends here, plan the crew handover at Waterford: the next day is Troy and the Hudson."
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
    day: 29, from: "Catskill, NY", to: "Poughkeepsie or Newburgh, NY", distanceNm: 33, locks: 0,
    leg: "hudson", overnight: "Shadows Marina or Poughkeepsie YC; or anchor at Newburgh",
    highlights: ["Hudson-Athens Lighthouse", "Kingston/Rondout Creek: Hudson River Maritime Museum (optional stop)", "Catskill Mountains backdrop to the west"],
    warnings: ["Ride the ebb tide south. Look up NOAA current predictions for the day (the upper-river ebb runs long — roughly 3:30 to 11:00 at Catskill on a typical day, max about 2 kt) rather than guessing from high water"],
    notes: "Mostly sailing now! SW breezes common in afternoon. Ride the ebb, motorsail if wind is light. Catskill (river mile 112) to Poughkeepsie (mile 75) is only about 33 nm, so a short day — if you want to even out the next day, carry on to Newburgh or Cold Spring (~44–50 nm)."
  },
  {
    day: 30, from: "Poughkeepsie, NY", to: "New York City", distanceNm: 65, locks: 0,
    leg: "hudson", overnight: "Liberty Landing Marina, Jersey City",
    highlights: ["Bannerman's Castle ruins on Pollepel Island, just north of West Point", "West Point Military Academy perched on the bluffs", "Statue of Liberty and Ellis Island on approach to NY Harbor", "Time the final approach for golden hour — the Manhattan skyline lit by the low evening sun is the landfall of the whole voyage"],
    warnings: ["Time the ebb through the Hudson Highlands (NOAA current predictions for Poughkeepsie and the Highlands) — it can run 2kt", "High ferry and commercial traffic near NYC; stay alert last 20nm", "Reserve Liberty Landing in advance — NYC slips fill fast"],
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
    day: 32, from: "New York Harbor", to: "Port Jefferson, NY", distanceNm: 56, locks: 0,
    leg: "sound-saybrook", overnight: "Port Jefferson Harbor",
    highlights: ["East River transit through Manhattan — dramatic urban sailing", "Long Island Sound opens up — excellent sailing begins", "Port Jefferson: deep, beautiful harbor, ferry terminal, great waterfront restaurants", "SW sea breezes = beam reaching east"],
    warnings: ["CRITICAL: Time the East River / Hell Gate carefully. Heading east you want the FLOOD, which sets toward the Sound (NOAA station NYH1924, Hell Gate). Currents reach 4–5 knots. A rule of thumb is to enter the East River at the Battery about 1h45m after Battery low water — on Jul 20, 2027 (NOAA predictions) Battery low is 04:17, so enter about 06:00; Hell Gate slack is 06:08 and the flood peaks at about 3.2 kt near 09:00. Recheck the tables for the day you actually go", "Do NOT attempt Hell Gate on a strong opposing current — days 32–33 fall just after the full moon, so currents run strong. Throgs Neck is weaker (flood max about 1.6 kt near 08:05)", "Take the West Channel past Roosevelt Island: the East Channel has a lift bridge with only about 40 ft of clearance when closed (the mast will be stepped by now)", "About 9–9.5 hours: leave Liberty Landing about 05:45–06:15, and reserve a Port Jefferson berth ahead in July"],
    notes: "The long Sound day: Liberty Landing through the East River and Hell Gate on the flood, then east along the north shore with the SW breeze behind you. Skipping Oyster Bay makes this a full day, so keep an eye on the clock. Port Jefferson has full services."
  },
  {
    day: 33, from: "Port Jefferson, NY", to: "Old Saybrook, CT", distanceNm: 38, locks: 0,
    leg: "sound-saybrook", overnight: "Saybrook Point Marina",
    highlights: ["A direct run across the Sound with the SW breeze behind you — skipping Greenport, Plum Gut and The Race", "Mouth of the Connecticut River — a beautiful finish", "Essex (5nm upriver): one of the prettiest New England towns, Essex Steam Train connects to river boat tours", "Saybrook Point lighthouse"],
    warnings: ["Connecticut River entrance can shoal; follow the marked channel, and stay clear of the Long Sand Shoal area", "Time the entrance for a fair current: on Jul 21, 2027 (NOAA predictions, Saybrook Channel LIS1015) the current turns to flood at 09:30, peaks at about 1.4 kt near 12:04 and slackens at 14:49. Leave Port Jefferson about 06:00–06:30 to arrive around 13:00", "Avoid a strong ebb against a SW breeze at the Connecticut River bar"],
    notes: "ARRIVAL. About 38 nm (about 42 marina to marina, around 7 hours): straight across the Sound from Port Jefferson. Follow the marked Connecticut River channel in. Arrive early and spend the afternoon on the river. The Connecticut River Valley is the perfect place to end a voyage."
  },
];
