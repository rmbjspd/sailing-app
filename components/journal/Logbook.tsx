"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Feather } from "lucide-react";
import { PageHero } from "@/components/kit";
import { legStyle } from "@/lib/data/legStyle";
import { useJournal } from "@/lib/hooks/useJournal";
import type { JournalEntry } from "@/lib/types";
import { Composer } from "./Composer";
import { EmptyLog } from "./EmptyLog";
import { EntryCard } from "./EntryCard";
import { VoyageStrip } from "./VoyageStrip";
import {
  LAST_DAY, compareEntries, dayForIso, formatEntryDate, isoForDay, itineraryDay, todayIso, wordCount,
} from "./logFormat";

type Order = "latest" | "voyage";

interface DayGroup {
  key: string;
  day: number;
  date: string;
  entries: JournalEntry[];
}

const DAY_MS = 86_400_000;

// "Day 1 in 258 days" before the voyage, "Today is Day 12" during it.
function VoyageClock() {
  const t = todayIso();
  const toStart = Math.round((Date.parse(isoForDay(1)) - Date.parse(t)) / DAY_MS);
  const day = dayForIso(t);
  const dot = <span className="size-1.5 shrink-0 rounded-full bg-brass shadow-[0_0_8px_var(--brass)]" />;
  if (toStart > 0)
    return <>{dot}<span>Dock lines in <span className="text-ink">{toStart.toLocaleString("en-US")}</span> {toStart === 1 ? "day" : "days"} · {formatEntryDate(isoForDay(1), { month: "short", day: "numeric", year: "numeric" })}</span></>;
  if (day > 0)
    return <>{dot}<span>Underway · today is <span className="text-ink">Day {day}</span> of {LAST_DAY}</span></>;
  return <>{dot}<span>Passage complete · {LAST_DAY} days logged in the wake</span></>;
}

function scrollToEl(el: Element | null, reduce: boolean | null) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 112;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(y, { duration: reduce ? 0 : 1.2 });
  else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}

