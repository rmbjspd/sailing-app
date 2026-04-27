"use client";
import { useState } from "react";
import { itinerary } from "@/lib/data/itinerary";
import { legGuides } from "@/lib/data/legGuides";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Star, ChevronDown, ChevronUp, BookOpen, Anchor } from "lucide-react";

type RouteOption = "saybrook" | "philly";

const LEG_META: Record<string, { label: string; pill: string }> = {
  "lake-michigan":  { label: "Lake Michigan",        pill: "bg-blue-100 text-blue-800 border-blue-200" },
  "lake-huron":     { label: "Lake Huron",            pill: "bg-blue-100 text-blue-800 border-blue-200" },
  "lake-erie":      { label: "Lake Erie",             pill: "bg-blue-100 text-blue-800 border-blue-200" },
  "erie-canal":     { label: "Erie Canal",            pill: "bg-amber-100 text-amber-800 border-amber-200" },
  "hudson":         { label: "Hudson River",          pill: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "coast-philly":   { label: "NJ Offshore Coast",     pill: "bg-purple-100 text-purple-800 border-purple-200" },
  "sound-saybrook": { label: "Long Island Sound",     pill: "bg-sky-100 text-sky-800 border-sky-200" },
};

export default function ItineraryPage() {
  const [route, setRoute] = useState<RouteOption>("saybrook");
  const [openGuides, setOpenGuides] = useState<Set<string>>(new Set());

  const days = itinerary.filter(d => d.route === "both" || d.route === route);

  const legGroups: { legId: string; days: typeof itinerary }[] = [];
  days.forEach(day => {
    const last = legGroups[legGroups.length - 1];
    if (last && last.legId === day.leg) last.days.push(day);
    else legGroups.push({ legId: day.leg, days: [day] });
  });

  const toggleGuide = (legId: string) => {
    setOpenGuides(prev => {
      const next = new Set(prev);
      next.has(legId) ? next.delete(legId) : next.add(legId);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-pirata)] text-3xl text-[hsl(var(--navy))]">
            Ship&rsquo;s Log
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
            ~29 sailing days &middot; Departure mid-June 2027
          </p>
        </div>
        <div className="flex gap-2 bg-[hsl(var(--secondary))] rounded-lg p-1 border border-[hsl(var(--border))]">
          {([
            { val: "saybrook", label: "⛵ Old Saybrook" },
            { val: "philly",   label: "🏛️ Philadelphia" },
          ] as { val: RouteOption; label: string }[]).map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setRoute(val)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                route === val
                  ? "bg-[hsl(var(--primary))] text-white shadow-sm"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {legGroups.map(({ legId, days: legDays }) => {
          const meta = LEG_META[legId] ?? { label: legId, pill: "bg-gray-100 text-gray-700" };
          const guide = legGuides.find(g => g.legId === legId);
          const guideOpen = openGuides.has(legId);

          return (
            <section key={legId}>
              {/* Leg header */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.pill}`}>
                  {meta.label}
                </span>
                <div className="flex-1 rope-divider" />
                <span className="text-sm shrink-0" style={{ opacity: 0.45 }}>☠</span>
                <div className="flex-1 rope-divider" />
              </div>

              {/* Captain Bob guide toggle */}
              {guide && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleGuide(legId)}
                    className="w-full text-left captain-callout rounded-lg px-4 py-3 flex items-start gap-3 hover:bg-amber-50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-[hsl(var(--accent))] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[hsl(var(--accent))]">
                        🦜 Captain&rsquo;s Briefing: {guide.title}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 truncate">
                        {guide.subtitle}
                      </p>
                    </div>
                    {guideOpen
                      ? <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                      : <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                    }
                  </button>

                  {guideOpen && (
                    <div className="border border-amber-200 rounded-b-lg bg-amber-50/60 px-4 py-5 space-y-5 -mt-1">
                      {/* Narrative */}
                      <div>
                        {guide.captainIntro.split("\n\n").map((para, i) => (
                          <p key={i} className="text-sm text-[hsl(var(--foreground))] leading-relaxed mb-3 last:mb-0">
                            {para}
                          </p>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Sailing tips */}
                        <div>
                          <p className="text-xs font-semibold text-[hsl(var(--accent))] uppercase tracking-wide mb-2 flex items-center gap-1">
                            <Star className="w-3 h-3" /> Sailing Tips
                          </p>
                          <ul className="space-y-2">
                            {guide.sailingTips.map((tip, i) => (
                              <li key={i} className="text-sm text-[hsl(var(--foreground))] flex items-start gap-2">
                                <span className="text-[hsl(var(--accent))] mt-1 shrink-0">→</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Watch for */}
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Watch For
                          </p>
                          <ul className="space-y-2">
                            {guide.watchFor.map((w, i) => (
                              <li key={i} className="text-sm text-[hsl(var(--foreground))] flex items-start gap-2">
                                <span className="text-amber-600 mt-1 shrink-0">⚠</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Best stops */}
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <Anchor className="w-3 h-3" /> Best Stops
                        </p>
                        <ul className="space-y-2">
                          {guide.bestStops.map((stop, i) => (
                            <li key={i} className="text-sm text-[hsl(var(--foreground))] flex items-start gap-2">
                              <span className="text-emerald-600 mt-0.5 shrink-0">⚓</span>
                              <span>{stop}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Day cards */}
              <div className="space-y-2">
                {legDays.map(day => <DayCard key={`${day.day}-${day.leg}`} day={day} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function DayCard({ day }: { day: (typeof itinerary)[0] }) {
  const [open, setOpen] = useState(false);
  const isLayover = day.distanceNm === 0 && day.from === day.to;
  const isArrival = day.notes.toLowerCase().includes("arrival");

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isArrival ? "border-[hsl(var(--accent))] bg-amber-50/40" :
        isLayover ? "border-amber-200 bg-amber-50/30" : "hover:border-[hsl(var(--primary))/40]"
      }`}
      onClick={() => setOpen(o => !o)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            isArrival ? "bg-[hsl(var(--accent))] text-white" :
            isLayover ? "bg-amber-100 text-amber-700 border-2 border-amber-300" :
            "bg-[hsl(var(--primary))] text-white"
          }`}>
            {isArrival ? "🏴‍☠️" : day.day}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm">
                {day.from === day.to ? day.from : `${day.from} → ${day.to}`}
              </p>
              {isArrival && (
                <Badge className="bg-[hsl(var(--accent))] text-white text-xs border-0">
                  Land Ho! ⚓
                </Badge>
              )}
              {isLayover && !isArrival && (
                <Badge variant="outline" className="border-amber-300 text-amber-700 text-xs">
                  Drop Anchor
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[hsl(var(--muted-foreground))] flex-wrap">
              {day.distanceNm > 0 && <span>📏 {day.distanceNm} nm</span>}
              {day.locks > 0 && <span>⚓ {day.locks} lock{day.locks !== 1 ? "s" : ""}</span>}
              <span className="truncate">🛏 {day.overnight}</span>
            </div>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-1" />
            : <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-1" />
          }
        </div>

        {open && (
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] space-y-4 text-sm">
            <p className="text-[hsl(var(--foreground))] leading-relaxed">{day.notes}</p>

            {day.highlights.length > 0 && (
              <div>
                <p className="font-semibold text-xs text-[hsl(var(--accent))] uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Fair Winds
                </p>
                <ul className="space-y-1">
                  {day.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-[hsl(var(--foreground))]">
                      <span className="text-emerald-500 mt-0.5">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {day.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold text-xs text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Avast!
                </p>
                <ul className="space-y-1">
                  {day.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-800">
                      <span className="mt-0.5 shrink-0">⚠</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
