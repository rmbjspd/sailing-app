// Edge-safe constants shared by proxy.ts (Edge runtime) and auth.ts (Node).
// MUST NOT import node:crypto or anything Node-only — proxy runs on the Edge.

export const SESSION_COOKIE = "crew_session";

/** Paths under the crew matcher that must stay public (no session required). */
export const PUBLIC_CREW_PATHS = ["/crew/login", "/api/crew/login", "/api/crew/logout"];
