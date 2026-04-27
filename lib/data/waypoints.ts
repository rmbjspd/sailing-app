import type { Waypoint } from "../types";

export const waypoints: Waypoint[] = [
  // --- Lake Michigan ---
  { id: "chicago", name: "Chicago", state: "IL", lat: 41.8827, lng: -87.6233, day: 0, leg: "lake-michigan", fuel: true, pumpout: true, marina: "DuSable Harbor", notes: "Trip start. Top off diesel and provisions before departing." },
  { id: "st-joseph", name: "St. Joseph", state: "MI", lat: 42.1098, lng: -86.4834, day: 1, leg: "lake-michigan", fuel: true, pumpout: true, marina: "Anchor's Way / St. Joseph Municipal" },
  { id: "grand-haven", name: "Grand Haven", state: "MI", lat: 43.0631, lng: -86.2285, day: 2, leg: "lake-michigan", fuel: true, pumpout: true, marina: "Grand Haven Municipal Marina", notes: "Waterfront music fountain show in evenings." },
  { id: "ludington", name: "Ludington", state: "MI", lat: 43.9551, lng: -86.4545, day: 3, leg: "lake-michigan", fuel: true, pumpout: true, marina: "Ludington Municipal Marina", notes: "Round Big Sable Point with caution in afternoon westerlies." },
  { id: "leland", name: "Leland", state: "MI", lat: 45.0231, lng: -85.7632, day: 4, leg: "lake-michigan", marina: "Leland (Fishtown)", notes: "Historic smokehouses. Carlson's Fish Market. Call ahead — limited slips. Alternate: Frankfort or Manistee if Manitou Passage is rough." },
  { id: "mackinac-island", name: "Mackinac Island", state: "MI", lat: 45.8493, lng: -84.6190, day: 5, leg: "lake-michigan", fuel: true, pumpout: true, marina: "State Harbor Marina", isLayover: true, notes: "Car-free island. Fort Mackinac, bike Arch Rock, try the fudge. Grand Hotel: jacket required after 6pm. Rest day on Day 6." },

  // --- Lake Huron ---
  { id: "rogers-city", name: "Rogers City", state: "MI", lat: 45.4237, lng: -83.8174, day: 7, leg: "lake-huron", fuel: true, marina: "Rogers City Municipal Marina", notes: "Alternate: Presque Isle Harbor (10nm farther) for more seclusion." },
  { id: "harrisville", name: "Harrisville", state: "MI", lat: 44.6553, lng: -83.2970, day: 8, leg: "lake-huron", marina: "Harrisville State Harbor", notes: "Limited services. Alpena (Thunder Bay) is a bailout option." },
  { id: "harbor-beach", name: "Harbor Beach", state: "MI", lat: 43.8401, lng: -82.6496, day: 9, leg: "lake-huron", fuel: true, pumpout: true, marina: "Harbor Beach Municipal Marina", notes: "One of the world's largest man-made harbors. Top off fuel for the river transit." },
  { id: "detroit", name: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458, day: 10, leg: "lake-huron", fuel: true, pumpout: true, marina: "Detroit City Marina / Wyandotte", notes: "2–3kt following current on St. Clair River. Heavy ship traffic — give freighters wide berth. Lake St. Clair is shallow; follow channels." },

  // --- Lake Erie ---
  { id: "put-in-bay", name: "Put-in-Bay", state: "OH", lat: 41.6534, lng: -82.8182, day: 11, leg: "lake-erie", fuel: true, pumpout: true, marina: "South Bass Island mooring / dock", notes: "Perry's Victory Monument (352ft). Golf cart rentals for island tour. Lively boating scene." },
  { id: "cleveland", name: "Cleveland", state: "OH", lat: 41.4993, lng: -81.6944, day: 12, leg: "lake-erie", fuel: true, pumpout: true, marina: "Edgewater / North Coast Harbor", notes: "Rock & Roll Hall of Fame, 10min walk from marina." },
  { id: "erie-pa", name: "Erie", state: "PA", lat: 42.1292, lng: -80.0851, day: 13, leg: "lake-erie", fuel: true, pumpout: true, marina: "Presque Isle State Park Marina", notes: "Brig Niagara replica at maritime museum. Sandy beaches for a swim." },
  { id: "tonawanda", name: "Buffalo / Tonawanda", state: "NY", lat: 43.0226, lng: -78.8798, day: 14, leg: "lake-erie", fuel: true, pumpout: true, marina: "Smith Boys / Wardell's Marina", notes: "Black Rock Lock: hail VHF 13. Last mast-up stop. Call Wardell's or Smith Boys to schedule crane for mast unstep (Day 15). Niagara Falls 20min by Uber." },

  // --- Erie Canal ---
  { id: "lockport", name: "Lockport", state: "NY", lat: 43.1706, lng: -78.6909, day: 16, leg: "erie-canal", notes: "Locks E-35 and E-34 lift ~49ft total. Historic 'Flight of Five' remnants. Lockport Cave tour." },
  { id: "medina", name: "Medina", state: "NY", lat: 43.2192, lng: -78.3870, day: 16, leg: "erie-canal", notes: "Sandstone buildings. Railroad museum at canal side. Free wall tie-up." },
  { id: "brockport", name: "Brockport", state: "NY", lat: 43.2128, lng: -77.9391, day: 16, leg: "erie-canal", notes: "Canal visitor center wall. Restaurants in town." },
  { id: "fairport", name: "Fairport", state: "NY", lat: 43.0987, lng: -77.4428, day: 17, leg: "erie-canal", notes: "Famous red liftbridge. Moonlight Creamery. Often voted 'coolest small town.' Good lunch stop." },
  { id: "pittsford", name: "Pittsford", state: "NY", lat: 43.0892, lng: -77.5197, day: 17, leg: "erie-canal", notes: "Canal park dock with power/water. Lovely town." },
  { id: "newark-ny", name: "Newark", state: "NY", lat: 43.0481, lng: -77.0956, day: 17, leg: "erie-canal", notes: "Free dock with showers. Good fallback if running late." },
  { id: "lyons", name: "Lyons", state: "NY", lat: 43.0637, lng: -76.9908, day: 18, leg: "erie-canal", notes: "Peppermint oil capital — town actually smells minty." },
  { id: "baldwinsville", name: "Baldwinsville", state: "NY", lat: 43.1548, lng: -76.3318, day: 18, leg: "erie-canal", notes: "Lock E-24 drops you to Oneida Lake level." },
  { id: "sylvan-beach", name: "Sylvan Beach", state: "NY", lat: 43.2009, lng: -75.7251, day: 18, leg: "erie-canal", notes: "East end of Oneida Lake. Retro amusement park and beach. Free wall by bridge. Cross Oneida Lake (20nm, can be choppy) in daylight only." },
  { id: "ilion", name: "Ilion", state: "NY", lat: 43.0137, lng: -75.0349, day: 19, leg: "erie-canal", fuel: true, pumpout: true, marina: "Ilion Municipal Marina", notes: "Best-equipped marina on the canal. Fuel, pump-out, laundry, grocery nearby." },
  { id: "little-falls", name: "Little Falls", state: "NY", lat: 43.0448, lng: -74.8660, day: 19, leg: "erie-canal", notes: "Lock E-17 is the highest single lift (40.5ft) on the Erie Canal. Rotary Park dock. Limestone cliffs. Moss Island glacial potholes nearby." },
  { id: "waterford", name: "Waterford", state: "NY", lat: 42.7921, lng: -73.6832, day: 20, leg: "erie-canal", pumpout: true, notes: "Waterford Flight (Locks E-6 to E-2) drops 169ft in 1.5mi — one of the highest lock flights in the world. Arrive at Lock E-6 by 2:30pm. Free 48hr dock at Visitor Center (water, power, showers)." },

  // --- Hudson River ---
  { id: "catskill", name: "Catskill", state: "NY", lat: 42.2179, lng: -73.8652, day: 21, leg: "hudson", marina: "Hop-O-Nose Marina (Catskill Creek)", notes: "Re-step mast here. Hop-O-Nose has crane and experienced crew — call ahead. Troy Federal Lock just south of Waterford: hail VHF 13, 14ft drop, free. Once through you're in tidal Hudson." },
  { id: "kingston", name: "Kingston / Rondout", state: "NY", lat: 41.9270, lng: -73.9974, day: 22, leg: "hudson", notes: "Hudson River Maritime Museum on Rondout Creek. Optional lunch stop." },
  { id: "poughkeepsie", name: "Poughkeepsie", state: "NY", lat: 41.7004, lng: -73.9210, day: 22, leg: "hudson", marina: "Shadows Marina / Poughkeepsie YC", notes: "Or cross river to Newburgh/Beacon." },
  { id: "west-point", name: "West Point", state: "NY", lat: 41.3918, lng: -73.9560, day: 23, leg: "hudson", notes: "Bannerman's Castle ruins visible from river (Pollepel Island, just north). Storm King Mountain. Time the ebb through the Highlands." },
  { id: "nyc", name: "New York City", state: "NY", lat: 40.6947, lng: -74.0444, day: 23, leg: "hudson", fuel: true, pumpout: true, marina: "Liberty Landing Marina (Jersey City)", isLayover: true, notes: "Statue of Liberty to port entering harbor. Day 24 is a layover. Refuel at Liberty Landing. West Marine in Weehawken NJ (ferry or Uber). Last major provisioning stop." },

  // --- Option A: NJ Coast → Philadelphia ---
  { id: "manasquan", name: "Manasquan Inlet", state: "NJ", lat: 40.1020, lng: -74.0385, day: 25, leg: "coast-philly", route: "philly", marina: "Hoffman's / Clark's Landing", notes: "~35nm from Sandy Hook. Time inlet entry near slack tide (swift current). Railroad and bascule bridges to navigate after inlet." } as any,
  { id: "atlantic-city", name: "Atlantic City", state: "NJ", lat: 39.3643, lng: -74.4229, day: 26, leg: "coast-philly", fuel: true, pumpout: true, marina: "Gardner's Basin / Farley State Marina", notes: "Pre-dawn departure from Manasquan (~60nm). Absecon Inlet is well-marked." } as any,
  { id: "cape-may", name: "Cape May", state: "NJ", lat: 38.9351, lng: -74.9060, day: 27, leg: "coast-philly", fuel: true, marina: "Utsch's Marina / Canyon Club", notes: "Victorian town, great for a walk. Check flood tide timing for Delaware Bay departure. Watch for Cape May–Lewes ferry traffic in inlet." } as any,
  { id: "delaware-city", name: "Delaware City", state: "DE", lat: 39.5790, lng: -75.5896, day: 28, leg: "coast-philly", marina: "Delaware City Marina", notes: "Pre-dawn departure Cape May to catch flood tide. Delaware Bay fog common in summer mornings — consider 9–10am departure after it burns off. Ship John Shoal Lighthouse midway." } as any,
  { id: "philadelphia", name: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652, day: 29, leg: "coast-philly", marina: "Penn's Landing Harbor", notes: "ARRIVAL. Delaware Memorial Bridge marks final stretch. Monitor VHF 13 for ship traffic. Penn's Landing puts you steps from Independence Seaport Museum." } as any,

  // --- Option B: Long Island Sound → Old Saybrook ---
  { id: "oyster-bay", name: "Oyster Bay", state: "NY", lat: 40.8676, lng: -73.5337, day: 25, leg: "sound-saybrook", marina: "Oyster Bay / Cold Spring Harbor", notes: "East River transit to reach LIS. CRITICAL: time Hell Gate for slack water — currents reach 4–5 knots. Excellent beam reaching in SW sea breezes once on LIS." } as any,
  { id: "port-jefferson", name: "Port Jefferson", state: "NY", lat: 40.9462, lng: -73.0693, day: 26, leg: "sound-saybrook", marina: "Port Jefferson Harbor", notes: "Beautiful harbor. Ferry terminal nearby. Good restaurants." } as any,
  { id: "greenport", name: "Greenport", state: "NY", lat: 41.1009, lng: -72.3620, day: 27, leg: "sound-saybrook", marina: "Mitchell Park Marina", notes: "North Fork wine country. Shelter Island a short dinghy ride. Excellent sailing to get here." } as any,
  { id: "mystic", name: "Mystic", state: "CT", lat: 41.3543, lng: -71.9665, day: 28, leg: "sound-saybrook", marina: "Mystic River / Noank", notes: "Mystic Seaport Museum. Drawbridge in town. Or continue to New London for a quieter overnight." } as any,
  { id: "old-saybrook", name: "Old Saybrook", state: "CT", lat: 41.2948, lng: -72.3765, day: 29, leg: "sound-saybrook", marina: "Saybrook Point Marina", notes: "ARRIVAL. Mouth of the Connecticut River. Essex (5nm upriver) is worth a detour — charming New England town. The Essex Steam Train connects to the river by boat." } as any,
];

// Shared Chicago-to-NYC portion + both ending options
export const routeCoordinates: { philly: [number, number][]; saybrook: [number, number][] } = {
  philly: waypoints
    .filter(w => w.leg !== "sound-saybrook")
    .map(w => [w.lng, w.lat]),
  saybrook: waypoints
    .filter(w => w.leg !== "coast-philly")
    .map(w => [w.lng, w.lat]),
};
