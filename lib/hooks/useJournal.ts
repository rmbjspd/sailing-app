"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { JournalEntry } from "../types";

// Stored under "journal:" as JournalEntry[] (newest-created first) — format unchanged.
export function useJournal() {
  const [entries, setEntries, ready] = useLocalStorage<JournalEntry[]>("journal:", []);

  const addEntry = useCallback((entry: Omit<JournalEntry, "id" | "createdAt">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, [setEntries]);

  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, [setEntries]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [setEntries]);

  return { entries, addEntry, updateEntry, deleteEntry, ready };
}
