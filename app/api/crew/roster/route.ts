import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/crew/auth";
import { getCrewStore } from "@/lib/crew/sqliteStore";
import { crewLegs, CREW_CAPACITY } from "@/lib/crew/legs";
import type { CrewSignup } from "@/lib/crew/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const all = getCrewStore().listAll();
  const byLeg = new Map<string, CrewSignup[]>();
  for (const m of all) {
    const arr = byLeg.get(m.legId);
    if (arr) arr.push(m);
    else byLeg.set(m.legId, [m]);
  }

  const legs = crewLegs().map((leg) => {
    const members = (leg.closed ? [] : byLeg.get(leg.legId) ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      contact: m.contact,
      note: m.note,
      createdAt: m.createdAt,
    }));
    const taken = members.length;
    return {
      legId: leg.legId,
      title: leg.title,
      dayRange: leg.dayRange,
      accent: leg.accent,
      closed: leg.closed,
      capacity: CREW_CAPACITY,
      taken,
      spotsRemaining: leg.closed ? 0 : Math.max(0, CREW_CAPACITY - taken),
      members,
    };
  });

  return NextResponse.json({ legs });
}
