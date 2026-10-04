import { routeSegments } from "@/lib/data/routePath";
import { legStyle } from "@/lib/data/legStyle";
import styles from "./crew.module.css";

// Full-bleed night chart behind the crew sign-in. The baked chart raster and
// the voyage route share one SVG coordinate frame (the raster's own pixel
// grid), so `slice` cropping keeps them registered at every viewport shape.
// Server component: pure SVG, no client JS.

const W = 2048;
const H = 1181;
const x = (lng: number) => ((lng + 89) / 18) * W;
const y = (lat: number) => ((47.5 - lat) / 7.5) * H;

function pathFor(coords: [number, number][]) {
  return coords
    .map(([lng, lat], i) => `${i ? "L" : "M"}${x(lng).toFixed(1)} ${y(lat).toFixed(1)}`)
    .join("");
}

export function ChartBackdrop() {
  const first = routeSegments[0].coords[0];
  const lastSeg = routeSegments[routeSegments.length - 1];
  const last = lastSeg.coords[lastSeg.coords.length - 1];
  const total = routeSegments.length;

  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="crew-route-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <image href="/geo/chart-dark.webp" width={W} height={H} opacity={0.62} />
        {routeSegments.map((seg, i) => {
          const s = legStyle(seg.leg);
          const d = pathFor(seg.coords);
          const delay = `${0.35 + (i / total) * 2.2}s`;
          return (
            <g key={seg.leg}>
              <path
                d={d}
                pathLength={1}
                className={styles.routeDraw}
                style={{ animationDelay: delay }}
                fill="none"
                stroke={s.color}
                strokeWidth={9}
                strokeOpacity={0.35}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#crew-route-glow)"
              />
              <path
                d={d}
                pathLength={1}
                className={styles.routeDraw}
                style={{ animationDelay: delay }}
                fill="none"
                stroke={s.color}
                strokeWidth={2.4}
                strokeOpacity={0.85}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
        {[first, last].map(([lng, lat], i) => (
          <g key={i} transform={`translate(${x(lng)} ${y(lat)})`}>
            <circle r={7} fill={i ? legStyle("sound-saybrook").color : legStyle("lake-michigan").color} className={styles.portPulse} opacity={0.6} />
            <circle r={5} fill="#eef3f8" />
          </g>
        ))}
      </svg>
      {/* Vignette: sink the edges into the abyss and calm the centre for the card */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,rgb(3_6_12/0.55)_0%,rgb(3_6_12/0.15)_60%,rgb(3_6_12/0.85)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-abyss to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss to-transparent" />
      <div className="graticule absolute inset-0 opacity-50" />
    </div>
  );
}
