import {
  Anchor, Backpack, BriefcaseMedical, Compass, CookingPot, LifeBuoy, Sailboat, Wind,
  type LucideIcon,
} from "lucide-react";
import { checklists } from "@/lib/data/checklists";
import { LEG_ORDER, legStyle } from "@/lib/data/legStyle";
import type { ChecklistGroup, ChecklistItem } from "@/lib/types";

// Presentation layer for the provisioning lockers. Each category borrows one
// hue from the voyage spectrum (in list order), so the readiness ring reads as
// the same dawn → dusk band the route uses everywhere else.

export type Priority = NonNullable<ChecklistItem["priority"]>;

export interface CategoryMeta {
  short: string;
  icon: LucideIcon;
  color: string;
}

const META: Record<string, Omit<CategoryMeta, "color">> = {
  safety:       { short: "Safety",     icon: LifeBuoy },
  navigation:   { short: "Navigation", icon: Compass },
  "boat-gear":  { short: "Boat",       icon: Anchor },
  dinghy:       { short: "Tender",     icon: Sailboat },
  personal:     { short: "Personal",   icon: Backpack },
  medical:      { short: "Medical",    icon: BriefcaseMedical },
  provisioning: { short: "Galley",     icon: CookingPot },
  sails:        { short: "Rigging",    icon: Wind },
};

export function categoryMeta(group: ChecklistGroup): CategoryMeta {
  const i = checklists.findIndex(g => g.id === group.id);
  const color = legStyle(LEG_ORDER[(i < 0 ? 0 : i) % LEG_ORDER.length]).color;
  const m = META[group.id] ?? { short: group.title, icon: Anchor };
  return { ...m, color };
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  critical: "Critical",
  important: "Important",
  nice: "Nice to have",
};

export const ALL_ITEMS = checklists.flatMap(g => g.items);
export const TOTAL_ITEMS = ALL_ITEMS.length;
export const CRITICAL_ITEMS = ALL_ITEMS.filter(i => i.priority === "critical");
