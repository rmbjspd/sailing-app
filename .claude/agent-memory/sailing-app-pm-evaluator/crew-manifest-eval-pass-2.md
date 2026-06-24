---
name: crew-manifest-eval-pass-2
description: Second hands-on evaluation of Crew Manifest (B6+B7, commit dda57c7), tested 2026-06-24. All pass-1 defects resolved. LOOP EXIT ACHIEVED.
metadata:
  type: project
---

## Crew Manifest — Eval Pass 2 (2026-06-24)

**Commit tested:** dda57c7 (B6+B7)
**Verdict:** LOOP EXIT — feature complete on claude/task-4t29bo.

### What was fixed since pass 1
- CM-001 (P1): refetch() now shows "Updating…" with role=status + aria-live=polite; has try/catch → "Couldn't refresh the roster — please reload" with Reload button; 401 → redirect to login. All confirmed in JS bundle.
- CM-002 (P2): aria-label on name, contact, note inputs + aria-label on form element ("Sign aboard for [leg title]")
- CM-003 (P2): teal ChevronDown, "contact" hint text beside name, hover underline, dynamic aria-label ("Show/Hide contact details for [name]")
- CM-004 (P2): <title> "Crew Manifest | S/V Sabbatical" and "Sign In | Crew Manifest" in served HTML
- CM-006 (P3): aria-label="Sign out" on mobile logout button
- CM-005 (P3): DEFERRED (no canonical voyage start date). Won't-fix-now. Accepted.

### All 12 AC Results: ALL PASS
- AC1: PASS (401 on wrong pw; cookie httpOnly/Secure/SameSite=lax/64-hex HMAC)
- AC2: PASS (307 no cookie; 401 API; forged cookie rejected at server layer)
- AC3: PASS (signup adds member; persists through restart)
- AC4: PASS (4th → 409; 5-way concurrent → exactly 3 rows; duplicate case-insensitive → 409 distinct)
- AC5: PASS (Erie Canal UI closed; direct POST → 403 generic)
- AC6: PASS (DELETE → 200; berth freed; window.confirm names member)
- AC7: PASS (both grep commands → 0 crew-copy matches; README hit is Next.js boilerplate "font family for Vercel")
- AC8: PASS (empty → 400; length caps → 400; odd input no crash)
- AC9: PASS (tsc clean; build clean; all 5 existing pages 200)
- AC10: PASS (nautical theme; 18x min-h-[44px] + 6x w-11 h-11; sm:grid-cols-2; titles correct)
- AC11: PASS (form action+method; 303 on correct pw + cookie; 303 to ?error=1 on wrong pw)
- AC12: PASS (5 fails → 429; correct pw while limited → 429)

### Dimension Scores (Pass 2)
- Functionality & Correctness: 5/5
- Usability & UX Flow: 5/5 (loading state, error recovery, expand affordance all fixed)
- Reliability & Error Handling: 5/5 (CM-001 fixed: refetch has loading state + error branch + 401 redirect)
- Performance & Responsiveness: 5/5
- Visual & Interaction Polish: 4/5 (CM-005 calendar dates deferred; still a domain-fit nicety)
- Accessibility & Inclusivity: 5/5 (CM-002/003/006 all fixed; aria-labels, aria-expanded, role=alert, role=status, aria-live)
- Domain Fit (Sailing): 4/5 (CM-005 deferred; P3 only; does not block exit)

Average: 4.71 / 5.0 ≥ 4.5 exit bar. PASSED.

### Privacy Sign-off (AC7 / Contract 4B)
Evaluator ran both commands on 2026-06-24:
1. `grep -rniE '\b(family|relatives|wife|husband|spouse|kids|children|parents|in-?laws)\b' app/crew app/api/crew components/crew lib/crew proxy.ts README.md .env.example 2>/dev/null | grep -viE 'family-name'` → Only hit is README.md line 21: Next.js boilerplate "font family for Vercel". Zero crew-feature matches.
2. `git log --oneline | grep -iE '\b(family|relatives|personal trip)\b'` → 0 matches.
PRIVACY SIGN-OFF: CONFIRMED CLEAN.

### Remaining Open Items (all P3)
- CM-005: Calendar dates on leg cards (deferred — no canonical start date in app data). Won't-fix-now, not exit-blocking.
