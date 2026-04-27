import Link from "next/link";
import { Map, CalendarDays, CheckSquare, BookOpen, Anchor, Wind, Clock, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const legs = [
  { label: "Lake Michigan", days: "1–6", nm: "~500 nm", emoji: "🌊", color: "bg-blue-50 border-blue-200" },
  { label: "Lake Huron", days: "7–10", nm: "~300 nm", emoji: "🌊", color: "bg-blue-50 border-blue-200" },
  { label: "Lake Erie", days: "11–15", nm: "~250 nm", emoji: "🌊", color: "bg-blue-50 border-blue-200" },
  { label: "Erie Canal", days: "15–20", nm: "338 mi · 34 locks", emoji: "⚓", color: "bg-amber-50 border-amber-200" },
  { label: "Hudson River", days: "21–24", nm: "~134 nm", emoji: "🌉", color: "bg-emerald-50 border-emerald-200" },
  { label: "NJ Coast / LIS", days: "25–29", nm: "~150–230 nm", emoji: "⛵", color: "bg-sky-50 border-sky-200" },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Hero */}
      <div className="rounded-xl bg-[hsl(213,74%,28%)] text-white p-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-white/60 text-xs font-medium tracking-widest uppercase mb-1">Summer 2027 Sailing Voyage</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Chicago → Philadelphia</h1>
            <p className="text-white/70">Great Lakes · Erie Canal · Hudson River · NJ Coast</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/60 text-xs mb-0.5">Departure</p>
            <p className="text-xl font-semibold">Mid-June 2027</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Navigation, label: "Distance", value: "~1,300 nm" },
            { icon: CalendarDays, label: "Days", value: "~29 sailing" },
            { icon: Anchor, label: "Locks", value: "36 total" },
            { icon: Wind, label: "Boat", value: "Oceanis 30.1" },
            { icon: Clock, label: "Sabbatical", value: "8 weeks" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Icon className="w-4 h-4 text-white/50" />
              <div>
                <p className="text-white/50 text-xs leading-none mb-0.5">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/map", icon: Map, label: "Interactive Map", desc: "Route + all waypoints" },
          { href: "/itinerary", icon: CalendarDays, label: "Itinerary", desc: "Day-by-day plan" },
          { href: "/checklists", icon: CheckSquare, label: "Checklists", desc: "Gear & provisioning" },
          { href: "/journal", icon: BookOpen, label: "Journal", desc: "Trip log entries" },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <Card className="h-full hover:shadow-md transition-all cursor-pointer hover:border-[hsl(213,74%,28%)]">
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[hsl(213,74%,28%)]" />
                </div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Route legs */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Route Overview</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {legs.map((leg) => (
            <div key={leg.label} className={`rounded-lg border p-4 ${leg.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{leg.emoji} {leg.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Days {leg.days}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{leg.nm}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination options */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Destination Options</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                🏛️ Option A — Philadelphia, PA
                <Badge variant="secondary" className="text-xs">~230 nm post-NYC</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1.5">
              <p>NJ offshore coast → Delaware Bay → Delaware River</p>
              <p className="text-amber-700 font-medium">⚠ Prevailing SW winds = mostly motorsailing south. Less sailing.</p>
              <p>Completes the full inland waterway narrative.</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[hsl(213,74%,28%)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                ⛵ Option B — Old Saybrook, CT
                <Badge className="bg-[hsl(213,74%,28%)] text-white text-xs">Recommended</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1.5">
              <p>East River → Long Island Sound → Connecticut coast</p>
              <p className="text-emerald-700 font-medium">✓ SW sea breezes = beam reaching east. Outstanding sailing.</p>
              <p>~80 nm shorter. Stops: Oyster Bay, Greenport, Mystic.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key logistics */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Key Logistics</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Mast Unstep", detail: "Tonawanda/Buffalo · Day 15", sub: "Schedule crane at Wardell's or Smith Boys in advance" },
            { title: "Mast Re-step", detail: "Catskill, NY · Day 21", sub: "Hop-O-Nose Marina, Catskill Creek — call ahead" },
            { title: "Canal Locks", detail: "34 locks, E-2 through E-35", sub: "~20–30 min each. Operate 7am–5pm (to 10pm on demand)" },
            { title: "Fuel Range", detail: "~12–17 hr on 25L tank", sub: "Carry 2× 5-gal jerry cans for 80 nm lake days" },
            { title: "Hudson Tides", detail: "Tidal to Troy · 5–6 hr lag", sub: "Check Troy tide times specifically, not NYC Battery" },
            { title: "Hell Gate (Option B)", detail: "East River, Day 25", sub: "Time for slack — currents reach 4–5 knots at Hell Gate" },
          ].map(({ title, detail, sub }) => (
            <Card key={title}>
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-sm text-[hsl(213,74%,28%)] font-medium mt-0.5">{detail}</p>
                <p className="text-xs text-gray-500 mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
