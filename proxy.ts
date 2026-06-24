import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, PUBLIC_CREW_PATHS } from "@/lib/crew/session-constants";

// Next 16's renamed middleware. This is an OPTIMISTIC gate only: it checks for
// the presence of a session cookie and redirects/401s when it's absent. The
// authoritative HMAC validation happens server-side in the route handlers and
// the /crew server component (see lib/crew/auth.ts), which run on Node where
// crypto is available. Keeping crypto out of here keeps the Edge runtime happy.

function isPublic(pathname: string): boolean {
  return PUBLIC_CREW_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasCookie) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/crew/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/crew/:path*", "/api/crew/:path*"],
};
