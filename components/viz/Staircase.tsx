"use client";
import { scaleLinear } from "d3-scale";
import { useId, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import type { ProfileLock, SurfacePoint, VizDay, WaterModel } from "@/lib/data/vizModel";
import { Callout, GRID, GRID_STRONG, HILITE, INK, KNOCK, KeyBadge, SIG, fmt, tint } from "./parts";
import { useDrawIn } from "./useDrawIn";
import { useViz } from "./VizContext";
import s from "./viz.module.css";

// ─── Geometry helpers ───────────────────────────────────────────────────────

type Lin = ReturnType<typeof scaleLinear<number, number>>;

function linePath(pts: SurfacePoint[], sx: Lin, sy: Lin) {
  return pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(2)},${sy(p.ft).toFixed(2)}`).join("");
}
function areaPath(pts: SurfacePoint[], sx: Lin, sy: Lin, baseFt: number) {
  const first = pts[0], last = pts[pts.length - 1];
  return `${linePath(pts, sx, sy)}L${sx(last.x).toFixed(2)},${sy(baseFt).toFixed(2)}L${sx(first.x).toFixed(2)},${sy(baseFt).toFixed(2)}Z`;
}
/** Short overnight name: "Medina or Brockport, NY" → "Medina", "Buffalo/Tonawanda, NY" → "Tonawanda". */
function placeName(to: string, end: "to" | "from" = "to") {
  const parts = to.split(" or ")[0].split("/");
  const p = end === "to" ? parts[parts.length - 1] : parts[0];
  return p.replace(/,\s*[A-Z]{2}\b.*$/, "").replace(/\(.*\)/, "").trim();
}
const stripE = (id: string) => id.replace(/^E-/, "");
const CANAL = "var(--leg-erie-canal)";

/** Group locks that would collide at this scale into one label. */
function lockClusters(locks: ProfileLock[], sx: Lin, minGap: number) {
  const groups: ProfileLock[][] = [];
  for (const l of locks) {
    const g = groups[groups.length - 1];
    if (g && sx(l.x) - sx(g[0].x) < minGap) g.push(l);
    else groups.push([l]);
  }
  return groups.map((g) => {
    const label =
      g.length === 1 ? g[0].id
        : g[0].id.startsWith("E-") && g.length > 3 ? `${g[0].id}…${stripE(g[g.length - 1].id)}`
        : g[0].id.startsWith("E-") ? `E-${g.map(l => stripE(l.id)).join("·")}`
        : g.map(l => l.id).join("·");
    return { locks: g, label, x: (sx(g[0].x) + sx(g[g.length - 1].x)) / 2, topFt: Math.max(...g.map(l => l.fromFt)) };
  });
}

/** 0.24 → "a quarter", 0.5 → "half", 0.15 → "a seventh"… */
function fractionWord(f: number) {
  const n = Math.round(1 / f);
  const words: Record<number, string> = { 1: "about the same as", 2: "half", 3: "a third", 4: "a quarter", 5: "a fifth", 6: "a sixth", 7: "a seventh", 8: "an eighth" };
  return words[n] ?? `1/${n}`;
}

function legColor(model: WaterModel, legId: string) {
  return model.legs.find(l => l.legId === legId)?.color ?? INK.ink2;
}

function legGradientStops(model: WaterModel) {
  const t = model.totalNm;
  return model.legs.flatMap((l) => [
    { o: l.x0 / t, c: l.color }, { o: l.x1 / t, c: l.color },
  ]);
}

// ─── Tooltip ────────────────────────────────────────────────────────────────

function LockTip({ lock, day, left, top, vbW }: { lock: ProfileLock; day?: VizDay; left: number; top: number; vbW: number }) {
  const fx = left / vbW;
  const tf = fx > 0.72 ? "translate(-100%, -100%) translate(-12px, -10px)" : fx < 0.18 ? "translate(0, -100%) translate(12px, -10px)" : "translate(-50%, -100%) translate(0, -14px)";
  return (
    <div className={s.tip} style={{ left: `${fx * 100}%`, top, transform: tf, ["--tf" as string]: tf }} role="status">
      <p className="eyebrow flex items-center justify-between gap-3 !tracking-[0.16em]">
        <span>{lock.operator}</span>
        {day && <span className="num">Day {day.day}</span>}
      </p>
      <p className="mt-1.5 font-display text-xl leading-tight text-ink">
        {lock.name}
        <span className="text-ink-3"> · {lock.place}</span>
      </p>
      <div className="mt-2.5 flex items-baseline gap-4">
        <p className="num text-2xl" style={{ color: lock.dir === "up" ? SIG.glow : SIG.brass }}>
          {lock.dir === "up" ? "↑" : "↓"} {fmt(lock.liftFt, 1)}<span className="ml-1 text-xs text-ink-3">ft</span>
        </p>
        <p className="num text-[11px] text-ink-3">
          {fmt(lock.fromFt)} → {fmt(lock.toFt)} ft
        </p>
      </div>
      {day && <p className="num mt-1 text-[11px] text-ink-3">{day.dateLabel}{lock.canalMi != null && <> · canal mi {fmt(lock.canalMi, 1)}</>}</p>}
      {lock.note && <p className="mt-2 text-[12.5px] leading-snug text-ink-2">{lock.note}</p>}
    </div>
  );
}

// ─── Fig 1a: the whole voyage ───────────────────────────────────────────────

export function StaircaseOverview({ model, compact = false }: { model: WaterModel; compact?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const [ref, phase] = useDrawIn<HTMLDivElement>();
  const { activeDay, setActiveDay } = useViz();
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = compact ? 380 : 1200;
  const H = compact ? 262 : 340;
  const m = compact ? { l: 36, r: 10, t: 34, b: 44 } : { l: 58, r: 22, t: 44, b: 58 };
  const sx = scaleLinear().domain([0, model.totalNm]).range([m.l, W - m.r]);
  const yMin = compact ? -380 : -400;
  const sy = scaleLinear().domain([yMin, 640]).range([H - m.b, m.t]);
  const y0 = sy(0);
  const ticks = compact ? [600, 300, 0, -300] : [600, 400, 200, 0, -200, -400];
  const stops = legGradientStops(model);
  const loupeX0 = model.locks[0].x - 8;
  const loupeX1 = model.mast.x1;
  const surf0 = model.surface[0].ft;
  const byDay = new Map(model.days.map(d => [d.day, d]));
  const deepest = model.deepest;
  const deepestDay = byDay.get(deepest.day)!;
  const ld = (id: string) => model.legDepth.find(l => l.legId === id);
  const mich = ld("lake-michigan"), huron = ld("lake-huron"), erie = ld("lake-erie"), sound = ld("sound-saybrook");
  const michBasin = model.basins.find(b => b.legId === "lake-michigan")!;
  const r1 = (n: number) => n.toFixed(1);

  // Water column (surface → floor) and the ground beneath, per contiguous run.
  const runPaths = model.seabed.filter(r => r.pts.length > 1).map((r) => {
    const top = r.pts.map(p => `${r1(sx(p.x))},${r1(sy(surfaceFtAt(model.surface, p.x)))}`);
    const bed = r.pts.map(p => `${r1(sx(p.x))},${r1(sy(p.ft))}`);
    const first = r.pts[0], last = r.pts[r.pts.length - 1];
    return {
      key: `${r.day}-${first.x}`,
      color: legColor(model, r.legId),
      water: `M${top.join("L")}L${[...bed].reverse().join("L")}Z`,
      floor: `M${bed.join("L")}`,
      ground: `M${bed.join("L")}L${r1(sx(last.x))},${r1(sy(yMin))}L${r1(sx(first.x))},${r1(sy(yMin))}Z`,
    };
  });
  const floorAt = (x: number) => {
    for (const r of model.seabed) {
      const a = r.pts[0].x, b = r.pts[r.pts.length - 1].x;
      if (x < a || x > b) continue;
      for (let i = 1; i < r.pts.length; i++) {
        const p = r.pts[i - 1], q = r.pts[i];
        if (x >= p.x && x <= q.x) return q.x === p.x ? q.ft : p.ft + (q.ft - p.ft) * ((x - p.x) / (q.x - p.x));
      }
    }
    return null;
  };

  const onMove = (e: RPointerEvent<SVGRectElement>) => {
    const r = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const x = Math.min(Math.max(sx.invert(px), 0), model.totalNm);
    setHoverX(x);
    const d = model.days.find(dd => dd.nm > 0 && x >= dd.x0 && x <= dd.x1);
    if (d) setActiveDay(d.day);
  };
  const hoverDay = hoverX != null ? model.days.find(d => d.nm > 0 && hoverX >= d.x0 && hoverX <= d.x1) : undefined;
  const hoverFt = hoverX != null ? surfaceFtAt(model.surface, hoverX) : 0;
  const hoverFloor = hoverX != null ? floorAt(hoverX) : null;
  const active = activeDay != null ? model.days.find(d => d.day === activeDay) : undefined;

  return (
    <div ref={ref} className={`${s.fig} relative`} data-phase={phase}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>Water-surface elevation along the whole voyage, Chicago to Old Saybrook</title>
        <desc id={`${uid}-d`}>
          {`The voyage begins on Lakes Michigan and Huron at ${surf0} ft above sea level, falls a few feet through the St. Clair and Detroit rivers to Lake Erie, then descends through ${model.lift.count} locks of the Erie Canal and the Troy lock to sea level on the Hudson. Beneath the surface line, the lake and sea floor under the track: the deepest water is ${fmt(deepest.depthFt)} ft on Day ${deepest.day} in Lake Michigan, where the floor lies ${fmt(-deepest.ft)} ft below sea level${erie && mich ? `; Lake Erie averages ${fmt(erie.meanFt)} ft under the keel against Lake Michigan's ${fmt(mich.meanFt)} ft` : ""}.`}
        </desc>
        <defs>
          <linearGradient id={`${uid}-leg`} gradientUnits="userSpaceOnUse" x1={sx(0)} x2={sx(model.totalNm)} y1={0} y2={0}>
            {stops.map((st, i) => <stop key={i} offset={st.o} stopColor={st.c} />)}
          </linearGradient>
          <linearGradient id={`${uid}-fade`} x1={0} x2={0} y1={0} y2={1}>
            <stop offset={0} stopColor="#fff" stopOpacity={0.55} />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect x={0} y={sy(600)} width={W} height={y0 - sy(600)} fill={`url(#${uid}-fade)`} />
          </mask>
          <linearGradient id={`${uid}-col`} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={sy(600)} y2={sy(yMin)}>
            <stop offset={0} stopColor="#fff" stopOpacity={0.9} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.35} />
          </linearGradient>
          <mask id={`${uid}-colm`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect x={0} y={0} width={W} height={H} fill={`url(#${uid}-col)`} />
          </mask>
          <pattern id={`${uid}-rock`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className={s.hatch} x1={0} y1={0} x2={0} y2={4} stroke={tint(1)} strokeOpacity={0.07} strokeWidth={1} />
          </pattern>
          <linearGradient id={`${uid}-rockfade`} x1={0} x2={0} y1={0} y2={1}>
            <stop offset={0} stopColor="#fff" stopOpacity={1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.15} />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <rect className={s.wipe} x={m.l - 4} y={0} width={W - m.l - m.r + 8} height={H} />
          </clipPath>
        </defs>

        {/* grid */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} stroke={t === 0 ? GRID_STRONG : GRID} strokeDasharray={t === 0 ? "none" : "2 4"} />
            <text x={m.l - 8} y={sy(t) + 3.5} textAnchor="end" fontSize={compact ? 9 : 10} className="num" fill={INK.ink3}>
              {t === 0 ? "0" : `${t > 0 ? "" : "−"}${Math.abs(t)}`}{!compact && t === 600 ? " ft" : ""}
            </text>
          </g>
        ))}
        <text x={m.l + 4} y={y0 - 6} fontSize={compact ? 8.5 : 9.5} letterSpacing="0.16em" className="font-mono" fill={INK.ink3}>SEA LEVEL</text>

        {/* enlarged-region marker */}
        <g aria-hidden>
          <rect x={sx(loupeX0)} y={m.t - (compact ? 16 : 22)} width={sx(loupeX1) - sx(loupeX0)} height={y0 - m.t + (compact ? 22 : 30)}
            fill={tint(0.025)} stroke={tint(0.16)} strokeDasharray="2 3" rx={4} />
          <text x={sx(loupeX0) + 6} y={m.t - (compact ? 6 : 9)} fontSize={compact ? 8 : 9.5} letterSpacing="0.14em" className="font-mono" fill={INK.ink2}>
            {compact ? "1B ↓" : "ENLARGED IN 1B ↓"}
          </text>
        </g>

        {/* active day band (cross-highlight) */}
        {active && active.nm > 0 && (
          <rect x={sx(active.x0)} y={m.t - 6} width={Math.max(1.5, sx(active.x1) - sx(active.x0))} height={H - m.b - m.t + 6} fill={HILITE} />
        )}

        <g clipPath={`url(#${uid}-clip)`}>
          {/* height above the sea (where there is no floor data: canal, rivers) */}
          <path className={s.relief} d={areaPath(model.surface, sx, sy, 0)} fill={`url(#${uid}-leg)`} fillOpacity={0.16} mask={`url(#${uid}-m)`} />
          {/* ground under the track */}
          <g mask={`url(#${uid}-colm)`}>
            {runPaths.map(r => <path key={`g${r.key}`} d={r.ground} fill={`url(#${uid}-rock)`} />)}
          </g>
          {/* the water column, surface to floor */}
          <g mask={`url(#${uid}-colm)`}>
            {runPaths.map(r => <path key={`w${r.key}`} className={s.water} style={{ ["--c" as string]: r.color }} d={r.water} fill={r.color} fillOpacity={0.26} />)}
          </g>
          {/* the floor */}
          {runPaths.map(r => (
            <path key={`f${r.key}`} d={r.floor} fill="none" stroke={r.color} strokeOpacity={0.85} strokeWidth={compact ? 0.9 : 1.1} strokeLinejoin="round" />
          ))}
          {/* the water surface */}
          <path d={linePath(model.surface, sx, sy)} fill="none" stroke={`url(#${uid}-leg)`} strokeWidth={2} strokeLinejoin="round" />
        </g>
        <line x1={m.l} x2={W - m.r} y1={y0} y2={y0} stroke="var(--vz-sea)" strokeDasharray="1 3" aria-hidden />
        {/* published deepest point of Lake Michigan (reference) */}
        {!compact && (
          <g aria-hidden className={s.fade} style={{ ["--d" as string]: "1.6s" }}>
            <line x1={sx(michBasin.x0) + 4} x2={sx(michBasin.x1) - 4} y1={sy(michBasin.floorFt)} y2={sy(michBasin.floorFt)} stroke={INK.ink3} strokeDasharray="1 3" />
            <text x={sx(michBasin.x1) - 6} y={sy(michBasin.floorFt) + 12} textAnchor="end" fontSize={9} letterSpacing="0.1em" className="font-mono" fill={INK.ink3}>
              LAKE&rsquo;S DEEPEST POINT · {fmt(michBasin.maxDepthFt)} FT (EPA)
            </text>
          </g>
        )}

        {/* leg band */}
        <g aria-hidden>
          {model.legs.map((l) => (
            <g key={l.legId}>
              <rect x={sx(l.x0) + 1} y={H - m.b + 12} width={Math.max(1, sx(l.x1) - sx(l.x0) - 2)} height={3} rx={1.5} fill={l.color} />
              <text x={(sx(l.x0) + sx(l.x1)) / 2} y={H - m.b + (compact ? 30 : 32)} textAnchor="middle" fontSize={compact ? 9 : 10} className="font-mono" fill={INK.ink3}>
                <tspan fill={l.color}>{l.numeral}</tspan>
                {!compact && sx(l.x1) - sx(l.x0) > 70 && <tspan dx={5}>{l.short}</tspan>}
              </text>
            </g>
          ))}
          {model.days.filter(d => d.nm > 0).map((d) => (
            <line key={d.day} x1={sx(d.x1)} x2={sx(d.x1)} y1={H - m.b + 9} y2={H - m.b + 12} stroke={INK.ink3} strokeOpacity={0.6} />
          ))}
        </g>

        {/* annotations */}
        {!compact ? (
          <g className={s.fade} style={{ ["--d" as string]: "1.2s" }}>
            <text x={sx(4)} y={sy(surf0) - 12} fontSize={9.5} letterSpacing="0.14em" className="font-mono" fill={INK.ink3}>CHICAGO · DAY 1</text>
            <text x={sx(4) + 128} y={sy(surf0) - 12} fontSize={12} fill={INK.ink}>
              <tspan className="num" fill={SIG.brass}>{fmt(surf0, 1)} ft</tspan>
              <tspan fill={INK.ink2} dx={6}>Michigan and Huron: one surface, two names</tspan>
            </text>
            <Callout x={sx(deepest.x)} y={sy(deepest.ft)} tx={sx(deepest.x) + 22} ty={sy(-120)}
              kicker={`Day ${deepest.day} · ${placeName(deepestDay.from, "from")} → ${placeName(deepestDay.to)}`}
              lines={[
                `${fmt(deepest.depthFt)} ft under the keel, the voyage's deepest:`,
                `the floor lies ${fmt(-deepest.ft)} ft below the sea we finish on`,
                ...(model.belowSeaNm >= 1 ? [`(${fmt(model.belowSeaNm)} nm of track over lakebed below sea level)`] : []),
              ]} tone="glow" />
            {huron && (
              <Callout x={sx(huron.max.x)} y={sy(huron.max.ft)} tx={sx(huron.max.x) + 16} ty={sy(huron.max.ft) + 34}
                kicker={`${huron.label} · Day ${huron.max.day}`} lines={[`${fmt(huron.max.depthFt)} ft deep under the track`]} />
            )}
            {erie && mich && (
              <Callout x={sx(erie.max.x)} y={sy(erie.max.ft)} tx={sx(erie.max.x) - 14} ty={sy(150)} side="left"
                kicker={`${erie.label} · avg ${fmt(erie.meanFt)} ft`} lines={[`the shallow one: ${fractionWord(erie.meanFt / mich.meanFt)}`, `of Michigan's ${fmt(mich.meanFt)} ft average`]} />
            )}
            <text x={(sx(model.legs[3].x0) + sx(model.legs[3].x1)) / 2} y={sy(surf0) - 16} textAnchor="middle" fontSize={11} fill={INK.ink2}>
              <tspan className="num" fill={INK.ink}>−{fmt(surf0 - model.surface.find(p => p.legId === "lake-erie")!.ft, 1)} ft</tspan> on current alone
            </text>
            {sound && (
              <Callout x={sx(sound.max.x)} y={sy(sound.max.ft)} tx={sx(sound.max.x) - 16} ty={sy(sound.max.ft) + 26} side="left"
                kicker={`Day ${sound.max.day} · ${sound.label}`} lines={[`${fmt(sound.max.depthFt)} ft under the keel`]} tone="ink" />
            )}
            <text x={W - m.r} y={y0 - 8} textAnchor="end" fontSize={9.5} letterSpacing="0.14em" className="font-mono" fill={INK.ink3}>OLD SAYBROOK · DAY {model.days.length}</text>
          </g>
        ) : (
          <g className={s.fade} style={{ ["--d" as string]: "1.2s" }}>
            <text x={sx(4)} y={sy(surf0) - 8} fontSize={10} className="num" fill={SIG.brass}>{fmt(surf0, 1)} ft</text>
            <circle cx={sx(deepest.x)} cy={sy(deepest.ft)} r={2.5} fill={KNOCK} stroke={SIG.glow} strokeWidth={1.25} />
            <text x={sx(deepest.x) + 7} y={sy(deepest.ft) + 4} fontSize={9.5} fill={INK.ink2}>
              <tspan className="num" fill={SIG.glow}>{fmt(deepest.depthFt)} ft</tspan> deep · Day {deepest.day}
            </text>
          </g>
        )}

        {/* crosshair */}
        {hoverX != null && (
          <g pointerEvents="none">
            <line x1={sx(hoverX)} x2={sx(hoverX)} y1={m.t - 6} y2={H - m.b} stroke={SIG.glow} strokeOpacity={0.5} strokeWidth={1} />
            {hoverFloor != null && <line x1={sx(hoverX)} x2={sx(hoverX)} y1={sy(hoverFt)} y2={sy(hoverFloor)} stroke={SIG.glow} strokeWidth={2.5} strokeLinecap="round" />}
            {hoverFloor != null && <circle cx={sx(hoverX)} cy={sy(hoverFloor)} r={2.5} fill={SIG.glow} />}
            <circle cx={sx(hoverX)} cy={sy(hoverFt)} r={3.5} fill={KNOCK} stroke={SIG.glow} strokeWidth={1.5} />
          </g>
        )}
        <rect x={m.l} y={m.t - 10} width={W - m.l - m.r} height={H - m.b - m.t + 10} fill="transparent"
          onPointerMove={onMove} onPointerLeave={() => { setHoverX(null); setActiveDay(null); }} />
      </svg>
      {hoverX != null && hoverDay && (
        <div className={s.tip} style={{
          left: `${(sx(hoverX) / W) * 100}%`, top: 0,
          transform: sx(hoverX) / W > 0.7 ? "translate(-100%, 0) translate(-12px, 0)" : "translate(12px, 0)",
          ["--tf" as string]: sx(hoverX) / W > 0.7 ? "translate(-100%, 0) translate(-12px, 0)" : "translate(12px, 0)",
          width: "auto", whiteSpace: "nowrap",
        }}>
          <p className="eyebrow !tracking-[0.16em]"><span className="num">Day {hoverDay.day}</span> · {hoverDay.dateShort}</p>
          <p className="mt-1 text-[13px] text-ink">{placeName(hoverDay.from, "from")} → {placeName(hoverDay.to)}</p>
          <p className="num mt-1 text-lg" style={{ color: hoverDay.color }}>{fmt(hoverFt, 1)} <span className="text-xs text-ink-3">ft above sea level</span></p>
          {hoverFloor != null && (
            <p className="num text-[13px] text-ink">{fmt(hoverFt - hoverFloor)} <span className="text-xs text-ink-3">ft of water under the keel</span></p>
          )}
        </div>
      )}
    </div>
  );
}

