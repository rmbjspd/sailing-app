"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, CalendarDays, BookOpen, CheckSquare, Compass } from "lucide-react";

const links = [
  { href: "/", label: "Chart Room", icon: Compass },
  { href: "/map", label: "Navigation Charts", icon: Map },
  { href: "/itinerary", label: "Ship's Log", icon: CalendarDays },
  { href: "/checklists", label: "Provisioning", icon: CheckSquare },
  { href: "/journal", label: "Captain's Log", icon: BookOpen },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="bg-[hsl(var(--navy))] text-white shadow-lg border-b-2 border-[hsl(var(--gold))]">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-[hsl(var(--gold))] text-xl leading-none">⚓</span>
          <span className="font-[family-name:var(--font-pirata)] text-xl text-white tracking-wide hidden sm:block">
            S/V Sabbatical
          </span>
          <span className="font-[family-name:var(--font-pirata)] text-xl text-white tracking-wide sm:hidden">
            SV Sabbatical
          </span>
        </Link>
        <nav className="flex items-center gap-1 ml-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
                  active
                    ? "bg-[hsl(var(--gold))/20] text-[hsl(var(--gold))] font-medium border border-[hsl(var(--gold))/40]"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
