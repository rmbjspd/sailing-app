import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  sessionToken,
  verifyPassword,
  isRateLimited,
  recordFailure,
  clearAttempts,
} from "@/lib/crew/auth";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

/** Only allow same-app relative redirect targets under /crew. */
function safeFrom(from: string | null): string {
  if (from && from.startsWith("/crew") && !from.startsWith("//")) return from;
  return "/crew";
}

export async function POST(req: NextRequest) {
  const isJson = (req.headers.get("content-type") ?? "").includes("application/json");
  const ip = clientIp(req);

  let pw = "";
  let from: string | null = null;
  if (isJson) {
    try {
      const body = await req.json();
      pw = typeof body?.password === "string" ? body.password : "";
      from = typeof body?.from === "string" ? body.from : null;
    } catch {
      pw = "";
    }
  } else {
    const form = await req.formData();
    pw = String(form.get("password") ?? "");
    const f = form.get("from");
    from = typeof f === "string" ? f : null;
  }

  const target = safeFrom(from);

  const fail = (status: number, message: string) => {
    if (isJson) return NextResponse.json({ error: message }, { status });
    const code = status === 429 ? "rate" : "1";
    return NextResponse.redirect(new URL(`/crew/login?error=${code}`, req.url), 303);
  };

  if (isRateLimited(ip)) {
    return fail(429, "Too many attempts — try again in a few minutes.");
  }

  if (!verifyPassword(pw)) {
    recordFailure(ip);
    return fail(401, "Incorrect password.");
  }

  clearAttempts(ip);
  const res = isJson
    ? NextResponse.json({ ok: true, redirect: target })
    : NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(SESSION_COOKIE, sessionToken(), SESSION_COOKIE_OPTIONS);
  return res;
}
