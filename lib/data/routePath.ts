/**
 * Hand-digitized water-following polyline for the S/V Sabbatical voyage:
 * Chicago → Old Saybrook via Great Lakes, Erie Canal, Hudson River, Long Island Sound.
 *
 * Each coordinate is [longitude, latitude] in WGS-84.
 * Organized by leg so inland legs (canal/river) can be styled distinctly.
 *
 * Methodology: points were placed from geographic knowledge of navigable waterways,
 * tracing lake centerlines, coastal shorelines, river channels, and the Erie Canal
 * alignment through the Mohawk Valley. Hotspot areas (Straits of Mackinac,
 * St. Clair River, Erie Canal locks, East River/Hell Gate) have additional shaping
 * points to stay in-water.
 *
 * Two places need care and are called out in the segments below: Baie Fine is a
 * dead-end fjord, so the north-channel track must double back down it rather than
 * cut across the La Cloche ridge; and the Sound leg now runs past Old Saybrook to
 * Mystic and back, so the outbound and return tracks are deliberately distinct
 * (outbound south of Fishers Island, return along the Connecticut shore).
 */

export type RouteLeg =
  | "lake-michigan"
  | "north-channel"
  | "lake-huron"
  | "st-clair"
  | "lake-erie"
  | "erie-canal"
  | "hudson"
  | "sound-saybrook";

export interface RouteSegment {
  leg: RouteLeg;
  /** true = inland canal / river (styled differently from open water) */
  inland: boolean;
  /** ordered [lng, lat] pairs */
  coords: [number, number][];
}

