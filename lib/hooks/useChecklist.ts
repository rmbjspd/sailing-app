"use client";
import { useLocalStorage } from "./useLocalStorage";

export function useChecklist() {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>("checklist:", {});

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isChecked = (id: string) => !!checked[id];

  const resetGroup = (ids: string[]) => {
    setChecked(prev => {
      const next = { ...prev };
      ids.forEach(id => { next[id] = false; });
      return next;
    });
  };

  return { isChecked, toggle, resetGroup, checked };
}
