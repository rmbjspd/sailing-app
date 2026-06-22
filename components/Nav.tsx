"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, CalendarDays, BookOpen, CheckSquare, Compass } from "lucide-react";

const links = [
  { href: "/",           label: "Chart Room",   icon: Compass     },
  { href: "/map",        label: "Nav Charts",   icon: Map         },
  { href: "/itinerary",  label: "Ship's Log",   icon: CalendarDays},
  { href: "/checklists", label: "Provisioning", icon: CheckSquare },
  { href: "/journal",    label: "Captain's Log",icon: BookOpen    },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header
      className="relative z-50"
      style={{
        background: "linear-gradient(180deg, hsl(220 62% 5%) 0%, hsl(220 55% 8%) 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.75), 0 1px 0 hsl(42 60% 22%)",
      }}
    >
      {/* Burnished gold rope border */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(42 70% 32%) 5%, hsl(42 88% 52%) 30%, hsl(38 82% 60%) 50%, hsl(42 88% 52%) 70%, hsl(42 70% 32%) 95%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <span
            className="text-[1.6rem] leading-none inline-block transition-transform duration-300 group-hover:scale-110"
            style={{
              color: "hsl(42 88% 55%)",
              filter: "drop-shadow(0 0 10px hsl(42 80% 48% / 0.6))",
            }}
          >
            ⚓
          </span>
          <div className="hidden sm:block">
            <div
              className="font-[family-name:var(--font-pirata)] text-[1.3rem] leading-tight tracking-wide"
              style={{
                color: "hsl(42 82% 62%)",
                textShadow: "0 0 24px hsl(42 80% 44% / 0.35), 0 2px 6px rgba(0,0,0,0.55)",
              }}
            >
              S/V Sabbatical
            </div>
            <div
              className="text-[0.6rem] tracking-[0.18em] uppercase"
              style={{ color: "hsl(42 30% 45%)", fontFamily: "var(--font-typewriter)" }}
            >
              Chicago → Old Saybrook · 2027
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-0.5 ml-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-sm rounded transition-all duration-200 ${
                  active ? "font-semibold" : "hover:bg-white/[0.06]"
                }`}
                style={
                  active
                    ? {
                        color: "hsl(42 88% 64%)",
                        background: "hsl(42 80% 50% / 0.13)",
                        boxShadow: "inset 0 -2px 0 hsl(42 88% 52%)",
                      }
                    : { color: "hsl(38 20% 55%)" }
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
