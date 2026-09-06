export type ApprovalSource =
  | "Practical Sailor Best Choice"
  | "Practical Sailor Recommended"
  | "Cruising World Gear of the Year"
  | "BoatUS Safety Approved"
  // For categories where brand reputation is NOT the quality signal — solar
  // panels, power banks, jerry cans. The marine-branded version of these is
  // usually the same product at a markup, so requiring a marine seal would
  // reject exactly the right answer. These pass on price alone.
  | "Commodity — no marine seal required";

export interface ApprovedBrand {
  brand: string;
  categories: string[];
  sources: ApprovalSource[];
  /**
   * Whether the designation above has actually been confirmed against the
   * source publication. IMPORTANT: everything here currently reads `false` —
   * these entries were seeded from general reputation, not from checking
   * Practical Sailor's archive. Gate 2 therefore rests on unconfirmed
   * assertions. Confirm a brand before trusting an alert on it, then flip
   * this to `true`. `npm run validate:watchlist` reports the running count.
   */
  verified: boolean;
}

export const APPROVED_BRANDS: ApprovedBrand[] = [
  // ── Safety ───────────────────────────────────────────────────────────
  { brand: "Mustang",           categories: ["safety"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Spinlock",          categories: ["safety"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "ACR",               categories: ["safety"], sources: ["Practical Sailor Best Choice", "BoatUS Safety Approved"], verified: false },
  { brand: "Ocean Signal",      categories: ["safety"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Orion",             categories: ["safety"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Fireboy",           categories: ["safety"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Wichard",           categories: ["safety"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Lifesling",         categories: ["safety"], sources: ["BoatUS Safety Approved"], verified: false },
  { brand: "Davis",             categories: ["safety"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Whale",             categories: ["safety"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Jabsco",            categories: ["safety"], sources: ["Practical Sailor Recommended"], verified: false },

  // ── Navigation ───────────────────────────────────────────────────────
  { brand: "Garmin",            categories: ["navigation"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Standard Horizon",  categories: ["navigation"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Icom",              categories: ["navigation"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "B&G",               categories: ["navigation"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Airmar",            categories: ["navigation"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Vesper",            categories: ["navigation"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "em-trak",           categories: ["navigation"], sources: ["Practical Sailor Recommended"], verified: false },

  // ── Electrical / Power ───────────────────────────────────────────────
  // Added after the deal-hunter missed a 28%-off Battle Born sale because
  // this whole category had no approved brands.
  { brand: "Battle Born",       categories: ["electrical"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Victron",           categories: ["electrical"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Dakota Lithium",    categories: ["electrical"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Epoch",             categories: ["electrical"], sources: ["Commodity — no marine seal required"], verified: false },
  { brand: "Renogy",            categories: ["electrical"], sources: ["Commodity — no marine seal required"], verified: false },
  { brand: "Rich Solar",        categories: ["electrical"], sources: ["Commodity — no marine seal required"], verified: false },
  { brand: "Anker",             categories: ["electrical"], sources: ["Commodity — no marine seal required"], verified: false },

  // ── Boat Gear ────────────────────────────────────────────────────────
  { brand: "Rocna",             categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Mantus",            categories: ["boat-gear"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Fortress",          categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Polyform",          categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "New England Ropes", categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Samson",            categories: ["boat-gear"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Taylor Made",       categories: ["boat-gear"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Lewmar",            categories: ["boat-gear"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Harken",            categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Scepter",           categories: ["boat-gear"], sources: ["Commodity — no marine seal required"], verified: false },

  // ── Dinghy & Tender ──────────────────────────────────────────────────
  { brand: "Achilles",          categories: ["dinghy"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "AB Inflatables",    categories: ["dinghy"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Highfield",         categories: ["dinghy"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Torqeedo",          categories: ["dinghy"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Honda",             categories: ["dinghy"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Tohatsu",           categories: ["dinghy"], sources: ["Practical Sailor Recommended"], verified: false },

  // ── Personal Gear ────────────────────────────────────────────────────
  { brand: "Gill",              categories: ["personal"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Musto",             categories: ["personal"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Henri Lloyd",       categories: ["personal"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Zhik",              categories: ["personal"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Dubarry",           categories: ["personal"], sources: ["Practical Sailor Best Choice"], verified: false },
  { brand: "Xtratuf",           categories: ["personal"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Petzl",             categories: ["personal"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Black Diamond",     categories: ["personal"], sources: ["Practical Sailor Recommended"], verified: false },
  { brand: "Costa",             categories: ["personal"], sources: ["Practical Sailor Best Choice"], verified: false },

  // ── Medical ──────────────────────────────────────────────────────────
  { brand: "Adventure Medical Kits", categories: ["medical"], sources: ["Practical Sailor Best Choice"], verified: false },

  // ── Sails & Rigging ──────────────────────────────────────────────────
  { brand: "Sailrite",          categories: ["sails"], sources: ["Practical Sailor Best Choice"], verified: false },
];

export function getApproval(brand: string, category: string): ApprovedBrand | null {
  return (
    APPROVED_BRANDS.find(
      (b) =>
        b.brand.toLowerCase() === brand.toLowerCase() &&
        b.categories.includes(category)
    ) ?? null
  );
}
