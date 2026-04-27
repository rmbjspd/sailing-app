"use client";
import { useState } from "react";
import { checklists } from "@/lib/data/checklists";
import { useChecklist } from "@/lib/hooks/useChecklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

const PRIORITY_COLORS = {
  critical: "bg-red-100 text-red-700",
  important: "bg-amber-100 text-amber-700",
  nice: "bg-gray-100 text-gray-600",
};

export default function ChecklistsPage() {
  const { isChecked, toggle, resetGroup } = useChecklist();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Checklists</h1>
      <p className="text-gray-500 text-sm mb-6">All items persist in your browser — check off as you pack.</p>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveGroup(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeGroup === null ? "bg-[hsl(213,74%,28%)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {checklists.map(g => {
          const total = g.items.length;
          const done = g.items.filter(item => isChecked(item.id)).length;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id === activeGroup ? null : g.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeGroup === g.id ? "bg-[hsl(213,74%,28%)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{g.emoji}</span>
              <span>{g.title}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${done === total ? "bg-green-500 text-white" : "bg-white/20 text-inherit"}`}>
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

            return (
              <Card key={group.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{group.emoji}</span>
                      <span>{group.title}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={done === total ? "default" : "secondary"} className={done === total ? "bg-green-600" : ""}>
                        {done}/{total}
                      </Badge>
                      <button
                        onClick={() => resetGroup(group.items.map(i => i.id))}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Reset group"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                    <div
                      className="h-full bg-[hsl(213,74%,28%)] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="divide-y divide-gray-50">
                    {group.items.map(item => {
                      const checked = isChecked(item.id);
                      return (
                        <li
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          className="flex items-start gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded px-1 group"
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                            checked ? "bg-[hsl(213,74%,28%)] border-[hsl(213,74%,28%)]" : "border-gray-300 group-hover:border-[hsl(213,74%,28%)]"
                          }`}>
                            {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${checked ? "line-through text-gray-400" : "text-gray-800"}`}>
                              {item.label}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>
                            )}
                          </div>
                          {item.priority && (
                            <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${PRIORITY_COLORS[item.priority]}`}>
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
  );
}
