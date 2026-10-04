"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, CornerDownLeft, MapPin } from "lucide-react";
import { LegChip } from "@/components/kit";
import type { JournalEntry } from "@/lib/types";
import {
  VOYAGE_DAYS, formatEntryDate, isoForDay, itineraryDay, placeShort, routeLabel, todayIso, wordCount,
} from "./logFormat";

type Draft = Omit<JournalEntry, "id" | "createdAt">;

// The writing surface. Picking a voyage day pre-fills the date and the planned
// landfall from the itinerary; either can still be typed over by hand (and a
// hand-typed value is never overwritten by a later day change).
export function Composer({
  initial, mode, onSave, onCancel,
}: {
  initial?: Partial<JournalEntry>;
  mode: "new" | "edit";
  onSave: (data: Draft) => void;
  onCancel: () => void;
}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [day, setDay] = useState<number>(initial?.day ?? 0);
  const [date, setDate] = useState(initial?.date ?? (initial?.day ? isoForDay(initial.day) : todayIso()));
  const [location, setLocation] = useState(
    initial?.location ?? (initial?.day ? itineraryDay(initial.day)?.to ?? "" : ""),
  );
  const [armDiscard, setArmDiscard] = useState(false);
  const auto = useRef({ date: initial?.day ? isoForDay(initial.day) : "", location: initial?.day ? itineraryDay(initial.day)?.to ?? "" : "" });
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const it = itineraryDay(day);
  const canSave = !!(title.trim() || body.trim());
  const dirty =
    title !== (initial?.title ?? "") || body !== (initial?.body ?? "");

  // Let the page grow with the writing instead of scrolling inside a box.
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 320)}px`;
  }, [body]);
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [title]);

  useEffect(() => {
    if (!armDiscard) return;
    const t = window.setTimeout(() => setArmDiscard(false), 2500);
    return () => window.clearTimeout(t);
  }, [armDiscard]);

  const pickDay = (n: number) => {
    setDay(n);
    if (n > 0) {
      const iso = isoForDay(n);
      const to = itineraryDay(n)?.to ?? "";
      if (!date || date === auto.current.date || (mode === "new" && date === todayIso())) setDate(iso);
      if (!location.trim() || location === auto.current.location) setLocation(to);
      auto.current = { date: iso, location: to };
    }
  };

  const save = () => {
    if (!canSave) return;
    onSave({ title: title.trim(), body, date, day, location: location.trim() });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (dirty && !armDiscard) setArmDiscard(true);
      else onCancel();
    }
  };

  const words = wordCount(body);
  // Composer only ever mounts after a click, so reading navigator here is safe.
  const mod = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
  const fieldCls =
    "w-full min-h-11 rounded-xl border border-line-strong bg-white/[0.03] px-3.5 text-[15px] text-ink placeholder:text-ink-4 transition-colors hover:border-white/25 focus:border-glow/60 focus:bg-white/[0.05] focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-glow/25";

  return (
    <motion.form
      onSubmit={e => { e.preventDefault(); save(); }}
      onKeyDown={onKeyDown}
      aria-label={mode === "new" ? "New log entry" : "Edit log entry"}
      className="glass-strong relative overflow-hidden rounded-[28px]"
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: reduce ? 0.12 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Spine glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow/50 to-transparent" />

      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
        <p className="eyebrow flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-glow shadow-[0_0_10px_var(--glow)]" />
          {mode === "new" ? "New entry" : "Editing entry"}
        </p>
        <p className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4 sm:flex">
          <span><Kbd>{mod}</Kbd><Kbd><CornerDownLeft className="size-2.5" strokeWidth={2} /></Kbd> save</span>
          <span><Kbd>Esc</Kbd> cancel</span>
        </p>
      </div>

      <div className="space-y-6 px-5 pb-6 pt-6 sm:px-8 sm:pt-7">
        {/* Day · date · place */}
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <label htmlFor={`${uid}-day`} className="eyebrow mb-2 block">Voyage day</label>
            <div className="relative">
              <select
                id={`${uid}-day`}
                value={day}
                onChange={e => pickDay(Number(e.target.value))}
                className={`${fieldCls} num appearance-none pr-9`}
                style={noOutline}
              >
                <option value={0}>Not a voyage day</option>
                {VOYAGE_DAYS.map(d => (
                  <option key={d.day} value={d.day}>
                    Day {String(d.day).padStart(2, "0")} · {formatEntryDate(isoForDay(d.day), { month: "short", day: "numeric" })} · {placeShort(d.to)}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-3.5 top-1/2 size-3 -translate-y-1/2 text-ink-3">
                <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-date`} className="eyebrow mb-2 block">Date</label>
            <input
              id={`${uid}-date`}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={`${fieldCls} num [color-scheme:dark]`}
              style={noOutline}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-loc`} className="eyebrow mb-2 block">Location</label>
            <div className="relative">
              <MapPin aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" strokeWidth={1.6} />
              <input
                id={`${uid}-loc`}
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Harbour, anchorage, lock…"
                autoComplete="off"
                className={`${fieldCls} pl-10`}
                style={noOutline}
              />
            </div>
          </div>
        </div>

        {/* The plan for that day, from the itinerary */}
        {it && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-ink-3">
            <LegChip legId={it.leg} size="sm" showNumeral />
            <span className="text-ink-2">{routeLabel(it)}</span>
            {it.overnight && placeShort(it.overnight) !== location && (
              <button
                type="button"
                onClick={() => { setLocation(it.overnight); auto.current.location = it.overnight; }}
                className="inline-flex min-h-8 items-center gap-1.5 text-left text-ink-3 underline decoration-ink-4 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3"
              >
                Use overnight: {it.overnight}
              </button>
            )}
          </div>
        )}

        <div>
          <label htmlFor={`${uid}-title`} className="eyebrow mb-1 block">Title</label>
          {/* A one-line textarea so long titles wrap instead of scrolling sideways. */}
          <textarea
            id={`${uid}-title`}
            ref={titleRef}
            autoFocus
            rows={1}
            value={title}
            onChange={e => setTitle(e.target.value.replace(/\n/g, " "))}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                bodyRef.current?.focus();
              }
            }}
            placeholder={it ? `${routeLabel(it)}` : "Name the day"}
            autoComplete="off"
            style={noOutline}
            className="font-display block w-full resize-none overflow-hidden border-0 border-b border-line bg-transparent pb-3 pt-1 text-[clamp(1.75rem,4vw,2.5rem)] font-light leading-tight text-ink placeholder:text-ink-4 focus:border-glow/50"
          />
        </div>

        <div className="relative">
          <label htmlFor={`${uid}-body`} className="sr-only">Log entry</label>
          {/* Margin rule, like a printed log page */}
          <textarea
            id={`${uid}-body`}
            ref={bodyRef}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={"Wind, weather, sea state. Who came aboard, what slid past the rail, how the light fell on the water…"}
            rows={10}
            className="peer font-display block w-full resize-none overflow-hidden border-0 bg-transparent pl-5 pr-1 text-[18px] font-light leading-[2rem] text-ink placeholder:italic placeholder:text-ink-4 focus:outline-none focus-visible:outline-none sm:pl-7"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent calc(2rem - 1px), rgb(255 255 255 / 0.06) calc(2rem - 1px), rgb(255 255 255 / 0.06) 2rem)",
              backgroundAttachment: "local",
              outline: "none",
              backgroundPositionY: "-0.3rem",
            }}
          />
          <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-brass/25 transition-[background-color,box-shadow] duration-300 peer-focus:bg-glow peer-focus:shadow-[0_0_10px_var(--glow)] sm:left-1" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-8">
        <p className="num text-xs text-ink-3" aria-live="polite">
          {armDiscard ? (
            <span className="text-brass">Unsaved words — press Esc again to discard</span>
          ) : (
            <>{words} {words === 1 ? "word" : "words"}{date && <span className="text-ink-4"> · {formatEntryDate(date, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>}</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-full px-5 text-sm font-medium text-ink-2 transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-glow px-5 text-sm font-semibold text-abyss shadow-[0_0_24px_-6px_var(--glow)] transition-[filter,opacity,box-shadow] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
          >
            <Check className="size-4" strokeWidth={2.25} />
            {mode === "new" ? "Save entry" : "Save changes"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

// globals.css draws an unlayered :focus-visible outline that utilities can't
// override; these fields carry their own focus treatment (glow border + ring).
const noOutline: React.CSSProperties = { outline: "none" };

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mr-1 inline-grid min-w-[18px] place-items-center rounded border border-line-strong bg-white/[0.03] px-1 py-px align-middle font-mono text-[10px] normal-case tracking-normal text-ink-3">
      {children}
    </kbd>
  );
}
