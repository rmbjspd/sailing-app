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
  // ── Lake Michigan ─────────────────────────────────────────────────────────
  // Chicago → St. Joseph → Grand Haven → Ludington → Leland → Mackinac Island
  // Hugs the eastern shoreline of Lake Michigan northward.
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
      [-86.4545, 43.9551], // Ludington
      [-86.30,   44.40],   // northward along coast
      [-86.10,   44.75],   // toward Sleeping Bear
      [-85.95,   44.95],   // Sleeping Bear area, clear of peninsula
      [-85.7632, 45.0231], // Leland
      [-85.55,   45.25],   // north of Leelanau Peninsula
      [-85.20,   45.55],   // crossing northward
      [-84.95,   45.75],   // approaching Straits of Mackinac
      [-84.7200, 45.8200], // Straits of Mackinac, west approach
      [-84.6190, 45.8493], // Mackinac Island
    ],
  },

  // ── North Channel (Straits → Drummond → Manitoulin → Georgian Bay) ────────
  // Mackinac Island → Drummond Island → Meldrum Bay → Gore Bay →
  // Little Current → Baie Fine/Killarney → Tobermory
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
      [-82.15,   45.96],   // continuing east along north shore
      [-81.9250, 45.9783], // Little Current
      [-81.75,   45.97],   // east of Little Current
      [-81.5111, 45.9712], // Baie Fine / Killarney
      [-81.40,   45.90],   // heading south toward Georgian Bay
      [-81.30,   45.75],   // Georgian Bay approach
      [-81.40,   45.50],   // south along Georgian Bay
      [-81.55,   45.25],   // continuing south
      [-81.6650, 45.2536], // Tobermory
    ],
  },

  // ── Lake Huron (Georgian Bay → Lake Huron west shore → Port Huron) ────────
  // Tobermory → Kincardine → Port Huron
  // Follows Ontario's eastern Lake Huron shoreline south.
  {
    leg: "lake-huron",
    inland: false,
    coords: [
      [-81.6650, 45.2536], // Tobermory
      [-81.68,   44.90],   // south along Bruce Peninsula
      [-81.65,   44.60],   // continuing south
      [-81.63,   44.40],   // toward Kincardine
      [-81.6363, 44.1745], // Kincardine
      [-81.55,   43.80],   // south along Huron shore
      [-81.42,   43.45],   // continuing
      [-81.30,   43.15],   // approaching southern Lake Huron
      [-82.10,   43.00],   // rounding thumb of Michigan, offshore
      [-82.30,   42.98],   // toward Port Huron
      [-82.4249, 42.9709], // Port Huron / Sarnia
    ],
  },

  // ── St. Clair River / Lake St. Clair (Port Huron → Detroit) ──────────────
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

  // ── Lake Erie ─────────────────────────────────────────────────────────────
  // Detroit → Put-in-Bay → Cleveland → Erie → Buffalo/Tonawanda
  {
    leg: "lake-erie",
    inland: false,
    coords: [
      [-83.0458, 42.3314], // Detroit
      [-82.90,   42.15],   // heading into Lake Erie
      [-82.8182, 41.6534], // Put-in-Bay (South Bass Island)
      [-82.50,   41.60],   // east across Lake Erie
      [-82.00,   41.55],   // mid-lake
      [-81.6944, 41.4993], // Cleveland
      [-81.20,   41.50],   // east
      [-80.60,   41.55],   // approaching Erie
      [-80.0851, 42.1292], // Erie PA (Presque Isle Bay)
      [-79.60,   42.55],   // east toward Buffalo
      [-79.00,   42.75],   // approaching Niagara
      [-78.8798, 43.0226], // Buffalo / Tonawanda — Black Rock Canal
    ],
  },

  // ── Erie Canal ────────────────────────────────────────────────────────────
  // Buffalo/Tonawanda → Medina/Brockport → Pittsford → Sylvan Beach →
  // Ilion/Little Falls → Waterford
  // Follows the Barge Canal alignment through the Mohawk Valley.
  {
    leg: "erie-canal",
    inland: true,
    coords: [
      [-78.8798, 43.0226], // Buffalo / Tonawanda (Black Rock Canal)
      [-78.70,   43.08],   // canal east of Tonawanda
      [-78.40,   43.12],   // Lockport area
      [-77.9391, 43.2128], // Medina / Brockport
      [-77.70,   43.18],   // west of Rochester
      [-77.5197, 43.0892], // Pittsford (Rochester area)
      [-77.20,   43.05],   // Fairport area
      [-76.90,   43.07],   // continuing east
      [-76.58,   43.12],   // Clyde
      [-76.20,   43.15],   // approaching Oneida Lake
      [-75.90,   43.18],   // Oneida Lake west end
      [-75.7251, 43.2009], // Sylvan Beach (Oneida Lake east end)
      [-75.45,   43.16],   // canal resumes east
      [-75.20,   43.10],   // Rome area
      [-75.0349, 43.0137], // Ilion / Little Falls
      [-74.80,   42.98],   // toward Herkimer
      [-74.50,   42.90],   // Amsterdam area
      [-74.10,   42.82],   // Schenectady approach
      [-73.90,   42.82],   // Waterford approach
      [-73.6832, 42.7921], // Waterford (junction Erie/Champlain canals)
    ],
  },

  // ── Hudson River ──────────────────────────────────────────────────────────
  // Waterford → Catskill → Poughkeepsie/Newburgh → NYC (Liberty Landing)
  // Follows the Hudson River channel south.
  {
    leg: "hudson",
    inland: true,
    coords: [
      [-73.6832, 42.7921], // Waterford
      [-73.73,   42.70],   // Troy / Federal Lock
      [-73.75,   42.60],   // tidal Hudson begins
      [-73.75,   42.48],   // south
      [-73.78,   42.38],   // continuing
      [-73.8652, 42.2179], // Catskill
      [-73.92,   42.10],   // Kingston area
      [-73.95,   42.00],   // continuing south
      [-73.96,   41.90],   // Rhinebeck area
      [-73.9210, 41.7004], // Poughkeepsie / Newburgh
      [-73.92,   41.55],   // Beacon area
      [-73.97,   41.45],   // Cold Spring
      [-74.00,   41.35],   // West Point / Bear Mountain
      [-74.02,   41.20],   // Haverstraw Bay
      [-74.02,   41.05],   // Tappan Zee / Nyack
      [-73.98,   40.92],   // Yonkers
      [-74.00,   40.80],   // Spuyten Duyvil (Harlem River junction)
      [-74.02,   40.75],   // Hudson River, lower
      [-74.0444, 40.6947], // NYC — Liberty Landing Marina (Jersey City)
    ],
  },

  // ── Long Island Sound → Old Saybrook ─────────────────────────────────────
  // NYC → East River/Hell Gate → Oyster Bay → Port Jefferson →
  // Greenport → Old Saybrook
  // Critical: East River / Hell Gate narrows must follow the channel precisely.
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
      [-72.37,   41.20],   // Plum Gut approach (north of Orient Point)
      [-72.35,   41.28],   // The Race approach
      [-72.37,   41.30],   // Connecticut shore
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
