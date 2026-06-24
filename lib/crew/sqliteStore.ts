import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { CrewStore } from "./store";
import type { CrewSignup, CrewSignupInput, AddResult } from "./types";
import { CREW_CAPACITY, isLegClosed, isKnownLeg } from "./legs";

const DB_PATH =
  process.env.CREW_DB_PATH ?? path.join(process.cwd(), "data", "crew.sqlite");

export class SqliteCrewStore implements CrewStore {
  private readonly db: Database.Database;

  constructor(dbPath: string = DB_PATH) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true }); // [1H] create data/ if absent
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS crew_signup (
        id TEXT PRIMARY KEY,
        leg_id TEXT NOT NULL,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS ux_leg_contact
        ON crew_signup(leg_id, lower(contact));
    `);
  }

  async listAll(): Promise<CrewSignup[]> {
    return this.db
      .prepare(
        `SELECT id, leg_id AS legId, name, contact, note, created_at AS createdAt
         FROM crew_signup ORDER BY created_at ASC`
      )
      .all() as CrewSignup[];
  }

  async addToLeg(legId: string, input: CrewSignupInput): Promise<AddResult> {
    if (!isKnownLeg(legId)) return { ok: false, reason: "invalid", message: "Unknown leg." };
    if (isLegClosed(legId))
      return { ok: false, reason: "closed", message: "This leg is not open for crew sign-up." };

    const name = input.name.trim();
    const contact = input.contact.trim();
    const note = input.note && input.note.trim() ? input.note.trim() : null;

    // BEGIN IMMEDIATE so two concurrent sign-ups serialise: the dedupe + cap
    // checks and the insert are one atomic unit and can never overshoot 3.
    const tx = this.db.transaction((): AddResult => {
      const dup = this.db
        .prepare(`SELECT 1 FROM crew_signup WHERE leg_id = ? AND lower(contact) = lower(?) LIMIT 1`)
        .get(legId, contact);
      if (dup)
        return { ok: false, reason: "duplicate", message: "You're already signed up for this leg." };

      const { n } = this.db
        .prepare(`SELECT COUNT(*) AS n FROM crew_signup WHERE leg_id = ?`)
        .get(legId) as { n: number };
      if (n >= CREW_CAPACITY)
        return { ok: false, reason: "full", message: "This leg's crew is full." };

      const member: CrewSignup = {
        id: randomUUID(),
        legId,
        name,
        contact,
        note,
        createdAt: new Date().toISOString(),
      };
      this.db
        .prepare(
          `INSERT INTO crew_signup (id, leg_id, name, contact, note, created_at)
           VALUES (@id, @legId, @name, @contact, @note, @createdAt)`
        )
        .run(member);
      return { ok: true, member };
    });

    try {
      return tx.immediate();
    } catch (e) {
      // Unique-index backstop: a racing duplicate insert raises SQLITE_CONSTRAINT.
      const code = (e as { code?: string })?.code ?? "";
      if (code.includes("CONSTRAINT"))
        return { ok: false, reason: "duplicate", message: "You're already signed up for this leg." };
      throw e;
    }
  }

  async remove(id: string): Promise<boolean> {
    return this.db.prepare(`DELETE FROM crew_signup WHERE id = ?`).run(id).changes > 0;
  }
}
