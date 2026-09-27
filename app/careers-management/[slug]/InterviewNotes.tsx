"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { InterviewQuestion, RubricCriterion } from "@/lib/data/jobs";
import { cn } from "@/lib/utils";

export type NotesSection = "phone" | "video" | "work_sample" | "final";

interface Notes {
  general: string;
  questions: Record<string, string>;
  ratings: Record<string, number>;
  // ISO timestamp of the scheduled interview, or null when none is booked.
  scheduledAt: string | null;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 800;
const EMPTY_NOTES: Notes = { general: "", questions: {}, ratings: {}, scheduledAt: null };

// -5 to 5 with no neutral option, so every score leans one way.
const SCALE = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

const primaryButtonClass =
  "h-10 px-4 bg-[#062F29] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px] disabled:opacity-50";
const secondaryButtonClass =
  "h-10 px-4 border border-gray-300 text-heading rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50";
const inputClass =
  "h-10 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#062F29] focus:border-transparent";

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

function formatScheduledAt(value: string) {
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

// Splits an ISO timestamp into the local date and time strings the inputs expect.
function toLocalInputs(value: string) {
  const d = new Date(value);
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function ScheduleInterview({
  section,
  scheduledAt,
  onChange,
}: {
  section: NotesSection;
  scheduledAt: string | null;
  onChange: (scheduledAt: string | null) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);

  const startEditing = () => {
    const initial = scheduledAt ? toLocalInputs(scheduledAt) : { date: "", time: "" };
    setDate(initial.date);
    setTime(initial.time);
    setEditing(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setBusy(true);
    const ok = await onChange(new Date(`${date}T${time}`).toISOString());
    setBusy(false);
    if (ok) setEditing(false);
  };

  const cancelInterview = async () => {
    setBusy(true);
    await onChange(null);
    setBusy(false);
  };

  if (editing) {
    return (
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={`${section}-date`} className="block text-xs font-semibold text-primary mb-1">
            Day
          </label>
          <input
            id={`${section}-date`}
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${section}-time`} className="block text-xs font-semibold text-primary mb-1">
            Time
          </label>
          <input
            id={`${section}-time`}
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={busy || !date || !time} className={primaryButtonClass}>
          Save
        </button>
        <button type="button" disabled={busy} onClick={() => setEditing(false)} className={secondaryButtonClass}>
          Cancel
        </button>
      </form>
    );
  }

  if (!scheduledAt) {
    return (
      <button type="button" onClick={startEditing} className={primaryButtonClass}>
        Schedule interview
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm text-heading mr-2">
        <span className="font-semibold">Scheduled:</span> {formatScheduledAt(scheduledAt)}
      </p>
      <button type="button" disabled={busy} onClick={startEditing} className={secondaryButtonClass}>
        Edit
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={cancelInterview}
        className="h-10 px-4 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        Cancel interview
      </button>
    </div>
  );
}

export function InterviewNotes({
  applicationId,
  section,
  questions,
  rubric = [],
  schedulable = false,
}: {
  applicationId: string;
  section: NotesSection;
  questions: InterviewQuestion[];
  rubric?: RubricCriterion[];
  schedulable?: boolean;
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
    if (!supabase) return false;
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
      return false;
    }
    setStatus("saved");
    setLastSaved({ at: data.updated_at, by: data.updated_by });
    return true;
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

  // Scheduling is a discrete action, so it saves right away along with any
  // pending text edits instead of waiting on the debounce.
  const schedule = (scheduledAt: string | null) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const next = { ...notes!, scheduledAt };
    setNotes(next);
    return save(next);
  };

  const rate = (criterionId: string, score: number) => {
    const ratings = { ...notes!.ratings };
    // Clicking the selected score clears it.
    if (ratings[criterionId] === score) delete ratings[criterionId];
    else ratings[criterionId] = score;
    update({ ...notes!, ratings });
  };

  if (loadError) return <p className="text-sm text-red-600">Couldn&apos;t load notes.</p>;
  if (!notes) return <p className="text-sm text-secondary">Loading notes...</p>;

  const statusLine = (
    <p className="text-xs text-secondary h-4" aria-live="polite">
      {status === "saving" && "Saving..."}
      {status === "error" && <span className="text-red-600">Couldn&apos;t save. Keep typing to retry.</span>}
      {(status === "saved" || status === "idle") &&
        lastSaved &&
        `Saved ${formatSavedAt(lastSaved.at)}${lastSaved.by ? ` by ${lastSaved.by}` : ""}`}
    </p>
  );

  const questionFields = (
    <div className="space-y-8">
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

  const scheduler = schedulable && (
    <ScheduleInterview section={section} scheduledAt={notes.scheduledAt} onChange={schedule} />
  );

  if (rubric.length === 0) {
    return (
      <div className="space-y-8">
        {scheduler}
        {statusLine}
        {questionFields}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {scheduler}
      {statusLine}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
        {questionFields}

        <section className="xl:sticky xl:top-0 space-y-8 rounded-lg border border-gray-200 p-5 md:p-6">
          <h3 className="text-sm font-semibold text-heading uppercase tracking-wide">Rubric</h3>
          {rubric.map((criterion) => {
            const labelId = `${section}-rubric-${criterion.id}`;
            const selected = notes.ratings[criterion.id];
            return (
              <div key={criterion.id}>
                <p id={labelId} className="text-sm font-semibold text-primary mb-3">
                  {criterion.label}
                </p>
                <div className="flex items-center gap-2">
                  <span aria-hidden className="text-lg shrink-0">
                    👎
                  </span>
                  <div role="radiogroup" aria-labelledby={labelId} className="flex flex-1 gap-1">
                    {SCALE.map((score) => (
                      <button
                        key={score}
                        type="button"
                        role="radio"
                        aria-checked={selected === score}
                        onClick={() => rate(criterion.id, score)}
                        className={cn(
                          "flex-1 min-w-0 h-9 rounded-md border text-xs font-medium tabular-nums transition-colors",
                          selected === score
                            ? "bg-[#062F29] border-[#062F29] text-white"
                            : "border-gray-300 text-secondary hover:border-[#062F29] hover:text-heading"
                        )}
                      >
                        {score > 0 ? `+${score}` : score}
                      </button>
                    ))}
                  </div>
                  <span aria-hidden className="text-lg shrink-0">
                    👍
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
