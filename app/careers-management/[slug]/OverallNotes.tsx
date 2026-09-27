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

interface Author {
  email: string;
  name: string | null;
}

const NOTE_COLUMNS = "id, body, author_id, author_email, author_name, created_at, updated_at";

// Soft brand tints so each teammate is recognizable at a glance.
const AVATAR_TONES = [
  "bg-[#D8FBDB] text-[#062F29]",
  "bg-[#E0F2FE] text-[#025f80]",
  "bg-[#F5F1EB] text-[#6B4E2E]",
  "bg-[#EDE9FE] text-[#4C3A99]",
];

const primaryButtonClass =
  "h-9 px-4 bg-[#062F29] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px] disabled:opacity-40 disabled:hover:rounded-lg";
const ghostButtonClass =
  "h-9 px-3 text-secondary rounded-lg text-sm font-semibold hover:text-heading transition-colors disabled:opacity-40";
const inlineActionClass = "text-xs font-semibold text-secondary transition-colors";
const bareTextareaClass =
  "block w-full resize-none bg-transparent text-sm text-primary leading-relaxed placeholder:text-secondary/70 focus:outline-none [field-sizing:content]";

function formatFullTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTime(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h ago`;
  if (minutes < 7 * 24 * 60) return `${Math.floor(minutes / (24 * 60))}d ago`;
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function displayName(author: Author) {
  return author.name || author.email.split("@")[0];
}

function AuthorAvatar({ author, size = "md" }: { author: Author; size?: "sm" | "md" }) {
  const words = displayName(author)
    .split(/[\s._-]+/)
    .filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hash = [...author.email].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 rounded-full flex items-center justify-center font-semibold",
        AVATAR_TONES[hash % AVATAR_TONES.length],
        size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-xs",
      )}
    >
      {initials}
    </span>
  );
}

// Cmd/Ctrl+Enter submits and Escape backs out, like most comment boxes.
function handleShortcuts(e: React.KeyboardEvent, submit: () => void, cancel: () => void) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    submit();
  } else if (e.key === "Escape") {
    cancel();
  }
}

function Composer({ me, onPost }: { me: Author | null; onPost: (body: string) => Promise<boolean> }) {
  const [draft, setDraft] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const isOpen = isFocused || draft.length > 0;

  const post = async () => {
    const body = draft.trim();
    if (!body || isPosting) return;
    setIsPosting(true);
    const ok = await onPost(body);
    setIsPosting(false);
    if (ok) setDraft("");
  };

  return (
    <div
      className={cn(
        "rounded-card bg-white border transition-all duration-200",
        isOpen ? "border-[#062F29] shadow-subtle" : "border-[#E4E2DD] hover:border-[#C9C6BF]",
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {me && <AuthorAvatar author={me} size="sm" />}
        <textarea
          aria-label="Add a note"
          placeholder="Share your take on this candidate..."
          rows={isOpen ? 3 : 1}
          value={draft}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => handleShortcuts(e, post, () => setDraft(""))}
          className={cn(bareTextareaClass, "pt-1 max-h-60", isOpen ? "min-h-[4.5rem]" : "min-h-0")}
        />
      </div>
      {isOpen && (
        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          <span className="text-xs text-secondary/80">⌘ + Enter to post</span>
          <div className="flex gap-1">
            {/* Prevent the blur so the click lands before the composer collapses. */}
            <button
              disabled={isPosting}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDraft("")}
              className={ghostButtonClass}
            >
              Cancel
            </button>
            <button
              disabled={isPosting || !draft.trim()}
              onMouseDown={(e) => e.preventDefault()}
              onClick={post}
              className={primaryButtonClass}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
  const author = { email: note.author_email, name: note.author_name };
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
    <li
      className={cn(
        "group rounded-card bg-white p-4 border transition-colors",
        mode === "edit" ? "border-[#062F29] shadow-subtle" : "border-transparent shadow-subtle",
      )}
    >
      <div className="flex items-center gap-3">
        <AuthorAvatar author={author} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-heading truncate" title={note.author_email}>
            {displayName(author)}
            {isOwn && <span className="ml-1.5 font-normal text-secondary">(you)</span>}
          </p>
          <p className="text-xs text-secondary">
            <time dateTime={note.created_at} title={formatFullTime(note.created_at)}>
              {formatRelativeTime(note.created_at)}
            </time>
            {isEdited && <span title={`Edited ${formatFullTime(note.updated_at)}`}> · Edited</span>}
          </p>
        </div>
        {isOwn && mode === "view" && (
          <div className="shrink-0 flex gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setDraft(note.body);
                setMode("edit");
              }}
              className={cn(inlineActionClass, "hover:text-heading")}
            >
              Edit
            </button>
            <button
              onClick={() => setMode("confirmDelete")}
              className={cn(inlineActionClass, "hover:text-red-600")}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {mode === "edit" ? (
        <div className="mt-3">
          <textarea
            aria-label="Edit note"
            autoFocus
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => handleShortcuts(e, save, () => setMode("view"))}
            className={cn(bareTextareaClass, "min-h-[4.5rem] max-h-80")}
          />
          <div className="mt-2 flex justify-end gap-1">
            <button disabled={busy} onClick={() => setMode("view")} className={ghostButtonClass}>
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
        <div className="mt-4 -mx-4 -mb-4 px-4 py-3 rounded-b-card bg-red-50 flex items-center justify-between gap-2">
          <p className="text-sm text-red-700">Delete this note?</p>
          <div className="flex gap-1">
            <button disabled={busy} onClick={() => setMode("view")} className={ghostButtonClass}>
              Keep
            </button>
            <button
              disabled={busy}
              onClick={remove}
              className="h-9 px-4 bg-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px] disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center text-center px-6">
      <span className="w-12 h-12 rounded-full bg-[#D8FBDB] text-[#062F29] flex items-center justify-center">
        <svg
          aria-hidden
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
          <path d="M8.5 10.5h7M8.5 13.5h4.5" />
        </svg>
      </span>
      <p className="mt-4 font-heading text-base font-medium text-heading">No notes yet</p>
      <p className="mt-1 text-sm text-secondary max-w-[16rem]">
        Leave your overall impression so the rest of the team can see where you landed.
      </p>
    </div>
  );
}

export function OverallNotes({ applicationId }: { applicationId: string }) {
  const [notes, setNotes] = useState<CandidateNote[] | null>(null);
  const [me, setMe] = useState<(Author & { id: string }) | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user?.email) return;
      const meta = user.user_metadata ?? {};
      setMe({ id: user.id, email: user.email, name: meta.full_name ?? meta.name ?? null });
    });
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

  const postNote = async (body: string) => {
    if (!supabase) return false;
    setActionError(null);

    // Author and timestamps are stamped by the database from the signed-in user.
    const { data, error } = await supabase
      .from("candidate_notes")
      .insert({ application_id: applicationId, body })
      .select(NOTE_COLUMNS)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      setActionError("Couldn't add your note. Please try again.");
      return false;
    }
    setNotes((prev) => [data as CandidateNote, ...(prev ?? [])]);
    return true;
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
    <section aria-labelledby="overall-notes-heading" className="p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id="overall-notes-heading" className="font-heading text-lg font-medium text-heading">
          Overall notes
        </h2>
        {notes !== null && notes.length > 0 && (
          <span className="px-2.5 py-0.5 rounded-full bg-[#D8FBDB] text-xs font-semibold text-[#062F29]">
            {notes.length}
          </span>
        )}
      </div>
      <p className="text-xs text-secondary mt-0.5 mb-5">Visible to everyone on the hiring team</p>

      <Composer me={me} onPost={postNote} />

      {actionError && <p className="mt-3 text-xs text-red-600">{actionError}</p>}

      {loadError ? (
        <p className="mt-6 text-sm text-red-600">Couldn&apos;t load notes.</p>
      ) : notes === null ? (
        <p className="mt-6 text-sm text-secondary">Loading notes...</p>
      ) : notes.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-5 space-y-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isOwn={note.author_id === me?.id}
              onSave={(body) => saveNote(note.id, body)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
