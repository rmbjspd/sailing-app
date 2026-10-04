"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Fuel, Droplets, Pause, Play, X, ChevronLeft, ChevronRight, ExternalLink, Anchor, ScrollText, Maximize2 } from "lucide-react";
import { waypoints } from "@/lib/data/waypoints";
import { itinerary } from "@/lib/data/itinerary";
import { legStyle, LEG_ORDER } from "@/lib/data/legStyle";
import { dateForDay } from "@/lib/data/voyage";
import type { Waypoint } from "@/lib/types";

const VoyageWorld = dynamic(() => import("@/components/world/VoyageWorld"), { ssr: false });

const PORTS = [...waypoints].sort((a, b) => a.day - b.day);
const LAST_DAY = Math.max(...itinerary.map((d) => d.day));
const fmtDate = (d: number) =>
  dateForDay(Math.max(1, d)).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

// The interactive chart: a 3D night chart you can pan, tilt and zoom, a port
// directory grouped by leg, a time scrubber that sails the boat to any day
// (or replays the whole voyage), and a detail card per harbour.
export default function ChartExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const [day, setDay] = useState(LAST_DAY);
  const [playing, setPlaying] = useState(false);
  const [listOpen, setListOpen] = useState(true);
  const [sheet, setSheet] = useState(false);
  const raf = useRef(0);
  const port = useMemo(() => PORTS.find((p) => p.id === selected) ?? null, [selected]);

  const select = useCallback((p: Waypoint | null) => {
    setPlaying(false);
    setSheet(false);
    setSelected(p?.id ?? null);
    if (p) setDay(p.day);
  }, []);

  const onStopSelect = useCallback((id: string) => select(PORTS.find((p) => p.id === id) ?? null), [select]);

  const step = useCallback((dir: 1 | -1) => {
    const i = port ? PORTS.indexOf(port) : dir === 1 ? -1 : PORTS.length;
    const next = PORTS[Math.min(PORTS.length - 1, Math.max(0, i + dir))];
    select(next);
  }, [port, select]);

  // Replay: sail from Chicago to Old Saybrook in ~24 s
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setDay((d) => {
        const n = d + dt * (LAST_DAY / 24);
        if (n >= LAST_DAY) { setPlaying(false); return LAST_DAY; }
        return n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  // Keyboard: ←/→ step through ports, Esc returns to the overview
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, [role=slider]")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, select]);

  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    setSelected(null);
    if (day >= LAST_DAY - 0.01) setDay(0);
    setPlaying(true);
  };

  const dayInt = Math.min(LAST_DAY, Math.ceil(day - 1e-6));
  const leg = itinerary.find((d) => d.day === Math.max(1, dayInt))?.leg ?? "lake-michigan";

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-abyss" data-lenis-prevent>
      <VoyageWorld mode="explore" focusStopId={selected} exploreDay={day} onStopSelect={onStopSelect} className="absolute inset-0" />
      <h1 className="sr-only">Interactive chart of the voyage</h1>

      {/* Port directory */}
      <AnimatePresence initial={false}>
        {listOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Ports of call"
            className="glass-strong absolute bottom-40 left-4 top-24 hidden w-[300px] flex-col overflow-hidden rounded-3xl md:flex lg:left-6"
          >
            <div className="flex items-start justify-between border-b border-line p-5 pb-4">
              <div>
                <p className="eyebrow">The Chart</p>
                <p className="font-display mt-1 text-2xl font-light">{PORTS.length} ports of call</p>
              </div>
              <button onClick={() => setListOpen(false)} className="grid size-9 place-items-center rounded-full text-ink-3 hover:bg-tint/5 hover:text-ink" aria-label="Hide port list">
                <X className="size-4" />
              </button>
            </div>
            <PortList selected={selected} onSelect={select} />
          </motion.aside>
        )}
      </AnimatePresence>
      {!listOpen && (
        <button onClick={() => setListOpen(true)} className="glass absolute left-4 top-24 hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ink-2 hover:text-ink md:flex lg:left-6">
          <Anchor className="size-4" /> Ports
        </button>
      )}

      {/* Port directory — phones: bottom sheet above the scrubber */}
      <AnimatePresence>
        {sheet && (
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog" aria-label="Ports of call"
            className="glass-strong absolute inset-x-3 bottom-[14rem] top-20 z-20 flex flex-col overflow-hidden rounded-3xl md:hidden"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="font-display text-xl font-light">{PORTS.length} ports of call</p>
              <button onClick={() => setSheet(false)} className="grid size-11 place-items-center rounded-full text-ink-3 hover:bg-tint/5 hover:text-ink" aria-label="Close port list">
                <X className="size-4" />
              </button>
            </div>
            <PortList selected={selected} onSelect={select} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Port detail */}
      <AnimatePresence mode="wait">
        {port && <PortCard key={port.id} port={port} onClose={() => select(null)} onStep={step} />}
      </AnimatePresence>

      {/* Time scrubber */}
      <div className="absolute inset-x-3 bottom-[5.25rem] md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[min(760px,calc(100%-3rem))] md:-translate-x-1/2">
        <div className="glass-strong rounded-2xl p-3 md:p-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={togglePlay}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-abyss transition-transform hover:scale-105 active:scale-95"
              aria-label={playing ? "Pause voyage replay" : day >= LAST_DAY - 0.01 ? "Replay the voyage from Chicago" : `Sail on from Day ${Math.ceil(day)}`}
            >
              {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="truncate text-sm">
                  <span className="num text-ink">Day {String(dayInt).padStart(2, "0")}</span>
                  <span className="text-ink-3"> · {dayInt === 0 ? "Departure, Chicago" : fmtDate(dayInt)}</span>
                </p>
                <p className="eyebrow hidden truncate !text-[10px] sm:block" style={{ color: legStyle(leg).color }}>{legStyle(leg).label}</p>
              </div>
              <Scrubber day={day} onChange={(d) => { setPlaying(false); setSelected(null); setDay(d); }} />
            </div>
            <button
              onClick={() => select(null)}
              className="hidden size-11 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:bg-tint/5 hover:text-ink sm:grid"
              aria-label="Show the whole route"
              title="Whole route (Esc)"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex gap-2 md:hidden">
          <button onClick={() => setSheet((v) => !v)} aria-expanded={sheet} className="glass-strong flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm text-ink-2">
            <Anchor className="size-4" /> Ports
          </button>
          <button onClick={() => select(null)} className="glass-strong flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm text-ink-2">
            <Maximize2 className="size-4" /> Whole route
          </button>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-ink-4 md:block">Drag to pan · scroll to zoom · right-drag to tilt · ← → to step through ports</p>
      </div>
    </div>
  );
}

