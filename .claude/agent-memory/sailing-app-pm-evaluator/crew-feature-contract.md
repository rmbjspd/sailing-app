# Crew Manifest — Feature Contract (Developer ⇄ Evaluator)

> STATUS: **DRAFT v2 — reconciled, awaiting evaluator ACCEPT ALL.** No feature code is written until the evaluator returns ACCEPT on all four contracts. This file is the durable, shared source of truth once signed off.

Branch: `claude/task-4t29bo` · App: Next.js 16.2.4 (server-capable) · Persistence: SQLite behind an interface.
Test password (dev/eval only, NOT production): **`CREW_PASSWORD=test-crew-2027`**.

---

## CONTRACT 1 — Plan / Scope

**Goal:** Let shipmates sign up as crew for individual voyage legs behind a single shared password, hard cap of 3 crew per leg, Erie Canal leg closed (reason private).

**A. Auth / session (single shared password, no username)**
- Password from `process.env.CREW_PASSWORD` (server-only, never `NEXT_PUBLIC_`). `.env.example` documents it; `.env.local` (gitignored) holds the dev/eval value `test-crew-2027`; production sets the real one in host env.
- `POST /api/crew/login {password}` → constant-time compare. On success set httpOnly + secure + sameSite=lax cookie `crew_session` = `HMAC-SHA256(CREW_PASSWORD, "crew-session-v1")` (stateless; valid iff equals recomputed token). 401 on mismatch.
- **[1B] Session revocation:** because the cookie is keyed off `CREW_PASSWORD`, rotating `CREW_PASSWORD` in host env + restarting the server **immediately invalidates all existing sessions**. This is an intended feature (captain can revoke access) and the cookie scheme must preserve it.
- **[1C] Rate limiting:** login handler tracks failed attempts in an in-memory Map keyed by client IP. **5 failed attempts per IP per 15 min ⇒ HTTP 429** "Too many attempts — try again in a few minutes." A correct password while rate-limited is still rejected (429). (In-memory is acceptable for this scale; no Redis.)
- **[3G] Progressive enhancement:** the login form is a real `<form action="/api/crew/login" method="POST">`. The handler accepts BOTH `application/json` (fetch path → 200/JSON) and `application/x-www-form-urlencoded` (no-JS path → **303 redirect to `/crew`** on success, back to `/crew/login?error=1` on failure). Login works with JavaScript disabled.
- `POST /api/crew/logout` → delete cookie.
- `proxy.ts` (Next 16's renamed middleware) matches `/crew/:path*` + `/api/crew/:path*`, excluding `/crew/login` and `/api/crew/login|logout`. Invalid/missing cookie ⇒ page redirect to `/crew/login`; API ⇒ 401 JSON. Each protected route handler **re-validates** the cookie (defense in depth — proxy is optimistic only, per Next docs).

**B. Persistence (SQLite behind an interface)**
- **[1G] Dependency:** B1 adds `better-sqlite3` + dev `@types/better-sqlite3` to `package.json` (prereq for a clean B1 build).
- `lib/crew/store.ts` interface `CrewStore { listAll(): CrewSignup[]; addToLeg(legId, {name,contact,note}): AddResult; remove(id): boolean; }` where `AddResult` is a discriminated union: `{ok:true, member}` | `{ok:false, reason:"closed"|"full"|"duplicate"}`.
- `lib/crew/sqliteStore.ts` — `better-sqlite3`, DB at `data/crew.sqlite`. **[1H]** store creates the `data/` dir if absent (`fs.mkdirSync("data",{recursive:true})`); `data/*.sqlite*` is gitignored. Schema auto-created:
  ```sql
  CREATE TABLE IF NOT EXISTS crew_signup (
    id TEXT PRIMARY KEY, leg_id TEXT NOT NULL, name TEXT NOT NULL,
    contact TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL);
  CREATE UNIQUE INDEX IF NOT EXISTS ux_leg_contact
    ON crew_signup(leg_id, lower(contact));   -- [1A] dedupe by (leg, contact)
  ```
- **[1A] Cap + dedupe (atomic):** `addToLeg` runs inside a `BEGIN IMMEDIATE` txn: reject closed legs → check existing `(legId, lower(contact))` (⇒ `duplicate`) → count crew on leg (⇒ `full` if ≥3) → insert. The unique index is the backstop so a race can never create a duplicate or a 4th row. A duplicate never consumes a berth.
- **[1E] Captain is NOT modeled:** the captain is implicit on every leg, never stored in `crew.sqlite`, never shown in the manifest, never counted. The cap of 3 is **crew-only**; "3 of 3 berths open" is the empty state.
- Imported **only** from server code (route handlers) — never bundled into a client component.

**C. API (route handlers under `app/api/crew/`)**
- `GET /api/crew/roster` → legs[] each `{legId,title,dayRange,closed,capacity:3,taken,spotsRemaining,members[]}`.
- `POST /api/crew/signup {legId,name,contact,note?}` → 201 | 400 invalid | 403 closed | 409 full | **409 duplicate (distinct message "You're already signed up for this leg")** | 401.
- `DELETE /api/crew/signup/[id]` → 200 | 401 | 404.
- **[1D] Withdrawal policy (decided):** any authenticated shipmate may withdraw any entry (trusted single-shared-password group). The UI shows a confirm dialog naming the member + leg ("Withdraw {name} from {leg}?"). This footgun risk is **explicitly accepted** given the trust model; no per-entry ownership/auth is built.
- Server is the sole authority on capacity, dedupe, and closed-leg rules. **[3E] Limits:** name ≤100, contact ≤200, note ≤500 chars; all trimmed; empty name/contact rejected (400).

**D. UX / design (reuse existing nautical system)**
- `/crew/login` — themed "ship's papers" password gate; real form (no-JS works); friendly error on wrong password / 429; loading state; redirect to `/crew` on success.
- `/crew` "Crew Manifest" — 8 leg cards (reuse `Card`/`Badge`/`Button` + lifted `LEG_STYLE`). Per joinable leg: "N of 3 berths open" badge, roster (names; contact/note in expand), "Sign aboard" form (name, contact, optional note), withdraw (×) with naming confirm. Full ⇒ disabled "Full crew". Erie Canal ⇒ locked "Reserved — not open for crew sign-up", no form, no reason.
- Add "Crew" link to `components/Nav.tsx`. Loading/empty/error states; mobile-responsive; accessible labels; **[3F] interactive targets ≥44×44px**.

**E. Privacy gate (hard):** the word "family" / any reason the Erie Canal is closed appears nowhere in crew code, copy, data, commit messages, README, or `.env.example`. Generic "reserved/unavailable" only.

**F. Acknowledged design decisions & non-goals**
- **[1F]** Full roster (name, contact, note) is visible to all authenticated users — a deliberate choice for a trusted crew group, not an oversight.
- Non-goals: accounts/usernames, email, payments, in-place edit (withdraw+re-add), per-entry ownership/auth, captain-tracking, or changes to existing pages' data/behavior.

---

## CONTRACT 2 — Backlog (prioritized slices)

- **B1 — Domain & persistence core:** add `better-sqlite3` deps; crew types; shared leg-metadata module (`lib/crew/legs.ts`, lifting `LEG_STYLE` + reusing `legGuides`/`legGroups`); `CrewStore` interface + sqlite impl with `data/` auto-create, unique index, atomic cap+dedupe; `.gitignore` for `data/*.sqlite*`. No UI.
- **B2 — Auth:** `CREW_PASSWORD`, login (JSON + form, rate-limited) / logout handlers, stateless HMAC cookie, `proxy.ts` gate, `.env.example` + `.env.local` (`test-crew-2027`) + README note.
- **B3 — Crew API:** roster GET, signup POST (cap + dedupe + closed enforcement, length validation, error contract), withdraw DELETE.
- **B4 — Login UI:** themed gate + redirect flow. **[2B] Eval note:** post-login `/crew` may be a skeleton/placeholder at the B4 gate — that's acceptable; full manifest is evaluated at B5.
- **B5 — Manifest UI:** leg cards, rosters, berths-remaining, sign-aboard form, withdraw w/ confirm, Erie Canal closed state, Nav link.
- **[2A] B6 — Interactive states:** loading/empty/error states, double-submit guard, 409 full + 409 duplicate handling in UI.
- **[2A] B7 — Accessibility & responsive pass:** keyboard nav, ARIA labels, 44px touch targets, mobile layout at 375px.
- **[2A] B8 — Privacy scrub + final security review:** grep/commit audit, rate-limit verification, full acceptance pass.

Each slice: developer implements → `tsc`+`next build` clean → commit/push → evaluator runs hands-on → defects re-prioritize the backlog.

---

## CONTRACT 3 — Acceptance Criteria (evaluator verifies hands-on)

1. Wrong password ⇒ rejected, no cookie; correct ⇒ cookie set, `/crew` reachable; logout clears access.
   - **[3B]** Evaluator checks DevTools → Application → Cookies: `httpOnly:true`, `sameSite:Lax`, `secure` true(prod)/false(dev), and value is the opaque HMAC token, **not** the raw password.
2. `/crew` or `/api/crew/*` without valid cookie ⇒ redirect (page) / 401 (API), proven by `curl -i`.
3. Joinable leg sign-up adds a member; roster + "N of 3" update for ALL sessions; survives reload + server restart.
4. **[3A]** Cap holds at 3 — 4th refused (UI disabled AND API 409). Concurrency test method: evaluator runs two rapid `Promise.all([fetch(...),fetch(...)])` POSTs from DevTools console, then verifies `sqlite3 data/crew.sqlite "SELECT COUNT(*) FROM crew_signup WHERE leg_id='lake-michigan'"` ≤ 3.
   - Duplicate test: same `(leg, contact)` twice ⇒ second returns 409 "already signed up", row count unchanged, berth not consumed twice.
5. **[3C]** Erie Canal un-joinable via UI (no form, shown reserved) AND via `curl -s -X POST localhost:3000/api/crew/signup -H "Content-Type: application/json" -H "Cookie: crew_session=<valid>" -d '{"legId":"erie-canal","name":"T","contact":"t@t.co"}'` ⇒ 403 with a **generic** message (no "family"/"reserved-for-X").
6. Withdraw removes the right member and frees a berth; confirm dialog names the member.
7. **[3D]** Privacy: ALL of these return zero matches — `grep -ri "family" app lib proxy.ts README.md .env.example data 2>/dev/null` and `git log --oneline | grep -i family`. Closed reason generic everywhere.
8. **[3E]** Validation: empty name/contact ⇒ friendly 400; name>100 / contact>200 / note>500 rejected or capped per spec; fields trimmed; no crash on odd input.
9. `tsc --noEmit` + `next build` clean; 5 existing pages (home/map/itinerary/checklists/journal) unbroken.
10. Design: matches nautical theme (tokens/primitives reused), responsive at 375px, sensible loading/empty/error states. **[3F]** Objective: all interactive controls ≥44×44px in DevTools.
11. **[3G]** With JavaScript disabled, `/crew/login` renders the form and POST still logs in (form `action`+`method` fallback), landing on `/crew`.
12. **[3H]** 5 failed logins within the window ⇒ 429 with friendly message; a correct password during rate-limit is also rejected (429).

---

## CONTRACT 4 — Loop Exit Conditions

The loop terminates (feature done on branch) when ALL hold on a single hands-on evaluator pass:
- All 12 acceptance criteria pass, AND
- Zero open P0/P1 defects; no known crash, data-loss, or privacy leak. **[4C]** The evaluator is the **sole arbiter** of P0/P1 severity; a finding it classifies P0/P1 blocks exit regardless of developer assessment, AND
- `tsc` + `next build` clean, no regression to existing pages, AND
- **[4A]** Quality bar: **average evaluator dimension score ≥ 4.5/5.0 across all seven criteria** (replaces the ambiguous "9.0/10"), AND
- **[4B]** Privacy sign-off: evaluator has personally run the AC7 grep + `git log` commands and confirmed zero matches.

Ship policy: stop at "feature complete on `claude/task-4t29bo`, pushed." No PR/merge to `main` unless the captain explicitly asks. Model identifier never appears in commits/code.

---

## Sign-off log
- Developer: DRAFT v1.
- Evaluator: REDLINE — 15 blocking + 6 recommended amendments (1A–H, 2A–C, 3A–H, 4A–C).
- Developer: DRAFT v2 — reconciled **all 21** items (15 blocking + 6 recommended). Awaiting ACCEPT ALL.
- Evaluator: **ACCEPT ALL** (verified all 21 items finding-by-finding). Contracts signed; developer may begin B1.

> STATUS UPDATE: **SIGNED — implementation loop active.** Current slice: B1.
