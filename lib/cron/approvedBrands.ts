export type ApprovalSource =
  | "Practical Sailor Best Choice"
  | "Practical Sailor Recommended"
  | "Cruising World Gear of the Year"
  | "BoatUS Safety Approved";

interface ApprovedBrand {
  brand: string;
  categories: string[];
  sources: ApprovalSource[];
}

// Seed from Practical Sailor gear lab archive (practical-sailor.com).
// Add brands here as you confirm their ratings. Category must match the
// checklist category string used in lib/cron/items.ts.
const APPROVED_BRANDS: ApprovedBrand[] = [
  { brand: "Mustang",          categories: ["safety"],    sources: ["Practical Sailor Best Choice"] },
  { brand: "Spinlock",         categories: ["safety"],    sources: ["Practical Sailor Best Choice"] },
  { brand: "ACR",              categories: ["safety"],    sources: ["Practical Sailor Best Choice", "BoatUS Safety Approved"] },
  { brand: "Ocean Signal",     categories: ["safety"],    sources: ["Practical Sailor Best Choice"] },
  { brand: "Orion",            categories: ["safety"],    sources: ["Practical Sailor Recommended"] },
  { brand: "Fireboy",          categories: ["safety"],    sources: ["Practical Sailor Recommended"] },
  { brand: "Garmin",           categories: ["navigation"]                , sources: ["Practical Sailor Best Choice"] },
  { brand: "Standard Horizon", categories: ["navigation"], sources: ["Practical Sailor Best Choice"] },
  { brand: "Icom",             categories: ["navigation"], sources: ["Practical Sailor Best Choice"] },
  // VERIFY: B&G (Navico) is well regarded for sailing electronics, but confirm the
  // exact Practical Sailor designation before trusting an alert on this brand.
  { brand: "B&G",              categories: ["navigation"], sources: ["Practical Sailor Recommended"] },
  // VERIFY: Airmar is the OEM behind most marine transducers (incl. Navico/B&G
  // branded ones). Confirm the exact Practical Sailor designation.
  { brand: "Airmar",           categories: ["navigation"], sources: ["Practical Sailor Recommended"] },
  { brand: "Rocna",            categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"] },
  { brand: "Mantus",           categories: ["boat-gear"], sources: ["Practical Sailor Recommended"] },
  { brand: "Fortress",         categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"] },
  { brand: "Polyform",         categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"] },
  { brand: "New England Ropes",categories: ["boat-gear"], sources: ["Practical Sailor Best Choice"] },
  { brand: "Samson",           categories: ["boat-gear"], sources: ["Practical Sailor Recommended"] },
  { brand: "Taylor Made",      categories: ["boat-gear"], sources: ["Practical Sailor Recommended"] },
  { brand: "Gill",             categories: ["personal"],  sources: ["Practical Sailor Best Choice"] },
  { brand: "Musto",            categories: ["personal"],  sources: ["Practical Sailor Recommended"] },
  { brand: "Henri Lloyd",      categories: ["personal"],  sources: ["Practical Sailor Recommended"] },
  { brand: "Petzl",            categories: ["personal"],  sources: ["Practical Sailor Recommended"] },
  { brand: "Black Diamond",    categories: ["personal"],  sources: ["Practical Sailor Recommended"] },
  { brand: "Costa",            categories: ["personal"],  sources: ["Practical Sailor Best Choice"] },
  { brand: "Sailrite",         categories: ["sails"],     sources: ["Practical Sailor Best Choice"] },
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
