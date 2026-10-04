"use client";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

// Hydration-safe localStorage state.
//
// Backed by useSyncExternalStore so:
//  • the server render and the hydration pass both see `initial` (no mismatch),
//  • the stored value appears on the very next commit — and immediately on
//    client-side navigations — with no setState-in-effect cascade,
//  • every component using the same key stays in sync (and other tabs too, via
//    the `storage` event).
// The third tuple element, `ready`, is false until the browser value has been
// read; views use it to render a skeleton instead of a flash of empty state.
//
// Storage format is unchanged: JSON under the exact key passed in.

const LOCAL_EVENT = "sabbatical:local-storage";
const memory = new Map<string, string | null>(); // fallback when storage throws

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function writeRaw(key: string, raw: string) {
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    memory.set(key, raw);
  }
  window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail: key }));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

const noopSubscribe = () => () => {};

/** True on the client after hydration; false during SSR and the hydration pass. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [fallback] = useState(initial);
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
  const ready = useHydrated();
  const value = useMemo(() => parse<T>(raw, fallback), [raw, fallback]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      // Always derive from what is in storage right now, so several updates in
      // one tick compose correctly.
      const prev = parse<T>(readRaw(key), fallback);
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      writeRaw(key, JSON.stringify(next));
    },
    [key, fallback],
  );

  return [value, set, ready] as const;
}
