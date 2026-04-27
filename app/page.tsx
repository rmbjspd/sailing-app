import Link from "next/link";
import { Map, CalendarDays, CheckSquare, BookOpen, Wind, Clock, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const legs = [
  { label: "Lake Michigan",  days: "1–6",   nm: "~500 nm",          emoji: "🌊", color: "bg-blue-50   border-blue-200"   },
  { label: "Lake Huron",     days: "7–10",  nm: "~300 nm",          emoji: "🌊", color: "bg-blue-50   border-blue-200"   },
  { label: "Lake Erie",      days: "11–15", nm: "~250 nm",          emoji: "⛈️",  color: "bg-blue-50   border-blue-200"   },
  { label: "Erie Canal",     days: "15–20", nm: "338 mi · 34 locks",emoji: "⚓", color: "bg-amber-50  border-amber-200"  },
  { label: "Hudson River",   days: "21–24", nm: "~134 nm",          emoji: "🌉", color: "bg-emerald-50 border-emerald-200"},
  { label: "NJ Coast / LIS", days: "25–29", nm: "~150–230 nm",      emoji: "⛵", color: "bg-sky-50    border-sky-200"    },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Hero */}
      <div className="bg-[hsl(var(--navy))] text-white relative overflow-hidden" style={{ padding: "2rem 2rem 3.5rem" }}>

        {/* Compass rose watermark */}
        <svg viewBox="0 0 120 120" className="absolute right-6 top-1/2 -translate-y-1/2 w-36 h-36 pointer-events-none hidden md:block" aria-hidden="true" style={{ opacity: 0.06 }}>
          <g fill="white">
            <path d="M60,4 L54,60 L60,51 L66,60 Z"/>
            <path d="M60,116 L54,60 L60,69 L66,60 Z"/>
            <path d="M4,60 L60,54 L51,60 L60,66 Z"/>
            <path d="M116,60 L60,54 L69,60 L60,66 Z"/>
            <path d="M21,21 L57,57 L51,60 L57,63 Z" opacity="0.6"/>
            <path d="M99,21 L63,57 L69,60 L63,63 Z" opacity="0.6"/>
            <path d="M21,99 L57,63 L51,60 L57,57 Z" opacity="0.6"/>
            <path d="M99,99 L63,63 L69,60 L63,57 Z" opacity="0.6"/>
            <circle cx="60" cy="60" r="9"/>
            <circle cx="60" cy="60" r="4" fill="hsl(213,62%,18%)"/>
          </g>
          <text x="60" y="2" textAnchor="middle" fill="white" fontSize="10" fontFamily="serif" fontWeight="bold">N</text>
          <text x="60" y="120" textAnchor="middle" fill="white" fontSize="10" fontFamily="serif" fontWeight="bold">S</text>
          <text x="1" y="64" textAnchor="middle" fill="white" fontSize="10" fontFamily="serif" fontWeight="bold">W</text>
          <text x="119" y="64" textAnchor="middle" fill="white" fontSize="10" fontFamily="serif" fontWeight="bold">E</text>
        </svg>

        <div className="relative z-10">
          <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-2">
            ☠ &nbsp;Summer 2027 · 8-Week Sabbatical&nbsp; ☠
          </p>
          <h1 className="font-[family-name:var(--font-pirata)] text-4xl md:text-5xl text-white leading-tight mb-1">
            Chicago → Philadelphia
          </h1>
          <p className="text-white/60 text-base mb-6">
            Great Lakes &middot; Erie Canal &middot; Hudson River &middot; NJ Coast &nbsp;🦜
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Navigation, label: "Total Distance", value: "~1,300 nm" },
              { icon: CalendarDays, label: "Sailing Days",  value: "~29 days"  },
              { icon: "⚓",         label: "Locks",         value: "36 total"  },
              { icon: Wind,         label: "Boat",          value: "Oceanis 30.1" },
              { icon: Clock,        label: "Sabbatical",    value: "8 weeks"   },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                {typeof s.icon === "string"
                  ? <span className="text-white/50 text-sm">{s.icon}</span>
                  : <s.icon className="w-4 h-4 text-white/50" />}
                <div>
                  <p className="text-white/50 text-xs leading-none mb-0.5">{s.label}</p>
                  <p className="text-white text-sm font-medium">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Torn parchment edge */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 30 }} aria-hidden="true">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full" style={{ height: 30, display: "block" }}>
            <path d="M0,30 L0,24 L12,8 L20,22 L32,4 L44,20 L54,6 L64,24 L76,10 L86,26 L96,6 L108,20 L118,2 L128,18 L140,28 L150,10 L162,24 L172,6 L182,20 L194,4 L204,22 L216,8 L226,26 L238,12 L248,30 L260,14 L270,2 L282,20 L292,8 L304,26 L314,10 L326,24 L336,6 L348,20 L358,4 L370,22 L380,10 L392,28 L402,8 L414,22 L424,4 L436,20 L446,8 L458,26 L468,12 L480,24 L490,6 L502,20 L512,4 L524,18 L534,8 L546,26 L556,12 L568,30 L580,14 L590,2 L602,20 L612,8 L624,26 L634,10 L646,24 L656,6 L668,22 L678,4 L690,20 L700,8 L712,26 L722,12 L734,30 L744,14 L756,2 L766,18 L778,8 L788,26 L800,10 L812,24 L822,6 L834,20 L844,4 L856,22 L866,10 L878,28 L888,8 L900,22 L910,4 L922,18 L932,8 L944,26 L954,12 L966,30 L978,14 L988,2 L1000,20 L1012,8 L1022,26 L1034,10 L1044,24 L1056,6 L1066,20 L1078,4 L1088,22 L1100,8 L1112,26 L1122,14 L1134,30 L1144,14 L1156,2 L1166,20 L1178,8 L1188,26 L1200,10 L1212,24 L1222,6 L1234,20 L1244,4 L1256,22 L1266,8 L1278,26 L1288,14 L1300,30 L1312,12 L1322,2 L1334,20 L1344,8 L1356,24 L1366,4 L1378,22 L1388,8 L1400,26 L1412,12 L1422,28 L1432,10 L1440,18 L1440,30 Z"
              fill="hsl(40, 35%, 96%)"/>
          </svg>
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/map",        icon: Map,        label: "Navigation Charts",  desc: "Full route + waypoints"    },
          { href: "/itinerary",  icon: CalendarDays,label: "Ship's Log",         desc: "Day-by-day itinerary"      },
          { href: "/checklists", icon: CheckSquare, label: "Provisioning Lists", desc: "Gear & supplies"           },
          { href: "/journal",    icon: BookOpen,    label: "Captain's Log",       desc: "Your voyage journal"       },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <Card className="h-full hover:shadow-md transition-all cursor-pointer hover:border-[hsl(var(--primary))] group">
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--secondary))] group-hover:bg-[hsl(var(--primary))/10] flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Route overview */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] shrink-0">
            The Course
          </h2>
          <div className="flex-1 rope-divider" />
          <span className="text-base shrink-0" style={{ opacity: 0.5 }}>☠</span>
          <div className="flex-1 rope-divider" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {legs.map((leg) => (
            <div key={leg.label} className={`rounded-lg border p-4 ${leg.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{leg.emoji} {leg.label}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Days {leg.days}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{leg.nm}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination options */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] shrink-0">
            Mark Your X
          </h2>
          <div className="flex-1 rope-divider" />
          <span className="text-base shrink-0" style={{ opacity: 0.5 }}>🦜</span>
          <div className="flex-1 rope-divider" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-[hsl(var(--border))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                🏛️ Option A &mdash; Philadelphia, PA
                <Badge variant="secondary" className="text-xs">~230 nm post-NYC</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[hsl(var(--muted-foreground))] space-y-2">
              <p>NJ offshore coast → Delaware Bay → Delaware River</p>
              <p className="text-amber-700 font-medium">⚠ Prevailing SW winds = mostly motorsailing south. Inlet timing be critical, mate.</p>
              <p>Completes the full inland waterway narrative. A cheesesteak awaits the weary crew at journey&apos;s end.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[hsl(var(--primary))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                ⛵ Option B &mdash; Old Saybrook, CT
                <Badge className="bg-[hsl(var(--primary))] text-white text-xs">Recommended</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[hsl(var(--muted-foreground))] space-y-2">
              <p>East River → Long Island Sound → Connecticut coast</p>
              <p className="text-emerald-700 font-medium">✓ SW sea breezes = beam reaching east. This, Captain, is the good stuff. This is why ye came.</p>
              <p>~80 nm shorter. Pillage stops: Oyster Bay, Greenport, Mystic, Essex.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key logistics */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] shrink-0">
            Dead Reckoning
          </h2>
          <div className="flex-1 rope-divider" />
          <span className="text-base shrink-0" style={{ opacity: 0.5 }}>⚓</span>
          <div className="flex-1 rope-divider" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Mast Unstep",    detail: "Tonawanda/Buffalo · Day 15",   sub: "Arr — call Wardell's or Smith Boys well in advance. The crane doesn't wait for fools." },
            { title: "Canal Transit",  detail: "34 locks · E-2 through E-35",  sub: "20–30 min per lock. Last lock by 4:30pm. Miss the Waterford Flight cutoff and ye sleep on the wrong side." },
            { title: "Mast Re-step",   detail: "Catskill, NY · Day 21",        sub: "Hop-O-Nose Marina on Catskill Creek. Ring ahead — the crane master is a busy soul." },
            { title: "Fuel Range",     detail: "~12–17 hr on 25L tank",        sub: "Two 5-gallon jerry cans are not optional on 80 nm Lake Michigan days. Ye'll learn this the hard way or the easy way." },
            { title: "Hudson Tides",   detail: "5–6 hr lag vs NYC Battery",    sub: "Troy tide tables, not NYC. Get this wrong and ye'll be bucking the flood all day, ye landlubber." },
            { title: "Hell Gate",      detail: "East River · Option B Day 25", sub: "4–5 kt current. Slack water window is 45 minutes. Miss it and the current will teach ye respect." },
          ].map(({ title, detail, sub }) => (
            <Card key={title} className="treasure-frame">
              <CardContent className="p-4 pt-5">
                <p className="font-[family-name:var(--font-pirata)] text-base text-[hsl(var(--navy))]">{title}</p>
                <p className="text-sm text-[hsl(var(--accent))] font-medium mt-0.5">{detail}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
