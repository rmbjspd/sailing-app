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
      <div className="rounded-xl bg-[hsl(var(--navy))] text-white p-8 relative overflow-hidden border-b-4 border-[hsl(var(--gold))]">
        {/* Decorative wave strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
          style={{ background: "repeating-linear-gradient(90deg, hsl(38,72%,43%) 0px, hsl(38,72%,43%) 8px, transparent 8px, transparent 14px)" }}
        />
        <div className="relative z-10">
          <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-2">
            Summer 2027 · 8-Week Sabbatical
          </p>
          <h1 className="font-[family-name:var(--font-pirata)] text-4xl md:text-5xl text-white leading-tight mb-1">
            Chicago → Philadelphia
          </h1>
          <p className="text-white/60 text-base mb-6">
            Great Lakes &middot; Erie Canal &middot; Hudson River &middot; NJ Coast
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
        <h2 className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] mb-3">
          The Route
        </h2>
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
        <h2 className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] mb-3">
          Choose Your Destination
        </h2>
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
              <p className="text-amber-700 font-medium">⚠ Prevailing SW winds = mostly motorsailing south. Inlet timing critical.</p>
              <p>Completes the full inland waterway narrative. Cheesesteak at the finish line.</p>
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
              <p className="text-emerald-700 font-medium">✓ SW sea breezes = beam reaching east. Outstanding sailing. The good stuff.</p>
              <p>~80 nm shorter. Stops: Oyster Bay, Greenport, Mystic, Essex.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key logistics */}
      <section>
        <h2 className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] mb-3">
          Critical Waypoints
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Mast Unstep",    detail: "Tonawanda/Buffalo · Day 15",  sub: "Call Wardell's or Smith Boys in advance to schedule the crane." },
            { title: "Canal Transit",  detail: "34 locks · E-2 through E-35", sub: "20–30 min/lock. Last lock by 4:30pm daily. Waterford Flight: 2:30pm latest." },
            { title: "Mast Re-step",   detail: "Catskill, NY · Day 21",       sub: "Hop-O-Nose Marina on Catskill Creek. Call ahead to reserve crane time." },
            { title: "Fuel Range",     detail: "~12–17 hr on 25L tank",       sub: "Two 5-gallon jerry cans are not optional on 80 nm Lake Michigan days." },
            { title: "Hudson Tides",   detail: "5–6 hr lag vs NYC Battery",   sub: "Check tide times for Troy, NY specifically. Not NYC." },
            { title: "Hell Gate",      detail: "East River · Option B Day 25", sub: "4–5 kt current. Time for slack water — 45-minute window. Non-negotiable." },
          ].map(({ title, detail, sub }) => (
            <Card key={title} className="parchment">
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-sm text-[hsl(var(--primary))] font-medium mt-0.5">{detail}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
