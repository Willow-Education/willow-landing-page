"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { InterviewQuestion } from "@/lib/data/jobs";

export type NotesSection = "phone" | "video" | "work_sample" | "final";

interface Notes {
  general: string;
  questions: Record<string, string>;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 800;
const EMPTY_NOTES: Notes = { general: "", questions: {} };

const textareaClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062F29] focus:border-transparent transition-colors text-sm leading-relaxed";

function formatSavedAt(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function InterviewNotes({
  applicationId,
  section,
  questions,
}: {
  applicationId: string;
  section: NotesSection;
  questions: InterviewQuestion[];
}) {
  const [notes, setNotes] = useState<Notes | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<{ at: string; by: string | null } | null>(null);

  // Pending edits are saved after a short pause, and flushed if the reviewer
  // switches tabs or candidates before the timer fires.
  const pendingRef = useRef<Notes | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from("interview_notes")
      .select("notes, updated_at, updated_by")
      .eq("application_id", applicationId)
      .eq("section", section)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error:", error);
          setLoadError(true);
          return;
        }
        setNotes({ ...EMPTY_NOTES, ...(data?.notes as Partial<Notes> | undefined) });
        if (data) setLastSaved({ at: data.updated_at, by: data.updated_by });
      });
  }, [applicationId, section]);

  const save = async (next: Notes) => {
    if (!supabase) return;
    pendingRef.current = null;
    setStatus("saving");

    const { data, error } = await supabase
      .from("interview_notes")
      .upsert({ application_id: applicationId, section, notes: next }, { onConflict: "application_id,section" })
      .select("updated_at, updated_by")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      setStatus("error");
      return;
    }
    setStatus("saved");
    setLastSaved({ at: data.updated_at, by: data.updated_by });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) save(pendingRef.current);
    };
    // Flush only on unmount; `save` reads the latest pending notes from the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (next: Notes) => {
    setNotes(next);
    pendingRef.current = next;
    setStatus("idle");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(next), SAVE_DELAY_MS);
  };

  if (loadError) return <p className="text-sm text-red-600">Couldn&apos;t load notes.</p>;
  if (!notes) return <p className="text-sm text-secondary">Loading notes...</p>;

  return (
    <div className="space-y-8">
      <p className="text-xs text-secondary h-4" aria-live="polite">
        {status === "saving" && "Saving..."}
        {status === "error" && <span className="text-red-600">Couldn&apos;t save. Keep typing to retry.</span>}
        {(status === "saved" || status === "idle") &&
          lastSaved &&
          `Saved ${formatSavedAt(lastSaved.at)}${lastSaved.by ? ` by ${lastSaved.by}` : ""}`}
      </p>

      <div>
        <label htmlFor={`${section}-general`} className="block text-sm font-semibold text-primary mb-2">
          General notes
        </label>
        <textarea
          id={`${section}-general`}
          rows={5}
          value={notes.general}
          onChange={(e) => update({ ...notes, general: e.target.value })}
          className={textareaClass}
        />
      </div>

      {questions.map((q, index) => (
        <div key={q.id}>
          <label htmlFor={`${section}-${q.id}`} className="block text-sm font-semibold text-primary mb-2">
            {index + 1}. {q.question}
          </label>
          <textarea
            id={`${section}-${q.id}`}
            rows={4}
            value={notes.questions[q.id] ?? ""}
            onChange={(e) =>
              update({ ...notes, questions: { ...notes.questions, [q.id]: e.target.value } })
            }
            className={textareaClass}
          />
        </div>
      ))}
    </div>
  );
}