function PortList({ selected, onSelect }: { selected: string | null; onSelect: (p: Waypoint | null) => void }) {
  return (
    <ol className="flex-1 overflow-y-auto overscroll-contain p-2" data-lenis-prevent>
      {LEG_ORDER.map((legId) => {
        const s = legStyle(legId);
        const ports = PORTS.filter((p) => p.leg === legId);
        if (!ports.length) return null;
        return (
          <li key={legId} className="mb-1">
            <p className="eyebrow sticky top-0 z-10 flex items-center gap-2 bg-[color-mix(in_srgb,var(--deep)_92%,transparent)] px-3 py-2 backdrop-blur" style={{ color: s.color }}>
              <span className="num">{s.numeral}</span> {s.label}
            </p>
            <ul>
              {ports.map((p) => {
                const on = p.id === selected;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => onSelect(on ? null : p)}
                      aria-pressed={on}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${on ? "bg-tint/[0.09]" : "hover:bg-tint/[0.04]"}`}
                    >
                      <span className="num w-7 shrink-0 text-[11px] text-ink-3">{p.day === 0 ? "—" : String(p.day).padStart(2, "0")}</span>
                      <span className="size-2 shrink-0 rounded-full transition-transform group-hover:scale-125" style={{ background: s.color, boxShadow: on ? `0 0 12px ${s.color}` : undefined }} />
                      <span className={`truncate text-sm ${on ? "text-ink" : "text-ink-2"}`}>{p.name}</span>
                      <span className="ml-auto text-[10px] text-ink-4">{p.state}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

function Scrubber({ day, onChange }: { day: number; onChange: (d: number) => void }) {
  // A spectrum track segmented by day, coloured by leg; native range input on
  // top for full keyboard + screen-reader support.
  const days = useMemo(() => Array.from({ length: LAST_DAY }, (_, i) => itinerary.find((d) => d.day === i + 1)?.leg ?? "lake-michigan"), []);
  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 flex h-2 -translate-y-1/2 gap-[2px]">
        {days.map((l, i) => (
          <span key={i} className="h-full flex-1 rounded-[2px] transition-opacity" style={{ background: legStyle(l).color, opacity: i < day ? 0.95 : 0.18 }} />
        ))}
      </div>
      <span className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-abyss bg-ink shadow-[0_0_16px_rgb(var(--tint)/0.5)]" style={{ left: `${(day / LAST_DAY) * 100}%` }} />
      <input
        type="range" min={0} max={LAST_DAY} step={0.01} value={day}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Voyage day"
        aria-valuetext={`Day ${Math.ceil(day)}`}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

function PortCard({ port, onClose, onStep }: { port: Waypoint; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const s = legStyle(port.leg);
  const day = itinerary.find((d) => d.day === port.day);
  const i = PORTS.indexOf(port);
  return (
    <motion.section
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(4px)", transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${port.name} details`}
      className="glass-strong absolute inset-x-3 top-20 max-h-[calc(100dvh-19rem)] md:max-h-[calc(100dvh-16rem)] overflow-y-auto rounded-3xl md:inset-x-auto md:right-6 md:top-24 md:w-[380px]"
      data-lenis-prevent
    >
      <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow" style={{ color: s.color }}>
            {port.day === 0 ? "Departure" : `Day ${port.day}`} · {s.label}
          </p>
          <button onClick={onClose} className="-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-tint/5 hover:text-ink" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <h2 className="font-display mt-2 text-[2.2rem] font-light leading-none">{port.name}</h2>
        <p className="mt-2 text-sm text-ink-3">
          {port.state}{port.day > 0 && <> · {fmtDate(port.day)}</>}{port.isLayover && <> · <span className="text-brass">layover day follows</span></>}
        </p>
        {port.marina && (
          <p className="mt-5 flex items-start gap-2 text-sm text-ink-2"><Anchor className="mt-0.5 size-4 shrink-0 text-ink-3" strokeWidth={1.5} />{port.marina}</p>
        )}
        {(port.fuel || port.pumpout) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {port.fuel && <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-brass"><Fuel className="size-3.5" strokeWidth={1.5} /> Fuel</span>}
            {port.pumpout && <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-glow"><Droplets className="size-3.5" strokeWidth={1.5} /> Pump-out</span>}
          </div>
        )}
        {day && (
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <div><p className="eyebrow !text-[9px]">From</p><p className="mt-1 truncate text-sm text-ink-2">{day.from.split(",")[0]}</p></div>
            <div><p className="eyebrow !text-[9px]">Distance</p><p className="num mt-1 text-sm text-ink">{day.distanceMi ? `${day.distanceMi} mi` : `${day.distanceNm} nm`}</p></div>
            <div><p className="eyebrow !text-[9px]">Locks</p><p className="num mt-1 text-sm text-ink">{day.locks || "—"}</p></div>
          </div>
        )}
        {port.notes && <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{port.notes}</p>}
        <div className="mt-6 flex flex-wrap gap-2">
          {port.day > 0 && (
            <Link href={`/itinerary#day-${port.day}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-abyss hover:bg-white">
              <ScrollText className="size-4" /> Ship&rsquo;s Log
            </Link>
          )}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${port.lat},${port.lng}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-ink-2 hover:bg-tint/5 hover:text-ink"
          >
            Harbour map <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
      <div className="flex border-t border-line">
        <button disabled={i <= 0} onClick={() => onStep(-1)} className="flex flex-1 items-center gap-2 px-5 py-3.5 text-sm text-ink-3 hover:bg-tint/[0.03] hover:text-ink disabled:opacity-30">
          <ChevronLeft className="size-4" /> {i > 0 ? PORTS[i - 1].name.split(" / ")[0] : ""}
        </button>
        <button disabled={i >= PORTS.length - 1} onClick={() => onStep(1)} className="flex flex-1 items-center justify-end gap-2 border-l border-line px-5 py-3.5 text-sm text-ink-3 hover:bg-tint/[0.03] hover:text-ink disabled:opacity-30">
          {i < PORTS.length - 1 ? PORTS[i + 1].name.split(" / ")[0] : ""} <ChevronRight className="size-4" />
        </button>
      </div>
    </motion.section>
  );
}
