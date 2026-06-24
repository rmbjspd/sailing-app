import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/crew/auth";

export async function POST(req: NextRequest) {
  const isJson = (req.headers.get("content-type") ?? "").includes("application/json");
  const res = isJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL("/crew/login", req.url), 303);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
