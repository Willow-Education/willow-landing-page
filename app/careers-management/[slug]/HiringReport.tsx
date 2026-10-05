"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HIRING_STAGES, getStage, type StageId } from "@/lib/data/hiring-stages";
import { cn } from "@/lib/utils";
import type { NotesSection } from "./InterviewNotes";

const REPORT_SECTIONS: { id: NotesSection; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "video", label: "Video" },
  { id: "work_sample", label: "Work Sample" },
  { id: "final", label: "Final" },
];

// Stages at or past the phone interview, in hiring order.
const INTERVIEW_STAGES: StageId[] = HIRING_STAGES.slice(
  HIRING_STAGES.findIndex((stage) => stage.id === "phone")
).map((stage) => stage.id);

export interface ReportCandidate {
  id: string;
  first_name: string;
  last_name: string;
  stage: StageId;
}

// Rubric total per application id, then per interview section.
type Totals = Record<string, Partial<Record<NotesSection, number>>>;

function formatScore(score: number) {
  return score > 0 ? `+${score}` : String(score);
}

export function HiringReport({
  applications,
  onSelect,
}: {
  applications: ReportCandidate[];
  onSelect: (application: ReportCandidate) => void;
}) {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState(false);
  const applicationIds = applications.map((a) => a.id).join(",");

  useEffect(() => {
    if (!supabase || !applicationIds) return;

    supabase
      .from("interview_notes")
      .select("application_id, section, ratings:notes->ratings")
      .in("application_id", applicationIds.split(","))
      .in(
        "section",
        REPORT_SECTIONS.map((s) => s.id)
      )
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error:", error);
          setError(true);
          return;
        }
        const next: Totals = {};
        for (const row of data as {
          application_id: string;
          section: NotesSection;
          ratings: Record<string, number> | null;
        }[]) {
          const scores = Object.values(row.ratings ?? {});
          // Sections with notes but no scores stay blank rather than showing 0.
          if (scores.length === 0) continue;
          next[row.application_id] = {
            ...next[row.application_id],
            [row.section]: scores.reduce((sum, score) => sum + score, 0),
          };
        }
        setTotals(next);
      });
  }, [applicationIds]);

  if (error) return <p className="px-5 md:px-8 py-6 text-sm text-red-600">Couldn&apos;t load the report.</p>;
  if (totals === null && applicationIds) {
    return <p className="px-5 md:px-8 py-6 text-sm text-secondary">Loading report...</p>;
  }

  // Everyone who has reached the phone interview: candidates in Phone or a later
  // stage, plus rejected candidates who were interviewed at least once.
  const candidates = applications
    .filter((a) =>
      a.stage === "rejected" ? Object.keys(totals?.[a.id] ?? {}).length > 0 : INTERVIEW_STAGES.includes(a.stage)
    )
    .sort((a, b) => {
      const rank = (stage: StageId) => (stage === "rejected" ? -1 : INTERVIEW_STAGES.indexOf(stage));
      return (
        rank(b.stage) - rank(a.stage) ||
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      );
    });

  if (candidates.length === 0) {
    return (
      <p className="px-5 md:px-8 py-6 text-sm text-secondary">No candidates have reached the phone interview yet.</p>
    );
  }

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 overflow-auto">
      <p className="text-sm text-secondary mb-4 max-w-3xl">
        Each score is the sum of that interview&apos;s rubric ratings. A blank means no ratings yet.
      </p>
      <table className="w-full max-w-5xl text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 pr-4 font-semibold text-heading">Candidate</th>
            <th className="py-3 px-4 font-semibold text-heading">Stage</th>
            {REPORT_SECTIONS.map((section) => (
              <th key={section.id} className="py-3 px-4 font-semibold text-heading text-right">
                {section.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => {
            const stage = getStage(candidate.stage);
            return (
              <tr key={candidate.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">
                  <button
                    onClick={() => onSelect(candidate)}
                    className="font-semibold text-heading hover:underline text-left"
                  >
                    {candidate.first_name} {candidate.last_name}
                  </button>
                </td>
                <td className="py-3 px-4 text-secondary whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", stage.dot)} />
                    {stage.label}
                  </span>
                </td>
                {REPORT_SECTIONS.map((section) => {
                  const score = totals?.[candidate.id]?.[section.id];
                  return (
                    <td
                      key={section.id}
                      className={cn(
                        "py-3 px-4 text-right tabular-nums",
                        score === undefined
                          ? "text-gray-400"
                          : score < 0
                            ? "text-red-600 font-semibold"
                            : "text-heading font-semibold"
                      )}
                    >
                      {score === undefined ? "—" : formatScore(score)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
