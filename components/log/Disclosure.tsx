"use client";
import { useEffect, useId, useState, type ReactNode } from "react";

// Accessible expander: a real <button aria-expanded> controlling a region.
// Summary and panel content are server-rendered and passed in, so the only
// client code is this toggle. Style the open state with Tailwind's
// `group-aria-expanded:` variants on elements inside `summary`.
// `listen` makes it follow the log-wide "open every entry" toggle.
export function Disclosure({
  summary, children, buttonClassName = "", panelClassName = "", className = "", listen = false, label,
}: {
  summary: ReactNode;
  children: ReactNode;
  buttonClassName?: string;
  panelClassName?: string;
  className?: string;
  listen?: boolean;
  /** accessible name override for the button */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!listen) return;
    const onAll = (e: Event) => setOpen(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("log:expand-all", onAll);
    return () => window.removeEventListener("log:expand-all", onAll);
  }, [listen]);

  return (
    <div className={className} data-open={open ? "" : undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen(o => !o)}
        className={`group ${buttonClassName}`}
      >
        {summary}
      </button>
      <div
        id={id}
        role="region"
        aria-label={label}
        inert={!open}
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={panelClassName}>{children}</div>
        </div>
      </div>
    </div>
  );
}
