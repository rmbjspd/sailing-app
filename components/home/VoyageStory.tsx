"use client";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import type { StoryState } from "@/components/world/rigs";
import type { StoryData, Chapter } from "./storyData";
import { dateForDay } from "@/lib/data/voyage";

const VoyageWorld = dynamic(() => import("@/components/world/VoyageWorld"), { ssr: false });

// Scroll choreography (fractions of the pinned section)
const HERO_END = 0.055;
const DIVE_END = 0.095;
const SAIL_END = 0.9;
const FINALE_IN = 0.965;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sstep = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

function lerpArr(arr: number[], d: number) {
  const i = Math.floor(Math.max(0, Math.min(d, arr.length - 1)));
  const f = d - i;
  return i >= arr.length - 1 ? arr[arr.length - 1] : arr[i] + (arr[i + 1] - arr[i]) * f;
}

/** Map overall scroll progress → story state + which chapter is on stage. */
function choreograph(p: number, chapters: Chapter[], lastDay: number) {
  if (p < DIVE_END) {
    return { day: 0, overview: 1 - sstep(HERO_END * 0.6, DIVE_END, p), pan: -2.9 * (1 - sstep(0, HERO_END, p)), zoom: 1 + 0.32 * (1 - sstep(0, HERO_END, p)), preview: 1 - sstep(HERO_END * 0.4, DIVE_END, p), chapter: p < HERO_END ? -1 : 0, phase: "hero" as const };
  }
  if (p < SAIL_END) {
    const t = (p - DIVE_END) / (SAIL_END - DIVE_END);
    const n = chapters.length;
    const ci = Math.min(n - 1, Math.floor(t * n));
    const local = t * n - ci;
    const c = chapters[ci];
    // hold briefly at the start of each chapter so the panel can be read
    const travel = ease(sstep(0.12, 0.96, local));
    const day = c.dayFrom + (c.dayTo - c.dayFrom) * travel;
    // the camera takes a breath upward as each new water opens up
    const lift = 0.2 * (1 - sstep(0, 0.22, local)) * (ci === 0 ? 0 : 1);
    return { day, overview: 0.04 + lift, pan: 0, zoom: 1, preview: 0, chapter: ci, phase: "sail" as const };
  }
  return { day: lastDay, overview: sstep(SAIL_END, FINALE_IN, p), pan: -2.9 * sstep(SAIL_END, FINALE_IN, p), zoom: 1 + 0.32 * sstep(SAIL_END, FINALE_IN, p), preview: 0, chapter: chapters.length - 1, phase: "finale" as const };
}

const noop = () => () => {};
function useDaysToDeparture() {
  return useSyncExternalStore(
    noop,
    () => Math.ceil((Date.UTC(2027, 5, 19) - Date.now()) / 86_400_000),
    () => null,
  );
}

