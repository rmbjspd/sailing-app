import type { ItineraryDay } from "../types";

export const itinerary: ItineraryDay[] = [
  // ---- LAKE MICHIGAN ----
  {
    day: 1, from: "Chicago, IL", to: "St. Joseph, MI", distanceNm: 53, locks: 0,
    leg: "lake-michigan", route: "both", overnight: "Anchor's Way / St. Joseph Municipal Marina",
    highlights: ["First open-water crossing of southern Lake Michigan", "St. Joseph's beach and waterfront restaurants — 'Riviera of the Midwest'"],
    warnings: ["Depart early — afternoon thunderstorms common on Lake Michigan in June", "Keep a close eye on fuel: 53nm motoring in calm = most of your tank"],
    notes: "Depart DuSable Harbor at first light. Set a course SE across southern Lake Michigan. Arrive by late afternoon. Refuel on arrival."
  },
  {
    day: 2, from: "St. Joseph, MI", to: "Grand Haven, MI", distanceNm: 75, locks: 0,
    leg: "lake-michigan", route: "both", overnight: "Grand Haven Municipal Marina",
    highlights: ["Pass South Haven and Saugatuck en route", "Grand Haven waterfront music fountain show in the evenings"],
    warnings: ["Longest Lake Michigan day — ensure full tank departing St. Joseph", "Afternoon NW winds can build 2–4ft chop; plan to be in by 3pm"],
    notes: "Long day sail hugging Michigan's eastern shore. Refuel and pump out at Grand Haven."
  },
  {
    day: 3, from: "Grand Haven, MI", to: "Ludington, MI", distanceNm: 80, locks: 0,
    leg: "lake-michigan", route: "both", overnight: "Ludington Municipal Marina",
    highlights: ["Sleeping Bear Dunes visible from offshore", "Ludington is a major refueling and resupply point"],
    warnings: ["Big Sable Point: afternoon westerlies can generate steep, short chop — round the point before noon if possible", "Carry at least one jerry can — 80nm motoring in calm air exceeds tank range; top off at Pentwater (40nm) if conditions are light"],
    notes: "Pass Muskegon (possible fuel stop at 40nm) and Pentwater en route. Arrive Ludington by mid-afternoon."
  },
  {
    day: 4, from: "Ludington, MI", to: "Leland, MI", distanceNm: 70, locks: 0,
    leg: "lake-michigan", route: "both", overnight: "Leland (Fishtown) — limited slips, call ahead",
    highlights: ["Sleeping Bear Dunes National Lakeshore scenery along this stretch", "Leland Fishtown: historic net sheds and smokehouses, Carlson's Fish Market"],
    warnings: ["Manitou Passage can have confused seas when wind opposes lake swell — check forecast carefully", "If Manitou Passage is rough, divert to Frankfort or Manistee and recombine next day"],
    notes: "Scenic run through the Manitou Passage. North and South Manitou Islands visible. Leland is charming but small; anchor off if marina full."
  },
  {
    day: 5, from: "Leland, MI", to: "Mackinac Island, MI", distanceNm: 80, locks: 0,
    leg: "lake-michigan", route: "both", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Mackinac Bridge: 5-mile suspension bridge at the Straits — a dramatic gateway", "First major milestone: top of Lake Michigan complete"],
    warnings: ["Depart pre-dawn — long run, and Straits currents can be strong", "Mackinac Bridge has 199ft clearance at center span — no issue, but impressive"],
    notes: "Pre-dawn departure recommended. Straits of Mackinac can have 2–3kt currents. Arrive Mackinac Island by evening."
  },
  {
    day: 6, from: "Mackinac Island", to: "Mackinac Island", distanceNm: 0, locks: 0,
    leg: "lake-michigan", route: "both", overnight: "Mackinac Island State Harbor Marina",
    highlights: ["Car-free island with Victorian charm", "Fort Mackinac, Arch Rock, bike the perimeter road", "Famous Mackinac Island fudge"],
    warnings: ["Grand Hotel: jacket required after 6pm for men if dining there", "Re-provision groceries — limited stores on island"],
    notes: "Rest day and weather buffer. Prepare for Lake Huron leg. Check Huron forecast carefully before departing."
  },

  // ---- LAKE HURON ----
  {
    day: 7, from: "Mackinac Island, MI", to: "Rogers City, MI", distanceNm: 70, locks: 0,
    leg: "lake-huron", route: "both", overnight: "Rogers City Municipal Marina",
    highlights: ["Enter Lake Huron heading SE along Michigan's 'Sunrise Coast'"],
    warnings: ["Lake Huron can develop steep, short chop with northerly or southerly winds due to long fetch — check forecast"],
    notes: "Fuel and water at Rogers City. Alpena (20nm farther) is a good alternate or bailout."
  },
  {
    day: 8, from: "Rogers City, MI", to: "Harrisville, MI", distanceNm: 60, locks: 0,
    leg: "lake-huron", route: "both", overnight: "Harrisville State Harbor",
    highlights: ["Relaxed run down Michigan's quiet east coast"],
    warnings: ["Harrisville has limited services. If conditions allow a longer push, Harbor Beach is 70nm from Rogers City in one shot."],
    notes: "Could combine Days 8–9 if conditions are favorable for a long day (130nm Rogers City to Harbor Beach via Alpena)."
  },
  {
    day: 9, from: "Harrisville, MI", to: "Harbor Beach, MI", distanceNm: 70, locks: 0,
    leg: "lake-huron", route: "both", overnight: "Harbor Beach Municipal Marina",
    highlights: ["One of the world's largest man-made harbors"],
    warnings: ["Top off diesel here — it's the last fuel before the St. Clair River"],
    notes: "Rounding Michigan's 'Thumb.' Straightforward run."
  },
  {
    day: 10, from: "Harbor Beach, MI", to: "Detroit, MI", distanceNm: 90, locks: 0,
    leg: "lake-huron", route: "both", overnight: "Detroit area marina (Wyandotte or Detroit City Marina)",
    highlights: ["St. Clair River carries you downstream at 2–3 knots — free speed", "Blue Water Bridge at Port Huron marks the river entrance", "Detroit River: urban sailing with a skyline backdrop"],
    warnings: ["Heavy commercial ship traffic on St. Clair River — give freighters a wide berth and monitor VHF 13", "Lake St. Clair is shallow (follow marked channels) and can be choppy", "Very early departure recommended — 90nm day"],
    notes: "Through Port Huron, down St. Clair River (~40nm), across Lake St. Clair (~20nm), down Detroit River (~15nm). Arrive by evening."
  },

  // ---- LAKE ERIE ----
  {
    day: 11, from: "Detroit, MI", to: "Put-in-Bay, OH", distanceNm: 55, locks: 0,
    leg: "lake-erie", route: "both", overnight: "South Bass Island mooring or dock",
    highlights: ["Perry's Victory & International Peace Memorial (352ft) — take the elevator up for views", "Golf cart rentals for island tour", "Lively boating scene and live music"],
    warnings: ["Lake Erie is the shallowest Great Lake — moderate winds create short, steep waves quickly", "Check forecast carefully; if Erie is kicking up, wait it out in Detroit"],
    notes: "Enter Lake Erie via Detroit River. Arrive Put-in-Bay by early afternoon to secure a mooring."
  },
  {
    day: 12, from: "Put-in-Bay, OH", to: "Cleveland, OH", distanceNm: 70, locks: 0,
    leg: "lake-erie", route: "both", overnight: "Edgewater Marina or North Coast Harbor",
    highlights: ["Rock & Roll Hall of Fame — 10min walk from North Coast Harbor", "Great Lakes Science Center adjacent"],
    warnings: ["Open lake run; watch afternoon weather"],
    notes: "Arrive Cleveland by evening. Good city stop for reprovisioning."
  },
  {
    day: 13, from: "Cleveland, OH", to: "Erie, PA", distanceNm: 80, locks: 0,
    leg: "lake-erie", route: "both", overnight: "Presque Isle State Park Marina",
    highlights: ["Presque Isle State Park: sandy beaches and calm bay", "U.S. Brig Niagara replica at Erie Maritime Museum"],
    warnings: ["Another long day — early departure"],
    notes: "Presque Isle Bay is well-protected. Last fuel before Buffalo."
  },
  {
    day: 14, from: "Erie, PA", to: "Buffalo/Tonawanda, NY", distanceNm: 70, locks: 1,
    leg: "lake-erie", route: "both", overnight: "Smith Boys or Wardell's Marina, Tonawanda",
    highlights: ["Black Rock Lock: hail VHF 13, bypasses Niagara River current", "Buffalo Canalside: USS Little Rock, waterfront dining", "Niagara Falls 20min by Uber from Tonawanda"],
    warnings: ["CRITICAL: Call Wardell's or Smith Boys NOW to schedule crane for mast-unstep tomorrow", "Buffalo/Tonawanda is the last chance to source major parts until NYC"],
    notes: "Final Great Lakes leg. Arrive by late afternoon. Begin mast-unstep logistics. Stock up at big-box stores (West Marine is here)."
  },
  {
    day: 15, from: "Tonawanda (mast prep)", to: "Tonawanda", distanceNm: 0, locks: 0,
    leg: "erie-canal", route: "both", overnight: "Tonawanda boatyard",
    highlights: ["Mast down — major transition from Great Lakes sailing to canal mode"],
    warnings: ["Verify air draft under 15ft after unstep", "Secure all deck hardware that could snag under low bridges", "Mast must be well-padded and tied — it will overhang bow or stern"],
    notes: "Unstep and cradle mast. Rig extra fenders (8+ needed for locks — both sides). Set up dedicated lock lines (2× 50ft). Fill water tank. Grocery run."
  },

  // ---- ERIE CANAL ----
  {
    day: 16, from: "Tonawanda, NY", to: "Medina or Brockport, NY", distanceNm: 0, locks: 2,
    leg: "erie-canal", route: "both", overnight: "Canal village wall (Medina or Brockport)",
    highlights: ["Locks E-35 and E-34 at Lockport: lift ~49ft combined — 'Flight of Five' history", "Medina's sandstone buildings and railroad museum", "Brockport canal visitor center wall"],
    warnings: ["First locks of the trip — go slow, fenders on both sides, crew fore and aft on lines", "Speed limit 10mph on canal"],
    notes: "After Lockport, no locks for ~60 miles. Pass through lift-bridge towns (operators see you and open). ~30–40 statute miles today."
  },
  {
    day: 17, from: "Medina/Brockport, NY", to: "Pittsford, NY", distanceNm: 0, locks: 5,
    leg: "erie-canal", route: "both", overnight: "Pittsford canal park dock (power/water)",
    highlights: ["Fairport: famous red liftbridge, Moonlight Creamery ice cream, great lunch stop", "Genesee River aqueduct crossing"],
    warnings: ["5 locks today (E-33 to E-29) — get an early start", "If locks are slow, Newark (before E-28) has a free dock as fallback"],
    notes: "Locks E-33/32 around Rochester (~25ft drop each). Locks E-31, E-30, E-29 toward Palmyra. ~60 statute miles."
  },
  {
    day: 18, from: "Pittsford/Newark, NY", to: "Sylvan Beach, NY", distanceNm: 0, locks: 6,
    leg: "erie-canal", route: "both", overnight: "Sylvan Beach wall or marina slip",
    highlights: ["Montezuma National Wildlife Refuge: herons, eagles, turtles", "Oneida Lake crossing — 20 miles of open water", "Sylvan Beach: retro amusement park, sandy beach"],
    warnings: ["Oneida Lake can be choppy — cross in daylight with good forecast only", "Lock E-24 at Baldwinsville: arrive before 5pm to ensure passage"],
    notes: "Seneca Canal junction at Montezuma. After Baldwinsville, 20nm open Oneida Lake to Sylvan Beach."
  },
  {
    day: 19, from: "Sylvan Beach, NY", to: "Ilion or Little Falls, NY", distanceNm: 0, locks: 4,
    leg: "erie-canal", route: "both", overnight: "Ilion Municipal Marina or Little Falls Rotary Park dock",
    highlights: ["Now on the canalized Mohawk River — scenery improves", "Ilion Marina: full services, laundry, grocery 5min away", "Little Falls: limestone cliff scenery, Moss Island glacial potholes"],
    warnings: ["Ilion is the best pump-out/fuel point before the final push to the Hudson", "Little Falls: Lock E-17 just past town is the deepest single lock (40.5ft) — tackle it next morning"],
    notes: "Locks E-22, 21, 20 through Herkimer area. Stop at Ilion or push to Little Falls."
  },
  {
    day: 20, from: "Ilion/Little Falls, NY", to: "Waterford, NY", distanceNm: 0, locks: 9,
    leg: "erie-canal", route: "both", overnight: "Waterford Visitor Center Dock (free 48hr, power, water)",
    highlights: ["Lock E-17 at Little Falls: 40.5ft drop — highest single lock on the Erie Canal", "Waterford Flight (E-6 to E-2): 169ft descent in 1.5 miles — one of the great feats of 19th-century engineering", "MILESTONE: Great Lakes to Atlantic connected!"],
    warnings: ["CRITICAL: Arrive at Lock E-6 (top of Waterford Flight) by 2:30pm to guarantee completing all 5 locks before close", "Locks E-13 through E-7 come in rapid succession — no dallying in the afternoon"],
    notes: "Big day: 8–9 locks. Canajoharie and Amsterdam are optional breaks. Once in the Waterford Flight, lock operators will see you through. Celebrate at the bottom."
  },

  // ---- HUDSON RIVER ----
  {
    day: 21, from: "Waterford, NY", to: "Catskill, NY", distanceNm: 40, locks: 1,
    leg: "hudson", route: "both", overnight: "Hop-O-Nose Marina, Catskill Creek",
    highlights: ["Troy Federal Lock: last lock, 14ft drop, free, hail VHF 13", "Now in tidal Hudson — current changes with tide", "MAST RE-STEP at Hop-O-Nose Marina, Catskill Creek (call ahead for crane)"],
    warnings: ["Tidal timing: high tide at Troy is ~5–6hrs AFTER high tide at NYC Battery — check Troy specifically on a tide app", "Hop-O-Nose is 1nm up Catskill Creek from the Hudson — easy approach in calm water"],
    notes: "Through Albany (mile 145). Arrive Catskill (mile 112) by early-to-mid afternoon to complete mast-step before dark. Allow 2–3hrs for re-rigging. Reconnect all electronics after stepping."
  },
  {
    day: 22, from: "Catskill, NY", to: "Poughkeepsie or Newburgh, NY", distanceNm: 60, locks: 0,
    leg: "hudson", route: "both", overnight: "Shadows Marina or Poughkeepsie YC; or anchor at Newburgh",
    highlights: ["Hudson-Athens Lighthouse", "Kingston/Rondout Creek: Hudson River Maritime Museum (optional stop)", "Catskill Mountains backdrop to the west"],
    warnings: ["Ride the ebb tide south — time departure for 1–2hrs after high water at your location"],
    notes: "Mostly sailing now! SW breezes common in afternoon. Ride the ebb, motorsail if wind is light."
  },
  {
    day: 23, from: "Poughkeepsie, NY", to: "New York City", distanceNm: 75, locks: 0,
    leg: "hudson", route: "both", overnight: "Liberty Landing Marina, Jersey City",
    highlights: ["Bannerman's Castle ruins on Pollepel Island, just north of West Point", "West Point Military Academy perched on the bluffs", "Statue of Liberty and Ellis Island on approach to NY Harbor", "Manhattan skyline"],
    warnings: ["Time the ebb through the Hudson Highlands — can run 2kt", "High ferry and commercial traffic near NYC; stay alert last 20nm", "Reserve Liberty Landing in advance — NYC slips fill fast"],
    notes: "Arrive NYC mid-to-late afternoon. Day 24 is a layover: refuel, West Marine run, provision, enjoy the city."
  },
  {
    day: 24, from: "New York City", to: "New York City", distanceNm: 0, locks: 0,
    leg: "hudson", route: "both", overnight: "Liberty Landing Marina",
    highlights: ["Rest, reprovisioning, city sightseeing"],
    warnings: ["Check extended weather forecast for either NJ coast (Option A) or Long Island Sound (Option B) before committing to departure day"],
    notes: "Buffer day. Full fuel and water. Audit all gear before coastal/sound leg. Both options depart from NY Harbor."
  },

  // ---- OPTION A: NJ COAST → PHILADELPHIA ----
  {
    day: 25, from: "New York Harbor", to: "Manasquan Inlet, NJ", distanceNm: 35, locks: 0,
    leg: "coast-philly", route: "philly", overnight: "Hoffman's Marina / Clark's Landing, Point Pleasant",
    highlights: ["First offshore sailing of the trip", "Verrazzano-Narrows Bridge departure"],
    warnings: ["Prevailing summer wind is SW — expect to be close-hauled or motorsailing heading south", "Time Manasquan Inlet entry near slack tide — current can be swift; a railroad bridge and bascule bridge must open before you reach marinas"],
    notes: "Short hop to get offshore legs under the crew. Sandy Hook to Manasquan Inlet."
  },
  {
    day: 26, from: "Manasquan, NJ", to: "Atlantic City, NJ", distanceNm: 60, locks: 0,
    leg: "coast-philly", route: "philly", overnight: "Gardner's Basin or Farley State Marina (Golden Nugget)",
    highlights: ["Barnegat Lighthouse visible offshore at mid-morning", "Atlantic City marina district is surprisingly well-equipped"],
    warnings: ["Pre-dawn departure needed — 60nm is a 10–12hr day", "Absecon Inlet is well-marked but favor main channel; check Coast Guard notices for any shoaling"],
    notes: "Long offshore day. Arrive before dusk. Fuel up in AC."
  },
  {
    day: 27, from: "Atlantic City, NJ", to: "Cape May, NJ", distanceNm: 40, locks: 0,
    leg: "coast-philly", route: "philly", overnight: "Utsch's Marina or Canyon Club",
    highlights: ["Cape May: Victorian architecture, gingerbread B&Bs", "Cape May Lighthouse", "Gateway to Delaware Bay"],
    warnings: ["Watch for Cape May–Lewes ferry traffic on approach", "Check flood tide times for tomorrow's Delaware Bay departure"],
    notes: "Shorter day — can afford later start. Use as weather-wait day if needed. Walk Washington Street Mall."
  },
  {
    day: 28, from: "Cape May, NJ", to: "Delaware City, DE", distanceNm: 55, locks: 0,
    leg: "coast-philly", route: "philly", overnight: "Delaware City Marina",
    highlights: ["Delaware Bay dolphins", "Ship John Shoal Lighthouse at midpoint", "Fort Delaware on Pea Patch Island"],
    warnings: ["Delaware Bay summer fog can be dense in early morning — wait for 9–10am after burn-off rather than pre-dawn departure", "Wind opposing tide makes the bay very rough; check forecast before leaving Cape May"],
    notes: "Ride the flood tide north. With a good current, 7–8+ knots SOG. Delaware City marina staff give timing advice for the river leg."
  },
  {
    day: 29, from: "Delaware City, DE", to: "Philadelphia, PA", distanceNm: 40, locks: 0,
    leg: "coast-philly", route: "philly", overnight: "Penn's Landing Harbor Marina",
    highlights: ["Delaware Memorial Bridge twin spans", "Philly skyline approach to Penn's Landing", "Independence Seaport Museum steps from the dock"],
    warnings: ["Heavy commercial ship traffic on Delaware River — monitor VHF 13 continuously", "Current reverses twice; ride the flood from Delaware City"],
    notes: "ARRIVAL. Chicago to Philadelphia complete. Cheesesteak at Pat's or Geno's is mandatory."
  },

  // ---- OPTION B: LONG ISLAND SOUND → OLD SAYBROOK ----
  {
    day: 25, from: "New York Harbor", to: "Oyster Bay or Cold Spring Harbor, NY", distanceNm: 28, locks: 0,
    leg: "sound-saybrook", route: "saybrook", overnight: "Oyster Bay or Cold Spring Harbor marina",
    highlights: ["East River transit through Manhattan — dramatic urban sailing", "Long Island Sound opens up — excellent sailing begins", "SW sea breezes = beam reaching east"],
    warnings: ["CRITICAL: Time the East River / Hell Gate carefully. Currents reach 4–5 knots at Hell Gate. Aim to pass Hell Gate at or just before slack water on a favorable ebb. PredictWind and Navionics show Hell Gate tidal predictions.", "Do NOT attempt Hell Gate on a strong opposing current"],
    notes: "Short day to get onto LIS. Once through Hell Gate, the sailing is typically glorious — consistent SW sea breeze for a beam reach east."
  },
  {
    day: 26, from: "Oyster Bay, NY", to: "Port Jefferson, NY", distanceNm: 38, locks: 0,
    leg: "sound-saybrook", route: "saybrook", overnight: "Port Jefferson Harbor",
    highlights: ["Classic Long Island Sound beam reach", "Port Jefferson: beautiful harbor, ferry terminal, great waterfront restaurants"],
    warnings: ["Summer SW sea breezes fill in by mid-morning — get out early before traffic"],
    notes: "Beautiful sailing day. Port Jefferson has full services."
  },
  {
    day: 27, from: "Port Jefferson, NY", to: "Greenport, NY", distanceNm: 40, locks: 0,
    leg: "sound-saybrook", route: "saybrook", overnight: "Mitchell Park Marina, Greenport",
    highlights: ["North Fork wine country — some of the best in the Northeast", "Shelter Island accessible by short ferry from Greenport", "Eastern LIS: more open water, great sailing"],
    warnings: ["Plum Gut (between Plum Island and Orient Point) has strong tidal currents — time your approach"],
    notes: "Another excellent sailing day. Greenport is a great overnight — walk to wine tasting or ferry to Shelter Island."
  },
  {
    day: 28, from: "Greenport, NY", to: "Mystic, CT", distanceNm: 28, locks: 0,
    leg: "sound-saybrook", route: "saybrook", overnight: "Mystic River or Noank, CT",
    highlights: ["Cross to Connecticut shore", "Mystic Seaport Museum: historic ships and maritime history", "Mystic drawbridge in the center of town"],
    warnings: ["Mystic River drawbridge: call ahead, limited opening schedule"],
    notes: "Shorter day — enjoy Mystic at a leisurely pace. World-class seafood."
  },
  {
    day: 29, from: "Mystic, CT", to: "Old Saybrook, CT", distanceNm: 22, locks: 0,
    leg: "sound-saybrook", route: "saybrook", overnight: "Saybrook Point Marina",
    highlights: ["Mouth of the Connecticut River — a beautiful finish", "Essex (5nm upriver): one of the prettiest New England towns, Essex Steam Train connects to river boat tours", "Saybrook Point lighthouse"],
    warnings: ["Connecticut River entrance can shoal; follow marked channel"],
    notes: "ARRIVAL. Short final day — arrive early and spend the afternoon exploring. The Connecticut River Valley is stunning."
  },
];
