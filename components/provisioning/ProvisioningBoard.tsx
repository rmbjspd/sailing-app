"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { EyeOff, Undo2, X } from "lucide-react";
import { PageHero } from "@/components/kit";
import { checklists } from "@/lib/data/checklists";
import { useChecklist } from "@/lib/hooks/useChecklist";
import type { ChecklistItem } from "@/lib/types";
import { CRITICAL_ITEMS, TOTAL_ITEMS, categoryMeta, type Priority } from "./categories";
import { CategoryPanel } from "./CategoryPanel";
import { MiniRing } from "./MiniRing";
import { ReadinessGauge } from "./ReadinessGauge";
import css from "./provisioning.module.css";

type PriorityFilter = "all" | Priority;

const PRIORITY_FILTERS: { id: PriorityFilter; label: string; short: string }[] = [
  { id: "all", label: "All", short: "All" },
  { id: "critical", label: "Critical", short: "Critical" },
  { id: "important", label: "Important", short: "Important" },
  { id: "nice", label: "Nice to have", short: "Nice" },
];

interface UndoState {
  groupId: string;
  title: string;
  snapshot: Record<string, boolean>;
  count: number;
  n: number;
}

export function ProvisioningBoard() {
  const { isChecked, toggle, resetGroup, restore, ready } = useChecklist();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [hideStowed, setHideStowed] = useState(false);
  const [undo, setUndo] = useState<UndoState | null>(null);
  const [celebrate, setCelebrate] = useState<{ id: string; n: number } | null>(null);
  const [announce, setAnnounce] = useState("");
  const listTop = useRef<HTMLDivElement>(null);

  const scrollToList = useCallback(() => {
    const el = listTop.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: reduce ? 0 : 1.1 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  // When a filter changes while the reader is deep in the list, bring the top
  // of the list back into view so the change is visible (and the page never
  // ends up scrolled past its new, shorter end).
  const refilter = (fn: () => void) => {
    fn();
    const el = listTop.current;
    if (el && el.getBoundingClientRect().top < 0) scrollToList();
  };

  const onToggle = useCallback((groupId: string, item: ChecklistItem) => {
    const group = checklists.find(g => g.id === groupId)!;
    const wasChecked = isChecked(item.id);
    const doneBefore = group.items.filter(i => isChecked(i.id)).length;
    toggle(item.id);
    if (!wasChecked && doneBefore === group.items.length - 1) {
      setCelebrate({ id: groupId, n: Date.now() });
      setAnnounce(`${group.title}: everything stowed.`);
    }
  }, [isChecked, toggle]);

  const onReset = useCallback((groupId: string) => {
    const group = checklists.find(g => g.id === groupId)!;
    const snapshot: Record<string, boolean> = {};
    let count = 0;
    group.items.forEach(i => {
      snapshot[i.id] = isChecked(i.id);
      if (snapshot[i.id]) count++;
    });
    resetGroup(group.items.map(i => i.id));
    setUndo({ groupId, title: group.title, snapshot, count, n: Date.now() });
    setAnnounce(`${group.title} reset. ${count} items unchecked. Undo available.`);
  }, [isChecked, resetGroup]);

  const doUndo = useCallback(() => {
    if (!undo) return;
    restore(undo.snapshot);
    setAnnounce(`${undo.title} restored.`);
    setUndo(null);
  }, [undo, restore]);

  // Auto-dismiss the undo toast; ⌘/Ctrl+Z also undoes while it is showing.
  useEffect(() => {
    if (!undo) return;
    const t = window.setTimeout(() => setUndo(null), 9000);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" && (e.target as HTMLInputElement).type !== "checkbox") return;
        if (tag === "TEXTAREA") return;
        e.preventDefault();
        doUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [undo, doUndo]);

  useEffect(() => {
    if (!celebrate) return;
    const t = window.setTimeout(() => setCelebrate(null), 1600);
    return () => window.clearTimeout(t);
  }, [celebrate]);

  const groups = active ? checklists.filter(g => g.id === active) : checklists;

  const visibleByGroup = useMemo(() => {
    const out: Record<string, ChecklistItem[]> = {};
    for (const g of checklists) {
      out[g.id] = g.items.filter(i =>
        (priority === "all" || i.priority === priority) &&
        (!hideStowed || !ready || !isChecked(i.id)),
      );
    }
    return out;
  }, [priority, hideStowed, ready, isChecked]);

  // Panels that have no items at this priority at all are dropped entirely.
  const shownGroups = groups.filter(g => priority === "all" || g.items.some(i => i.priority === priority));
  const shownCount = shownGroups.reduce((n, g) => n + visibleByGroup[g.id].length, 0);

  const priorityLeft = (p: PriorityFilter) =>
    (p === "all" ? checklists.flatMap(g => g.items) : checklists.flatMap(g => g.items).filter(i => i.priority === p))
      .filter(i => !isChecked(i.id)).length;

  const showCritical = () => {
    setActive(null);
    setPriority("critical");
    setHideStowed(true);
    scrollToList();
  };

  const emptyMessage = (title: string) =>
    priority === "all"
      ? `Everything in ${title} is stowed.`
      : `Every ${priority === "nice" ? "nice-to-have" : priority} item in ${title} is stowed.`;

  return (
    <div className="pb-32 md:pb-24">
      <PageHero
        eyebrow={<span className="num">Provisioning · {TOTAL_ITEMS} items · {checklists.length} lockers</span>}
        title={<>Ready to cast <em className="text-glow">off?</em></>}
        lede={
          <>
            Everything that needs to be aboard before the dock lines come in at DuSable Harbor.
            Tick each item as it&rsquo;s stowed &mdash; progress is kept on this device. The{" "}
            <span className="num text-alert">{CRITICAL_ITEMS.length}</span> critical items are the ones that decide the departure date.
          </>
        }
        aside={<ReadinessGauge isChecked={isChecked} ready={ready} onShowCritical={showCritical} />}
      />

      <div ref={listTop} className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-10">
          {/* ── Rail + filters ─────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-4" data-lenis-prevent>
            <nav aria-label="Lockers" className="-mx-4 md:-mx-8 lg:mx-0">
              <p className="eyebrow mb-3 hidden lg:block">Lockers</p>
              <LayoutGroup id="rail">
                <ul
                  className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-3 [mask-image:linear-gradient(90deg,transparent,black_16px,black_calc(100%-24px),transparent)] md:px-8 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0 lg:[mask-image:none]"
                  data-lenis-prevent
                >
                  <RailButton
                    active={active === null}
                    onClick={() => refilter(() => setActive(null))}
                    label="All lockers"
                    sub={ready ? `${TOTAL_ITEMS - priorityLeft("all")}/${TOTAL_ITEMS}` : "—"}
                    ring={<MiniRing frac={ready ? (TOTAL_ITEMS - priorityLeft("all")) / TOTAL_ITEMS : 0} color="var(--glow)" ready={ready} />}
                  />
                  {checklists.map(g => {
                    const meta = categoryMeta(g);
                    const done = g.items.filter(i => isChecked(i.id)).length;
                    return (
                      <RailButton
                        key={g.id}
                        active={active === g.id}
                        onClick={() => refilter(() => setActive(active === g.id ? null : g.id))}
                        label={meta.short}
                        fullLabel={g.title}
                        sub={ready ? `${done}/${g.items.length}` : "—"}
                        ring={<MiniRing frac={done / g.items.length} color={meta.color} ready={ready} />}
                      />
                    );
                  })}
                </ul>
              </LayoutGroup>
            </nav>

            <div className="mt-4 flex flex-wrap items-center gap-3 lg:mt-7 lg:block lg:space-y-4">
              <div className="min-w-0 max-w-full">
                <p className="eyebrow mb-3 hidden lg:block">Priority</p>
                <div
                  role="radiogroup"
                  aria-label="Filter by priority"
                  className="glass inline-flex max-w-full overflow-x-auto rounded-full p-1 lg:flex lg:w-full lg:flex-col lg:rounded-2xl lg:overflow-visible"
                >
                  <LayoutGroup id="prio">
                    {PRIORITY_FILTERS.map(f => {
                      const on = priority === f.id;
                      const left = ready ? priorityLeft(f.id) : null;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => refilter(() => setPriority(f.id))}
                          className={`relative flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-full px-3.5 text-[13px] sm:px-4 font-medium transition-colors lg:rounded-xl lg:px-3.5 ${
                            on ? "text-ink" : "text-ink-3 hover:text-ink-2"
                          }`}
                        >
                          {on && (
                            <motion.span
                              layoutId="prio-pill"
                              className={`${css.pill} absolute inset-0 rounded-full lg:rounded-xl`}
                              transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                          )}
                          <span className="relative flex items-center gap-2 whitespace-nowrap">
                            {f.id !== "all" && (
                              <span className={`size-[6px] rounded-full ${
                                f.id === "critical" ? "bg-alert" : f.id === "important" ? "bg-brass" : "border border-ink-3"
                              }`} />
                            )}
                            <span className="sm:hidden" aria-hidden>{f.short}</span>
                            <span className="max-sm:sr-only">{f.label}</span>
                          </span>
                          <span className={`num relative hidden text-[11px] lg:inline ${f.id === "critical" && left ? "text-alert" : "text-ink-4"}`}>
                            {left === null ? "" : `${left} left`}
                          </span>
                        </button>
                      );
                    })}
                  </LayoutGroup>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={hideStowed}
                onClick={() => refilter(() => setHideStowed(h => !h))}
                className="glass flex min-h-11 items-center gap-3 rounded-full py-1 pl-4 pr-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-ink lg:w-full lg:justify-between lg:rounded-2xl"
              >
                <span className="flex items-center gap-2">
                  <EyeOff className="size-4 text-ink-3" strokeWidth={1.75} />
                  Hide stowed
                </span>
                <span
                  className={`relative inline-flex h-6 w-10 items-center rounded-full border transition-colors duration-300 ${
                    hideStowed ? "border-glow/50 bg-glow/25" : "border-line-strong bg-tint/[0.05]"
                  }`}
                >
                  <motion.span
                    className={`absolute size-[18px] rounded-full ${hideStowed ? `bg-glow ${css.knobOn}` : "bg-ink-3"}`}
                    initial={false}
                    animate={{ x: hideStowed ? 19 : 2 }}
                    transition={{ type: "spring", stiffness: 520, damping: 32 }}
                  />
                </span>
              </button>

              <p className="num text-xs text-ink-3 lg:px-1" aria-live="polite">
                {shownCount} {shownCount === 1 ? "item" : "items"} shown
              </p>
            </div>
          </aside>

          {/* ── Lockers ───────────────────────────────────────────────── */}
          <div className="mt-8 space-y-6 lg:mt-0">
            {shownGroups.map(g => (
              <CategoryPanel
                key={g.id}
                group={g}
                index={checklists.indexOf(g)}
                visibleItems={visibleByGroup[g.id]}
                isChecked={isChecked}
                ready={ready}
                onToggle={item => onToggle(g.id, item)}
                onReset={() => onReset(g.id)}
                celebrate={celebrate?.id === g.id ? celebrate.n : null}
                emptyMessage={emptyMessage(g.title)}
              />
            ))}
            {shownGroups.length === 0 && (
              <p className="glass rounded-[26px] px-7 py-10 text-center text-ink-3">
                Nothing in this locker at that priority.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Undo toast */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
        <AnimatePresence>
          {undo && (
            <motion.div
              key={undo.n}
              role="status"
              className="glass-strong pointer-events-auto relative flex w-full max-w-lg items-center gap-2 overflow-hidden rounded-2xl py-2 pl-5 pr-2"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              <p className="min-w-0 flex-1 text-sm leading-snug text-ink-2">
                <span className="text-ink">{undo.title}</span> reset
                <span className="num block text-ink-3 sm:inline"><span className="hidden sm:inline"> · </span>{undo.count} unchecked</span>
              </p>
              <button
                type="button"
                onClick={doUndo}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-glow transition-colors hover:bg-glow/10"
              >
                <Undo2 className="size-4" strokeWidth={1.75} />
                Undo
                <kbd className="num hidden rounded border border-line-strong px-1 text-[10px] text-ink-3 sm:inline">
                  {/* Toast only renders after a click, so navigator is available. */}
                  {/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘Z" : "Ctrl Z"}
                </kbd>
              </button>
              <button
                type="button"
                onClick={() => setUndo(null)}
                aria-label="Dismiss"
                className="grid size-11 place-items-center rounded-xl text-ink-3 transition-colors hover:bg-tint/[0.06] hover:text-ink"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] bg-glow/60"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 9, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}

function RailButton({
  active, onClick, label, fullLabel, sub, ring,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  fullLabel?: string;
  sub: string;
  ring: React.ReactNode;
}) {
  return (
    <li className="shrink-0 snap-start">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={fullLabel ? `${fullLabel}, ${sub} stowed` : undefined}
        className={`relative flex min-h-[52px] items-center gap-3 rounded-2xl py-2 pl-2.5 pr-4 text-left transition-colors lg:min-h-11 lg:w-full lg:py-1.5 ${
          active ? "text-ink" : "text-ink-2 hover:bg-tint/[0.04] hover:text-ink"
        }`}
      >
        {active && (
          <motion.span
            layoutId="rail-active"
            className={`${css.railPill} absolute inset-0 rounded-2xl`}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          />
        )}
        <span className="relative">{ring}</span>
        <span className="relative flex flex-1 items-baseline justify-between gap-3">
          <span className="whitespace-nowrap text-[14px] font-medium tracking-tight">
            <span className="lg:hidden">{label}</span>
            <span className="hidden lg:inline">{fullLabel ?? label}</span>
          </span>
          <span className="num text-[11px] text-ink-3">{sub}</span>
        </span>
      </button>
    </li>
  );
}
