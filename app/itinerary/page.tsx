"use client";
import { useState } from "react";
import { itinerary } from "@/lib/data/itinerary";
import { legGroupsForRoute, formatLegDistance } from "@/lib/data/stats";
import { legGuides } from "@/lib/data/legGuides";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Star, ChevronDown, ChevronUp, BookOpen, Anchor } from "lucide-react";

type RouteOption = "saybrook" | "philly";

const LEG_META: Record<string, { label: string; accent: string; bg: string; text: string }> = {
  "lake-michigan":  { label: "Lake Michigan",              accent: "hsl(210 62% 40%)", bg: "hsl(210 55% 90%)", text: "hsl(210 62% 22%)" },
  "north-channel":  { label: "North Channel · Manitoulin", accent: "hsl(165 52% 36%)", bg: "hsl(165 38% 90%)", text: "hsl(165 52% 18%)" },
  "lake-erie":      { label: "Lake Erie",                  accent: "hsl(205 60% 40%)", bg: "hsl(205 50% 90%)", text: "hsl(205 60% 22%)" },
  "erie-canal":     { label: "Erie Canal",                 accent: "hsl(42 72% 42%)",  bg: "hsl(42 60% 91%)",  text: "hsl(33 58% 24%)"  },
  "hudson":         { label: "Hudson River",               accent: "hsl(148 45% 34%)", bg: "hsl(148 35% 90%)", text: "hsl(148 45% 18%)" },
  "coast-philly":   { label: "NJ Offshore Coast",          accent: "hsl(270 40% 45%)", bg: "hsl(270 30% 91%)", text: "hsl(270 40% 22%)" },
  "sound-saybrook": { label: "Long Island Sound",          accent: "hsl(200 65% 40%)", bg: "hsl(200 50% 90%)", text: "hsl(200 65% 22%)" },
};

