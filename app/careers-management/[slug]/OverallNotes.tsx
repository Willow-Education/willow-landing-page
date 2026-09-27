"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface CandidateNote {
  id: string;
  body: string;
  author_id: string;
  author_email: string;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

const NOTE_COLUMNS = "id, body, author_id, author_email, author_name, created_at, updated_at";
const AVATAR_COLORS = [
  "bg-sky-600",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-teal-700",
];

const primaryButtonClass =
  "h-8 px-3 bg-[#062F29] text-white rounded-lg text-xs font-semibold transition-all duration-300 hover:rounded-[12px] disabled:opacity-50";
const secondaryButtonClass =
  "h-8 px-3 border border-gray-300 text-heading rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50";
const textareaClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062F29] focus:border-transparent transition-colors text-sm leading-relaxed bg-white";

function formatNoteTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function authorLabel(note: CandidateNote) {
  return note.author_name || note.author_email;
}

function AuthorAvatar({ note }: { note: CandidateNote }) {
  const words = authorLabel(note)
    .split(/[\s@.]+/)
    .filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hash = [...note.author_email].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span
      className={cn(
        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold",
        AVATAR_COLORS[hash % AVATAR_COLORS.length],
      )}
    >
      {initials}
    </span>
  );
}

// Cmd/Ctrl+Enter submits, like most comment boxes.
function submitOnModEnter(e: React.KeyboardEvent, submit: () => void) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    submit();
  }
}

function NoteCard({
  note,
  isOwn,
  onSave,
  onDelete,
}: {
  note: CandidateNote;
  isOwn: boolean;
  onSave: (body: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  const [draft, setDraft] = useState(note.body);
  const [busy, setBusy] = useState(false);
  const isEdited = new Date(note.updated_at).getTime() - new Date(note.created_at).getTime() > 1000;

  const save = async () => {
    if (!draft.trim() || busy) return;
    setBusy(true);
    const ok = await onSave(draft.trim());
    setBusy(false);
    if (ok) setMode("view");
  };

  const remove = async () => {
    setBusy(true);
    const ok = await onDelete();
    // On success the card unmounts; otherwise let them try again.
    if (!ok) setBusy(false);
  };

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AuthorAvatar note={note} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-heading truncate" title={note.author_email}>
            {authorLabel(note)}
          </p>
          <p className="text-xs text-secondary">
            {formatNoteTime(note.created_at)}
            {isEdited && <span title={`Edited ${formatNoteTime(note.updated_at)}`}> · Edited</span>}
          </p>
        </div>
        {isOwn && mode === "view" && (
          <div className="shrink-0 flex gap-2 text-xs">
            <button
              onClick={() => {
                setDraft(note.body);
                setMode("edit");
              }}
              className="text-secondary hover:text-heading transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setMode("confirmDelete")}
              className="text-secondary hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {mode === "edit" ? (
        <div className="mt-3 space-y-2">
          <textarea
            aria-label="Edit note"
            autoFocus
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => submitOnModEnter(e, save)}
            className={textareaClass}
          />
          <div className="flex justify-end gap-2">
            <button disabled={busy} onClick={() => setMode("view")} className={secondaryButtonClass}>
              Cancel
            </button>
            <button disabled={busy || !draft.trim()} onClick={save} className={primaryButtonClass}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-primary leading-relaxed whitespace-pre-wrap break-words">
          {note.body}
        </p>
      )}

      {mode === "confirmDelete" && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <p className="text-xs text-secondary">Delete this note?</p>
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => setMode("view")} className={secondaryButtonClass}>
              Cancel
            </button>
            <button
              disabled={busy}
              onClick={remove}
              className="h-8 px-3 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export function OverallNotes({ applicationId }: { applicationId: string }) {
  const [notes, setNotes] = useState<CandidateNote[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [draft, setDraft] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from("candidate_notes")
      .select(NOTE_COLUMNS)
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error:", error);
          setLoadError(true);
          return;
        }
        setNotes(data as CandidateNote[]);
      });
  }, [applicationId]);

  const post = async () => {
    const body = draft.trim();
    if (!supabase || !body || isPosting) return;
    setIsPosting(true);
    setActionError(null);

    // Author and timestamps are stamped by the database from the signed-in user.
    const { data, error } = await supabase
      .from("candidate_notes")
      .insert({ application_id: applicationId, body })
      .select(NOTE_COLUMNS)
      .single();

    setIsPosting(false);
    if (error) {
      console.error("Supabase error:", error);
      setActionError("Couldn't add your note. Please try again.");
      return;
    }
    setDraft("");
    setNotes((prev) => [data as CandidateNote, ...(prev ?? [])]);
  };

  const saveNote = async (id: string, body: string) => {
    if (!supabase) return false;
    setActionError(null);

    // An update blocked by row-level security returns no rows rather than an error.
    const { data, error } = await supabase
      .from("candidate_notes")
      .update({ body })
      .eq("id", id)
      .select(NOTE_COLUMNS);

    if (error || !data?.length) {
      console.error("Supabase error:", error);
      setActionError("Couldn't save your note. Please try again.");
      return false;
    }
    setNotes((prev) => prev?.map((n) => (n.id === id ? (data[0] as CandidateNote) : n)) ?? null);
    return true;
  };

  const deleteNote = async (id: string) => {
    if (!supabase) return false;
    setActionError(null);

    const { data, error } = await supabase.from("candidate_notes").delete().eq("id", id).select("id");

    if (error || !data?.length) {
      console.error("Supabase error:", error);
      setActionError("Couldn't delete your note. Please try again.");
      return false;
    }
    setNotes((prev) => prev?.filter((n) => n.id !== id) ?? null);
    return true;
  };

  return (
    <section aria-labelledby="overall-notes-heading" className="p-4 md:p-5">
      <h2
        id="overall-notes-heading"
        className="text-sm font-semibold text-heading uppercase tracking-wide flex items-center gap-2"
      >
        Overall Notes
        {notes !== null && notes.length > 0 && (
          <span className="min-w-6 px-1.5 py-0.5 rounded-full bg-gray-200 text-xs text-secondary normal-case tracking-normal text-center">
            {notes.length}
          </span>
        )}
      </h2>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <textarea
          aria-label="Add a note"
          rows={3}
          placeholder="Add a note about this candidate..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => submitOnModEnter(e, post)}
          className={textareaClass}
        />
        <div className="mt-2 flex justify-end gap-2">
          {draft && (
            <button disabled={isPosting} onClick={() => setDraft("")} className={secondaryButtonClass}>
              Cancel
            </button>
          )}
          <button disabled={isPosting || !draft.trim()} onClick={post} className={primaryButtonClass}>
            {isPosting ? "Adding..." : "Add note"}
          </button>
        </div>
      </div>

      {actionError && <p className="mt-3 text-xs text-red-600">{actionError}</p>}

      {loadError ? (
        <p className="mt-4 text-sm text-red-600">Couldn&apos;t load notes.</p>
      ) : notes === null ? (
        <p className="mt-4 text-sm text-secondary">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="mt-4 text-sm text-secondary">No notes yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isOwn={note.author_id === userId}
              onSave={(body) => saveNote(note.id, body)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
