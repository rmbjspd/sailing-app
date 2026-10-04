// The baked chart raster for the active theme, as SVG <image>s. Both are
// rendered; CSS (.night-only / .day-only in globals.css) shows the right one,
// so it works in server components and never flashes the wrong chart.
// Frame: equirectangular over lib/geo/projection.ts BBOX (2048×1181 at full res).
export function ChartImage({
  width, height, x = 0, y = 0, hiRes = true, opacity, preserveAspectRatio,
}: {
  width: number; height: number; x?: number; y?: number; hiRes?: boolean; opacity?: number; preserveAspectRatio?: string;
}) {
  const sfx = hiRes ? "" : "-sm";
  const common = { x, y, width, height, opacity, preserveAspectRatio };
  return (
    <>
      <image className="night-only" href={`/geo/chart-dark${sfx}.webp`} {...common} />
      <image className="day-only" href={`/geo/chart-day${sfx}.webp`} {...common} />
    </>
  );
}
