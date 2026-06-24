import type { CrewSignup, CrewSignupInput, AddResult } from "./types";

/**
 * Persistence boundary for crew sign-ups. Backend-agnostic and async so the
 * implementation can be SQLite (local dev) or a hosted DB (production) without
 * touching the API/UI. The store is the sole authority on the per-leg cap,
 * duplicate prevention, and closed-leg rules.
 */
export interface CrewStore {
  /** All sign-ups across all legs, oldest first. */
  listAll(): Promise<CrewSignup[]>;
  /** Atomically add a member to a leg, enforcing closed/duplicate/full rules. */
  addToLeg(legId: string, input: CrewSignupInput): Promise<AddResult>;
  /** Remove a sign-up by id. Resolves true if a row was deleted. */
  remove(id: string): Promise<boolean>;
}

let store: CrewStore | null = null;

/**
 * Lazily-created singleton store. Uses Supabase when SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY are set (e.g. on Vercel, whose filesystem is
 * read-only), otherwise the local SQLite file. Dynamic imports keep
 * better-sqlite3 (a native addon) out of the bundle when Supabase is in use.
 * Server-only — never import from client code.
 */
export async function getCrewStore(): Promise<CrewStore> {
  if (store) return store;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { SupabaseCrewStore } = await import("./supabaseStore");
    store = new SupabaseCrewStore();
  } else {
    const { SqliteCrewStore } = await import("./sqliteStore");
    store = new SqliteCrewStore();
  }
  return store;
}
