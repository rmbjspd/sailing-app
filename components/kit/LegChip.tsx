import { legStyle } from "@/lib/data/legStyle";

// Small coloured pill identifying a leg — the dot glows in the leg's colour.
export function LegChip({ legId, size = "md", showNumeral = false }: { legId: string; size?: "sm" | "md"; showNumeral?: boolean }) {
  const s = legStyle(legId);
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-medium tracking-tight ${
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
      style={{ background: s.bg, borderColor: s.border, color: s.color }}
    >
      <span className="size-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
      {showNumeral && <span className="num opacity-70">{s.numeral}</span>}
      {s.label}
    </span>
  );
}
