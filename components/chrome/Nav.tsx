"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Compass, Map, ScrollText, PackageCheck, Feather, Users } from "lucide-react";
import Mark from "./Mark";

const links = [
  { href: "/",           label: "Voyage",       icon: Compass      },
  { href: "/map",        label: "Chart",        icon: Map          },
  { href: "/itinerary",  label: "Ship's Log",   icon: ScrollText   },
  { href: "/checklists", label: "Provisioning", icon: PackageCheck },
  { href: "/journal",    label: "Journal",      icon: Feather      },
  { href: "/crew",       label: "Crew",         icon: Users        },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

// Floating glass navigation. Desktop: a pill top-centre with the brand at left.
// Mobile: brand chip top-left plus a thumb-reachable dock at the bottom.
export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-4 pt-4 md:px-6">
        <Link
          href="/"
          aria-label="S/V Sabbatical — home"
          className="pointer-events-auto glass flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 transition-colors hover:bg-white/[0.06]"
        >
          <span className="grid size-8 place-items-center rounded-full bg-white/[0.04]">
            <Mark className="size-6" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[15px] tracking-tight text-ink">Sabbatical</span>
            <span className="eyebrow block !text-[9px] !tracking-[0.25em] mt-0.5">Oceanis 30.1</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="pointer-events-auto glass hidden items-center gap-0.5 rounded-full p-1 md:flex">
          {links.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-[13px] font-medium tracking-tight transition-colors ${
                  active ? "text-abyss" : "text-ink-2 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        <span className="hidden w-[148px] md:block" aria-hidden />
      </header>

      {/* Mobile dock */}
      <nav
        aria-label="Primary"
        className="glass-strong fixed inset-x-3 bottom-3 z-50 flex items-stretch justify-between rounded-2xl p-1 md:hidden"
        style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium ${
                active ? "text-ink" : "text-ink-3"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className={`relative size-[18px] ${active ? "text-glow" : ""}`} strokeWidth={1.75} />
              <span className="relative truncate">{label.replace("Provisioning", "Stores")}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
