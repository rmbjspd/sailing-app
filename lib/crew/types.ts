// Domain types for the crew sign-up feature. The captain is NEVER modelled here:
// they are implicit on every leg, never stored, never counted. The cap of 3 is
// crew-only.

export interface CrewSignup {
  id: string;
  legId: string;
  name: string;
  contact: string;
  note: string | null;
  createdAt: string; // ISO 8601
}

export interface CrewSignupInput {
  name: string;
  contact: string;
  note?: string | null;
}

/** Result of attempting to add a crew member to a leg. */
export type AddResult =
  | { ok: true; member: CrewSignup }
  | { ok: false; reason: "closed" | "full" | "duplicate" | "invalid"; message: string };

/** Maximum input lengths (chars). Enforced by validation and the DB schema. */
export const FIELD_LIMITS = { name: 100, contact: 200, note: 500 } as const;

// ── Roster view models (client-safe: no node imports) ───────────────────────
export interface RosterMember {
  id: string;
  name: string;
  contact: string;
  note: string | null;
  createdAt: string;
}

export interface RosterLeg {
  legId: string;
  title: string;
  dayRange: string;
  dateRange: string;
  accent: string;
  closed: boolean;
  capacity: number;
  taken: number;
  spotsRemaining: number;
  members: RosterMember[];
}
