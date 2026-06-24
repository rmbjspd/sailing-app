import type { CrewSignup, CrewSignupInput, AddResult } from "./types";

/**
 * Persistence boundary for crew sign-ups. Kept deliberately small and backend-
 * agnostic so the SQLite implementation can be swapped for a hosted DB later
 * without touching the API/UI. The store is the sole authority on the per-leg
 * cap, duplicate prevention, and closed-leg rules.
 */
export interface CrewStore {
  /** All sign-ups across all legs, oldest first. */
  listAll(): CrewSignup[];
  /** Atomically add a member to a leg, enforcing closed/duplicate/full rules. */
  addToLeg(legId: string, input: CrewSignupInput): AddResult;
  /** Remove a sign-up by id. Returns true if a row was deleted. */
  remove(id: string): boolean;
}
