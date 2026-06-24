import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session-constants";

// Server-only auth core. The session is stateless: the cookie holds an HMAC of
// a fixed label keyed by CREW_PASSWORD, so rotating CREW_PASSWORD (+ restart)
// instantly invalidates every existing session. Never import from client code.

const SESSION_LABEL = "crew-session-v1";

function password(): string {
  return process.env.CREW_PASSWORD ?? "";
}

function sha256(s: string): Buffer {
  return createHash("sha256").update(s).digest();
}

/** Constant-time string compare. Hashes both sides so length never leaks. */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

export function verifyPassword(submitted: string): boolean {
  const pw = password();
  if (!pw) return false; // misconfigured (no password set) ⇒ fail closed
  return safeEqual(submitted, pw);
}

/** The valid cookie value for the current CREW_PASSWORD. */
export function sessionToken(): string {
  const pw = password();
  if (!pw) return "";
  return createHmac("sha256", pw).update(SESSION_LABEL).digest("hex");
}

export function isValidSession(value: string | undefined | null): boolean {
  const token = sessionToken();
  if (!token || !value) return false;
  return safeEqual(value, token);
}

/** Authoritative server-side session check (reads the request cookies). */
export async function hasValidSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export { SESSION_COOKIE };

// ── Login rate limiting (in-memory; per-process, resets on restart) ──────────
// 5 failed attempts per IP per 15 minutes. Acceptable for a personal app; not
// shared across instances and intentionally simple (no Redis).
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(ip: string): boolean {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() > rec.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_FAILS;
}

export function recordFailure(ip: string): void {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  rec.count += 1;
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
