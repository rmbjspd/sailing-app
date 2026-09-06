// Purchasable items drawn from lib/data/checklists.ts, plus an `electrical`
// category the checklist doesn't cover.
//
// Only track things where a price alert is ACTIONABLE: branded, purchasable
// goods. Consumables, documents, services, and custom-fabricated items
// (dodger, bimini, sails) are deliberately excluded — there's no meaningful
// "price" to watch.
//
// Every brand listed on an item MUST be approved in that item's category, or
// the item can never alert. `npm run validate:watchlist` enforces this.
export interface WatchedItem {
  id: string;
  label: string;
  category: string;
  priority: "critical" | "important" | "nice";
  brands: string[];     // ALL must be approved in `category` — see validator
  searchTerm: string;   // passed to Google Shopping
  asin?: string;        // Amazon ASIN, where one is known
}

export const WATCHED_ITEMS: WatchedItem[] = [
  // ── Safety ──────────────────────────────────────────────────────────
  {
    id: "s1", label: "Inflatable PFD-harness", category: "safety", priority: "critical",
    brands: ["Mustang", "Spinlock"],
    searchTerm: "inflatable pfd harness sailing offshore",
  },
  {
    id: "s2", label: "Safety tethers double-clip 4-set", category: "safety", priority: "critical",
    brands: ["Spinlock", "Wichard"],
    searchTerm: "sailing safety tether double clip offshore",
  },
  {
    id: "s3", label: "Jacklines bow to stern", category: "safety", priority: "critical",
    brands: ["Wichard"],
    searchTerm: "sailboat jackline webbing bow to stern safety",
  },
  {
    id: "s4", label: "EPIRB / PLB", category: "safety", priority: "critical",
    brands: ["ACR", "Ocean Signal"],
    searchTerm: "ACR GlobalFix EPIRB PLB marine safety beacon",
  },
  {
    id: "s5", label: "Lifesling / horseshoe buoy + throw line", category: "safety", priority: "critical",
    brands: ["Lifesling"],
    searchTerm: "Lifesling overboard rescue system marine",
  },
  {
    id: "s6", label: "Marine flare kit day + night", category: "safety", priority: "critical",
    brands: ["Orion", "ACR"],
    searchTerm: "Orion marine flare kit day night signals coastal",
  },
  {
    // "Kidde" was listed here previously but is not an approved safety brand,
    // so the gate silently ignored it while the search still returned Kidde
    // products. Dropped to keep search and approval consistent.
    id: "s7", label: "Marine fire extinguisher", category: "safety", priority: "critical",
    brands: ["Fireboy"],
    searchTerm: "marine fire extinguisher USCG approved",
  },
  {
    id: "s8", label: "Electric bilge pump", category: "safety", priority: "critical",
    brands: ["Whale", "Jabsco"],
    searchTerm: "electric marine bilge pump 12V",
  },
  {
    id: "s9", label: "Manual bilge pump with handle", category: "safety", priority: "critical",
    brands: ["Whale"],
    searchTerm: "Whale manual bilge pump Gusher marine",
  },
  {
    id: "s16", label: "Radar reflector", category: "safety", priority: "important",
    brands: ["Davis"],
    searchTerm: "Davis Echomaster radar reflector sailboat",
  },
  {
    id: "s17", label: "SOS strobe light", category: "safety", priority: "important",
    brands: ["ACR", "Ocean Signal"],
    searchTerm: "ACR SOS strobe light waterproof marine",
  },

  // ── Navigation ──────────────────────────────────────────────────────
  // n2 (Garmin InReach Mini) intentionally omitted — already owned.
  // n10 (depth sounder) intentionally omitted — already aboard.
  {
    id: "n4", label: "Handheld VHF radio DSC GPS", category: "navigation", priority: "critical",
    brands: ["Standard Horizon", "Icom"],
    searchTerm: "handheld VHF radio DSC GPS floating waterproof marine",
  },
  {
    // Was missing entirely despite being a `critical` checklist item and one
    // of the most expensive things on the list.
    id: "n11", label: "AIS Class B transceiver (transmit + receive)", category: "navigation", priority: "critical",
    brands: ["Vesper", "em-trak"],
    searchTerm: "AIS Class B transceiver transmit marine SOTDMA",
  },
  {
    id: "n9", label: "Autopilot wheel pilot", category: "navigation", priority: "critical",
    brands: ["Garmin"],
    searchTerm: "Garmin Compact Reactor wheel pilot autopilot marine",
  },
  {
    // NOTE: sized for a larger boat. On the Oceanis 30.1 the lighter HALO20+
    // is the better fit — weight aloft and power draw both matter more on a
    // 9,100 lb hull. Left as-is pending a call on which to track.
    id: "n21", label: "Radar — B&G HALO24 dome w/ Doppler", category: "navigation", priority: "important",
    brands: ["B&G"],
    searchTerm: "B&G HALO24 radar dome Doppler",
  },
  {
    // In-hull (shoot-through) CHIRP fishfinder transducer.
    // Two hard constraints:
    //   1. REQUIRES solid fiberglass laminate below the waterline. Will not
    //      shoot through a cored, metal, or wood hull.
    //   2. Down/side IMAGING cannot work in-hull at any price — those beams
    //      need wet contact. In-hull tops out at 2D/CHIRP sonar.
    id: "n10b", label: "In-hull CHIRP fishfinder transducer (Airmar M285HW)", category: "navigation", priority: "nice",
    brands: ["Airmar"],
    searchTerm: "Airmar M285HW in-hull CHIRP transducer",
  },

  // ── Electrical / Power ───────────────────────────────────────────────
  // Category absent from checklists.ts entirely. Added after the scan missed
  // a 28%-off Battle Born sale it had no way to see.
  {
    id: "e1", label: "LiFePO4 house battery 100Ah", category: "electrical", priority: "critical",
    brands: ["Battle Born", "Dakota Lithium", "Epoch"],
    searchTerm: "100Ah 12V LiFePO4 lithium deep cycle battery marine",
  },
  {
    id: "e2", label: "MPPT solar charge controller (100/30)", category: "electrical", priority: "important",
    brands: ["Victron"],
    searchTerm: "Victron SmartSolar MPPT 100/30 charge controller",
  },
  {
    // Non-optional with lithium: protects the alternator from being pulled to
    // 100% output continuously by a bank that never tapers.
    id: "e3", label: "DC-DC charger (alternator protection)", category: "electrical", priority: "critical",
    brands: ["Victron"],
    searchTerm: "Victron Orion-TR Smart DC-DC charger 12/12",
  },
  {
    id: "e4", label: "Solar panels 100W rigid", category: "electrical", priority: "important",
    brands: ["Renogy", "Rich Solar"],
    searchTerm: "100W 12V monocrystalline rigid solar panel",
  },
  {
    // Moved from `navigation`, where it was passing the brand gate on Garmin's
    // approval while the product actually searched for is an Anker power bank.
    id: "n16", label: "Portable battery banks 2x", category: "electrical", priority: "important",
    brands: ["Anker"],
    searchTerm: "Anker portable power bank 20000mah waterproof",
    asin: "B07QXV6N1B",
  },

  // ── Boat Gear ────────────────────────────────────────────────────────
  {
    id: "b1", label: "Dock lines 6-set", category: "boat-gear", priority: "critical",
    brands: ["New England Ropes", "Samson"],
    searchTerm: "New England Ropes dock lines half inch marine",
  },
  {
    id: "b3", label: "Fenders large cylindrical 4+", category: "boat-gear", priority: "critical",
    brands: ["Polyform", "Taylor Made"],
    searchTerm: "Polyform cylindrical boat fenders large",
  },
  {
    id: "b6", label: "Primary anchor Rocna / Mantus", category: "boat-gear", priority: "critical",
    brands: ["Rocna", "Mantus"],
    searchTerm: "Rocna anchor galvanized sailing cruising",
  },
  {
    id: "b7", label: "Secondary Fortress / Danforth anchor", category: "boat-gear", priority: "important",
    brands: ["Fortress"],
    searchTerm: "Fortress anchor aluminum danforth marine",
  },
  {
    id: "b8", label: "Jerry cans 2x 5-gallon diesel", category: "boat-gear", priority: "critical",
    brands: ["Scepter"],
    searchTerm: "Scepter 5 gallon diesel jerry can marine",
  },
  {
    id: "b22", label: "Winch handles (primary + spare)", category: "boat-gear", priority: "important",
    brands: ["Lewmar", "Harken"],
    searchTerm: "Lewmar winch handle sailboat locking",
  },

  // ── Dinghy & Tender ──────────────────────────────────────────────────
  // Whole category was missing.
  {
    id: "d1", label: "Inflatable dinghy 8-10ft roll-up", category: "dinghy", priority: "important",
    brands: ["Achilles", "AB Inflatables", "Highfield"],
    searchTerm: "inflatable dinghy 9ft roll up floor tender",
  },
  {
    id: "d2", label: "Outboard 2-4hp for tender", category: "dinghy", priority: "important",
    brands: ["Honda", "Tohatsu", "Torqeedo"],
    searchTerm: "outboard motor 2.5hp 4 stroke portable dinghy",
  },

  // ── Personal Gear ────────────────────────────────────────────────────
  {
    id: "p1", label: "Foul weather jacket + pants", category: "personal", priority: "critical",
    brands: ["Gill", "Musto", "Henri Lloyd", "Zhik"],
    searchTerm: "offshore foul weather sailing jacket bib pants",
  },
  {
    id: "p19", label: "Offshore bibs + sea boots (helm crew)", category: "personal", priority: "important",
    brands: ["Dubarry", "Xtratuf", "Gill"],
    searchTerm: "offshore sailing sea boots waterproof",
  },
  {
    id: "p5", label: "Polarized sailing sunglasses", category: "personal", priority: "important",
    brands: ["Costa"],
    searchTerm: "Costa polarized sailing sunglasses UV400",
  },
  {
    id: "p13", label: "Headlamp with red-light mode", category: "personal", priority: "important",
    brands: ["Petzl", "Black Diamond"],
    searchTerm: "headlamp red light mode waterproof",
    asin: "B085LPCK9N",
  },

  // ── Medical ──────────────────────────────────────────────────────────
  {
    id: "m1", label: "Comprehensive marine first aid kit", category: "medical", priority: "critical",
    brands: ["Adventure Medical Kits"],
    searchTerm: "Adventure Medical Kits marine first aid kit offshore",
  },

  // ── Sails & Rigging ──────────────────────────────────────────────────
  {
    id: "b18", label: "Sail repair kit", category: "sails", priority: "important",
    brands: ["Sailrite"],
    searchTerm: "Sailrite sail repair kit tape palm needle thread",
  },
];
