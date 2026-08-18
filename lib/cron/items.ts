// Purchasable items drawn from lib/data/checklists.ts.
// Populate `asin` as you identify Amazon listings for each item —
// items without an ASIN skip Keepa and fall back to SerpAPI only.
export interface WatchedItem {
  id: string;
  label: string;
  category: string;
  priority: "critical" | "important" | "nice";
  brands: string[];     // first brand is used for the approval gate
  searchTerm: string;   // passed to SerpAPI google_shopping
  asin?: string;        // Amazon ASIN — enables Keepa price history
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
    brands: ["Spinlock"],
    searchTerm: "spinlock deckvest tether double clip safety",
  },
  {
    id: "s4", label: "EPIRB / PLB", category: "safety", priority: "critical",
    brands: ["ACR", "Ocean Signal"],
    searchTerm: "ACR GlobalFix EPIRB PLB marine safety beacon",
  },
  {
    id: "s6", label: "Marine flare kit day + night", category: "safety", priority: "critical",
    brands: ["Orion", "ACR"],
    searchTerm: "Orion marine flare kit day night signals coastal",
  },
  {
    id: "s7", label: "Marine fire extinguisher", category: "safety", priority: "critical",
    brands: ["Fireboy", "Kidde"],
    searchTerm: "marine fire extinguisher USCG approved B1",
  },
  {
    id: "s17", label: "SOS strobe light", category: "safety", priority: "important",
    brands: ["ACR", "Ocean Signal"],
    searchTerm: "ACR SOS strobe light waterproof marine",
  },

  // ── Navigation ──────────────────────────────────────────────────────
  // n2 (Garmin InReach Mini) intentionally omitted — already owned.
  {
    id: "n4", label: "Handheld VHF radio DSC GPS", category: "navigation", priority: "critical",
    brands: ["Standard Horizon", "Icom"],
    searchTerm: "handheld VHF radio DSC GPS floating waterproof marine",
  },
  {
    id: "n21", label: "Radar — B&G HALO24 dome w/ Doppler", category: "navigation", priority: "important",
    brands: ["B&G"],
    searchTerm: "B&G HALO24 radar dome Doppler",
  },
  {
    // In-hull (shoot-through) depth transducer — no hull penetration.
    // REQUIRES a solid fiberglass laminate below the waterline; will not
    // shoot through a cored, metal, or wood hull. Verify before buying.
    id: "n10", label: "In-hull depth transducer (Airmar P79)", category: "navigation", priority: "important",
    brands: ["Airmar"],
    searchTerm: "Airmar P79 in-hull depth transducer",
  },
  {
    id: "n9", label: "Autopilot wheel pilot", category: "navigation", priority: "critical",
    brands: ["Garmin"],
    searchTerm: "Garmin GHP Compact Reactor wheel pilot autopilot marine",
  },
  {
    id: "n16", label: "Portable battery banks 2x", category: "navigation", priority: "important",
    brands: ["Garmin", "Anker"],
    searchTerm: "Anker portable power bank 20000mah waterproof",
    asin: "B07QXV6N1B",
  },

  // ── Boat Gear ────────────────────────────────────────────────────────
  {
    id: "b1", label: "Dock lines 6-set", category: "boat-gear", priority: "critical",
    brands: ["New England Ropes", "Samson"],
    searchTerm: "New England Ropes dock lines half inch 25ft 50ft marine",
  },
  {
    id: "b3", label: "Fenders large cylindrical 4+", category: "boat-gear", priority: "critical",
    brands: ["Polyform", "Taylor Made"],
    searchTerm: "Polyform fenders cylindrical large boat bumpers",
  },
  {
    id: "b6", label: "Primary anchor Rocna / Mantus", category: "boat-gear", priority: "critical",
    brands: ["Rocna", "Mantus"],
    searchTerm: "Rocna anchor 33kg stainless sailing cruising",
  },
  {
    id: "b7", label: "Secondary Fortress / Danforth anchor", category: "boat-gear", priority: "important",
    brands: ["Fortress"],
    searchTerm: "Fortress FX-37 anchor aluminum danforth",
  },
  {
    id: "b18", label: "Sail repair kit", category: "sails", priority: "important",
    brands: ["Sailrite"],
    searchTerm: "Sailrite sail repair kit tape palm needle thread",
  },

  // ── Personal Gear ────────────────────────────────────────────────────
  {
    id: "p1", label: "Foul weather jacket + pants", category: "personal", priority: "critical",
    brands: ["Gill", "Musto", "Henri Lloyd"],
    searchTerm: "Gill offshore foul weather sailing jacket bib pants",
  },
  {
    id: "p5", label: "Polarized sailing sunglasses", category: "personal", priority: "important",
    brands: ["Costa"],
    searchTerm: "Costa polarized sailing sunglasses offshore UV400",
  },
  {
    id: "p13", label: "Headlamp with red-light mode", category: "personal", priority: "important",
    brands: ["Petzl", "Black Diamond"],
    searchTerm: "Petzl ACTIK headlamp red light mode waterproof",
    asin: "B085LPCK9N",
  },
];
