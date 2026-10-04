"use client";
import { animate, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChartImage } from "@/components/kit/ChartImage";
import type { ChartData } from "./model";
import styles from "./log.module.css";

export type Box = [number, number, number, number];

export interface ChartView {
  /** route drawn through the end of this day (0 = nothing yet) */
  drawn: number;
  /** stop index where the boat sits */
  boat: number;
  /** stop indices to label */
  labels: number[];
  /** the day whose passage is highlighted, if any */
  current: number | null;
  /** region of the chart to frame (chart px) */
  frame: Box;
  /** frame tightly around the boat instead (compact strip) */
  follow?: boolean;
}

// Classic chart lettering for the water bodies: [label, lng, lat, rotation°, size]
const WATER: [string, number, number, number, number][] = [
  ["Lake Superior", -86.6, 47.22, 0, 26],
  ["Lake Michigan", -87.12, 43.35, -82, 28],
  ["Lake Huron", -82.55, 44.55, -62, 26],
  ["Georgian Bay", -80.85, 45.25, -42, 20],
  ["North Channel", -82.95, 46.12, -6, 13],
  ["Lake Erie", -81.15, 42.17, -24, 24],
  ["Lake Ontario", -77.75, 43.62, -8, 22],
  ["Long Island Sound", -72.95, 41.09, -9, 11],
  ["Atlantic Ocean", -72.6, 40.42, 0, 20],
];

const lngX = (lng: number, w: number) => ((lng + 89) / 18) * w;
const latY = (lat: number, h: number) => ((47.5 - lat) / 7.5) * h;

/** Fit `box` into a viewBox with the panel's aspect ratio, padded and clamped to the chart. */
function fit(box: Box, aspect: number, W: number, H: number, minW: number, pad = 0.14): Box {
  const [x, y, w, h] = box;
  let vw = Math.max(w * (1 + 2 * pad), minW);
  let vh = Math.max(h * (1 + 2 * pad), minW / aspect);
  if (vw / vh < aspect) vw = vh * aspect;
  else vh = vw / aspect;
  const clamp = (c: number, half: number, max: number) =>
    half * 2 >= max ? max / 2 : Math.min(Math.max(c, half), max - half);
  const cx = clamp(x + w / 2, vw / 2, W);
  const cy = clamp(y + h / 2, vh / 2, H);
  return [cx - vw / 2, cy - vh / 2, vw, vh];
}

const NM_PER_DEG_LAT = 60;
const NICE = [5, 10, 20, 25, 50, 100, 200];

