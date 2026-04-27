export type Leg = "lake-michigan" | "lake-huron" | "lake-erie" | "erie-canal" | "hudson" | "coast-philly" | "sound-saybrook";

export interface Waypoint {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  day: number;
  leg: Leg;
  isLayover?: boolean;
  notes?: string;
  marina?: string;
  fuel?: boolean;
  pumpout?: boolean;
}

export interface ItineraryDay {
  day: number;
  from: string;
  to: string;
  distanceNm: number;
  locks: number;
  leg: Leg;
  overnight: string;
  route: "both" | "philly" | "saybrook"; // which destination option this day belongs to
  highlights: string[];
  warnings: string[];
  notes: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  checked?: boolean;
  priority?: "critical" | "important" | "nice";
  notes?: string;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  emoji: string;
  items: ChecklistItem[];
}

export interface JournalEntry {
  id: string;
  date: string;       // ISO date string
  day: number;        // trip day number
  title: string;
  body: string;
  location: string;
  createdAt: string;
}
