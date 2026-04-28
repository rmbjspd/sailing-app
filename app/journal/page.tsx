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
    <div className="parchment-page">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-pirata)] text-4xl text-[hsl(var(--navy))]">
              Captain&rsquo;s Log
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 italic">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} &mdash; all hands, record your observations
            </p>
          </div>
          <button
            onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              background: "hsl(var(--teal))",
              color: "white",
              boxShadow: "0 2px 8px hsl(var(--teal) / 0.35)",
            }}
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
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
          <div className="text-center py-20 text-[hsl(var(--muted-foreground))]">
            <p className="text-6xl mb-4">🦜</p>
            <p className="font-[family-name:var(--font-pirata)] text-2xl text-[hsl(var(--navy))] mb-2">
              Squawk! Log&apos;s empty, Cap&apos;n!
            </p>
            <p className="text-sm italic max-w-xs mx-auto leading-relaxed">
              A voyage unrecorded is a voyage forgotten. Every great captain kept a log — even Davy Jones.
            </p>
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
    </div>
  );
}

function EntryCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <button className="text-left flex-1" onClick={() => setExpanded(e => !e)}>
            <p className="font-semibold text-sm text-[hsl(var(--card-foreground))]">
              {entry.title || "(No title)"}
            </p>
            <div
              className="flex items-center gap-2 mt-0.5 text-xs italic"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <span>📅 {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
              {entry.day > 0 && <span>· Day {entry.day}</span>}
              {entry.location && <span>· 📍 {entry.location}</span>}
            </div>
          </button>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded transition-colors hover:bg-[hsl(var(--page-bg))]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded transition-colors hover:bg-[hsl(0 55% 93%)]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>
      {expanded && entry.body && (
        <CardContent className="pt-0">
          <p
            className="text-sm whitespace-pre-wrap leading-relaxed italic"
            style={{
              color: "hsl(var(--card-foreground))",
              fontFamily: "var(--font-typewriter)",
              fontSize: "0.875rem",
            }}
          >
            {entry.body}
          </p>
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
  const [title, setTitle]       = useState(initial?.title    ?? "");
  const [body, setBody]         = useState(initial?.body     ?? "");
  const [date, setDate]         = useState(initial?.date     ?? today);
  const [day, setDay]           = useState(String(initial?.day ?? ""));
  const [location, setLocation] = useState(initial?.location ?? "");

  const handleSave = () => {
    if (!body.trim() && !title.trim()) return;
    onSave({ title, body, date, day: Number(day) || 0, location });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid hsl(var(--border))",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    background: "hsl(var(--parchment))",
    color: "hsl(var(--card-foreground))",
    outline: "none",
  };

  return (
    <Card
      className="shadow-md"
      style={{ border: "2px solid hsl(var(--teal))" }}
    >
      <div className="h-1" style={{ background: "hsl(var(--teal))", borderRadius: "6px 6px 0 0" }} />
      <CardContent className="p-5 space-y-3">
        <input
          style={inputStyle}
          placeholder="Entry title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2">
          <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} />
          <input style={inputStyle} placeholder="Day #" value={day} onChange={e => setDay(e.target.value)} />
          <input style={inputStyle} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <textarea
          style={{
            ...inputStyle,
            minHeight: "140px",
            resize: "vertical",
            fontFamily: "var(--font-typewriter)",
            lineHeight: "1.7",
          }}
          placeholder="Write your journal entry…"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
          >
            <X className="w-3.5 h-3.5 mr-1" /> Cancel
          </Button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "hsl(var(--teal))", color: "white" }}
          >
            <Check className="w-3.5 h-3.5" /> Save Entry
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