function surfaceFtAt(surface: SurfacePoint[], x: number) {
  for (let i = surface.length - 1; i > 0; i--) {
    const a = surface[i - 1], b = surface[i];
    if (x >= a.x && x <= b.x) return b.x === a.x ? b.ft : a.ft + (b.ft - a.ft) * ((x - a.x) / (b.x - a.x));
  }
  return surface[surface.length - 1].ft;
}

// ─── Fig 1b: the canal, magnified ───────────────────────────────────────────

interface Annot {
  n: number;
  lockId?: string;
  x: number;
  ft: number;
  kicker: string;
  lines: string[];
  tone: "ink" | "brass" | "glow";
}

export function canalAnnotations(model: WaterModel): Annot[] {
  const L = (id: string) => model.locks.find(l => l.id === id)!;
  const e34 = L("E-34"), e33 = L("E-33"), e24 = L("E-24"), e23 = L("E-23"), e21 = L("E-21"), e17 = L("E-17");
  const lockport = model.locks.filter(l => l.flight === "Lockport");
  const flight = model.locks.filter(l => l.flight === "Waterford");
  const flightFt = flight.reduce((a, l) => a + l.liftFt, 0);
  const flightMi = flight[flight.length - 1].canalMi! - flight[0].canalMi!;
  const ups = model.locks.filter(l => l.dir === "up");
  const troy = L("Troy");
  return [
    { n: 1, lockId: "E-34", x: e34.x, ft: (lockport[0].fromFt + e34.toFt) / 2, kicker: `Lockport · ${lockport.map(l => l.id).join(" + ")}`, lines: [`${fmt(lockport.reduce((a, l) => a + l.liftFt, 0))} ft down in two chambers`], tone: "brass" },
    { n: 2, x: (e34.x + e33.x) / 2, ft: e34.toFt, kicker: "The long level", lines: [`${fmt(e33.canalMi! - e34.canalMi!)} miles without a single lock`], tone: "ink" },
    { n: 3, x: (e24.x + e23.x) / 2, ft: e24.toFt, kicker: `Seneca River · ${fmt(e24.toFt)} ft`, lines: ["the canal's low point between the lakes"], tone: "ink" },
    { n: 4, lockId: "E-21", x: e21.x, ft: e21.toFt, kicker: `Rome summit · ${fmt(e21.toFt)} ft`, lines: [`${ups.length} locks lift you UP ${fmt(ups.reduce((a, l) => a + l.liftFt, 0))} ft`, "before the long fall to the sea"], tone: "glow" },
    { n: 5, lockId: "E-17", x: e17.x, ft: (e17.fromFt + e17.toFt) / 2, kicker: `E-17 · ${e17.place}`, lines: [`${fmt(e17.liftFt, 1)} ft — the canal's tallest lift`], tone: "brass" },
    { n: 6, lockId: "E-4", x: flight[2].x, ft: flight[2].fromFt, kicker: "Waterford Flight", lines: [`${fmt(flightFt)} ft in ${fmt(flightMi, 1)} miles`], tone: "brass" },
    { n: 7, lockId: "Troy", x: troy.x, ft: troy.fromFt / 2, kicker: "Troy Federal Lock", lines: [`−${fmt(troy.liftFt)} ft to tidewater`], tone: "glow" },
  ];
}