export function VoyageChart({
  data, view, onSelectStop, hiRes, compact = false, title, desc,
}: {
  data: ChartData;
  view: ChartView;
  onSelectStop: (stopIndex: number) => void;
  hiRes: boolean;
  compact?: boolean;
  title: string;
  desc: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const vb = useRef<Box>([0, 0, data.w, data.h]);
  const size = useRef({ w: 0, h: 0 });
  const anim = useRef<{ stop: () => void } | null>(null);
  const reduce = useReducedMotion();
  const [cam, setCam] = useState<{ nm: number; px: number; upp: number; box: Box } | null>(null);
  const scale = cam;

  const boat = data.stops[view.boat];

  const targetFor = (): Box => {
    const { w, h } = size.current;
    const aspect = w > 0 && h > 0 ? w / h : 1.25;
    if (view.follow) {
      // Compact strip: a steady local window that rides with the boat.
      const [, , fw] = view.frame;
      const span = Math.min(Math.max(fw * 0.9, 380), 1700);
      const vh = span / aspect;
      // sit the boat a little below centre, clear of the floating brand mark
      return fit([boat.x - span / 2, boat.y - vh * 0.42, span, vh], aspect, data.w, data.h, span, 0);
    }
    return fit(view.frame, aspect, data.w, data.h, compact ? 360 : 300, 0.18);
  };

  const apply = (v: Box) => {
    vb.current = v;
    const svg = svgRef.current;
    if (!svg) return;
    svg.setAttribute("viewBox", v.map(n => n.toFixed(1)).join(" "));
    const w = size.current.w || 1;
    svg.style.setProperty("--s", (v[2] / w).toFixed(4));
  };

  const updateScale = (v: Box) => {
    const w = size.current.w;
    if (!w) return;
    // nm per screen px at the boat's latitude (equirectangular frame)
    const degPerPx = ((v[2] / data.w) * 18) / w;
    const lat = 47.5 - (boat.y / data.h) * 7.5;
    const nmPerPx = degPerPx * NM_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);
    const target = nmPerPx * (compact ? 56 : 90);
    const nm = NICE.reduce((best, n) => (Math.abs(n - target) < Math.abs(best - target) ? n : best), NICE[0]);
    setCam({ nm, px: Math.round(nm / nmPerPx), upp: v[2] / w, box: v });
  };

  const latest = useRef({ targetFor, apply, updateScale });
  useEffect(() => { latest.current = { targetFor, apply, updateScale }; });

  // Track panel size; snap the view on resize.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const changed = Math.abs(width - size.current.w) > 1 || Math.abs(height - size.current.h) > 1;
      size.current = { w: width, h: height };
      if (changed) {
        anim.current?.stop();
        const { targetFor: tf, apply: ap, updateScale: us } = latest.current;
        const t = tf();
        ap(t);
        us(t);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Glide the camera to each new frame.
  const frameKey = `${view.frame.join(",")}|${view.follow ? view.boat : ""}`;
  useEffect(() => {
    if (!size.current.w) return;
    const from = vb.current;
    const to = targetFor();
    anim.current?.stop();
    updateScale(to);
    if (reduce) { apply(to); return; }
    const fcx = from[0] + from[2] / 2, fcy = from[1] + from[3] / 2;
    const tcx = to[0] + to[2] / 2, tcy = to[1] + to[3] / 2;
    const zoom = to[2] / from[2];
    const aspect = to[2] / to[3];
    anim.current = animate(0, 1, {
      duration: 1.25,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: t => {
        const w = from[2] * Math.pow(zoom, t); // log-space zoom feels like a camera
        const h = w / aspect;
        const cx = fcx + (tcx - fcx) * t, cy = fcy + (tcy - fcy) * t;
        apply([cx - w / 2, cy - h / 2, w, h]);
      },
    });
    return () => anim.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameKey, reduce]);

  // ── Label layout: greedy, collision-free placement in screen space ──────
  const horizontalLeg = view.frame[2] > view.frame[3] * 1.6;
  const upp = cam?.upp ?? 3; // chart units per screen px at rest
  const box = cam?.box ?? [0, 0, data.w, data.h];
  type Side = "r" | "l" | "a" | "b";
  const rectFor = (x: number, y: number, name: string, side: Side, fs: number) => {
    const tw = name.length * fs * 0.56 * upp, th = fs * 1.05 * upp, g = 8 * upp;
    if (side === "r") return [x + g, y - th * 0.7, tw, th];
    if (side === "l") return [x - g - tw, y - th * 0.7, tw, th];
    if (side === "a") return [x - tw / 2, y - g - th, tw, th];
    return [x - tw / 2, y + g * 0.9, tw, th];
  };
  const hit = (a: number[], b: number[]) =>
    a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];
  const inside = (r: number[]) =>
    r[0] > box[0] + 6 * upp && r[0] + r[2] < box[0] + box[2] - 6 * upp && r[1] > box[1] + 30 * upp && r[1] + r[3] < box[1] + box[3] - 30 * upp;
  const boatFs = compact ? 11 : 13;
  const boatSide: Side = inside(rectFor(boat.x, boat.y - 9 * upp, boat.name, "r", boatFs)) ? "r" : "l";
  const kept: number[][] = [rectFor(boat.x, boat.y - 9 * upp, boat.name, boatSide, boatFs)];
  const placed: { i: number; side: Side }[] = [];
  if (!compact) {
    view.labels.forEach((i, k) => {
      if (i === view.boat) return;
      const st = data.stops[i];
      const order: Side[] = horizontalLeg ? (k % 2 ? ["b", "a", "r", "l"] : ["a", "b", "r", "l"]) : ["r", "l", "a", "b"];
      for (const side of order) {
        const r = rectFor(st.x, st.y, st.name, side, 10.5);
        if (inside(r) && !kept.some(o => hit(o, r))) {
          kept.push(r);
          placed.push({ i, side });
          return;
        }
      }
    });
  }
  const sideStyle: Record<Side, { anchor: "start" | "end" | "middle"; t: string }> = {
    r: { anchor: "start", t: "translate(calc(var(--s) * 8px), calc(var(--s) * 3.5px))" },
    l: { anchor: "end", t: "translate(calc(var(--s) * -8px), calc(var(--s) * 3.5px))" },
    a: { anchor: "middle", t: "translateY(calc(var(--s) * -9px))" },
    b: { anchor: "middle", t: "translateY(calc(var(--s) * 17px))" },
  };

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <svg
        ref={svgRef}
        className={`${styles.chart} block h-full w-full select-none`}
        viewBox={`0 0 ${data.w} ${data.h}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-labelledby="log-chart-title log-chart-desc"
      >
        <title id="log-chart-title">{title}</title>
        <desc id="log-chart-desc">{desc}</desc>
        <defs>
          <linearGradient id="log-fx" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.05" stopColor="#fff" />
            <stop offset="0.95" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <linearGradient id="log-fy" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.07" stopColor="#fff" />
            <stop offset="0.93" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="log-mx" maskUnits="userSpaceOnUse" x="0" y="0" width={data.w} height={data.h}>
            <rect width={data.w} height={data.h} fill="url(#log-fx)" />
          </mask>
          <mask id="log-my" maskUnits="userSpaceOnUse" x="0" y="0" width={data.w} height={data.h}>
            <rect width={data.w} height={data.h} fill="url(#log-fy)" />
          </mask>
          <radialGradient id="log-boat-glow">
            <stop offset="0" className={styles.glowCore} />
            <stop offset="0.35" stopColor="var(--glow)" className={styles.glowMid} />
            <stop offset="1" stopColor="var(--glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g mask="url(#log-mx)">
          <g mask="url(#log-my)">
            <ChartImage width={data.w} height={data.h} hiRes={hiRes} preserveAspectRatio="none" opacity={0.95} />
          </g>
        </g>

        {/* graticule, one degree */}
        <g className={styles.grat} style={{ strokeWidth: "calc(var(--s) * 1px)" }} aria-hidden>
          {Array.from({ length: 31 }, (_, i) => -95 + i).map(lng => (
            <line key={lng} x1={lngX(lng, data.w)} x2={lngX(lng, data.w)} y1={-1200} y2={data.h + 1200} />
          ))}
          {Array.from({ length: 21 }, (_, i) => 34 + i).map(lat => (
            <line key={lat} y1={latY(lat, data.h)} y2={latY(lat, data.h)} x1={-1500} x2={data.w + 1500} />
          ))}
        </g>

        {/* water lettering */}
        {!compact && (
          <g aria-hidden className={styles.water} fontFamily="var(--font-fraunces), serif" fontStyle="italic" style={{ letterSpacing: "0.18em" }}>
            {WATER.map(([t, lng, lat, rot, fs]) => {
              const x = lngX(lng, data.w), y = latY(lat, data.h);
              return (
                <text key={t} x={x} y={y} textAnchor="middle" transform={`rotate(${rot} ${x} ${y})`} style={{ stroke: "none", fontSize: `calc(var(--s) * ${fs * 0.55}px)` }}>
                  {t}
                </text>
              );
            })}
          </g>
        )}

        {/* the whole passage, faint, ahead of the boat */}
        <g aria-hidden>
          {data.legs.map(l => (
            <path
              key={l.legId}
              d={l.d}
              className={`${styles.route} ${styles.ahead}`}
              stroke={l.color}
              style={{
                strokeWidth: "calc(var(--s) * 1.25px)",
                strokeDasharray: l.inland ? "calc(var(--s) * 1px) calc(var(--s) * 4px)" : undefined,
              }}
            />
          ))}
        </g>

        {/* miles made good: halo + core, drawn day by day */}
        <g aria-hidden>
          {data.dayPaths.map(p => {
            const on = p.day <= view.drawn;
            return (
              <path
                key={`h${p.day}`}
                d={p.d}
                pathLength={1}
                className={`${styles.route} ${p.day === view.current ? styles.wakeCur : styles.wake}`}
                stroke={p.color}
                style={{ strokeWidth: "calc(var(--s) * 9px)", strokeDasharray: 1, strokeDashoffset: on ? 0 : 1 }}
              />
            );
          })}
          {/* casing under the current passage (paper by day, none at night) */}
          {data.dayPaths.map(p => (
            <path
              key={`k${p.day}`}
              d={p.d}
              pathLength={1}
              className={`${styles.route} ${styles.casing}`}
              style={{
                strokeWidth: "calc(var(--s) * 5.5px)",
                strokeDasharray: 1,
                strokeDashoffset: p.day === view.current && p.day <= view.drawn ? 0 : 1,
              }}
            />
          ))}
          {data.dayPaths.map(p => {
            const on = p.day <= view.drawn;
            const cur = p.day === view.current;
            return (
              <path
                key={`c${p.day}`}
                d={p.d}
                pathLength={1}
                className={`${styles.route} ${cur ? styles.current : ""}`}
                stroke={p.color}
                style={{
                  strokeWidth: `calc(var(--s) * ${cur ? 2.75 : 2.25}px)`,
                  strokeDasharray: 1,
                  strokeDashoffset: on ? 0 : 1,
                }}
              />
            );
          })}
        </g>

        {/* overnight stops */}
        <g>
          {data.stops.map((s, i) => {
            const past = s.day <= view.drawn;
            return (
              <g key={s.id} onClick={() => onSelectStop(i)} style={{ cursor: "pointer" }}>
                <circle cx={s.x} cy={s.y} fill="transparent" style={{ r: "calc(var(--s) * 13px)" }} />
                <circle
                  cx={s.x}
                  cy={s.y}
                  className={`${styles.stop} ${past ? "" : styles.hollow}`}
                  fill={s.color}
                  stroke={s.color}
                  strokeOpacity={past ? 1 : 0.6}
                  style={{ r: `calc(var(--s) * ${past ? 3.6 : 2.8}px)`, strokeWidth: "calc(var(--s) * 1.25px)" }}
                />
              </g>
            );
          })}
        </g>

        {/* stop names for the leg in frame */}
        <g aria-hidden fontFamily="var(--font-geist), sans-serif" pointerEvents="none">
          {placed.map(({ i, side }) => {
            const st = data.stops[i];
            return (
              <text
                key={st.id}
                x={st.x}
                y={st.y}
                className={`${styles.label} ${styles.stopLabel}`}
                textAnchor={sideStyle[side].anchor}
                style={{
                  fontSize: "calc(var(--s) * 10.5px)",
                  strokeWidth: "calc(var(--s) * 3px)",
                  transform: sideStyle[side].t,
                }}
              >
                {st.name}
              </text>
            );
          })}
        </g>

        {/* the boat */}
        <g
          className={styles.boat}
          style={{ transform: `translate(${boat.x}px, ${boat.y}px)` }}
          pointerEvents="none"
          aria-hidden
        >
          <line x1={-4000} x2={4000} y1={0} y2={0} stroke="var(--glow)" className={styles.cross} style={{ strokeWidth: "calc(var(--s) * 1px)" }} />
          <line y1={-4000} y2={4000} x1={0} x2={0} stroke="var(--glow)" className={styles.cross} style={{ strokeWidth: "calc(var(--s) * 1px)" }} />
          <circle fill="url(#log-boat-glow)" style={{ r: "calc(var(--s) * 34px)" }} />
          <circle className={`${styles.ping} motion-reduce:hidden`} fill="none" stroke="var(--glow)" style={{ r: "calc(var(--s) * 7px)", strokeWidth: "calc(var(--s) * 1.5px)" }} />
          <circle className={styles.boatDot} stroke="var(--glow)" style={{ r: "calc(var(--s) * 4.75px)", strokeWidth: "calc(var(--s) * 2px)" }} />
          <text
            className={styles.boatLabel}
            fontFamily="var(--font-geist), sans-serif"
            fontWeight={500}
            style={{
              fontSize: `calc(var(--s) * ${compact ? 11 : 13}px)`,
              strokeWidth: "calc(var(--s) * 3.5px)",
              transform: `translate(calc(var(--s) * ${boatSide === "r" ? 11 : -11}px), calc(var(--s) * -9px))`,
            }}
            textAnchor={boatSide === "r" ? "start" : "end"}
          >
            {boat.name}
          </text>
        </g>
      </svg>

      {/* scale bar + north */}
      {scale && !compact && (
        <div aria-hidden className="pointer-events-none absolute bottom-4 right-5 flex items-end gap-3 text-ink-3">
          <span className="flex items-end gap-2">
            <span className="num text-[10px] leading-none">{scale.nm} nm</span>
            <span className="block h-[7px] border-x border-b border-ink-3/80" style={{ width: scale.px }} />
          </span>
          <span className="flex flex-col items-center">
            <span className="num text-[9px] leading-none">N</span>
            <svg width="8" height="12" viewBox="0 0 10 16" className="mt-0.5"><path d="M5 0 L9 16 L5 12 L1 16Z" fill="currentColor" fillOpacity="0.7" /></svg>
          </span>
        </div>
      )}
    </div>
  );
}
