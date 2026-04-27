"use client";
import { useState } from "react";
import { useJournal } from "@/lib/hooks/useJournal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import type { JournalEntry } from "@/lib/types";

export default function JournalPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-pirata)] text-3xl text-[hsl(var(--navy))]">Captain&rsquo;s Log</h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} &mdash; all hands, record your observations
          </p>
        </div>
        <Button
          onClick={() => setShowForm(f => !f)}
          className="bg-[hsl(213,74%,28%)] hover:bg-[hsl(213,74%,22%)] text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Entry
        </Button>
      </div>

      {showForm && (
        <EntryForm
          onSave={(data) => {
            addEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-16 text-[hsl(var(--muted-foreground))]">
          <p className="text-5xl mb-3">🦜</p>
          <p className="font-[family-name:var(--font-pirata)] text-xl text-[hsl(var(--navy))] mb-1">Squawk! Log&apos;s empty, Cap&apos;n!</p>
          <p className="text-sm">A voyage unrecorded is a voyage forgotten. Every great captain kept a log — even Davy Jones.</p>
        </div>
      )}

      <div className="space-y-4 mt-4">
        {entries.map(entry =>
          editId === entry.id ? (
            <EntryForm
              key={entry.id}
              initial={entry}
              onSave={(data) => {
                updateEntry(entry.id, data);
                setEditId(null);
              }}
              onCancel={() => setEditId(null)}
            />
          ) : (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => setEditId(entry.id)}
              onDelete={() => deleteEntry(entry.id)}
            />
          )
        )}
      </div>
    </div>
  );
}

function EntryCard({ entry, onEdit, onDelete }: { entry: JournalEntry; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <button className="text-left flex-1" onClick={() => setExpanded(e => !e)}>
            <p className="font-semibold text-sm">{entry.title || "(No title)"}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
              <span>📅 {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
              {entry.day > 0 && <span>· Day {entry.day}</span>}
              {entry.location && <span>· 📍 {entry.location}</span>}
            </div>
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onEdit} className="text-gray-400 hover:text-gray-600 p-1"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </CardHeader>
      {expanded && entry.body && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.body}</p>
        </CardContent>
      )}
    </Card>
  );
}

function EntryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<JournalEntry>;
  onSave: (data: Omit<JournalEntry, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [date, setDate] = useState(initial?.date ?? today);
  const [day, setDay] = useState(String(initial?.day ?? ""));
  const [location, setLocation] = useState(initial?.location ?? "");

  const handleSave = () => {
    if (!body.trim() && !title.trim()) return;
    onSave({ title, body, date, day: Number(day) || 0, location });
  };

  return (
    <Card className="border-[hsl(213,74%,28%)] border-2">
      <CardContent className="p-4 space-y-3">
        <input
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(213,74%,28%)]"
          placeholder="Entry title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2">
          <input type="date" className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(213,74%,28%)]" value={date} onChange={e => setDate(e.target.value)} />
          <input className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(213,74%,28%)]" placeholder="Day #" value={day} onChange={e => setDay(e.target.value)} />
          <input className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(213,74%,28%)]" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <textarea
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(213,74%,28%)] min-h-32 resize-y"
          placeholder="Write your journal entry…"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
          <Button size="sm" className="bg-[hsl(213,74%,28%)] text-white hover:bg-[hsl(213,74%,22%)]" onClick={handleSave}><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
