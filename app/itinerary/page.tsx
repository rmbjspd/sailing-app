"use client";
import { useState } from "react";
import { itinerary } from "@/lib/data/itinerary";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Star, Anchor } from "lucide-react";

type RouteOption = "both" | "philly" | "saybrook";

const LEG_LABELS: Record<string, { label: string; color: string }> = {
  "lake-michigan": { label: "Lake Michigan", color: "bg-blue-100 text-blue-800" },
  "lake-huron": { label: "Lake Huron", color: "bg-blue-100 text-blue-800" },
  "lake-erie": { label: "Lake Erie", color: "bg-blue-100 text-blue-800" },
  "erie-canal": { label: "Erie Canal", color: "bg-amber-100 text-amber-800" },
  "hudson": { label: "Hudson River", color: "bg-emerald-100 text-emerald-800" },
  "coast-philly": { label: "NJ Coast", color: "bg-purple-100 text-purple-800" },
  "sound-saybrook": { label: "Long Island Sound", color: "bg-sky-100 text-sky-800" },
};

export default function ItineraryPage() {
  const [route, setRoute] = useState<RouteOption>("saybrook");

  const days = itinerary.filter(d =>
    d.route === "both" || d.route === route
  );

  // Group by leg
  const legGroups: { legId: string; days: typeof itinerary }[] = [];
  days.forEach(day => {
    const last = legGroups[legGroups.length - 1];
    if (last && last.legId === day.leg) {
      last.days.push(day);
    } else {
      legGroups.push({ legId: day.leg, days: [day] });
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Day-by-Day Itinerary</h1>
          <p className="text-gray-500 text-sm mt-1">~29 sailing days · Mid-June 2027 departure</p>
        </div>
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          {([
            { val: "saybrook", label: "⛵ Old Saybrook" },
            { val: "philly", label: "🏛️ Philadelphia" },
          ] as { val: RouteOption; label: string }[]).map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setRoute(val)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                route === val ? "bg-[hsl(213,74%,28%)] text-white shadow-sm" : "text-gray-600 hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {legGroups.map(({ legId, days: legDays }) => {
          const meta = LEG_LABELS[legId] ?? { label: legId, color: "bg-gray-100 text-gray-700" };
          return (
            <section key={legId}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                  {meta.label}
                </span>
                <Separator className="flex-1" />
              </div>
              <div className="space-y-3">
                {legDays.map(day => (
                  <DayCard key={`${day.day}-${day.leg}`} day={day} />
                ))}
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
  const isLayover = day.distanceNm === 0 && day.locks === 0 && day.from === day.to;

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isLayover ? "border-amber-200 bg-amber-50/50" : ""
      }`}
      onClick={() => setOpen(o => !o)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(213,74%,28%)] text-white flex items-center justify-center font-bold text-sm">
            {day.day}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm">
                {day.from === day.to ? `${day.from} (layover)` : `${day.from} → ${day.to}`}
              </p>
              {isLayover && <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">Rest day</Badge>}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
              {day.distanceNm > 0 && <span>📏 {day.distanceNm} nm</span>}
              {day.locks > 0 && <span>⚓ {day.locks} lock{day.locks !== 1 ? "s" : ""}</span>}
              <span className="truncate">🛏️ {day.overnight}</span>
            </div>
          </div>
          <span className="text-gray-400 text-xs shrink-0">{open ? "▲" : "▼"}</span>
        </div>

        {open && (
          <div className="mt-4 space-y-3 text-sm border-t pt-3">
            <p className="text-gray-700">{day.notes}</p>

            {day.highlights.length > 0 && (
              <div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Highlights
                </p>
                <ul className="space-y-1">
                  {day.highlights.map((h, i) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {day.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-medium text-xs text-amber-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Watch out
                </p>
                <ul className="space-y-1">
                  {day.warnings.map((w, i) => (
                    <li key={i} className="text-amber-800 text-sm flex items-start gap-2">
                      <span className="mt-0.5">⚠</span> {w}
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
