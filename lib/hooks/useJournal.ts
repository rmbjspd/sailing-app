"use client";
import { useLocalStorage } from "./useLocalStorage";
import type { JournalEntry } from "../types";

export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("journal:", []);

  const addEntry = (entry: Omit<JournalEntry, "id" | "createdAt">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return { entries, addEntry, updateEntry, deleteEntry };
}
