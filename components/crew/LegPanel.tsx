"use client";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  Anchor,
  Check,
  Loader2,
  Lock,
  Mail,
  Phone,
  Plus,
  UserMinus,
  X,
} from "lucide-react";
import { alpha, legStyle } from "@/lib/data/legStyle";
import { FIELD_LIMITS, type RosterLeg, type RosterMember } from "@/lib/crew/types";
import { contactHref, dayCount, dayLabel, firstName, initials, signedOn } from "./crewFormat";
import styles from "./crew.module.css";

export type ActivePanel =
  | { legId: string; kind: "form" }
  | { legId: string; kind: "member"; memberId: string }
  | null;

// Berth centres along the hull (as % of hull width), stern → bow.
const BERTH_X = [24, 49, 73];

const EASE = [0.16, 1, 0.3, 1] as const;

// Leg-coloured bloom whose strength follows the theme: `--halo` is set per
// theme on the panel (crew.module.css) — a glow at night, a modest shadow by day.
function halo(color: string, strong = false) {
  return `color-mix(in srgb, ${color} ${strong ? "calc(var(--halo) * 1.5)" : "var(--halo)"}, transparent)`;
}

export function LegPanel({
  leg,
  active,
  setActive,
  joinedId,
  onJoined,
  onChanged,
  onUnauthorized,
}: {
  leg: RosterLeg;
  active: ActivePanel;
  setActive: (a: ActivePanel) => void;
  joinedId: string | null;
  onJoined: (member: { id: string; name: string; legId: string }) => void;
  onChanged: () => Promise<boolean>;
  onUnauthorized: () => void;
}) {
  const s = legStyle(leg.legId);
  const reduce = useReducedMotion();
  const uid = useId();
  const formId = `${uid}-form`;
  const detailId = `${uid}-detail`;
  const titleId = `${uid}-title`;
  const full = !leg.closed && leg.spotsRemaining === 0;
  const mine = active && active.legId === leg.legId ? active : null;
  const formOpen = mine?.kind === "form";
  const selected =
    mine?.kind === "member" ? leg.members.find((m) => m.id === mine.memberId) ?? null : null;
  const justJoined = joinedId ? leg.members.find((m) => m.id === joinedId) ?? null : null;
  const nDays = dayCount(leg.dayRange);

  const slots: (RosterMember | null)[] = Array.from(
    { length: leg.capacity },
    (_, i) => leg.members[i] ?? null,
  );

  return (
    <article
      id={`leg-${leg.legId}`}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={`relative scroll-mt-28 overflow-hidden rounded-[28px] border outline-none transition-colors ${styles.panel} ${
        leg.closed ? styles.panelClosed : ""
      }`}
      style={{ ["--c" as string]: s.color } as React.CSSProperties}
    >
      {/* Leg-colour waterline along the top edge */}
      <div
        aria-hidden
        className="absolute inset-x-8 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${leg.closed ? "var(--line-strong)" : s.color}, transparent)`,
          opacity: leg.closed ? 0.6 : 0.7,
        }}
      />

      <div className="flex flex-col gap-5 p-6 sm:gap-6 sm:p-8">
        {/* ── Identity ─────────────────────────────────────────────────── */}
        <header className="flex gap-4 sm:gap-7">
          <span
            aria-hidden
            className={`font-display shrink-0 text-[44px] font-light leading-[0.85] tracking-[-0.04em] sm:w-[96px] sm:text-[62px] ${
              leg.closed ? "" : styles.glowText
            }`}
            style={{ color: leg.closed ? "var(--ink-4)" : s.color }}
          >
            <em>{s.numeral}</em>
          </span>
          <div className="min-w-0 pt-1">
            <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Leg {s.numeral}</span>
              <span className="text-ink-4">/</span>
              <span className="num normal-case tracking-[0.08em] text-ink-2">{dayLabel(leg.dayRange)}</span>
              <span className="text-ink-4">/</span>
              <span className="num normal-case tracking-[0.08em] text-ink-2">{leg.dateRange}</span>
            </p>
            <h3 id={titleId} className="mt-2.5 font-display text-[clamp(1.6rem,2.6vw,2.15rem)] font-light leading-[1.02] text-ink">
              {leg.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-snug text-ink-2">
              {s.tagline}
              <span className="text-ink-3">
                {" "}· <span className="num">{nDays}</span> {nDays === 1 ? "day" : "days"}
              </span>
            </p>
          </div>
        </header>

        {/* ── Berth plan ──────────────────────────────────────────────── */}
        <div>
          <div className="relative mx-auto aspect-[440/150] w-full">
            <Hull color={leg.closed ? "var(--ink-4)" : s.color} closed={leg.closed} patternId={`hatch-${uid.replace(/[^a-zA-Z0-9_-]/g, "")}`} />
            {leg.closed ? (
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid size-12 place-items-center rounded-full border border-line-strong bg-abyss/70 text-ink-3 sm:size-14">
                  <Lock className="size-5" strokeWidth={1.5} />
                </span>
              </div>
            ) : (
              slots.map((m, i) => (
                <div
                  key={m?.id ?? `open-${i}`}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${BERTH_X[i] ?? 25 + i * 25}%` }}
                >
                  {m ? (
                    <motion.button
                      type="button"
                      initial={m.id === joinedId && !reduce ? { scale: 0.3, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 18 }}
                      onClick={() =>
                        setActive(selected?.id === m.id ? null : { legId: leg.legId, kind: "member", memberId: m.id })
                      }
                      aria-expanded={selected?.id === m.id}
                      aria-controls={detailId}
                      aria-label={`${m.name}, berth ${i + 1}. ${selected?.id === m.id ? "Hide" : "Show"} contact details`}
                      className={`grid size-12 place-items-center rounded-full text-[14px] font-semibold tracking-tight text-abyss transition-[transform,box-shadow] hover:scale-[1.06] sm:size-14 sm:text-[15px] ${
                        m.id === joinedId ? styles.berthJoined : ""
                      }`}
                      style={
                        {
                          "--berth-color": s.color,
                          background: s.color,
                          boxShadow:
                            selected?.id === m.id
                              ? `inset 0 1px 0 rgb(255 255 255 / 0.4), 0 0 0 3px var(--ring), 0 0 0 5px ${s.color}, 0 0 28px ${halo(s.color)}`
                              : `inset 0 1px 0 rgb(255 255 255 / 0.4), 0 0 0 3px var(--ring), 0 8px 24px -6px ${halo(s.color)}`,
                        } as React.CSSProperties
                      }
                    >
                      {initials(m.name)}
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(formOpen ? null : { legId: leg.legId, kind: "form" })}
                      aria-expanded={formOpen}
                      aria-controls={formId}
                      aria-label={`Take a berth on ${leg.title} (${leg.spotsRemaining} open)`}
                      className={`group grid size-12 place-items-center rounded-full border-[1.5px] border-dashed transition-[background-color,transform] hover:scale-[1.06] sm:size-14 ${
                        formOpen && i === leg.taken ? "" : styles.berthOpen
                      }`}
                      style={{
                        borderColor: formOpen && i === leg.taken ? s.color : alpha(s.color, 0.7),
                        background: formOpen && i === leg.taken ? alpha(s.color, 0.18) : "var(--berth)",
                        color: s.color,
                      }}
                    >
                      <Plus
                        className={`size-5 transition-transform ${formOpen && i === leg.taken ? "rotate-45" : "group-hover:rotate-90"}`}
                        strokeWidth={1.75}
                      />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Names under each berth */}
          {leg.closed ? (
            <div className="h-9" aria-hidden />
          ) : (
            <div className="relative mx-auto h-9 w-full" aria-hidden>
              {slots.map((m, i) => (
                <span
                  key={m?.id ?? `l-${i}`}
                  className="absolute top-0 w-[30%] -translate-x-1/2 text-center leading-tight"
                  style={{ left: `${BERTH_X[i]}%` }}
                >
                  {m ? (
                    <span className="block truncate text-[12.5px] text-ink sm:text-[13px]" title={m.name}>
                      <span className="sm:hidden">{firstName(m.name)}</span>
                      <span className="hidden sm:inline">{m.name}</span>
                    </span>
                  ) : (
                    <span className="block truncate text-[12px] text-ink-3">
                      <span className="sm:hidden">Open</span>
                      <span className="hidden sm:inline">{i === leg.taken ? "Take this berth" : "Open berth"}</span>
                    </span>
                  )}
                  <span className="eyebrow mt-0.5 block !text-[9px]">Berth {i + 1}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-[32px] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-5">
          <StatusChip leg={leg} full={full} color={s.color} />
          <AnimatePresence mode="wait" initial={false}>
            {justJoined ? (
              <motion.p
                key="joined"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[13.5px] text-ok"
              >
                <Check className="size-4" strokeWidth={2} />
                Welcome aboard, {firstName(justJoined.name)}.
              </motion.p>
            ) : (
              <motion.p key="hint" initial={false} className="text-[13.5px] text-ink-3">
                {leg.closed
                  ? "Reserved — not open for crew sign-up."
                  : full
                    ? "This leg’s crew is full."
                    : leg.taken === 0
                      ? "No crew yet — the first berth is yours."
                      : `${leg.taken} aboard so far.`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Inline expansions ─────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {formOpen && !leg.closed && (
          <Expand key="form" reduce={!!reduce} body={<>
            <SignAboardForm
              id={formId}
              leg={leg}
              color={s.color}
              numeral={s.numeral}
              onCancel={() => setActive(null)}
              onChanged={onChanged}
              onUnauthorized={onUnauthorized}
              onJoined={(member) => {
                setActive(null);
                onJoined(member);
              }}
            />
          </>} />
        )}
        {selected && (
          <Expand key={`m-${selected.id}`} reduce={!!reduce} body={<>
            <MemberDetail
              id={detailId}
              member={selected}
              legTitle={leg.title}
              color={s.color}
              onClose={() => setActive(null)}
              onChanged={onChanged}
              onUnauthorized={onUnauthorized}
            />
          </>} />
        )}
      </AnimatePresence>
    </article>
  );
}

function Expand({ body, reduce }: { body: React.ReactNode; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Once open, make sure the whole expansion is on screen (above the mobile dock).
  const reveal = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const bottomGap = window.innerWidth < 768 ? 104 : 24;
    const overflow = r.bottom - (window.innerHeight - bottomGap);
    if (overflow <= 0) return;
    const by = Math.min(overflow, Math.max(0, r.top - 96));
    if (by <= 0) return;
    const lenis = window.__lenis;
    if (lenis && !reduce) lenis.scrollTo(window.scrollY + by, { duration: 0.8 });
    else window.scrollBy({ top: by, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <motion.div
      ref={ref}
      onAnimationComplete={(def) => {
        if (typeof def === "object" && def && "opacity" in def && (def as { opacity: number }).opacity === 1) reveal();
      }}
      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="mx-6 border-t border-line sm:mx-8 lg:mx-10" />
      <div className="px-6 pb-7 pt-7 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">{body}</div>
    </motion.div>
  );
}

function StatusChip({ leg, full, color }: { leg: RosterLeg; full: boolean; color: string }) {
  if (leg.closed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-tint/[0.03] px-3 py-1 text-[12.5px] text-ink-2">
        <Lock className="size-3" strokeWidth={2} /> Reserved
      </span>
    );
  }
  if (full) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-[12.5px] text-brass">
        <Check className="size-3.5" strokeWidth={2} /> Full crew
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12.5px]"
      style={{ borderColor: alpha(color, 0.3), background: alpha(color, 0.08), color }}
    >
      <span className={`size-1.5 rounded-full ${styles.glowDot}`} style={{ background: color, ["--c" as string]: color }} />
      <span>
        <span className="num">{leg.spotsRemaining}</span> of <span className="num">{leg.capacity}</span>{" "}
        berth{leg.spotsRemaining === 1 ? "" : "s"} open
      </span>
    </span>
  );
}

// Plan view of the boat, bow to the right. Decorative.
function Hull({ color, closed, patternId: pid }: { color: string; closed: boolean; patternId: string }) {
  const hull =
    "M24 32C18 32 16 36 16 42L16 108C16 114 18 118 24 118C120 126 200 127 262 122C350 114 405 93 428 75C405 57 350 36 262 28C200 23 120 24 24 32Z";
  const deck =
    "M34 42L34 108C120 115 200 116 258 111C334 104 380 89 400 75C380 61 334 46 258 39C200 34 120 35 34 42Z";
  return (
    <svg viewBox="0 0 440 150" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(var(--tint) / 0.07)" strokeWidth="1.2" />
        </pattern>
      </defs>
      <path d={hull} className={closed ? undefined : styles.hullOutline} fill={closed ? `url(#${pid})` : alpha(color, 0.05)} stroke={color} strokeOpacity={closed ? 0.35 : 0.55} strokeWidth={1.3} />
      <g className={styles.hullDetail}>
      <path d={deck} fill="none" stroke={color} strokeOpacity={closed ? 0.12 : 0.18} strokeWidth={1} />
      {/* centreline */}
      <line x1="16" y1="75" x2="428" y2="75" stroke={color} strokeOpacity={0.14} strokeDasharray="2 6" />
      {/* cockpit + companionway */}
      <rect x="24" y="54" width="34" height="42" rx="8" fill="none" stroke={color} strokeOpacity={0.16} />
      {/* mast step + shrouds */}
      <circle cx="268" cy="75" r="3.5" fill={color} fillOpacity={closed ? 0.25 : 0.55} />
      <path d="M268 75L250 30M268 75L250 120" stroke={color} strokeOpacity={0.1} />
      {/* forestay + fore hatch */}
      <path d="M268 75L424 75" stroke={color} strokeOpacity={0.16} />
      <rect x="372" y="67" width="14" height="16" rx="2.5" fill="none" stroke={color} strokeOpacity={0.14} />
      </g>
    </svg>
  );
}

function Field({
  id,
  label,
  optional,
  count,
  limit,
  error,
  hint,
  control,
}: {
  id: string;
  label: string;
  optional?: boolean;
  count: number;
  limit: number;
  error?: string | null;
  hint?: string;
  control: React.ReactNode;
}) {
  const near = count >= limit * 0.9;
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
          {label}
          {optional && <span className="ml-1.5 font-normal text-ink-3">optional</span>}
        </label>
        <span
          id={`${id}-count`}
          className={`num text-[11px] transition-colors ${near ? "text-brass" : "text-ink-3"}`}
          aria-live={near ? "polite" : "off"}
        >
          {count}/{limit}
        </span>
      </div>
      {control}
      {error ? (
        <p id={`${id}-err`} className={`mt-1.5 flex items-center gap-1.5 text-[12.5px] ${styles.alertText}`}>
          <AlertTriangle className="size-3.5 text-alert" strokeWidth={1.75} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

const inputCls =
  `w-full rounded-xl border ${styles.well} px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-4`;

function SignAboardForm({
  id,
  leg,
  color,
  numeral,
  onCancel,
  onChanged,
  onUnauthorized,
  onJoined,
}: {
  id: string;
  leg: RosterLeg;
  color: string;
  numeral: string;
  onCancel: () => void;
  onChanged: () => Promise<boolean>;
  onUnauthorized: () => void;
  onJoined: (member: { id: string; name: string; legId: string }) => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ name?: string; contact?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const borderFor = (bad?: string) =>
    bad
      ? "border-alert/60 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--alert)_12%,transparent)]"
      : "border-line-strong focus:border-[var(--leg)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--leg)_22%,transparent)]";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fe: { name?: string; contact?: string } = {};
    if (!name.trim()) fe.name = "Please enter your name.";
    if (!contact.trim()) fe.contact = "Please enter a contact (email or phone).";
    setFieldErr(fe);
    if (fe.name) return nameRef.current?.focus();
    if (fe.contact) return contactRef.current?.focus();

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crew/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legId: leg.legId, name, contact, note }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.status === 201) {
        const data = await res.json().catch(() => ({}));
        const m = data?.member;
        setName("");
        setContact("");
        setNote("");
        // Mark the newcomer first so their berth animates in when the
        // refreshed roster lands.
        onJoined({ id: m?.id ?? "", name: m?.name ?? name.trim(), legId: leg.legId });
        await onChanged();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Could not sign up. Please try again.");
        // The roster moved under us (filled up / closed) — resync the berths.
        if (res.status === 409 || res.status === 403) void onChanged();
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      id={id}
      onSubmit={submit}
      noValidate
      aria-label={`Sign aboard for ${leg.title}`}
      style={{ ["--leg" as string]: color } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow" style={{ color }}>
            Signing aboard · Leg {numeral} · Berth <span className="num">{leg.taken + 1}</span> of{" "}
            <span className="num">{leg.capacity}</span>
          </p>
          <h4 className="mt-2 font-display text-[clamp(1.5rem,3vw,2rem)] font-light leading-tight text-ink">
            Take a berth on <em style={{ color }}>{leg.title}</em>
          </h4>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close sign-up form"
          className="grid size-11 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-tint/[0.06] hover:text-ink"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field id={`${uid}-name`} label="Your name" count={name.length} limit={FIELD_LIMITS.name} error={fieldErr.name} control={<>
          <input
            ref={nameRef}
            style={{ outline: "none" }}
            id={`${uid}-name`}
            className={`${inputCls} h-12 ${borderFor(fieldErr.name)}`}
            placeholder="First and last name"
            autoComplete="name"
            value={name}
            maxLength={FIELD_LIMITS.name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErr.name) setFieldErr((f) => ({ ...f, name: undefined }));
            }}
            aria-invalid={fieldErr.name ? true : undefined}
            aria-describedby={`${uid}-name-count${fieldErr.name ? ` ${uid}-name-err` : ""}`}
            required
            autoFocus
          />
        </>} />
        <Field
          id={`${uid}-contact`}
          label="Email or phone"
          count={contact.length}
          limit={FIELD_LIMITS.contact}
          error={fieldErr.contact}
          hint="Shipmates on the manifest can see this."
         control={<>
          <input
            ref={contactRef}
            style={{ outline: "none" }}
            id={`${uid}-contact`}
            className={`${inputCls} h-12 ${borderFor(fieldErr.contact)}`}
            placeholder="you@example.com or +1 555…"
            autoComplete="email"
            value={contact}
            maxLength={FIELD_LIMITS.contact}
            onChange={(e) => {
              setContact(e.target.value);
              if (fieldErr.contact) setFieldErr((f) => ({ ...f, contact: undefined }));
            }}
            aria-invalid={fieldErr.contact ? true : undefined}
            aria-describedby={`${uid}-contact-count ${fieldErr.contact ? `${uid}-contact-err` : `${uid}-contact-hint`}`}
            required
          />
        </>} />
        <div className="md:col-span-2">
          <Field id={`${uid}-note`} label="Note" optional count={note.length} limit={FIELD_LIMITS.note} control={<>
            <textarea
              id={`${uid}-note`}
              style={{ outline: "none" }}
              className={`${inputCls} min-h-[96px] resize-y py-3 leading-relaxed ${borderFor()}`}
              placeholder="Sailing experience, which days you can make, dietary needs…"
              value={note}
              maxLength={FIELD_LIMITS.note}
              onChange={(e) => setNote(e.target.value)}
              aria-describedby={`${uid}-note-count`}
              rows={3}
            />
          </>} />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className={`mt-5 flex items-start gap-2.5 rounded-xl border border-alert/30 bg-alert/[0.08] px-4 py-3 text-[14px] leading-snug ${styles.alertText}`}
        >
          <AlertTriangle className="mt-px size-4 shrink-0 text-alert" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[48px] rounded-full border border-line-strong px-6 text-[14px] text-ink-2 transition-colors hover:bg-tint/[0.05] hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-[14.5px] font-medium text-abyss transition-[filter,transform] hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
          style={{ background: color, boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.18), 0 12px 36px -12px ${halo(color, true)}` }}
        >
          {busy ? <Loader2 className="size-4 animate-spin" strokeWidth={2} /> : <Anchor className="size-4" strokeWidth={2} />}
          {busy ? "Signing aboard…" : "Sign aboard"}
        </button>
      </div>
    </form>
  );
}

function MemberDetail({
  id,
  member,
  legTitle,
  color,
  onClose,
  onChanged,
  onUnauthorized,
}: {
  id: string;
  member: RosterMember;
  legTitle: string;
  color: string;
  onClose: () => void;
  onChanged: () => Promise<boolean>;
  onUnauthorized: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const href = contactHref(member.contact);
  const ContactIcon = href?.startsWith("tel:") ? Phone : Mail;

  async function withdraw() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/crew/signup/${member.id}`, { method: "DELETE" });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok || res.status === 404) {
        // 404: someone else already withdrew this entry — just resync.
        await onChanged();
        onClose();
        return;
      }
      setError("Couldn’t withdraw — please try again.");
      setBusy(false);
    } catch {
      setError("Network error — please try again.");
      setBusy(false);
    }
  }

  return (
    <div id={id} role="region" aria-label={`${member.name} — crew details`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden
            className="grid size-14 shrink-0 place-items-center rounded-full text-[16px] font-semibold text-abyss"
            style={{ background: color, boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.4), 0 8px 24px -8px ${halo(color, true)}` }}
          >
            {initials(member.name)}
          </span>
          <div className="min-w-0">
            <p className="font-display text-[clamp(1.4rem,3vw,1.75rem)] font-light leading-tight text-ink [overflow-wrap:anywhere]">
              {member.name}
            </p>
            {signedOn(member.createdAt) && (
              <p className="eyebrow mt-1.5 !text-[10px]">
                Signed aboard <span className="num normal-case">{signedOn(member.createdAt)}</span>
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close details for ${member.name}`}
          className="grid size-11 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-tint/[0.06] hover:text-ink"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <dl className="mt-6 grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0">
          <dt className="eyebrow !text-[10px]">Contact</dt>
          <dd className="mt-2 text-[15px] text-ink [overflow-wrap:anywhere]">
            {href ? (
              <a
                href={href}
                className="inline-flex min-h-[44px] items-center gap-2 underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-[currentColor]"
                style={{ color }}
              >
                <ContactIcon className="size-4 shrink-0" strokeWidth={1.75} />
                {member.contact}
              </a>
            ) : (
              member.contact
            )}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="eyebrow !text-[10px]">Note</dt>
          <dd className="mt-2 text-[15px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]">
            {member.note ? <span className="italic">&ldquo;{member.note}&rdquo;</span> : <span className="text-ink-4">—</span>}
          </dd>
        </div>
      </dl>

      {error && (
        <p role="alert" className={`mt-5 flex items-center gap-2 text-[13.5px] ${styles.alertText}`}>
          <AlertTriangle className="size-4 text-alert" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div className="mt-6 flex min-h-[48px] flex-wrap items-center justify-end gap-3">
        {confirming ? (
          <div role="group" aria-label="Confirm withdrawal" className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 flex-1 text-[14px] leading-snug text-ink-2" aria-live="polite">
              Withdraw <strong className="font-medium text-ink">{member.name}</strong> from {legTitle}?
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="min-h-[44px] flex-1 rounded-full border border-line-strong px-5 text-[14px] text-ink-2 transition-colors hover:bg-tint/[0.05] hover:text-ink sm:flex-none"
              >
                Keep aboard
              </button>
              <button
                type="button"
                onClick={withdraw}
                disabled={busy}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-alert px-5 text-[14px] font-medium text-abyss transition-[filter] hover:brightness-110 disabled:opacity-70 sm:flex-none"
              >
                {busy ? <Loader2 className="size-4 animate-spin" strokeWidth={2} /> : <UserMinus className="size-4" strokeWidth={2} />}
                {busy ? "Withdrawing…" : "Withdraw"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Withdraw ${member.name} from ${legTitle}`}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border border-alert/30 px-5 text-[14px] transition-colors hover:bg-alert/10 ${styles.alertText}`}
          >
            <UserMinus className="size-4" strokeWidth={1.75} />
            Withdraw from this leg
          </button>
        )}
      </div>
    </div>
  );
}