export const routeSegments: RouteSegment[] = [
  // ── Lake Michigan (Days 1–8) ─────────────────────────────────────────────
  // Chicago → St. Joseph → Grand Haven → Pentwater → Frankfort →
  // South Manitou → Leland → Beaver Island → Mackinac Island
  // Hugs the eastern shoreline north, then crosses to Beaver Island and the Straits.
  {
    leg: "lake-michigan",
    inland: false,
    coords: [
      [-87.6233, 41.8827], // Chicago (DuSable Harbor)
      [-87.15,   42.05],   // offshore, clear of Chicago shoals
      [-86.85,   42.05],   // heading toward St. Joseph
      [-86.4834, 42.1098], // St. Joseph
      [-86.30,   42.50],   // mid-lake passage north
      [-86.2285, 43.0631], // Grand Haven
      [-86.37,   43.50],   // following shoreline north
      [-86.4339, 43.7769], // Pentwater
      [-86.4545, 43.9551], // Ludington (morning fuel and water stop, Day 4)
      [-86.35,   44.30],   // north past Manistee, standing off Big Sable
      [-86.2300, 44.6329], // Frankfort (Betsie Lake)
      [-86.10,   44.80],   // offshore Point Betsie / Empire, Sleeping Bear bluffs
      [-86.0925, 45.0119], // South Manitou Island (anchor, dinghy ashore)
      [-85.7632, 45.0231], // Leland (Fishtown) — via the Manitou Passage
      [-85.5930, 45.1850], // Cathead Point, standing a mile off the shoal
      [-85.5189, 45.7467], // Beaver Island (St. James / Paradise Bay)
      [-85.1300, 45.7700], // Grays Reef Passage
      [-84.7200, 45.8200], // Straits of Mackinac, west approach
      [-84.6190, 45.8493], // Mackinac Island
    ],
  },

  // ── North Channel / Georgian Bay (Days 9–18) ─────────────────────────────
  // Mackinac Island → Drummond Island → Meldrum Bay → Gore Bay →
  // Benjamin Islands → Kagawong → Little Current → Baie Fine/The Pool →
  // Killarney → Tobermory
  {
    leg: "north-channel",
    inland: false,
    coords: [
      [-84.6190, 45.8493], // Mackinac Island
      [-84.30,   45.90],   // east through Straits
      [-84.05,   45.95],   // St. Martin Bay area
      [-83.7430, 46.0036], // Drummond Island
      [-83.50,   46.00],   // Potagannissing Bay east
      [-83.30,   45.98],   // crossing into North Channel
      [-83.1168, 45.9168], // Meldrum Bay (Manitoulin north shore)
      [-82.80,   45.92],   // along Manitoulin north shore
      [-82.4668, 45.9168], // Gore Bay
      [-82.35,   46.02],   // north into the Benjamins approach
      [-82.2529, 46.0885], // Benjamin Islands (anchor)
      [-82.2530, 45.8980], // Kagawong (Bridal Veil Falls, lunch stop)
      [-81.9250, 45.9783], // Little Current (swing bridge, on the hour)
      [-81.7200, 46.0100], // Landsdowne Channel into Frazer Bay
      [-81.6800, 46.0300], // Baie Fine entrance bar — favor the north side
      [-81.5500, 46.0500], // The Pool (anchor, Days 14–15)
      [-81.6800, 46.0300], // back out of the fjord — The Pool is a dead end
      [-81.62,   45.99],   // Frazer Bay, turning south around Badgeley Point
      [-81.5111, 45.9712], // Killarney
      [-81.40,   45.90],   // heading south toward Georgian Bay
      [-81.30,   45.75],   // Georgian Bay open crossing
      [-81.40,   45.50],   // south across the bay
      [-81.55,   45.25],   // approaching the Bruce
      [-81.6650, 45.2536], // Tobermory (Big Tub Harbour)
    ],
  },

  // ── Lake Huron (Days 19–21) ──────────────────────────────────────────────
  // Tobermory → Kincardine → Goderich → Port Huron
  // Follows Ontario's eastern Lake Huron shoreline south.
  {
    leg: "lake-huron",
    inland: false,
    coords: [
      [-81.6650, 45.2536], // Tobermory
      [-81.68,   44.90],   // south along Bruce Peninsula
      [-81.65,   44.60],   // past Southampton / Port Elgin
      [-81.63,   44.40],   // toward Kincardine
      [-81.6363, 44.1745], // Kincardine
      [-81.7068, 43.7563], // Goderich (harbour of refuge)
      [-81.55,   43.45],   // south along Huron shore, past Bayfield
      [-81.40,   43.15],   // approaching southern Lake Huron
      [-82.10,   43.00],   // rounding toward the Michigan thumb, offshore
      [-82.30,   42.98],   // toward Port Huron
      [-82.4249, 42.9709], // Port Huron / Sarnia
    ],
  },

  // ── St. Clair River / Lake St. Clair (Day 22) ────────────────────────────
  // Follows the navigable channel south through St. Clair River, Lake St. Clair,
  // and the Detroit River.
  {
    leg: "st-clair",
    inland: true,
    coords: [
      [-82.4249, 42.9709], // Port Huron / Sarnia — St. Clair River entrance
      [-82.46,   42.88],   // St. Clair River south
      [-82.50,   42.78],   // mid-river
      [-82.52,   42.68],   // south
      [-82.54,   42.58],   // Lake St. Clair approach
      [-82.55,   42.48],   // southern Lake St. Clair main channel
      [-82.58,   42.38],   // Detroit River entrance
      [-82.70,   42.35],   // Detroit River channel SW
      [-82.90,   42.32],   // Detroit River channel, approaching Lake Erie
      [-83.0458, 42.3314], // Detroit
    ],
  },

  // ── Lake Erie (Days 23–29) ───────────────────────────────────────────────
  // Detroit → Put-in-Bay → Cleveland → Ashtabula → Erie → Dunkirk →
  // Buffalo/Tonawanda
  {
    leg: "lake-erie",
    inland: false,
    coords: [
      [-83.0458, 42.3314], // Detroit
      [-82.90,   42.15],   // heading into Lake Erie
      [-82.8182, 41.6534], // Put-in-Bay (South Bass Island)
      [-82.50,   41.60],   // east across the western basin
      [-82.00,   41.55],   // past Huron and Vermilion
      [-81.6944, 41.4993], // Cleveland
      [-81.20,   41.62],   // east past Fairport Harbor
      [-80.7967, 41.8992], // Ashtabula
      [-80.40,   42.00],   // past Conneaut
      [-80.0851, 42.1292], // Erie PA (Presque Isle Bay)
      [-79.70,   42.35],   // past Barcelona Harbor
      [-79.3372, 42.4933], // Dunkirk (Chadwick Bay)
      [-79.00,   42.75],   // approaching Niagara / Buffalo breakwall
      [-78.8798, 43.0226], // Buffalo / Tonawanda — Black Rock Canal
    ],
  },

  // ── Erie Canal (Days 30–40) ──────────────────────────────────────────────
  // Buffalo/Tonawanda → Medina → Pittsford → Lyons → Baldwinsville →
  // Brewerton → Rome → Little Falls → Canajoharie → Schenectady → Waterford
  // Follows the Barge Canal alignment through the Mohawk Valley.
  {
    leg: "erie-canal",
    inland: true,
    coords: [
      [-78.8798, 43.0226], // Buffalo / Tonawanda (Black Rock Canal)
      [-78.70,   43.08],   // canal east of Tonawanda
      [-78.69,   43.17],   // Lockport — Locks E-35 / E-34
      [-78.3872, 43.2192], // Medina
      [-77.94,   43.21],   // Brockport (lunch tie-up)
      [-77.70,   43.18],   // Spencerport, west of Rochester
      [-77.5197, 43.0892], // Pittsford (Schoen Place)
      [-77.44,   43.10],   // Fairport — red lift bridge
      [-76.9885, 43.0639], // Lyons
      [-76.72,   43.03],   // Clyde
      [-76.55,   43.05],   // May's Point / Cayuga-Seneca junction, Montezuma
      [-76.3325, 43.1583], // Baldwinsville (Lock E-24)
      [-76.2700, 43.1700], // Three Rivers Junction
      [-76.1268, 43.2396], // Brewerton (Ess-Kay Yards) — stage for Oneida
      [-75.90,   43.20],   // Oneida Lake, west end
      [-75.7251, 43.2009], // Sylvan Beach (Oneida east end, lunch stop)
      [-75.4353, 43.2078], // Rome (Bellamy Harbor Park)
      [-75.20,   43.10],   // canal east toward Utica
      [-75.0349, 43.0137], // Ilion (fuel and pump-out stop)
      [-74.8594, 43.0397], // Little Falls (Rotary Park)
      [-74.5714, 42.9036], // Canajoharie
      [-74.1890, 42.9370], // Amsterdam (Riverlink Park)
      [-73.9265, 42.8180], // Schenectady (Mohawk Harbor) — Flight staging
      [-73.6832, 42.7921], // Waterford (bottom of the Flight)
    ],
  },

  // ── Hudson River (Days 41–46) ────────────────────────────────────────────
  // Waterford → Catskill → Poughkeepsie → Haverstraw → NYC (Liberty Landing)
  // Follows the Hudson River channel south.
  {
    leg: "hudson",
    inland: true,
    coords: [
      [-73.6832, 42.7921], // Waterford
      [-73.73,   42.70],   // Troy / Federal Lock
      [-73.75,   42.60],   // tidal Hudson begins
      [-73.75,   42.48],   // south past Albany
      [-73.78,   42.38],   // continuing
      [-73.8652, 42.2179], // Catskill (Hop-O-Nose — mast re-step, rigging day)
      [-73.92,   42.10],   // Kingston / Rondout Creek
      [-73.95,   42.00],   // continuing south
      [-73.96,   41.90],   // Norrie Point / Rhinebeck
      [-73.9210, 41.7004], // Poughkeepsie
      [-73.92,   41.55],   // Beacon / Pollepel Island (Bannerman's Castle)
      [-73.97,   41.45],   // Cold Spring / Storm King
      [-74.00,   41.35],   // West Point / Bear Mountain
      [-73.9483, 41.1957], // Haverstraw (Haverstraw Bay)
      [-74.02,   41.05],   // Tappan Zee / Nyack
      [-73.98,   40.92],   // Yonkers
      [-74.00,   40.80],   // Spuyten Duyvil (Harlem River junction)
      [-74.02,   40.75],   // Hudson River, lower — the Palisades astern
      [-74.0444, 40.6947], // NYC — Liberty Landing Marina (Jersey City)
    ],
  },

  // ── Long Island Sound → Mystic → Old Saybrook (Days 47–52) ───────────────
  // NYC → East River/Hell Gate → Oyster Bay → Port Jefferson → Greenport →
  // Plum Gut → The Race → Mystic → Old Saybrook
  // Critical: the East River / Hell Gate narrows must follow the channel precisely.
  // The track runs PAST Old Saybrook to Mystic and doubles back, so the outbound
  // leg is taken south of Fishers Island and the return along the Connecticut
  // shore — they must not overlay each other.
  {
    leg: "sound-saybrook",
    inland: false,
    coords: [
      [-74.0444, 40.6947], // NYC — Liberty Landing (Hudson side, Jersey City)
      [-74.02,   40.69],   // around the Battery, south tip of Manhattan
      [-74.00,   40.70],   // Upper Bay, East River mouth
      [-73.99,   40.71],   // Brooklyn Bridge
      [-73.97,   40.715],  // Williamsburg Bridge
      [-73.96,   40.74],   // East River, Midtown east
      [-73.95,   40.757],  // Queensboro Bridge / Roosevelt Island
      [-73.93,   40.779],  // Hell Gate narrows
      [-73.89,   40.79],   // past Rikers Island, heading NE
      [-73.83,   40.80],   // Whitestone Bridge
      [-73.79,   40.81],   // Throgs Neck — entering western Long Island Sound
      [-73.72,   40.84],   // western LIS, heading east
      [-73.5337, 40.8676], // Oyster Bay / Cold Spring Harbor
      [-73.40,   40.89],   // east along LIS north shore
      [-73.25,   40.92],   // continuing east
      [-73.0693, 40.9462], // Port Jefferson
      [-72.85,   41.00],   // east
      [-72.65,   41.04],   // continuing
      [-72.3620, 41.1009], // Greenport (North Fork)
      [-72.2100, 41.1900], // Plum Gut, north of Orient Point — take it on the early ebb
      [-72.0900, 41.2300], // The Race
      [-71.9800, 41.2700], // south of Fishers Island, into Fishers Island Sound
      [-71.9700, 41.3200], // Mystic River mouth, past Noank
      [-71.9663, 41.3639], // Mystic (Seaport Museum Marina, north of the bascule)
      [-71.9700, 41.3150], // back down the Mystic River
      [-72.0200, 41.3050], // Groton Long Point
      [-72.0900, 41.3050], // mouth of the Thames, New London
      [-72.1900, 41.3000], // Niantic Bay
      [-72.3400, 41.2700], // Cornfield Point
      [-72.3765, 41.2948], // Old Saybrook (Saybrook Point Marina)
    ],
  },
];

/**
 * All route coordinates as a single flat array [lng, lat] for GeoJSON LineString use.
 * Segments share their endpoint with the next segment's start, so we de-duplicate.
 */
export const fullRoutePath: [number, number][] = routeSegments.flatMap(
  (seg, i) => (i === 0 ? seg.coords : seg.coords.slice(1))
);
