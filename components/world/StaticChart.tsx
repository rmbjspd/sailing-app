import { routeSegments } from "@/lib/data/routePath";
import { waypoints } from "@/lib/data/waypoints";
import { legStyle } from "@/lib/data/legStyle";
import { BBOX } from "@/lib/geo/projection";

// No-WebGL fallback: the baked night chart with the route drawn in SVG, in the
// same equirectangular frame as the raster.
const W = 2048, H = 1181;
const px = (lng: number, lat: number) =>
  [((lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * W, ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * H] as const;

export default function StaticChart({ className }: { className?: string }) {
  // Positioning comes from the caller's className (e.g. "absolute inset-0");
  // never force position here or the box collapses to zero height.
  return (
    <div className={`overflow-hidden ${className ?? "relative h-full w-full"}`} style={{ background: "#03060c" }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Chart of the voyage from Chicago to Old Saybrook">
        <image href="/geo/chart-dark-sm.webp" x={0} y={0} width={W} height={H} />
        {routeSegments.map((s) => (
          <polyline
            key={s.leg}
            points={s.coords.map(([lng, lat]) => px(lng, lat).join(",")).join(" ")}
            fill="none"
            stroke={legStyle(s.leg).color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={s.inland ? "10 8" : undefined}
            style={{ filter: `drop-shadow(0 0 6px ${legStyle(s.leg).color})` }}
          />
        ))}
        {waypoints.map((w) => {
          const [x, y] = px(w.lng, w.lat);
          return <circle key={w.id} cx={x} cy={y} r={6} fill="#03060c" stroke={legStyle(w.leg).color} strokeWidth={3} />;
        })}
      </svg>
    </div>
  );
}