export default function ItineraryPage() {
  const [route, setRoute] = useState<RouteOption>("saybrook");
  const [openGuides, setOpenGuides] = useState<Set<string>>(new Set());

  const legGroups = legGroupsForRoute(route);

  const toggleGuide = (legId: string) => {
    setOpenGuides(prev => {
      const next = new Set(prev);
      next.has(legId) ? next.delete(legId) : next.add(legId);
      return next;
    });
  };

  return (
    <div className="parchment-page">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-pirata)] text-4xl text-[hsl(var(--navy))]">
              Ship&rsquo;s Log
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 italic">
              ~34 sailing days &middot; Departure mid-June 2027
            </p>
          </div>

          {/* Route toggle */}
          <div
            className="flex gap-1.5 rounded-lg p-1.5"
            style={{
              background: "hsl(var(--parchment-mid))",
              border: "1.5px solid hsl(var(--border))",
            }}
          >
            {([
              { val: "saybrook", label: "⛵ Old Saybrook" },
              { val: "philly",   label: "🏛️ Philadelphia" },
            ] as { val: RouteOption; label: string }[]).map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setRoute(val)}
                className="px-4 py-1.5 rounded text-sm font-semibold transition-all duration-200"
                style={
                  route === val
                    ? {
                        background: "hsl(var(--teal))",
                        color: "white",
                        boxShadow: "0 2px 6px hsl(var(--teal) / 0.35)",
                      }
                    : {
                        color: "hsl(var(--muted-foreground))",
                      }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {legGroups.map((leg) => {
            const { legId, days: legDays, dayStart, dayEnd, locks } = leg;
            const meta = LEG_META[legId] ?? {
              label: legId,
              accent: "hsl(var(--teal))",
              bg: "hsl(var(--parchment-mid))",
              text: "hsl(var(--navy))",
            };
            const guide = legGuides.find(g => g.legId === legId);
            const guideOpen = openGuides.has(legId);

            return (
              <section key={legId}>
                {/* Leg header */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0 tracking-wide"
                    style={{
                      background: meta.bg,
                      color: meta.text,
                      border: `1.5px solid ${meta.accent}55`,
                    }}
                  >
                    {meta.label}
                  </span>
                  <div className="flex-1 rope-divider" />
                  <span className="text-base shrink-0" style={{ opacity: 0.4 }}>☠</span>
                  <div className="flex-1 rope-divider" />
                </div>

                {/* Derived leg stats — computed from the itinerary, never hardcoded */}
                <p className="text-xs text-[hsl(var(--muted-foreground))] -mt-3 mb-5 italic">
                  Days {dayStart}&ndash;{dayEnd} · {formatLegDistance(leg)}
                  {locks > 0 && ` · ${locks} lock${locks !== 1 ? "s" : ""}`}
                </p>

                {/* Captain's Briefing */}
                {guide && (
                  <div className="mb-5">
                    <button
                      onClick={() => toggleGuide(legId)}
                      className="w-full text-left captain-callout rounded-lg px-4 py-3.5 flex items-start gap-3 transition-opacity hover:opacity-90"
                    >
                      <BookOpen className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(var(--gold))" }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: "hsl(38 55% 32%)" }}>
                          🦜 Captain&rsquo;s Briefing: {guide.title}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 truncate italic">
                          {guide.subtitle}
                        </p>
                      </div>
                      {guideOpen
                        ? <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                        : <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                      }
                    </button>

                    {guideOpen && (
                      <div
                        className="rounded-b-lg px-5 py-5 space-y-5 -mt-1"
                        style={{
                          background: "hsl(42 55% 92%)",
                          border: "1px solid hsl(42 45% 78%)",
                          borderTop: "none",
                        }}
                      >
                        <div>
                          {guide.captainIntro.split("\n\n").map((para, i) => (
                            <p key={i} className="text-sm text-[hsl(var(--card-foreground))] leading-relaxed mb-3 last:mb-0 italic">
                              {para}
                            </p>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "hsl(var(--teal))" }}>
                              <Star className="w-3 h-3" /> Sailing Tips
                            </p>
                            <ul className="space-y-2">
                              {guide.sailingTips.map((tip, i) => (
                                <li key={i} className="text-sm text-[hsl(var(--card-foreground))] flex items-start gap-2">
                                  <span className="mt-0.5 shrink-0" style={{ color: "hsl(var(--teal))" }}>→</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "hsl(var(--coral))" }}>
                              <AlertTriangle className="w-3 h-3" /> Watch For
                            </p>
                            <ul className="space-y-2">
                              {guide.watchFor.map((w, i) => (
                                <li key={i} className="text-sm text-[hsl(var(--card-foreground))] flex items-start gap-2">
                                  <span className="mt-0.5 shrink-0" style={{ color: "hsl(var(--coral))" }}>⚠</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "hsl(var(--kelp))" }}>
                            <Anchor className="w-3 h-3" /> Best Stops
                          </p>
                          <ul className="space-y-1.5">
                            {guide.bestStops.map((stop, i) => (
                              <li key={i} className="text-sm text-[hsl(var(--card-foreground))] flex items-start gap-2">
                                <span className="mt-0.5 shrink-0" style={{ color: "hsl(var(--kelp))" }}>⚓</span>
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
                  {legDays.map(day => <DayCard key={`${day.day}-${day.leg}`} day={day} accentColor={meta.accent} />)}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, accentColor }: { day: (typeof itinerary)[0]; accentColor: string }) {
  const [open, setOpen] = useState(false);
  const isLayover = day.distanceNm === 0 && day.from === day.to;
  const isArrival = day.notes.toLowerCase().includes("arrival");

  const badgeBg = isArrival
    ? "hsl(var(--coral))"
    : isLayover
    ? "hsl(42 65% 80%)"
    : accentColor;

  const badgeText = isArrival ? "white" : isLayover ? "hsl(38 50% 28%)" : "white";

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isArrival ? "shadow-sm" : ""
      }`}
      style={
        isArrival
          ? { borderColor: "hsl(var(--coral))", borderWidth: "2px" }
          : isLayover
          ? { borderColor: "hsl(42 55% 72%)" }
          : undefined
      }
      onClick={() => setOpen(o => !o)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Day badge */}
          <div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: badgeBg, color: badgeText }}
          >
            {isArrival ? "🏴‍☠️" : day.day}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm text-[hsl(var(--card-foreground))]">
                {day.from === day.to ? day.from : `${day.from} → ${day.to}`}
              </p>
              {isArrival && (
                <Badge className="text-xs border-0" style={{ background: "hsl(var(--coral))", color: "white" }}>
                  Land Ho! ⚓
                </Badge>
              )}
              {isLayover && !isArrival && (
                <Badge variant="outline" className="text-xs" style={{ borderColor: "hsl(42 55% 62%)", color: "hsl(38 50% 30%)" }}>
                  Drop Anchor
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[hsl(var(--muted-foreground))] flex-wrap">
              {day.distanceNm > 0 && <span>📏 {day.distanceNm} nm</span>}
              {!!day.distanceMi && day.distanceMi > 0 && <span>📏 {day.distanceMi} mi</span>}
              {day.locks > 0 && <span>⚓ {day.locks} lock{day.locks !== 1 ? "s" : ""}</span>}
              <span className="truncate italic">🛏 {day.overnight}</span>
            </div>
          </div>

          {open
            ? <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-1" />
            : <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-1" />
          }
        </div>

        {open && (
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] space-y-4 text-sm">
            <p className="text-[hsl(var(--card-foreground))] leading-relaxed italic">{day.notes}</p>

            {day.highlights.length > 0 && (
              <div>
                <p className="font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "hsl(var(--teal))" }}>
                  <Star className="w-3 h-3" /> Fair Winds
                </p>
                <ul className="space-y-1">
                  {day.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-[hsl(var(--card-foreground))]">
                      <span style={{ color: "hsl(var(--kelp))" }} className="mt-0.5">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {day.warnings.length > 0 && (
              <div
                className="rounded-lg p-3"
                style={{ background: "hsl(16 55% 93%)", border: "1px solid hsl(16 50% 74%)" }}
              >
                <p className="font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "hsl(var(--coral))" }}>
                  <AlertTriangle className="w-3 h-3" /> Avast!
                </p>
                <ul className="space-y-1">
                  {day.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ color: "hsl(16 55% 28%)" }}>
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
