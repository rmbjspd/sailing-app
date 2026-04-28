"use client";
import React, { useState } from "react";
import { checklists } from "@/lib/data/checklists";
import { useChecklist } from "@/lib/hooks/useChecklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

const PRIORITY_STYLES: Record<string, React.CSSProperties> = {
  critical:  { background: "hsl(0 65% 92%)",   color: "hsl(0 65% 32%)"   },
  important: { background: "hsl(38 65% 90%)",  color: "hsl(33 60% 30%)"  },
  nice:      { background: "hsl(220 20% 88%)", color: "hsl(220 20% 38%)" },
};

export default function ChecklistsPage() {
  const { isChecked, toggle, resetGroup } = useChecklist();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className="parchment-page">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-[family-name:var(--font-pirata)] text-4xl text-[hsl(var(--navy))] mb-1">
          Provisioning Lists
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] text-sm mb-8 italic">
          Check off as you stow it. State persists in your browser — your progress won&rsquo;t walk the plank.
        </p>

        {/* Group tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveGroup(null)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={
              activeGroup === null
                ? { background: "hsl(var(--navy-mid))", color: "white", boxShadow: "0 2px 8px hsl(var(--navy) / 0.3)" }
                : { background: "hsl(var(--parchment-mid))", color: "hsl(var(--muted-foreground))" }
            }
          >
            All
          </button>
          {checklists.map(g => {
            const total = g.items.length;
            const done = g.items.filter(item => isChecked(item.id)).length;
            const isActive = activeGroup === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id === activeGroup ? null : g.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                style={
                  isActive
                    ? { background: "hsl(var(--navy-mid))", color: "white", boxShadow: "0 2px 8px hsl(var(--navy) / 0.3)" }
                    : { background: "hsl(var(--parchment-mid))", color: "hsl(var(--muted-foreground))" }
                }
              >
                <span>{g.emoji}</span>
                <span>{g.title}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={
                    done === total
                      ? { background: "hsl(148 45% 38%)", color: "white" }
                      : isActive
                      ? { background: "rgba(255,255,255,0.2)", color: "inherit" }
                      : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                  }
                >
                  {done}/{total}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {checklists
            .filter(g => activeGroup === null || g.id === activeGroup)
            .map(group => {
              const total = group.items.length;
              const done = group.items.filter(item => isChecked(item.id)).length;
              const pct = Math.round((done / total) * 100);
              const complete = done === total;

              return (
                <Card key={group.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base flex items-center gap-2 font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))]">
                        <span>{group.emoji}</span>
                        <span>{group.title}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          className="text-xs border-0"
                          style={
                            complete
                              ? { background: "hsl(148 45% 36%)", color: "white" }
                              : { background: "hsl(var(--parchment-mid))", color: "hsl(var(--muted-foreground))" }
                          }
                        >
                          {done}/{total}
                        </Badge>
                        <button
                          onClick={() => resetGroup(group.items.map(i => i.id))}
                          className="transition-colors hover:opacity-70"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                          title="Reset group"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full mt-2" style={{ background: "hsl(var(--muted))" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          background: complete
                            ? "hsl(148 45% 38%)"
                            : "linear-gradient(90deg, hsl(var(--teal)), hsl(var(--gold)))",
                        }}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      {group.items.map(item => {
                        const checked = isChecked(item.id);
                        return (
                          <li
                            key={item.id}
                            onClick={() => toggle(item.id)}
                            className="flex items-start gap-3 py-2.5 cursor-pointer rounded px-1 transition-colors hover:bg-[hsl(var(--page-bg))] group"
                            style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}
                          >
                            {/* Custom checkbox */}
                            <div
                              className="mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all duration-150 border-2"
                              style={{
                                background: checked ? "hsl(var(--teal))" : "transparent",
                                borderColor: checked
                                  ? "hsl(var(--teal))"
                                  : "hsl(var(--border))",
                              }}
                            >
                              {checked && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm leading-snug"
                                style={{
                                  color: checked ? "hsl(var(--muted-foreground))" : "hsl(var(--card-foreground))",
                                  textDecoration: checked ? "line-through" : "none",
                                  opacity: checked ? 0.6 : 1,
                                }}
                              >
                                {item.label}
                              </p>
                              {item.notes && (
                                <p className="text-xs italic mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                                  {item.notes}
                                </p>
                              )}
                            </div>

                            {item.priority && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded shrink-0 font-semibold"
                                style={PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.nice}
                              >
                                {item.priority}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}