export default function VoyageStory({ data }: { data: StoryData }) {
  const section = useRef<HTMLElement>(null);
  const story = useRef<StoryState>({ day: 0, overview: 1, pan: -2.9, zoom: 1.32, preview: 1 });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const dayMV = useMotionValue(0);
  const [chapter, setChapter] = useState(-1);
  const [phase, setPhase] = useState<"hero" | "sail" | "finale">("hero");
  const reduce = useReducedMotion();

  const apply = useCallback((p: number) => {
    const s = choreograph(p, data.chapters, data.lastDay);
    story.current.day = s.day;
    story.current.overview = s.overview;
    story.current.pan = s.pan;
    story.current.zoom = s.zoom;
    story.current.preview = s.preview;
    dayMV.set(s.day);
    setChapter((c) => (c === s.chapter ? c : s.chapter));
    setPhase((ph) => (ph === s.phase ? ph : s.phase));
  }, [data, dayMV]);
  useMotionValueEvent(scrollYProgress, "change", apply);

  const heroOpacity = useTransform(scrollYProgress, [0, HERO_END], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, HERO_END], [0, -60]);
  const hudOpacity = useTransform(scrollYProgress, [HERO_END, DIVE_END, SAIL_END, SAIL_END + 0.02], [0, 1, 1, 0]);
  const finaleOpacity = useTransform(scrollYProgress, [SAIL_END + 0.015, FINALE_IN], [0, 1]);
  const railFill = useTransform(scrollYProgress, [DIVE_END, SAIL_END], ["0%", "100%"]);

  const jumpTo = useCallback((ci: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const t = DIVE_END + ((ci + 0.02) / data.chapters.length) * (SAIL_END - DIVE_END);
    const y = top + span * t;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }, [data.chapters.length, reduce]);

  const active = chapter >= 0 ? data.chapters[chapter] : null;

  return (
    <section
      ref={section}
      aria-label="The voyage, told in 3D as you scroll"
      className="relative"
      style={{ height: `${120 * data.chapters.length + 260}vh` }}
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <VoyageWorld mode="story" story={story} className="absolute inset-0" />

        {/* readability scrims */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_50%,rgb(3_6_12/0.75),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-abyss/80 to-transparent" />

        <Hero data={data} opacity={heroOpacity} y={heroY} />

        {/* Chapter panel */}
        <div className="pointer-events-none absolute inset-x-3 bottom-[5.5rem] md:inset-x-auto md:bottom-auto md:left-8 md:top-1/2 md:w-[420px] md:-translate-y-1/2 lg:left-14">
          <AnimatePresence mode="wait">
            {phase === "sail" && active && <ChapterPanel key={active.legId} c={active} />}
          </AnimatePresence>
        </div>

        {/* HUD */}
        <motion.div style={{ opacity: hudOpacity }} className="pointer-events-none absolute right-4 top-24 md:right-8 md:top-auto md:bottom-16">
          <Hud data={data} day={dayMV} active={active} />
        </motion.div>

        {/* Leg rail */}
        <motion.nav
          aria-label="Jump to a leg of the voyage"
          style={{ opacity: hudOpacity }}
          className="absolute inset-x-4 bottom-[4.75rem] hidden md:inset-x-8 md:bottom-6 md:block"
        >
          <div className="relative flex h-6 items-center gap-1">
            {data.chapters.map((c, i) => (
              <button
                key={c.legId}
                onClick={() => jumpTo(i)}
                className="group relative h-full flex-1 cursor-pointer"
                style={{ flexGrow: Math.max(c.days, 2) }}
                aria-label={`${c.numeral}. ${c.label}`}
              >
                <span
                  className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-all group-hover:h-[5px]"
                  style={{ background: c.color, opacity: i === chapter ? 1 : i < chapter ? 0.6 : 0.18, boxShadow: i === chapter ? `0 0 14px ${c.color}` : undefined }}
                />
                <span className={`num absolute -top-4 left-0 whitespace-nowrap text-[10px] tracking-widest transition-opacity ${i === chapter ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`} style={{ color: c.color }}>
                  {c.numeral} · {c.label.split(" · ")[0]}
                </span>
              </button>
            ))}
          </div>
          <motion.div className="mt-1 h-px bg-white/40" style={{ width: railFill }} />
        </motion.nav>

        {/* Finale */}
        <motion.div style={{ opacity: finaleOpacity }} className="pointer-events-none absolute inset-0 flex items-end pb-28 md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-5 md:px-14">
            <p className="eyebrow mb-4 !text-brass">Day {data.lastDay} · {dateForDay(data.lastDay).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</p>
            <h2 className="font-display text-[clamp(3.2rem,10vw,9rem)] font-light leading-[0.88]">
              Land<em className="text-spectrum pr-2">fall.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
              The mouth of the Connecticut River. <span className="num text-ink">{data.totals.nm.toLocaleString()}</span> nautical miles,{" "}
              <span className="num text-ink">{data.totals.locks}</span> locks, eight bodies of water — and one very
              well-travelled Oceanis 30.1.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Hero({ data, opacity, y }: { data: StoryData; opacity: MotionValue<number>; y: MotionValue<number> }) {
  const days = useDaysToDeparture();
  const stats = [
    { v: data.totals.nm.toLocaleString(), l: "nautical miles" },
    { v: String(data.totals.days), l: "days" },
    { v: String(data.totals.locks), l: "locks" },
    { v: String(data.totals.legs), l: "waters" },
    { v: "2", l: "countries" },
  ];
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-end pb-32 md:justify-center md:pb-0">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
          className="eyebrow mb-6 flex items-center gap-3"
        >
          <span className="spectrum-line w-10" /> S/V Sabbatical · Summer 2027
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.45, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3.4rem,11vw,10.5rem)] font-light leading-[0.86] tracking-[-0.035em]"
        >
          Chicago <em className="text-ink-3">to</em>
          <br />
          Old Saybrook
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1.2 }}
          className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-2"
        >
          Five weeks under sail across the Great Lakes, through the North Channel&rsquo;s granite, down the Erie
          Canal with the mast on deck, and out the Hudson into Long Island Sound.
        </motion.p>
        <motion.dl
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 1 }}
          className="mt-10 grid grid-cols-3 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-9"
        >
          {stats.map((s) => (
            <div key={s.l}>
              <dt className="eyebrow whitespace-nowrap !text-[9px] !tracking-[0.16em] sm:!text-[10px] sm:!tracking-[0.22em]">{s.l}</dt>
              <dd className="num mt-1 text-2xl text-ink md:text-3xl">{s.v}</dd>
            </div>
          ))}
        </motion.dl>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="mt-12 flex items-center gap-6"
        >
          <span className="flex items-center gap-3 text-sm text-ink-2">
            <span className="grid size-10 place-items-center rounded-full border border-line-strong">
              <ArrowDown className="float-y size-4" strokeWidth={1.5} />
            </span>
            Scroll to cast off
          </span>
          {days != null && days > 0 && (
            <span className="num rounded-full border border-line px-3 py-1.5 text-xs text-brass">
              T–{days} days
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ChapterPanel({ c }: { c: Chapter }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -16, filter: "blur(6px)", transition: { duration: 0.25 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong pointer-events-auto relative overflow-hidden rounded-3xl p-6 md:p-8"
    >
      <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-3 -top-8 text-[9rem] font-light italic leading-none opacity-[0.07]"
        style={{ color: c.color }}
      >
        {c.numeral}
      </span>
      <p className="eyebrow flex items-center gap-2" style={{ color: c.color }}>
        <span className="size-1.5 rounded-full" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }} />
        Leg {c.numeral} · {c.dateRange}
      </p>
      <h2 className="font-display mt-3 text-[2.1rem] font-light leading-[1] md:text-[2.6rem]">{c.label}</h2>
      <p className="mt-2 text-sm italic text-ink-2 font-display">{c.tagline}</p>
      <p className="mt-5 hidden text-[15px] leading-relaxed text-ink-2 md:block">{c.lede}</p>
      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
        <div><dt className="eyebrow !text-[9px]">Distance</dt><dd className="num mt-1 text-[15px] text-ink">{c.distance}</dd></div>
        <div><dt className="eyebrow !text-[9px]">Days</dt><dd className="num mt-1 text-[15px] text-ink">{c.days}</dd></div>
        <div><dt className="eyebrow !text-[9px]">Locks</dt><dd className="num mt-1 text-[15px] text-ink">{c.locks || "—"}</dd></div>
      </dl>
      <p className="mt-5 hidden text-xs leading-relaxed text-ink-3 md:block">
        <span className="eyebrow !text-[9px] mr-2">Ports</span>
        {c.stops.join(" · ")}
      </p>
    </motion.article>
  );
}