interface LoupeProps {
  model: WaterModel;
  domain: [number, number];
  compact?: boolean;
  /** Draw the Waterford Flight magnifier (desktop). */
  inset?: boolean;
  /** Mobile rows: show keyed badges instead of full callouts. */
  keyed?: boolean;
  title: string;
  rowIndex?: number;
}

export function StaircaseLoupe({ model, domain, compact = false, inset = false, keyed = false, title, rowIndex = 0 }: LoupeProps) {
  const uid = useId().replace(/:/g, "");
  const [ref, phase] = useDrawIn<HTMLDivElement>();
  const { activeDay, setActiveDay } = useViz();
  const [hover, setHover] = useState<ProfileLock | null>(null);

  const W = compact ? 380 : 1200;
  const H = compact ? 236 : 500;
  const m = compact ? { l: 36, r: 10, t: 44, b: 46 } : { l: 58, r: 22, t: 96, b: 70 };
  const sx = scaleLinear().domain(domain).range([m.l, W - m.r]);
  const sy = scaleLinear().domain([-10, 610]).range([H - m.b, m.t]);
  const stops = legGradientStops(model);
  const inDomain = (x: number) => x >= domain[0] - 1e-6 && x <= domain[1] + 1e-6;
  const locks = model.locks.filter(l => inDomain(l.x));
  const days = model.days.filter(d => d.x1 > domain[0] && d.x0 < domain[1]);
  const clusters = lockClusters(locks, sx, compact ? 9 : 11);
  const annots = canalAnnotations(model).filter(a => inDomain(a.x));
  const pxPerNm = (W - m.l - m.r) / (domain[1] - domain[0]);
  const byDay = useMemo(() => new Map(model.days.map(d => [d.day, d])), [model.days]);
  const lockIdx = new Map(model.locks.map((l, i) => [l.id, i]));

  // Hit-area for each lock: halfway to its neighbours, min 8px.
  const hits = locks.map((l, i) => {
    const prev = locks[i - 1], next = locks[i + 1];
    const a = prev ? (sx(prev.x) + sx(l.x)) / 2 : sx(l.x) - 14;
    const b = next ? (sx(next.x) + sx(l.x)) / 2 : sx(l.x) + 14;
    const w = Math.max(b - a, 8);
    return { l, x: Math.min(a, sx(l.x) - w / 2), w };
  });

  const mastDays = model.mast.upDay - model.mast.downDay + 1;
  const flight = model.locks.filter(l => l.flight === "Waterford");
  const showMast = model.mast.x1 > domain[0] && model.mast.x0 < domain[1];

  // Waterford magnifier geometry (desktop only)
  const ins = { x: W - m.r - 262, y: m.t - 2, w: 262, h: 160 };
  const ix = scaleLinear().domain([flight[0].canalMi! - 0.18, flight[flight.length - 1].canalMi! + 0.42]).range([ins.x + 16, ins.x + ins.w - 14]);
  const iy = scaleLinear().domain([0, flight[0].fromFt + 6]).range([ins.y + ins.h - 18, ins.y + 60]);
  const flightPts: [number, number][] = [];
  flightPts.push([flight[0].canalMi! - 0.18, flight[0].fromFt]);
  for (const l of flight) { flightPts.push([l.canalMi!, l.fromFt]); flightPts.push([l.canalMi!, l.toFt]); }
  flightPts.push([flight[flight.length - 1].canalMi! + 0.42, flight[flight.length - 1].toFt]);

  const hoverDay = hover ? byDay.get(hover.day) : undefined;
  const tipPos = hover ? (() => {
    if (inset && hover.flight === "Waterford") return { left: ix(hover.canalMi!), top: iy(hover.fromFt) };
    return { left: sx(hover.x), top: sy(hover.fromFt) };
  })() : null;

  const lockAria = (l: ProfileLock) => {
    const d = byDay.get(l.day);
    return `${l.name}, ${l.place}: ${l.dir === "up" ? "lifts" : "lowers"} ${fmt(l.liftFt, 1)} feet, Day ${l.day}${d ? `, ${d.dateLabel}` : ""}. Lock ${lockIdx.get(l.id)! + 1} of ${model.locks.length}.`;
  };

  return (
    <div ref={ref} className={`${s.fig} relative`} data-phase={phase} onPointerLeave={() => { setHover(null); setActiveDay(null); }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="group" aria-label={title}>
        <defs>
          <linearGradient id={`${uid}-leg`} gradientUnits="userSpaceOnUse" x1={sx(0)} x2={sx(model.totalNm)} y1={0} y2={0}>
            {stops.map((st, i) => <stop key={i} offset={st.o} stopColor={st.c} />)}
          </linearGradient>
          <linearGradient id={`${uid}-fade`} x1={0} x2={0} y1={0} y2={1}>
            <stop className={s.poolTop} offset={0} stopColor="#fff" stopOpacity={0.5} />
            <stop className={s.poolBot} offset={1} stopColor="#fff" stopOpacity={0.03} />
          </linearGradient>
          <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect x={0} y={sy(600)} width={W} height={sy(-10) - sy(600)} fill={`url(#${uid}-fade)`} />
          </mask>
          <clipPath id={`${uid}-clip`}>
            <rect className={s.wipe} style={{ ["--d" as string]: `${rowIndex * 0.25}s` }} x={m.l} y={0} width={W - m.l - m.r} height={H} />
          </clipPath>
        </defs>

        {/* grid */}
        {[0, 100, 200, 300, 400, 500, 600].filter(t => !compact || t % 200 === 0).map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} stroke={t === 0 ? GRID_STRONG : GRID} strokeDasharray={t === 0 ? "none" : "2 4"} />
            <text x={m.l - 8} y={sy(t) + 3.5} textAnchor="end" fontSize={compact ? 9 : 10} className="num" fill={INK.ink3}>{t}{t === 600 && !compact ? " ft" : ""}</text>
          </g>
        ))}

        {/* day columns */}
        {days.map((d) => {
          const a = Math.max(sx(d.x0), m.l), b = Math.min(sx(d.x1), W - m.r);
          const w = b - a;
          const on = activeDay === d.day;
          return (
            <g key={d.day}>
              {d.nm > 0 && (
                <rect x={a} y={m.t - 12} width={w} height={H - m.b - m.t + 12} fill={on ? HILITE : d.day % 2 ? tint(0.014) : "transparent"}
                  onPointerEnter={() => setActiveDay(d.day)} />
              )}
              {d.x1 < domain[1] - 0.01 && <line x1={sx(d.x1)} x2={sx(d.x1)} y1={m.t - 12} y2={H - m.b + 6} stroke={GRID} />}
              {d.nm > 0 && w > (compact ? 16 : 26) && (
                <text x={a + w / 2} y={m.t - (compact ? 18 : 26)} textAnchor="middle" fontSize={compact ? 8.5 : 9.5} letterSpacing="0.08em" className="font-mono" fill={on ? SIG.glow : INK.ink3}>
                  {w > (compact ? 70 : 64) ? `DAY ${d.day}` : d.day}
                  {!compact && w > 64 && <tspan fill={INK.ink4}>{` · ${d.dateShort.toUpperCase()}`}</tspan>}
                </text>
              )}
            </g>
          );
        })}

        {/* mast-down span */}
        {showMast && (
          <g aria-hidden className={s.fade} style={{ ["--d" as string]: "0.6s" }}>
            {(() => {
              const a = Math.max(sx(model.mast.x0), m.l), b = Math.min(sx(model.mast.x1), W - m.r);
              const y = m.t - (compact ? 32 : 58);
              return (
                <>
                  <line x1={a} x2={b} y1={y} y2={y} stroke={SIG.brass} strokeOpacity={0.7} strokeWidth={1} />
                  {sx(model.mast.x0) >= m.l && <line x1={a} x2={a} y1={y - 4} y2={y + 4} stroke={SIG.brass} />}
                  {sx(model.mast.x1) <= W - m.r && <line x1={b} x2={b} y1={y - 4} y2={y + 4} stroke={SIG.brass} />}
                  <text x={sx(model.mast.x0) >= m.l || sx(model.mast.x1) <= W - m.r ? a + 6 : (a + b) / 2} y={y - 6} textAnchor={sx(model.mast.x0) >= m.l || sx(model.mast.x1) <= W - m.r ? "start" : "middle"}
                    fontSize={compact ? 8.5 : 9.5} letterSpacing="0.14em" className="font-mono" fill={SIG.brass}>
                    {sx(model.mast.x0) >= m.l ? `MAST DOWN · ${mastDays} DAYS · DAY ${model.mast.downDay} → ${model.mast.upDay}` : "MAST DOWN"}
                  </text>
                  {sx(model.mast.x1) <= W - m.r && (
                    <text x={b - 6} y={y - 6} textAnchor="end" fontSize={compact ? 8.5 : 9.5} letterSpacing="0.14em" className="font-mono" fill={SIG.brass}>
                      MAST UP · {placeName(byDay.get(model.mast.upDay)!.to).toUpperCase()}
                    </text>
                  )}
                </>
              );
            })()}
          </g>
        )}

        {/* the staircase */}
        <g clipPath={`url(#${uid}-clip)`}>
          <path className={s.pool} d={areaPath(model.surface, sx, sy, -10)} fill={`url(#${uid}-leg)`} fillOpacity={0.34} mask={`url(#${uid}-m)`} />
          <path d={linePath(model.surface, sx, sy)} fill="none" stroke={`url(#${uid}-leg)`} strokeWidth={compact ? 1.6 : 2} strokeLinejoin="miter" />
          {/* lock lips */}
          {locks.map((l) => (
            <circle key={l.id} cx={sx(l.x)} cy={sy(l.fromFt)} r={compact ? 1.6 : 2} fill={l.dir === "up" ? SIG.glow : INK.ink} />
          ))}
        </g>

        {/* lock labels */}
        <g className={s.fade} style={{ ["--d" as string]: "1.4s" }} aria-hidden>
          {clusters.map((c) => {
            const y = sy(c.topFt) - 7;
            const flightCluster = inset && c.locks.some(l => l.flight === "Waterford");
            if (flightCluster || (!compact && c.label === "Troy")) return null;
            const est = c.label.length * (compact ? 5 : 5.6);
            if (y - est < m.t - (compact ? 6 : 34)) {
              // No headroom: set it flat, just under the lower pool.
              const lo = Math.min(...c.locks.map(l => l.toFt));
              return (
                <text key={c.label} x={c.x + 5} y={sy(lo) + 13} fontSize={compact ? 8 : 9} className="num" fill={INK.ink3}>{c.label}</text>
              );
            }
            return (
              <text key={c.label} transform={`translate(${c.x + 3},${y}) rotate(-90)`} fontSize={compact ? 8 : 9} className="num"
                fill={c.locks.some(l => l.dir === "up") ? SIG.glow : INK.ink3} fillOpacity={0.9}>
                {c.label}
              </text>
            );
          })}
        </g>

        {/* overnight stops along the axis */}
        {days.filter(d => d.nm > 0 && d.x1 <= domain[1] + 0.01 && d.x1 >= domain[0]).map((d, i, arr) => {
          const x = sx(d.x1);
          const prev = arr[i - 1];
          const row = compact ? i % 2 : prev && x - sx(prev.x1) < 84 ? 1 : 0;
          return (
            <g key={d.day} aria-hidden>
              <circle cx={x} cy={H - m.b + 6} r={2} fill={d.color} />
              <text x={x} y={H - m.b + 20 + row * 12} textAnchor={x > W - m.r - 30 ? "end" : "middle"} fontSize={compact ? 9 : 10.5} fill={INK.ink2}>
                {placeName(d.to)}
              </text>
            </g>
          );
        })}

        {/* scale bar */}
        {(() => {
          const mi = compact ? 10 : 25;
          const len = mi * 0.868976 * pxPerNm;
          const x = compact ? m.l : W - m.r - len;
          const y = H - (compact ? 8 : 12);
          return (
            <g aria-hidden>
              <line x1={x} x2={x + len} y1={y} y2={y} stroke={INK.ink3} />
              <line x1={x} x2={x} y1={y - 3} y2={y} stroke={INK.ink3} />
              <line x1={x + len} x2={x + len} y1={y - 3} y2={y} stroke={INK.ink3} />
              <text x={compact ? x + len + 6 : x - 6} y={y + 3} textAnchor={compact ? "start" : "end"} fontSize={9} className="num" fill={INK.ink3}>{mi} mi</text>
            </g>
          );
        })()}

        {/* annotations */}
        {!keyed ? (
          <g className={s.fade} style={{ ["--d" as string]: "2s" }}>
            {annots.map((a) => {
              const x = sx(a.x), y = sy(a.ft);
              switch (a.n) {
                case 1: return <Callout key={a.n} x={x} y={y} tx={x + 10} ty={sy(410)} kicker={a.kicker} lines={a.lines} tone={a.tone} />;
                case 2: {
                  const e34 = model.locks.find(l => l.id === "E-34")!, e33 = model.locks.find(l => l.id === "E-33")!;
                  const xa = sx(e34.x) + 4, xb = sx(e33.x) - 4, yy = sy(e34.toFt) + 18;
                  return (
                    <g key={a.n} aria-hidden>
                      <line x1={xa} x2={xb} y1={yy} y2={yy} stroke={INK.ink2} strokeOpacity={0.5} strokeWidth={0.75} />
                      <line x1={xa} x2={xa} y1={yy - 4} y2={yy + 4} stroke={INK.ink2} strokeOpacity={0.6} />
                      <line x1={xb} x2={xb} y1={yy - 4} y2={yy + 4} stroke={INK.ink2} strokeOpacity={0.6} />
                      <text x={(xa + xb) / 2} y={yy + 16} textAnchor="middle" fontSize={12} fill={INK.ink}>{a.lines[0]}</text>
                    </g>
                  );
                }
                case 3: return <Callout key={a.n} x={x} y={y} tx={x + 10} ty={sy(290)} kicker={a.kicker} lines={a.lines} tone={a.tone} />;
                case 4: return <Callout key={a.n} x={x} y={y} tx={x + 10} ty={sy(515)} kicker={a.kicker} lines={a.lines} tone={a.tone} />;
                case 5: return <Callout key={a.n} x={x} y={y} tx={x - 10} ty={sy(225)} kicker={a.kicker} lines={a.lines} tone={a.tone} side="left" />;
                case 6: return inset ? (
                  <path key={a.n} d={`M${sx(flight[0].x)},${sy(flight[0].fromFt) - 6} L${sx(flight[0].x)},${ins.y + ins.h}`}
                    fill="none" stroke={SIG.brass} strokeOpacity={0.5} strokeWidth={0.75} />
                ) : null;
                case 7: return <Callout key={a.n} x={x} y={y} tx={x - 10} ty={sy(130)} kicker={a.kicker} lines={[a.lines[0], "tidal from here on"]} tone={a.tone} side="left" />;
                default: return null;
              }
            })}
            {(() => {
              // Oneida Lake label on its pool
              const d = model.days.find(dd => dd.legId === "erie-canal" && dd.locks === 0 && dd.nm > 0);
              if (!d || !inDomain((d.x0 + d.x1) / 2)) return null;
              return (
                <text x={sx((d.x0 + d.x1) / 2)} y={sy(370) + 18} textAnchor="middle" fontSize={compact ? 8.5 : 10} fill={INK.ink2}>
                  Oneida L.
                </text>
              );
            })()}
          </g>
        ) : (
          <g aria-hidden>
            {annots.map((a) => (
              <KeyBadge key={a.n} n={a.n} x={sx(a.x) + (a.n === 2 ? 0 : 10)} y={a.n === 2 ? sy(a.ft) + 14 : Math.min(sy(a.ft) - 4, H - m.b - 12)} tone={a.tone === "ink" ? "ink" : a.tone} />
            ))}
          </g>
        )}

        {/* Waterford magnifier */}
        {inset && (
          <g className={s.fade} style={{ ["--d" as string]: "2.4s" }}>
            <rect className={s.inset} x={ins.x} y={ins.y} width={ins.w} height={ins.h} rx={12} fill="rgb(7 16 29 / 0.9)" stroke={tint(0.14)} />
            <text x={ins.x + 16} y={ins.y + 20} fontSize={9.5} letterSpacing="0.14em" className="font-mono" fill={SIG.brass}>WATERFORD FLIGHT</text>
            <text x={ins.x + 16} y={ins.y + 40} fontSize={15} className="font-display" fill={INK.ink}>
              {fmt(flight.reduce((a, l) => a + l.liftFt, 0))} ft in {fmt(flight[flight.length - 1].canalMi! - flight[0].canalMi!, 1)} miles
            </text>
            <path d={flightPts.map((p, i) => `${i ? "L" : "M"}${ix(p[0])},${iy(p[1])}`).join("")} fill="none" stroke={CANAL} strokeWidth={1.75} />
            <path d={`${flightPts.map((p, i) => `${i ? "L" : "M"}${ix(p[0])},${iy(p[1])}`).join("")}L${ix(flightPts[flightPts.length - 1][0])},${iy(0)}L${ix(flightPts[0][0])},${iy(0)}Z`} className={s.insetPool} fill={CANAL} fillOpacity={0.1} />
            {flight.map((l) => (
              <g key={l.id}>
                <text x={ix(l.canalMi!) + 3} y={iy(l.fromFt) - 4} fontSize={9} className="num" fill={hover?.id === l.id ? SIG.glow : INK.ink2}>{stripE(l.id)}</text>
                <text x={ix(l.canalMi!) + 3} y={iy(l.toFt) + 11} fontSize={8.5} className="num" fill={INK.ink3}>{fmt(l.liftFt, 1)}</text>
              </g>
            ))}
            {(() => {
              const len = ix(flight[0].canalMi! + 0.5) - ix(flight[0].canalMi!);
              const x = ins.x + ins.w - 16 - len, y = ins.y + 22;
              return (
                <g aria-hidden>
                  <line x1={x} x2={x + len} y1={y} y2={y} stroke={INK.ink3} />
                  <line x1={x} x2={x} y1={y - 3} y2={y} stroke={INK.ink3} />
                  <line x1={x + len} x2={x + len} y1={y - 3} y2={y} stroke={INK.ink3} />
                  <text x={x - 5} y={y + 3} textAnchor="end" fontSize={9} className="num" fill={INK.ink3}>½ mi</text>
                </g>
              );
            })()}
          </g>
        )}

        {/* hover highlight */}
        {hover && inDomain(hover.x) && (
          <g pointerEvents="none">
            <line x1={sx(hover.x)} x2={sx(hover.x)} y1={m.t - 12} y2={H - m.b} stroke={SIG.glow} strokeOpacity={0.35} />
            <line x1={sx(hover.x)} x2={sx(hover.x)} y1={sy(hover.fromFt)} y2={sy(hover.toFt)} stroke={SIG.glow} strokeWidth={3} strokeLinecap="round" />
            <circle cx={sx(hover.x)} cy={sy(hover.fromFt)} r={4} fill={KNOCK} stroke={SIG.glow} strokeWidth={1.5} />
          </g>
        )}

        {/* hit targets (lock list) */}
        <g role="list" aria-label="Locks">
          {hits.map(({ l, x, w }) => (
            <g key={l.id} role="listitem" tabIndex={inset && l.flight === "Waterford" ? -1 : 0} aria-label={lockAria(l)} className={s.hit}
              onPointerEnter={() => { setHover(l); setActiveDay(l.day); }}
              onFocus={() => { setHover(l); setActiveDay(l.day); }}
              onBlur={() => setHover(null)}
              onClick={() => setHover(h => (h?.id === l.id ? null : l))}>
              <rect x={x} y={Math.min(sy(l.fromFt), sy(l.toFt)) - 30} width={w} height={Math.abs(sy(l.toFt) - sy(l.fromFt)) + 44} fill="transparent" />
              <rect className={s.focusRing} x={x} y={Math.min(sy(l.fromFt), sy(l.toFt)) - 30} width={w} height={Math.abs(sy(l.toFt) - sy(l.fromFt)) + 44} rx={4} />
            </g>
          ))}
          {inset && flight.map((l, i) => {
            const a = i ? (ix(flight[i - 1].canalMi!) + ix(l.canalMi!)) / 2 : ix(l.canalMi!) - 18;
            const b = i < flight.length - 1 ? (ix(flight[i + 1].canalMi!) + ix(l.canalMi!)) / 2 : ix(l.canalMi!) + 18;
            return (
              <g key={`in-${l.id}`} role="listitem" tabIndex={0} aria-label={lockAria(l)} className={s.hit}
                onPointerEnter={() => { setHover(l); setActiveDay(l.day); }}
                onFocus={() => { setHover(l); setActiveDay(l.day); }}
                onBlur={() => setHover(null)}
                onClick={() => setHover(h => (h?.id === l.id ? null : l))}>
                <rect x={a} y={ins.y + 46} width={b - a} height={ins.h - 52} fill="transparent" />
                <rect className={s.focusRing} x={a} y={ins.y + 46} width={b - a} height={ins.h - 52} rx={4} />
              </g>
            );
          })}
        </g>
      </svg>
      {hover && tipPos && (
        <LockTip lock={hover} day={hoverDay} left={tipPos.left} top={`${(tipPos.top / H) * 100}%` as unknown as number} vbW={W} />
      )}
    </div>
  );
}

/** Mobile key for the numbered badges. */
export function CanalKey({ model }: { model: WaterModel }) {
  const annots = canalAnnotations(model);
  return (
    <ol className="mt-5 grid gap-3">
      {annots.map((a) => (
        <li key={a.n} className="flex gap-3">
          <span className="num mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[10px]"
            style={{ borderColor: a.tone === "glow" ? SIG.glow : a.tone === "brass" ? SIG.brass : INK.ink3, color: a.tone === "glow" ? SIG.glow : a.tone === "brass" ? SIG.brass : INK.ink2 }}>
            {a.n}
          </span>
          <p className="text-[13.5px] leading-snug text-ink-2">
            <span className="text-ink">{a.kicker}.</span> {a.lines.join(" ")}
          </p>
        </li>
      ))}
    </ol>
  );
}
