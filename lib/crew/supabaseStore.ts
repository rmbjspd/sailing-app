import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CrewStore } from "./store";
import type { CrewSignup, CrewSignupInput, AddResult } from "./types";
import { isLegClosed, isKnownLeg } from "./legs";

// Hosted-Postgres store for production (Vercel's filesystem is read-only, so the
// SQLite-on-disk store can't run there). Uses the service-role key server-side
// only. The per-leg cap + dedupe are enforced atomically by the `signup_for_leg`
// Postgres function (see supabase/schema.sql) using a per-leg advisory lock, so
// concurrent sign-ups can never exceed the cap.

interface SignupRpcRow {
  result: "ok" | "duplicate" | "full";
  id: string | null;
  created_at: string | null;
}

interface CrewRow {
  id: string;
  leg_id: string;
  name: string;
  contact: string;
  note: string | null;
  created_at: string;
}

export class SupabaseCrewStore implements CrewStore {
  private readonly db: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
    }
    this.db = createClient(url, key, { auth: { persistSession: false } });
  }

  async listAll(): Promise<CrewSignup[]> {
    const { data, error } = await this.db
      .from("crew_signup")
      .select("id, leg_id, name, contact, note, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(`roster query failed: ${error.message}`);
    return (data ?? []).map((r: CrewRow) => ({
      id: r.id,
      legId: r.leg_id,
      name: r.name,
      contact: r.contact,
      note: r.note,
      createdAt: r.created_at,
    }));
  }

  async addToLeg(legId: string, input: CrewSignupInput): Promise<AddResult> {
    if (!isKnownLeg(legId)) return { ok: false, reason: "invalid", message: "Unknown leg." };
    if (isLegClosed(legId))
      return { ok: false, reason: "closed", message: "This leg is not open for crew sign-up." };

    const name = input.name.trim();
    const contact = input.contact.trim();
    const note = input.note && input.note.trim() ? input.note.trim() : null;

    const { data, error } = await this.db.rpc("signup_for_leg", {
      p_leg: legId,
      p_name: name,
      p_contact: contact,
      p_note: note,
    });

    if (error) {
      // Unique-index backstop for a racing duplicate insert.
      if (error.code === "23505")
        return { ok: false, reason: "duplicate", message: "You're already signed up for this leg." };
      throw new Error(`signup failed: ${error.message}`);
    }

    const row = (Array.isArray(data) ? data[0] : data) as SignupRpcRow | undefined;
    if (row?.result === "duplicate")
      return { ok: false, reason: "duplicate", message: "You're already signed up for this leg." };
    if (row?.result === "full")
      return { ok: false, reason: "full", message: "This leg's crew is full." };
    if (row?.result === "ok" && row.id && row.created_at) {
      return {
        ok: true,
        member: { id: row.id, legId, name, contact, note, createdAt: row.created_at },
      };
    }
    throw new Error("signup returned an unexpected result");
  }

  async remove(id: string): Promise<boolean> {
    const { data, error } = await this.db
      .from("crew_signup")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw new Error(`withdraw failed: ${error.message}`);
    return (data?.length ?? 0) > 0;
  }
}