function Hud({ data, day, active }: { data: StoryData; day: MotionValue<number>; active: Chapter | null }) {
  const dayLabel = useTransform(day, (d) => (d < 0.05 ? "00" : String(Math.min(data.lastDay, Math.ceil(d))).padStart(2, "0")));
  const dateLabel = useTransform(day, (d) =>
    dateForDay(Math.max(1, Math.ceil(d))).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
  );
  const nm = useTransform(day, (d) => Math.round(lerpArr(data.cumNm, d)).toLocaleString());
  const locks = useTransform(day, (d) => String(Math.round(lerpArr(data.cumLocks, Math.floor(d + 0.001)))));
  const port = useTransform(day, (d) => data.overnight[Math.min(data.lastDay, Math.ceil(d - 0.02))] ?? "");
  const items = useMemo(() => [
    { l: "Day", v: dayLabel },
    { l: "Date", v: dateLabel },
    { l: "NM sailed", v: nm },
    { l: "Locks", v: locks },
  ], [dayLabel, dateLabel, nm, locks]);
  return (
    <div className="glass rounded-2xl px-4 py-3 md:px-5 md:py-4">
      <div className="flex gap-4 md:gap-6">
        {items.map((it) => (
          <div key={it.l} className="min-w-0">
            <p className="eyebrow !text-[9px]">{it.l}</p>
            <motion.p className="num mt-1 text-base text-ink md:text-xl">{it.v}</motion.p>
          </div>
        ))}
      </div>
      <div className="mt-3 hidden items-center gap-2 border-t border-line pt-3 text-xs text-ink-2 md:flex">
        <span className="size-1.5 rounded-full" style={{ background: active?.color ?? "var(--glow)" }} />
        <span className="eyebrow !text-[9px]">Overnight</span>
        <motion.span className="truncate">{port}</motion.span>
      </div>
    </div>
  );
}
