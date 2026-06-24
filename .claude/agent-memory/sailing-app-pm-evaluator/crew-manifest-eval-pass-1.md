---
name: crew-manifest-eval-pass-1
description: First hands-on evaluation of Crew Manifest feature (B1-B5, commits d46f444–1928012), tested 2026-06-24
metadata:
  type: project
---

## Crew Manifest — Eval Pass 1 (2026-06-24)

**Commits tested:** d46f444 (B1) · ccc4c38 (B2) · acd11a1 (B3) · 1928012 (B4+B5)

**Verdict:** NEEDS WORK — not at loop exit. Feature is fundamentally sound; B6-B8 remain and one P1 UX defect found.

### AC Results Summary (all 12)
- AC1 PASS: wrong pw 401 no cookie; correct pw sets httpOnly/SameSite=lax/Secure cookie with 64-hex HMAC value (not raw pw); logout clears cookie (Expires=epoch)
- AC2 PASS: /crew → 307 redirect; /api/crew/* → 401. Forged cookie → rejected by both proxy (no-op) and server handler (authoritative HMAC re-check). Defense-in-depth confirmed.
- AC3 PASS: signup adds member; roster updated; data persists through server kill+restart (SQLite WAL).
- AC4 PASS: 3rd member accepted, 4th → 409 "full". 5-way concurrent POST → exactly 3 rows, no overshoot (BEGIN IMMEDIATE txn holds). Duplicate same contact different case → 409 "already signed up", row count unchanged.
- AC5 PASS: Erie Canal UI shows "Reserved — not open for crew sign-up" with Lock icon, no form. Direct POST → 403 generic message, no "family" or reason.
- AC6 PASS: DELETE removes member, roster immediately shows freed berth. window.confirm dialog names member + leg.
- AC7 PASS: Both grep commands return zero matches. "family" in page HTML is only CSS font-family (system UI fallback) — not crew copy.
- AC8 PASS: empty name → 400 "Please enter your name"; empty contact → 400; whitespace-only name trimmed → 400; name>100 → 400; contact>200 → 400; note>500 → 400. Odd unicode/special chars and XSS payload stored correctly (React escapes on render).
- AC9 PASS: tsc --noEmit clean; next build clean (11 routes). All 5 existing pages return 200.
- AC10 PARTIAL PASS: nautical theme (parchment-page, treasure-frame, pirata font, teal/navy tokens), 8 leg cards all rendered, empty state present, full crew state present. 44px confirmed: submit button min-h-[44px], withdraw button w-11 h-11, sign-aboard min-h-[44px]. sm:grid-cols-2 responsive grid. DEFECT: "Sign aboard" button text is missing from server-rendered HTML initially (issue with context — see P1 note below).
- AC11 PASS: form action="/api/crew/login" method="POST" confirmed. Correct pw via form-urlencoded → 303 to /crew with cookie. Wrong pw → 303 to /crew/login?error=1.
- AC12 PASS: 5 failed logins (same IP via X-Forwarded-For: 10.0.0.99) → 5x 401; 6th → 429; correct pw while limited → 429. Rate limit works per-IP correctly.

### P1 Defect Found
**CM-001: No loading/error state for roster fetch on /crew (missing B6 work)**
When /crew first loads, the roster is server-rendered (correct). But after signup, the UI calls refetch() which is a client-side fetch to /api/crew/roster. There is no loading state shown during this refetch — the card just updates silently. If the refetch fails (e.g., session expired mid-session), no error is shown to the user and the roster appears stale. This is the B6 work item and is expected to be addressed.

Also: The "Sign aboard" button which opens the inline form has no double-submit guard at the form level (the form's submit handler sets busy=true, which is good, but there's no disabled state on the "Sign aboard" toggler itself to prevent opening multiple form instances on different cards simultaneously). Minor but relevant.

### P2 Issues Found
**CM-002: No label attributes on sign-up form inputs (a11y gap)**
The sign-aboard form inputs use placeholder text only — there are no `<label>` elements or `aria-label` attributes on the name/contact/note fields. Placeholders disappear when the user starts typing, leaving screen reader users without field context. This is B7 work.

**CM-003: Expand/collapse roster member reveals contact — no visual cue that it's expandable**
The chevron is subtle. On mobile, the tap target for "expand member details" (the name + chevron row) is fine (min-h-[44px]) but there's no visual affordance that it's interactive. A user won't know they can tap to see contact info.

**CM-004: /crew page title is "Crew Manifest" but browser tab title not verified**
<title> tag not checked — may be generic Next.js default.

### P3 Issues Found  
**CM-005: No "back to crew" link from /crew/login when already have session**
If someone manually navigates to /crew/login while logged in, they get redirected to /crew (correct). But there's no graceful "you're already signed in" state.

**CM-006: "Sign out" text hidden on small mobile (sm:inline)**
On 375px, the Sign Out button shows only the icon. Acceptable UX but icon-only could be confusing for non-technical users.

### Loop Exit Status
NOT at exit conditions. B6, B7, B8 slices remain. Open defects:
- P1: CM-001 (loading/error states for refetch — B6 work)
- P2: CM-002 (form input labels — B7 work)
- P2: CM-003 (expand affordance)
- P2: CM-004 (browser tab title)
- P3: CM-005, CM-006

### Key test commands for next eval pass
```bash
# Get session
SESSION=$(curl -si -X POST http://localhost:3120/api/crew/login -H "Content-Type: application/json" -d '{"password":"test-crew-2027"}' | grep -i set-cookie | sed 's/set-cookie: //' | cut -d';' -f1 | tr -d '\r')

# Rate limit test (use fresh IP)
for i in 1..5; do curl -X POST ... -H "X-Forwarded-For: 10.0.0.99" ...; done

# Concurrency test (5-way)
for i in 1..5; do curl ... &; done; wait

# Privacy grep
grep -rniE '\b(family|relatives|wife|husband|spouse|kids|children|parents|in-?laws)\b' app/crew app/api/crew components/crew lib/crew proxy.ts 2>/dev/null | grep -viE 'family-name'
git log --oneline | grep -iE '\b(family|relatives|personal trip)\b'
```