export function Logbook() {
  const { entries, addEntry, updateEntry, deleteEntry, ready } = useJournal();
  const reduce = useReducedMotion();
  const [composer, setComposer] = useState<{ day: number; n: number } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>("latest");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const composerRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const today = useMemo(() => (ready ? dayForIso(todayIso()) : 0), [ready]);

  const counts = useMemo(() => {
    const m = new Map<number, number>();
    entries.forEach(e => { if (e.day > 0) m.set(e.day, (m.get(e.day) ?? 0) + 1); });
    return m;
  }, [entries]);

  const groups = useMemo<DayGroup[]>(() => {
    const sorted = [...entries].sort(compareEntries);
    if (order === "latest") sorted.reverse();
    const out: DayGroup[] = [];
    for (const e of sorted) {
      const key = e.day > 0 ? `d${e.day}` : `t${e.date}`;
      const last = out[out.length - 1];
      if (last && last.key === key) last.entries.push(e);
      else out.push({ key, day: e.day, date: e.date, entries: [e] });
    }
    return out;
  }, [entries, order]);

  const totalWords = useMemo(() => entries.reduce((n, e) => n + wordCount(e.body ?? ""), 0), [entries]);
  const daysLogged = counts.size;

  const openComposer = useCallback((day: number) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setEditId(null);
    setComposer({ day, n: Date.now() });
    requestAnimationFrame(() => scrollToEl(composerRef.current, reduce));
  }, [reduce]);

  const closeComposer = useCallback(() => {
    setComposer(null);
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  }, []);

  useEffect(() => {
    if (!highlight) return;
    const t = window.setTimeout(() => setHighlight(null), 2600);
    return () => window.clearTimeout(t);
  }, [highlight]);

  const reveal = (id: string) => {
    setHighlight(id);
    // Wait for the composer's exit so the target's position has settled.
    window.setTimeout(() => scrollToEl(document.getElementById(`entry-${id}`), reduce), reduce ? 0 : 500);
  };

  const pickDay = (day: number) => {
    const existing = groups.find(g => g.day === day);
    if (existing) reveal(existing.entries[0].id);
    else openComposer(day);
  };

  const describe = (e: Pick<JournalEntry, "title" | "day">) =>
    e.title || (e.day ? `Day ${e.day}` : "Untitled entry");

  return (
    <div className="pb-32 md:pb-24">
      <PageHero
        eyebrow={<span>Journal · Kept aboard S/V Sabbatical</span>}
        title={<>The <em className="text-brass">Logbook</em></>}
        lede={
          <>
            <span className="num">{LAST_DAY}</span>{" "}days from Chicago to Old Saybrook, one page at a time.
            Wind, weather, who came alongside, how the light fell on the water &mdash; set it down
            while it&rsquo;s fresh. Entries are kept on this device.
          </>
        }
        aside={
          <div className="glass-strong w-full rounded-[28px] p-6 sm:w-[380px]">
            <dl className="grid grid-cols-3 gap-4">
              {[
                { k: "Entries", v: entries.length },
                { k: "Days", v: daysLogged, of: LAST_DAY },
                { k: "Words", v: totalWords },
              ].map(s => (
                <div key={s.k}>
                  <dt className="eyebrow !text-[10px]">{s.k}</dt>
                  <dd className="mt-2">
                    {ready ? (
                      <span className="num text-[28px] leading-none text-ink">
                        {s.v.toLocaleString("en-US")}
                        {s.of && <span className="text-[15px] text-ink-4">/{s.of}</span>}
                      </span>
                    ) : (
                      <span className="shimmer block h-7 w-12 rounded-md bg-white/[0.04]" />
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="num mt-5 flex min-h-5 items-center gap-2 border-t border-line pt-4 text-[12px] text-ink-3">
              {ready && <VoyageClock />}
            </p>
            <button
              type="button"
              onClick={() => openComposer(today)}
              disabled={!ready}
              className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-glow px-6 text-[15px] font-semibold text-abyss shadow-[0_0_32px_-8px_var(--glow)] transition-[filter,box-shadow] hover:shadow-[0_0_44px_-6px_var(--glow)] hover:brightness-110 disabled:opacity-50"
            >
              <Feather className="size-[18px] transition-transform duration-500 group-hover:-rotate-12" strokeWidth={1.75} />
              New entry
            </button>
          </div>
        }
      >
        <VoyageStrip counts={counts} ready={ready} today={today} onPick={pickDay} />
      </PageHero>

      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {/* New-entry composer */}
        <div ref={composerRef} className="scroll-mt-28">
          <AnimatePresence>
            {composer && (
              <div key={composer.n} className="mb-12">
                <Composer
                  mode="new"
                  initial={{ day: composer.day }}
                  onSave={data => {
                    const e = addEntry(data);
                    setComposer(null);
                    setAnnounce(`Saved “${describe(e)}”.`);
                    reveal(e.id);
                  }}
                  onCancel={closeComposer}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        {!ready ? (
          <div className="space-y-6" aria-busy="true" aria-label="Loading the log">
            {[0, 1].map(i => (
              <div key={i} className="grid gap-6 md:grid-cols-[140px_minmax(0,1fr)]">
                <span className="shimmer hidden h-16 rounded-xl bg-white/[0.03] md:block" />
                <span className="shimmer block h-64 rounded-[24px] border border-line bg-white/[0.02]" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          !composer && <EmptyLog onBegin={openComposer} onBlank={() => openComposer(0)} />
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="eyebrow">
                <span className="num">{entries.length}</span> {entries.length === 1 ? "entry" : "entries"}
              </h2>
              <div role="radiogroup" aria-label="Order" className="glass inline-flex rounded-full p-1">
                <LayoutGroup id="order">
                  {([["latest", "Latest first"], ["voyage", "From Day 1"]] as const).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={order === id}
                      onClick={() => setOrder(id)}
                      className={`relative min-h-10 rounded-full px-4 text-[13px] font-medium transition-colors ${order === id ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}
                    >
                      {order === id && (
                        <motion.span layoutId="order-pill" className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  ))}
                </LayoutGroup>
              </div>
            </div>

            <ol className="relative">
              {/* The course line */}
              <span
                aria-hidden
                className="absolute bottom-6 left-[140px] top-3 hidden w-px md:block"
                style={{ background: "linear-gradient(180deg, transparent, var(--line-strong) 4%, var(--line-strong) 96%, transparent)" }}
              />
              <AnimatePresence initial={false}>
                {groups.map(g => {
                  const it = itineraryDay(g.day);
                  const color = it ? legStyle(it.leg).color : "var(--ink-3)";
                  return (
                    <motion.li
                      key={g.key}
                      id={g.day > 0 ? `log-day-${g.day}` : undefined}
                      layout={reduce ? false : "position"}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative grid gap-4 pb-12 md:grid-cols-[140px_minmax(0,1fr)] md:gap-10"
                    >
                      {/* Day marker */}
                      <div className="md:sticky md:top-28 md:self-start md:pr-8 md:text-right">
                        <span
                          aria-hidden
                          className="absolute left-[140px] top-3 hidden size-3 -translate-x-1/2 rounded-full border-2 md:block"
                          style={{ borderColor: color, background: "var(--abyss)", boxShadow: `0 0 0 4px var(--abyss), 0 0 14px ${color}` }}
                        />
                        <p className="flex items-baseline gap-3 md:block">
                          {g.day > 0 ? (
                            <>
                              <span className="eyebrow md:block" style={{ color }}>Day</span>
                              <span className="num text-[28px] leading-none text-ink md:mt-1 md:block md:text-[44px] md:tracking-[-0.04em]">
                                {String(g.day).padStart(2, "0")}
                              </span>
                            </>
                          ) : (
                            <span className="eyebrow md:block">Ashore</span>
                          )}
                          <span className="num text-[13px] text-ink-3 md:mt-2 md:block">
                            {formatEntryDate(g.date, { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                        </p>
                      </div>

                      <div className="min-w-0 space-y-6">
                        {g.entries.map(e => (
                          <div key={e.id} id={`entry-${e.id}`} className="scroll-mt-28">
                            <AnimatePresence mode="wait" initial={false}>
                              {editId === e.id ? (
                                <Composer
                                  key="edit"
                                  mode="edit"
                                  initial={e}
                                  onSave={data => {
                                    updateEntry(e.id, data);
                                    setEditId(null);
                                    setAnnounce(`Updated “${describe(data)}”.`);
                                    reveal(e.id);
                                  }}
                                  onCancel={() => {
                                    setEditId(null);
                                    requestAnimationFrame(() =>
                                      document.querySelector<HTMLElement>(`#entry-${CSS.escape(e.id)} button[title="Edit"]`)?.focus());
                                  }}
                                />
                              ) : (
                                <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                  <EntryCard
                                    entry={e}
                                    highlight={highlight === e.id}
                                    onEdit={() => { setComposer(null); setEditId(e.id); }}
                                    onDelete={() => {
                                      deleteEntry(e.id);
                                      setAnnounce(`Deleted “${describe(e)}”.`);
                                    }}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </>
        )}
      </div>

      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
