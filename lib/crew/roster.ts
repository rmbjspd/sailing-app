import { getCrewStore } from "./store";
import { crewLegs, CREW_CAPACITY } from "./legs";
import type { CrewSignup, RosterLeg } from "./types";

// Builds the per-leg roster view. Server-only (reads the store). Shared by the
// GET /api/crew/roster handler and the /crew server component so the shape can
// never drift between the initial render and subsequent fetches.
export async function getRoster(): Promise<RosterLeg[]> {
  const all = await (await getCrewStore()).listAll();
  const byLeg = new Map<string, CrewSignup[]>();
  for (const m of all) {
    const arr = byLeg.get(m.legId);
    if (arr) arr.push(m);
    else byLeg.set(m.legId, [m]);
  }

  return crewLegs().map((leg) => {
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
      dateRange: leg.dateRange,
      accent: leg.accent,
      closed: leg.closed,
      capacity: CREW_CAPACITY,
      taken,
      spotsRemaining: leg.closed ? 0 : Math.max(0, CREW_CAPACITY - taken),
      members,
    };
  });
}
