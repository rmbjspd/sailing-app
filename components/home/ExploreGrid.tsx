import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/kit";
import { tripTotals, legGroups } from "@/lib/data/stats";
import { checklists } from "@/lib/data/checklists";
import { waypoints } from "@/lib/data/waypoints";
import { legStyle, LEG_ORDER } from "@/lib/data/legStyle";

// "Go aboard" — the doorways into the rest of the site, each with a small
// generative glyph drawn from the real data it leads to.
export default function ExploreGrid() {
  const t = tripTotals();
  const items = checklists.reduce((s, g) => s + g.items.length, 0);
  const legs = legGroups();
  const cards = [
    {
      href: "/map", eyebrow: "Chart", title: "Fly the route", body: `A 3D chart of all ${waypoints.length} ports, built from real elevation data. Pan, tilt, and fly to any harbour.`,
      span: "md:col-span-2 md:row-span-2", glyph: <RouteGlyph />,
    },
    { href: "/itinerary", eyebrow: "Ship's Log", title: `${t.dayEnd} days, day by day`, body: "Every passage, berth, lock, highlight and hazard, with the captain's briefing for each leg.", glyph: <DaysGlyph days={legs.map((l) => ({ id: l.legId, n: l.dayEnd - l.dayStart + 1 }))} /> },
    { href: "/checklists", eyebrow: "Provisioning", title: `${items} items to stow`, body: "Safety gear to snacks, sorted by what actually stops you leaving the dock.", glyph: <StoresGlyph /> },
    { href: "/crew", eyebrow: "Crew", title: "Sign aboard a leg", body: "Three berths per leg. Pick your waters and join the passage.", glyph: <CrewGlyph /> },
    { href: "/journal", eyebrow: "Journal", title: "Keep the log", body: "Write it down while the water is still in your hair.", glyph: <JournalGlyph /> },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeader eyebrow="Go aboard" title={<>Everything for the <em>passage</em></>} lede="The plan, the stores, the crew and the log — all in one chart room." />
      <div className="mt-16 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.href} delay={i * 0.06} className={c.span ?? "md:col-span-2"}>
            <Link
              href={c.href}
              className="group glass relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl p-7 transition-[transform,background] duration-500 hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100">{c.glyph}</div>
              <div className="relative flex items-start justify-between">
                <p className="eyebrow">{c.eyebrow}</p>
                <ArrowUpRight className="size-5 text-ink-3 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glow" strokeWidth={1.5} />
              </div>
              <div className="relative mt-10 max-w-sm">
                <h3 className="font-display text-3xl font-light leading-tight md:text-[2.1rem]">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{c.body}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RouteGlyph() {
  // Waypoints plotted in their real relative positions, joined in order.
  const xs = waypoints.map((w) => w.lng), ys = waypoints.map((w) => w.lat);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const P = (lng: number, lat: number) => [40 + ((lng - x0) / (x1 - x0)) * 520, 40 + ((y1 - lat) / (y1 - y0)) * 260];
  const sorted = [...waypoints].sort((a, b) => a.day - b.day);
  return (
    <svg viewBox="0 0 600 340" className="absolute bottom-0 right-0 h-[75%] w-[85%]" aria-hidden>
      {sorted.slice(1).map((w, i) => {
        const a = P(sorted[i].lng, sorted[i].lat), b = P(w.lng, w.lat);
        return <line key={w.id} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={legStyle(w.leg).color} strokeWidth={1.5} strokeOpacity={0.8} />;
      })}
      {sorted.map((w) => { const [x, y] = P(w.lng, w.lat); return <circle key={w.id} cx={x} cy={y} r={2.5} fill={legStyle(w.leg).color} />; })}
    </svg>
  );
}

function DaysGlyph({ days }: { days: { id: string; n: number }[] }) {
  const cells = days.flatMap((d) => Array.from({ length: d.n }, (_, k) => ({ id: d.id, k })));
  return (
    <svg viewBox="0 0 350 40" className="absolute right-6 top-16 w-[60%] opacity-80" aria-hidden>
      {cells.map((c, i) => (
        <rect key={`${c.id}-${c.k}`} x={i * 10} y={0} width={7} height={22} rx={2} fill={legStyle(c.id).color} opacity={0.75} />
      ))}
    </svg>
  );
}

function StoresGlyph() {
  return (
    <svg viewBox="0 0 120 120" className="absolute right-6 top-14 size-24" aria-hidden>
      <circle cx="60" cy="60" r="48" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="8" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="var(--glow)" strokeWidth="8" strokeLinecap="round" strokeDasharray="301" strokeDashoffset="110" transform="rotate(-90 60 60)" />
    </svg>
  );
}

function CrewGlyph() {
  return (
    <svg viewBox="0 0 220 40" className="absolute right-6 top-16 w-40" aria-hidden>
      {LEG_ORDER.slice(0, 4).map((id, i) => (
        <g key={id} transform={`translate(${i * 55} 0)`}>
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={10 + k * 14} cy={20} r={5.5} fill={k < 3 - (i % 3) ? legStyle(id).color : "none"} stroke={legStyle(id).color} strokeDasharray={k < 3 - (i % 3) ? undefined : "2 2"} />
          ))}
        </g>
      ))}
    </svg>
  );
}

function JournalGlyph() {
  return (
    <svg viewBox="0 0 200 60" className="absolute right-6 top-16 w-40" aria-hidden>
      {[0, 1, 2, 3].map((i) => <line key={i} x1="0" x2={200 - i * 30} y1={8 + i * 14} y2={8 + i * 14} stroke="rgb(255 255 255 / 0.14)" />)}
      <path d="M4 50 C 40 30, 70 58, 110 36 S 170 28, 196 40" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
    </svg>
  );
}
