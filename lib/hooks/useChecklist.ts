"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

// Stored under "checklist:" as Record<itemId, boolean> — format unchanged.
export function useChecklist() {
  const [checked, setChecked, ready] = useLocalStorage<Record<string, boolean>>("checklist:", {});

  const toggle = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, [setChecked]);

  const isChecked = useCallback((id: string) => !!checked[id], [checked]);

  const resetGroup = useCallback((ids: string[]) => {
    setChecked(prev => {
      const next = { ...prev };
      ids.forEach(id => { next[id] = false; });
      return next;
    });
  }, [setChecked]);

  /** Restore specific ids to given values (used to undo a reset). */
  const restore = useCallback((snapshot: Record<string, boolean>) => {
    setChecked(prev => ({ ...prev, ...snapshot }));
  }, [setChecked]);

  return { isChecked, toggle, resetGroup, restore, checked, ready };
}
