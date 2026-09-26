/**
 * Hand-digitized water-following polyline for the S/V Sabbatical voyage:
 * Winthrop Harbor → Old Saybrook via Great Lakes, Erie Canal, Hudson River, Long Island Sound.
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
 * Baie Fine is a dead-end fjord, so the north-channel track doubles back down it
 * rather than cutting across the La Cloche ridge to Killarney.
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
  // ── Lake Michigan (Days 1–6) ─────────────────────────────────────────────
  // Winthrop Harbor → Holland → Ludington → Leland → Beaver Island → Mackinac
  // A near-straight 74nm crossing to Holland, then north up the eastern shore,
  // through the Manitou Passage, and across to Beaver Island and the Straits.
  {
    leg: "lake-michigan",
    inland: false,
    coords: [
      [-87.8039, 42.4889], // Winthrop Harbor (North Point Marina) — trip start
      [-86.2130, 42.7730], // Holland channel, after the open crossing
      [-86.1861, 42.7906], // Holland (Lake Macatawa)
      [-86.2500, 43.0600], // past Grand Haven (bail-out)
      [-86.3500, 43.5000], // past Muskegon / White Lake / Pentwater
      [-86.4545, 43.9551], // Ludington
      [-86.5300, 44.0600], // Big Sable Point, rounded in the morning
      [-86.3500, 44.3000], // past Manistee
      [-86.2700, 44.6900], // Point Betsie
      [-86.1000, 44.8500], // offshore Sleeping Bear bluffs
      [-86.0925, 45.0119], // South Manitou Island (optional anchor stop)
      [-85.7632, 45.0231], // Leland (Fishtown) — via the Manitou Passage
      [-85.5930, 45.1850], // Cathead Point, standing a mile off the shoal
      [-85.5189, 45.7467], // Beaver Island (St. James / Paradise Bay)
      [-85.1300, 45.7700], // Grays Reef Passage
      [-84.7200, 45.8200], // Straits of Mackinac, west approach
      [-84.6190, 45.8493], // Mackinac Island
    ],
  },

  // ── North Channel / Georgian Bay (Days 7–15) ─────────────────────────────
  // Mackinac Island → Drummond Island → Meldrum Bay → Benjamin Islands →
  // Kagawong → Little Current → Baie Fine/The Pool → Killarney → Tobermory
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
      [-82.80,   45.93],   // along Manitoulin north shore
      [-82.60,   45.95],   // north of Clapperton Island, past Gore Bay
      [-82.2529, 46.0885], // Benjamin Islands (anchor)
      [-82.2530, 45.8980], // Kagawong (Bridal Veil Falls, lunch stop)
      [-81.9250, 45.9783], // Little Current (swing bridge, on the hour)
      [-81.7200, 46.0100], // Landsdowne Channel into Frazer Bay
      [-81.6800, 46.0300], // Baie Fine entrance bar — favour the north side
      [-81.5500, 46.0500], // The Pool (anchor, Days 11–12)
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

  // ── Lake Huron (Days 16–18) ──────────────────────────────────────────────
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

  // ── St. Clair River / Lake St. Clair (Day 19) ────────────────────────────
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

  // ── Lake Erie (Days 20–25) ───────────────────────────────────────────────
  // Detroit → Put-in-Bay → Cleveland → Ashtabula → Erie → Buffalo/Tonawanda
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
      [-79.70,   42.35],   // past Barcelona Harbor (bail-out)
      [-79.35,   42.52],   // off Dunkirk / Chadwick Bay (bail-out)
      [-79.00,   42.75],   // approaching Niagara / Buffalo breakwall
      [-78.8798, 43.0226], // Buffalo / Tonawanda — Black Rock Canal
    ],
  },

  // ── Erie Canal (Days 26–35) ──────────────────────────────────────────────
  // Buffalo/Tonawanda → Albion → Fairport → Clyde → Brewerton → Rome →
  // Little Falls → Canajoharie → Schenectady → Waterford
  // Follows the Barge Canal alignment through the Mohawk Valley.
  {
    leg: "erie-canal",
    inland: true,
    coords: [
      [-78.8798, 43.0226], // Buffalo / Tonawanda (Black Rock Canal)
      [-78.70,   43.08],   // canal east of Tonawanda
      [-78.69,   43.17],   // Lockport — Locks E-35 / E-34
      [-78.3872, 43.2192], // Medina (lunch stop)
      [-78.1933, 43.2456], // Albion
      [-77.94,   43.21],   // Brockport
      [-77.70,   43.18],   // Spencerport, west of Rochester
      [-77.5197, 43.0892], // Pittsford (Schoen Place, fallback)
      [-77.4425, 43.0987], // Fairport — red lift bridge
      [-77.23,   43.06],   // Palmyra
      [-76.9885, 43.0639], // Lyons (lunch stop)
      [-76.8694, 43.0839], // Clyde
      [-76.55,   43.05],   // May's Point / Cayuga-Seneca junction, Montezuma
      [-76.3325, 43.1583], // Baldwinsville (Lock E-24, fallback)
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

  // ── Hudson River (Days 36–40) ────────────────────────────────────────────
  // Waterford → Catskill → Poughkeepsie → NYC (Liberty Landing)
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
      [-73.9483, 41.1957], // Haverstraw Bay (fallback stop if the light is wrong)
      [-74.02,   41.05],   // Tappan Zee / Nyack
      [-73.98,   40.92],   // Yonkers
      [-74.00,   40.80],   // Spuyten Duyvil (Harlem River junction)
      [-74.02,   40.75],   // Hudson River, lower — the Palisades astern
      [-74.0444, 40.6947], // NYC — Liberty Landing Marina (Jersey City)
    ],
  },

  // ── Long Island Sound → Old Saybrook (Days 41–44) ────────────────────────
  // NYC → East River/Hell Gate → Oyster Bay → Port Jefferson → Greenport →
  // Plum Gut → Old Saybrook
  // Critical: the East River / Hell Gate narrows must follow the channel precisely.
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
      [-72.2700, 41.1300], // Gardiners Bay, east toward Orient Point
      [-72.2150, 41.1700], // Plum Gut — take it on the early ebb
      [-72.2600, 41.2300], // eastern Long Island Sound, heading NW
      [-72.3400, 41.2700], // off Cornfield Point
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
