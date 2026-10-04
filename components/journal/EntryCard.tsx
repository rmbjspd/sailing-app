"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, MapPin, Pencil, Trash2 } from "lucide-react";
import { LegChip } from "@/components/kit";
import type { JournalEntry } from "@/lib/types";
import { formatEntryDate, itineraryDay, routeLabel, wordCount } from "./logFormat";

const LONG_BODY = 520; // characters before an entry folds by default

// One page of the log: leg + planned passage, an editorial title, the place,
// and the body set like a printed journal. Long entries fold; delete asks first.
export function EntryCard({
  entry, onEdit, onDelete, highlight,
}: {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
  highlight?: boolean;
}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const it = itineraryDay(entry.day);
  const long = (entry.body?.length ?? 0) > LONG_BODY;
  const [expanded, setExpanded] = useState(!long);
  const [confirming, setConfirming] = useState(false);
  const keepRef = useRef<HTMLButtonElement>(null);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const words = wordCount(entry.body ?? "");
  const paragraphs = (entry.body ?? "").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const title = entry.title || (it ? routeLabel(it) : "Untitled entry");

  useEffect(() => {
    if (confirming) keepRef.current?.focus();
  }, [confirming]);

  const cancelConfirm = () => {
    setConfirming(false);
    requestAnimationFrame(() => deleteBtnRef.current?.focus());
  };

  return (
    <article
      aria-labelledby={`${uid}-title`}
      className={`group/card relative rounded-[24px] border bg-[linear-gradient(180deg,rgb(255_255_255/0.045),rgb(255_255_255/0.012))] shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_24px_60px_-30px_rgb(0_0_0/0.8)] transition-[border-color,box-shadow] duration-700 ${
        highlight ? "border-glow/50 shadow-[0_0_0_4px_rgb(94_242_214/0.08),0_0_40px_-8px_rgb(94_242_214/0.35)]" : "border-line hover:border-line-strong"
      }`}
    >
      <div className="px-5 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            {it ? (
              <>
                <LegChip legId={it.leg} size="sm" showNumeral />
                <span className="text-[13px] text-ink-3">{routeLabel(it)}</span>
              </>
            ) : (
              <span className="eyebrow">Ashore</span>
            )}
          </div>
          <div className="-mr-2 -mt-2 flex shrink-0 items-center opacity-100 transition-opacity sm:opacity-80 sm:group-hover/card:opacity-100 sm:group-focus-within/card:opacity-100">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit “${title}”`}
              title="Edit"
              className="grid size-11 place-items-center rounded-full text-ink-3 transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <Pencil className="size-4" strokeWidth={1.6} />
            </button>
            <button
              ref={deleteBtnRef}
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Delete “${title}”`}
              title="Delete"
              className="grid size-11 place-items-center rounded-full text-ink-3 transition-colors hover:bg-alert/10 hover:text-alert"
            >
              <Trash2 className="size-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <h3 id={`${uid}-title`} className="font-display mt-4 text-[clamp(1.6rem,3.2vw,2.25rem)] font-light leading-[1.08] text-ink">
          {title}
        </h3>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-3">
          <span className="num">{formatEntryDate(entry.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
          {entry.location && (
            <span className="inline-flex items-center gap-1.5 text-ink-2">
              <MapPin className="size-3.5 text-ink-3" strokeWidth={1.6} />
              {entry.location}
            </span>
          )}
        </p>

        {entry.body && (
          <div className="relative mt-6">
            <motion.div
              id={`${uid}-body`}
              initial={false}
              animate={{ height: expanded ? "auto" : 190 }}
              transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
              style={!expanded ? { maskImage: "linear-gradient(180deg, black 45%, transparent)", WebkitMaskImage: "linear-gradient(180deg, black 45%, transparent)" } : undefined}
            >
              <div className="font-display space-y-5 text-[18px] font-light leading-[1.8] text-ink-2">
                {paragraphs.map((para, i) => (
                  <p key={i} className={`whitespace-pre-line ${i === 0 ? "text-[19px] text-ink sm:text-[20px]" : ""}`}>
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
            {long && (
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded}
                aria-controls={`${uid}-body`}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-[13px] font-medium text-glow transition-colors hover:text-ink"
              >
                <ChevronDown className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} strokeWidth={1.75} />
                {expanded ? "Fold entry" : "Continue reading"}
              </button>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <span className="hairline flex-1 opacity-70" />
          <span className="num text-[11px] text-ink-4">
            {words} {words === 1 ? "word" : "words"}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {confirming && (
            <motion.div
              role="alertdialog"
              aria-labelledby={`${uid}-confirm`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
              onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); cancelConfirm(); } }}
            >
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-alert/25 bg-alert/[0.06] py-2 pl-4 pr-2">
                <p id={`${uid}-confirm`} className="text-sm text-ink-2">
                  Tear this page out of the log? <span className="text-ink-3">This can&rsquo;t be undone.</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    ref={keepRef}
                    type="button"
                    onClick={cancelConfirm}
                    className="min-h-11 rounded-full px-4 text-sm font-medium text-ink-2 transition-colors hover:bg-white/[0.06] hover:text-ink"
                  >
                    Keep it
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-alert/90 px-4 text-sm font-semibold text-abyss transition-colors hover:bg-alert"
                  >
                    <Trash2 className="size-4" strokeWidth={2} />
                    Delete entry
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
