import { FIELD_LIMITS } from "./types";

export interface ValidSignupInput {
  name: string;
  contact: string;
  note: string | null;
}

/**
 * Trim + validate raw sign-up input. Returns friendly, user-facing messages so
 * the API can pass them straight through to the form. The store assumes the
 * input is already validated, but also trims defensively.
 */
export function validateSignupInput(raw: {
  name?: unknown;
  contact?: unknown;
  note?: unknown;
}): { ok: true; value: ValidSignupInput } | { ok: false; message: string } {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const contact = typeof raw.contact === "string" ? raw.contact.trim() : "";
  const note = typeof raw.note === "string" ? raw.note.trim() : "";

  if (!name) return { ok: false, message: "Please enter your name." };
  if (!contact) return { ok: false, message: "Please enter a contact (email or phone)." };
  if (name.length > FIELD_LIMITS.name)
    return { ok: false, message: `Name must be ${FIELD_LIMITS.name} characters or fewer.` };
  if (contact.length > FIELD_LIMITS.contact)
    return { ok: false, message: `Contact must be ${FIELD_LIMITS.contact} characters or fewer.` };
  if (note.length > FIELD_LIMITS.note)
    return { ok: false, message: `Note must be ${FIELD_LIMITS.note} characters or fewer.` };

  return { ok: true, value: { name, contact, note: note || null } };
}
