import Link from "next/link";
import { Map, CalendarDays, CheckSquare, BookOpen, Wind, Clock, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { legGroupsForRoute, tripTotals, formatLegDistance } from "@/lib/data/stats";
import { waypoints } from "@/lib/data/waypoints";

// Per-leg presentation only. All days/distances/locks are derived from
// itinerary.ts at render time so the overview can never go stale.
const LEG_STYLE: Record<string, { label: string; emoji: string; accent: string; bg: string; border: string }> = {
  "lake-michigan":  { label: "Lake Michigan",              emoji: "🌊", accent: "hsl(210 65% 42%)", bg: "hsl(210 55% 90%)", border: "hsl(210 60% 68%)" },
  "north-channel":  { label: "North Channel · Manitoulin", emoji: "🍁", accent: "hsl(165 52% 36%)", bg: "hsl(165 38% 90%)", border: "hsl(165 48% 62%)" },
  "lake-erie":      { label: "Lake Erie",                  emoji: "⛈️", accent: "hsl(205 60% 40%)", bg: "hsl(205 50% 90%)", border: "hsl(205 55% 66%)" },
  "erie-canal":     { label: "Erie Canal",                 emoji: "⚓", accent: "hsl(42 78% 44%)",  bg: "hsl(42 60% 91%)",  border: "hsl(42 72% 64%)" },
  "hudson":         { label: "Hudson River",               emoji: "🌉", accent: "hsl(148 45% 34%)", bg: "hsl(148 35% 90%)", border: "hsl(148 42% 60%)" },
  "coast-philly":   { label: "NJ Coast",                   emoji: "⛵", accent: "hsl(16 68% 46%)",  bg: "hsl(16 50% 92%)",  border: "hsl(16 62% 66%)" },
  "sound-saybrook": { label: "Long Island Sound",          emoji: "⛵", accent: "hsl(200 65% 40%)", bg: "hsl(200 50% 90%)", border: "hsl(200 60% 66%)" },
};

function buildCourseLegs() {
  const sayb = legGroupsForRoute("saybrook");
  const phil = legGroupsForRoute("philly");
  const shared = sayb.slice(0, 5); // lake-michigan … hudson (identical on both routes)
  const sound = sayb[sayb.length - 1];
  const coast = phil[phil.length - 1];

  const cards = shared.map((leg) => {
    const s = LEG_STYLE[leg.legId];
    const locks = leg.locks > 0 ? ` · ${leg.locks} lock${leg.locks !== 1 ? "s" : ""}` : "";
    return { ...s, days: `${leg.dayStart}–${leg.dayEnd}`, nm: `${formatLegDistance(leg)}${locks}` };
  });

  // Final leg forks into two route options — present as a combined card.
  const s = LEG_STYLE["sound-saybrook"];
  cards.push({
    label: "NJ Coast / Long Island Sound",
    emoji: "⛵",
    accent: s.accent, bg: s.bg, border: s.border,
    days: `${Math.min(sound.dayStart, coast.dayStart)}–${Math.max(sound.dayEnd, coast.dayEnd)}`,
    nm: `${Math.round(sound.distanceNm)}–${Math.round(coast.distanceNm)} nm`,
  });
  return cards;
}

export default function HomePage() {
  const legs = buildCourseLegs();
  const sayb = tripTotals("saybrook");
  const phil = tripTotals("philly");
  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
  // Erie-Canal-only lock count (excludes Black Rock + Troy) for the Canal card.
  const canalLocks = legGroupsForRoute("saybrook").find(l => l.legId === "erie-canal")?.locks ?? 0;
  // Option B overnight stops, derived from waypoints so the copy can't drift.
  const saybrookStops = waypoints
    .filter(w => w.leg === "sound-saybrook")
    .map(w => w.name.split(" / ")[0])
    .join(", ");
  const heroStats = [
    { icon: Navigation,  label: "Total Distance", value: `~${fmt(sayb.distanceNmEquiv)}–${fmt(phil.distanceNmEquiv)} nm` },
    { icon: CalendarDays, label: "Sailing Days",   value: `${sayb.dayEnd}–${phil.dayEnd} days` },
    { icon: "⚓",         label: "Locks",          value: `${sayb.locks} total` },
    { icon: Wind,         label: "Boat",           value: "Oceanis 30.1" },
    { icon: Clock,        label: "Sabbatical",     value: "8 weeks" },
  ];
  return (
    <div>

      {/* ── Full-bleed ocean hero ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(158deg, hsl(220 62% 5%) 0%, hsl(215 58% 8%) 40%, hsl(200 60% 10%) 72%, hsl(212 55% 7%) 100%)",
          minHeight: "340px",
        }}
      >
        {/* Chart-table grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 79px, hsl(42 50% 60% / 0.04) 79px, hsl(42 50% 60% / 0.04) 80px), repeating-linear-gradient(0deg, transparent, transparent 79px, hsl(42 50% 60% / 0.04) 79px, hsl(42 50% 60% / 0.04) 80px)",
          }}
        />

        {/* Large compass rose */}
        <svg
          viewBox="0 0 120 120"
          className="absolute top-1/2 right-8 md:right-16 pointer-events-none hidden sm:block"
          aria-hidden="true"
          style={{
            width: "clamp(180px, 28vw, 340px)",
            height: "clamp(180px, 28vw, 340px)",
            transform: "translateY(-50%)",
            opacity: 0.14,
            filter: "drop-shadow(0 0 18px hsl(42 80% 52% / 0.25))",
          }}
        >
          <g fill="hsl(42 80% 68%)">
            <path d="M60,4 L54,60 L60,51 L66,60 Z" />
            <path d="M60,116 L54,60 L60,69 L66,60 Z" />
            <path d="M4,60 L60,54 L51,60 L60,66 Z" />
            <path d="M116,60 L60,54 L69,60 L60,66 Z" />
            <path d="M21,21 L57,57 L51,60 L57,63 Z" opacity="0.55" />
            <path d="M99,21 L63,57 L69,60 L63,63 Z" opacity="0.55" />
            <path d="M21,99 L57,63 L51,60 L57,57 Z" opacity="0.55" />
            <path d="M99,99 L63,63 L69,60 L63,57 Z" opacity="0.55" />
            <circle cx="60" cy="60" r="10" />
            <circle cx="60" cy="60" r="5" fill="hsl(220 55% 9%)" />
          </g>
          <text x="60" y="1.5" textAnchor="middle" fill="hsl(42 80% 72%)" fontSize="10" fontWeight="bold" fontFamily="serif">N</text>
          <text x="60" y="120" textAnchor="middle" fill="hsl(42 80% 72%)" fontSize="10" fontWeight="bold" fontFamily="serif">S</text>
          <text x="0.5" y="64" textAnchor="middle" fill="hsl(42 80% 72%)" fontSize="10" fontWeight="bold" fontFamily="serif">W</text>
          <text x="119.5" y="64" textAnchor="middle" fill="hsl(42 80% 72%)" fontSize="10" fontWeight="bold" fontFamily="serif">E</text>
        </svg>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-4"
            style={{
              color: "hsl(42 55% 52%)",
              fontFamily: "var(--font-typewriter)",
            }}
          >
            ☠ &nbsp;Summer 2027 &middot; 8-Week Sabbatical&nbsp; ☠
          </p>

          <h1
            className="font-[family-name:var(--font-pirata)] leading-none mb-4"
            style={{
              fontSize: "clamp(3rem, 9vw, 7rem)",
              color: "hsl(42 82% 60%)",
              textShadow:
                "0 0 48px hsl(42 80% 44% / 0.28), 0 4px 10px rgba(0,0,0,0.55)",
            }}
          >
            Chicago<br />
            <span style={{ color: "hsl(42 65% 75%)", fontSize: "0.75em" }}>→</span>{" "}
            Philadelphia
          </h1>

          <p
            className="italic text-base md:text-lg mb-8 leading-relaxed"
            style={{ color: "hsl(38 30% 62%)" }}
          >
            Great Lakes &middot; Erie Canal &middot; Hudson River &middot; NJ Coast &nbsp;🦜
          </p>

          <div className="flex flex-wrap gap-3">
            {heroStats.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5"
                style={{
                  background: "hsl(42 40% 50% / 0.1)",
                  border: "1px solid hsl(42 40% 50% / 0.2)",
                  backdropFilter: "blur(2px)",
                }}
              >
                {typeof s.icon === "string" ? (
                  <span style={{ color: "hsl(42 60% 55%)", fontSize: "0.85rem" }}>{s.icon}</span>
                ) : (
                  <s.icon className="w-4 h-4" style={{ color: "hsl(42 60% 55%)" } as React.CSSProperties} />
                )}
                <div>
                  <p className="text-xs leading-none mb-1" style={{ color: "hsl(38 22% 48%)" }}>
                    {s.label}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "hsl(38 50% 78%)" }}>
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Torn parchment bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg
            viewBox="0 0 1440 36"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: 36 }}
          >
            <path
              d="M0,36 L0,28 L14,10 L22,26 L36,6 L48,24 L60,8 L72,28 L84,12 L96,30 L108,8 L120,24 L134,4 L146,22 L160,32 L172,12 L186,28 L198,8 L212,24 L226,6 L240,26 L254,10 L268,30 L282,14 L296,36 L310,16 L324,4 L338,24 L352,10 L366,28 L380,12 L394,26 L408,8 L422,24 L436,6 L450,26 L464,12 L478,30 L492,10 L506,26 L520,6 L534,22 L548,10 L562,30 L576,14 L590,36 L604,16 L618,4 L632,24 L646,10 L660,28 L674,12 L688,26 L702,8 L716,26 L730,6 L744,24 L758,10 L772,30 L786,14 L800,36 L814,16 L828,4 L842,22 L856,10 L870,30 L884,12 L898,28 L912,8 L926,26 L940,6 L954,24 L968,12 L982,28 L996,10 L1010,30 L1024,14 L1038,36 L1052,16 L1066,4 L1080,24 L1094,10 L1108,28 L1122,12 L1136,26 L1150,8 L1164,24 L1178,6 L1192,22 L1206,10 L1220,30 L1234,14 L1248,36 L1262,14 L1276,4 L1290,24 L1304,10 L1318,28 L1332,8 L1346,26 L1360,6 L1374,24 L1390,14 L1402,30 L1418,12 L1430,26 L1440,18 L1440,36 Z"
              fill="hsl(38, 26%, 84%)"
            />
          </svg>
        </div>
      </div>

      {/* ── Parchment content surface ── */}
      <div className="parchment-page">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

          {/* Quick nav */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/map",        icon: Map,         label: "Navigation Charts", desc: "Full route + waypoints"  },
              { href: "/itinerary",  icon: CalendarDays, label: "Ship's Log",        desc: "Day-by-day itinerary"    },
              { href: "/checklists", icon: CheckSquare,  label: "Provisioning",      desc: "Gear & supplies"         },
              { href: "/journal",    icon: BookOpen,     label: "Captain's Log",     desc: "Your voyage journal"     },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}>
                <Card className="h-full transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 group border-[hsl(var(--border))]">
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 group-hover:scale-110"
                      style={{
                        background: "hsl(var(--page-bg))",
                        border: "2px solid hsl(var(--border))",
                        transition: "transform 0.2s, background 0.2s",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "hsl(var(--teal))" } as React.CSSProperties} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[hsl(var(--card-foreground))]">{label}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Route overview */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-[family-name:var(--font-pirata)] text-2xl text-[hsl(var(--navy))] shrink-0">
                The Course
              </h2>
              <div className="flex-1 rope-divider" />
              <span className="text-lg shrink-0" style={{ opacity: 0.55 }}>☠</span>
              <div className="flex-1 rope-divider" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {legs.map((leg) => (
                <div
                  key={leg.label}
                  className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    background: leg.bg,
                    border: `1.5px solid ${leg.border}`,
                  }}
                >
                  {/* Color accent bar */}
                  <div className="h-1.5" style={{ background: leg.accent }} />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-[hsl(var(--card-foreground))]">
                        {leg.emoji}&nbsp; {leg.label}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Days {leg.days}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: leg.accent + "22", color: leg.accent, border: `1px solid ${leg.accent}44` }}
                    >
                      {leg.nm}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Destination options */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-[family-name:var(--font-pirata)] text-2xl text-[hsl(var(--navy))] shrink-0">
                Mark Your X
              </h2>
              <div className="flex-1 rope-divider" />
              <span className="text-lg shrink-0" style={{ opacity: 0.55 }}>🦜</span>
              <div className="flex-1 rope-divider" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {/* Option A */}
              <Card className="border-[hsl(var(--border))] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 flex-wrap font-[family-name:var(--font-pirata)] text-xl">
                    🏛️ Option A — Philadelphia, PA
                    <Badge variant="secondary" className="text-xs font-[family-name:var(--font-typewriter)]">
                      ~230 nm post-NYC
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[hsl(var(--card-foreground))] space-y-2">
                  <p className="italic text-[hsl(var(--muted-foreground))]">NJ offshore coast → Delaware Bay → Delaware River</p>
                  <p style={{ color: "hsl(38 65% 38%)" }} className="font-semibold">
                    ⚠ Prevailing SW winds = mostly motorsailing south. Inlet timing be critical, mate.
                  </p>
                  <p>Completes the full inland waterway narrative. A cheesesteak awaits the weary crew at journey&apos;s end.</p>
                </CardContent>
              </Card>

              {/* Option B — recommended */}
              <Card
                className="shadow-md"
                style={{ border: "2.5px solid hsl(var(--teal))" }}
              >
                <div className="h-1.5 rounded-t-lg" style={{ background: "hsl(var(--teal))" }} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 flex-wrap font-[family-name:var(--font-pirata)] text-xl">
                    ⛵ Option B — Old Saybrook, CT
                    <Badge
                      className="text-xs font-[family-name:var(--font-typewriter)] border-0"
                      style={{ background: "hsl(var(--teal))", color: "white" }}
                    >
                      Recommended
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[hsl(var(--card-foreground))] space-y-2">
                  <p className="italic text-[hsl(var(--muted-foreground))]">East River → Long Island Sound → Connecticut coast</p>
                  <p style={{ color: "hsl(148 45% 32%)" }} className="font-semibold">
                    ✓ SW sea breezes = beam reaching east. This, Captain, is the good stuff. This is why ye came.
                  </p>
                  <p>~80 nm shorter. Pillage stops: {saybrookStops}.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dead reckoning */}
          <section className="pb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-[family-name:var(--font-pirata)] text-2xl text-[hsl(var(--navy))] shrink-0">
                Dead Reckoning
              </h2>
              <div className="flex-1 rope-divider" />
              <span className="text-lg shrink-0" style={{ opacity: 0.55 }}>⚓</span>
              <div className="flex-1 rope-divider" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Mast Unstep",
                  detail: "Tonawanda/Buffalo · Day 20",
                  sub: "Call Wardell's or Smith Boys well in advance. The crane doesn't wait for fools.",
                },
                {
                  title: "Canal Transit",
                  detail: `34 numbered locks · ${canalLocks} transited`,
                  sub: "20–30 min per lock. Last lock by 4:30 pm. Miss the Waterford Flight cutoff and ye sleep on the wrong side.",
                },
                {
                  title: "Mast Re-step",
                  detail: "Catskill, NY · Day 26",
                  sub: "Hop-O-Nose Marina on Catskill Creek. Ring ahead — the crane master is a busy soul.",
                },
                {
                  title: "CBSA / CBP",
                  detail: "Canada Day 8 · US re-entry Day 14",
                  sub: "Passports for all hands. Phone CBSA at Meldrum Bay on arrival, CBP at Port Huron on return. No exceptions.",
                },
                {
                  title: "Hudson Tides",
                  detail: "5–6 hr lag vs NYC Battery",
                  sub: "Troy tide tables, not NYC. Get this wrong and ye'll be bucking the flood all day, ye landlubber.",
                },
                {
                  title: "Hell Gate",
                  detail: "East River · Option B Day 30",
                  sub: "4–5 kt current. Slack water window is 45 minutes. Miss it and the current will teach ye respect.",
                },
              ].map(({ title, detail, sub }) => (
                <div key={title} className="treasure-frame rounded-lg p-5 pt-6">
                  <p className="font-[family-name:var(--font-pirata)] text-lg text-[hsl(var(--navy))]">
                    {title}
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(var(--teal))" }}>
                    {detail}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed italic">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
