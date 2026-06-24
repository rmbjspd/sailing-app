import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasValidSession } from "@/lib/crew/auth";
import { getCrewStore } from "@/lib/crew/sqliteStore";
import { validateSignupInput } from "@/lib/crew/validation";
import { isKnownLeg } from "@/lib/crew/legs";

export async function POST(req: NextRequest) {
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { legId?: unknown; name?: unknown; contact?: unknown; note?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const legId = typeof body?.legId === "string" ? body.legId : "";
  if (!legId || !isKnownLeg(legId)) {
    return NextResponse.json({ error: "Unknown leg." }, { status: 400 });
  }

  const valid = validateSignupInput(body);
  if (!valid.ok) {
    return NextResponse.json({ error: valid.message }, { status: 400 });
  }

  const result = getCrewStore().addToLeg(legId, valid.value);
  if (result.ok) {
    return NextResponse.json({ member: result.member }, { status: 201 });
  }

  // closed ⇒ 403; full / duplicate ⇒ 409; invalid ⇒ 400
  const status = result.reason === "closed" ? 403 : result.reason === "invalid" ? 400 : 409;
  return NextResponse.json({ error: result.message, reason: result.reason }, { status });
}
