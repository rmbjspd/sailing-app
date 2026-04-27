"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor, Map, CalendarDays, BookOpen, CheckSquare } from "lucide-react";

const links = [
  { href: "/", label: "Overview", icon: Anchor },
  { href: "/map", label: "Map", icon: Map },
  { href: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { href: "/checklists", label: "Checklists", icon: CheckSquare },
  { href: "/journal", label: "Journal", icon: BookOpen },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="bg-[hsl(var(--primary))] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm shrink-0">
          <Anchor className="w-5 h-5 text-[hsl(var(--accent))]" />
          <span className="hidden sm:block">Chicago → Philadelphia</span>
          <span className="sm:hidden">Sailing 2027</span>
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
                    ? "bg-white/20 text-white font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
