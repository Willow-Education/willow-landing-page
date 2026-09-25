"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JOBS, type Job } from "@/lib/data/jobs";
import {
  ALL_STAGES,
  HIRING_STAGES,
  getNextStage,
  getStage,
  type StageId,
} from "@/lib/data/hiring-stages";
import { cn } from "@/lib/utils";
import { InterviewNotes } from "./InterviewNotes";

const RESUME_BUCKET = "resumes";
const DAY_MS = 24 * 60 * 60 * 1000;
const AVATAR_COLORS = ["bg-sky-600", "bg-indigo-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-teal-700"];

const DETAIL_TABS = [
  { id: "application", label: "Application" },
  { id: "resume", label: "Resume" },
  { id: "phone", label: "Phone Interview" },
  { id: "video", label: "Video Interview" },
  { id: "work_sample", label: "Work Sample" },
  { id: "final", label: "Final Interview" },
] as const;

type DetailTab = (typeof DETAIL_TABS)[number]["id"];

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  portfolio_url: string;
  video_url: string;
  resume_path: string;
  answers: { question: string; answer: string }[];
  stage: StageId;
  stage_changed_at: string;
  created_at: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysInStage(application: Application) {
  return Math.max(0, Math.floor((Date.now() - new Date(application.stage_changed_at).getTime()) / DAY_MS));
}

function Avatar({ application, size }: { application: Application; size: "sm" | "lg" }) {
  const initials = `${application.first_name[0] ?? ""}${application.last_name[0] ?? ""}`.toUpperCase();
  const hash = [...application.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span
      className={cn(
        "shrink-0 rounded-full flex items-center justify-center text-white font-semibold",
        AVATAR_COLORS[hash % AVATAR_COLORS.length],
        size === "sm" ? "w-10 h-10 text-sm" : "w-14 h-14 md:w-16 md:h-16 text-lg md:text-xl"
      )}
    >
      {initials}
    </span>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-1">{label}</h3>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-content-link text-base hover:underline break-all"
      >
        {href}
      </a>
    </div>
  );
}

function StageActions({
  application,
  isSaving,
  onMove,
}: {
  application: Application;
  isSaving: boolean;
  onMove: (stage: StageId) => void;
}) {
  const nextStage = getNextStage(application.stage);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {application.stage !== "rejected" && (
        <button
          onClick={() => onMove("rejected")}
          disabled={isSaving}
          className="h-10 px-4 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Reject
        </button>
      )}
      {nextStage && (
        <button
          onClick={() => onMove(nextStage.id)}
          disabled={isSaving}
          className="h-10 px-4 bg-[#062F29] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px] disabled:opacity-50"
        >
          Advance to {nextStage.label}
        </button>
      )}
      <select
        aria-label="Move to stage"
        value=""
        disabled={isSaving}
        onChange={(e) => e.target.value && onMove(e.target.value as StageId)}
        className="h-10 pl-3 pr-8 border border-gray-300 rounded-lg text-sm font-semibold text-heading bg-white disabled:opacity-50"
      >
        <option value="">Move to...</option>
        {ALL_STAGES.filter((stage) => stage.id !== application.stage).map((stage) => (
          <option key={stage.id} value={stage.id}>
            {stage.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ApplicationDetail({
  job,
  application,
  activeTab,
  onTabChange,
  isSaving,
  moveError,
  onMove,
}: {
  job: Job;
  application: Application;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  isSaving: boolean;
  moveError: string | null;
  onMove: (stage: StageId) => void;
}) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState(false);
  const isPdf = application.resume_path.toLowerCase().endsWith(".pdf");
  const stage = getStage(application.stage);

  useEffect(() => {
    setResumeUrl(null);
    setResumeError(false);
    if (!supabase) return;

    // Resumes live in a private bucket, so each view gets a short-lived link.
    supabase.storage
      .from(RESUME_BUCKET)
      .createSignedUrl(application.resume_path, 60 * 60)
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Supabase storage error:", error);
          setResumeError(true);
          return;
        }
        setResumeUrl(data.signedUrl);
      });
  }, [application.resume_path]);

  return (
    <article>
      <header className="px-5 md:px-10 py-6 md:py-8 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar application={application} size="lg" />
          <div className="min-w-0">
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-heading truncate">
              {application.first_name} {application.last_name}
            </h2>
            <p className="text-secondary text-sm mt-1">
              <a href={`mailto:${application.email}`} className="text-content-link hover:underline">
                {application.email}
              </a>
              {" · "}Applied {formatDate(application.created_at)}
              {" · "}
              <span className="inline-flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", stage.dot)} />
                {stage.label}
              </span>
            </p>
          </div>
        </div>
        <div>
          <StageActions application={application} isSaving={isSaving} onMove={onMove} />
          {moveError && <p className="text-sm text-red-600 mt-2">{moveError}</p>}
        </div>
      </header>

      <div className="px-3 md:px-8 border-b border-gray-200 flex overflow-x-auto" role="tablist">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "shrink-0 px-3 py-3 text-sm border-b-2 -mb-px transition-colors",
              tab.id === activeTab
                ? "border-[#062F29] text-heading font-semibold"
                : "border-transparent text-secondary hover:text-heading"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={cn("px-5 md:px-10 py-8 md:py-10", activeTab !== "resume" && "max-w-3xl")}>
        {activeTab === "application" && (
          <div className="space-y-8">
            <LinkRow label="Portfolio or prototype" href={application.portfolio_url} />
            <LinkRow label="Video" href={application.video_url} />
            {application.answers.map(({ question, answer }) => (
              <div key={question}>
                <h3 className="text-sm font-semibold text-primary mb-2">{question}</h3>
                <p className="text-secondary text-base leading-relaxed whitespace-pre-wrap">{answer}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "resume" &&
          (resumeError ? (
            <p className="text-sm text-red-600">Couldn&apos;t load the resume.</p>
          ) : !resumeUrl ? (
            <p className="text-sm text-secondary">Loading resume...</p>
          ) : isPdf ? (
            <div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-content-link hover:underline mb-3"
              >
                Open in a new tab
              </a>
              <iframe
                src={resumeUrl}
                title={`${application.first_name} ${application.last_name} resume`}
                className="w-full h-[calc(100dvh-6rem)] min-h-[600px] border border-gray-200 rounded-lg"
              />
            </div>
          ) : (
            <p className="text-sm text-secondary">
              Word documents can&apos;t be previewed here.{" "}
              <a href={resumeUrl} className="text-content-link hover:underline">
                Download the resume
              </a>
              .
            </p>
          ))}

        {(activeTab === "phone" || activeTab === "video" || activeTab === "final") && (
          <InterviewNotes
            key={activeTab}
            applicationId={application.id}
            section={activeTab}
            questions={job.interviews[activeTab]}
          />
        )}

        {activeTab === "work_sample" && (
          <InterviewNotes applicationId={application.id} section="work_sample" questions={[]} />
        )}
      </div>
    </article>
  );
}

export default function JobCandidatesPage() {
  const { slug } = useParams<{ slug: string }>();
  const job = JOBS.find((j) => j.slug === slug);

  const [applications, setApplications] = useState<Application[] | null>(null);
  const [activeStage, setActiveStage] = useState<StageId>(HIRING_STAGES[0].id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("application");

  useEffect(() => {
    if (!supabase || !job) return;

    supabase
      .from("job_applications")
      .select(
        "id, first_name, last_name, email, portfolio_url, video_url, resume_path, answers, stage, stage_changed_at, created_at"
      )
      .eq("job_slug", job.slug)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error:", error);
          setError("Couldn't load applications.");
          return;
        }
        setApplications(data as Application[]);
      });
  }, [job]);

  const stageApplications = applications?.filter((a) => a.stage === activeStage) ?? [];
  const selected =
    stageApplications.find((a) => a.id === selectedId) ?? stageApplications[0] ?? null;

  const selectStage = (stage: StageId) => {
    setActiveStage(stage);
    setSelectedId(null);
    setMoveError(null);
  };

  const selectCandidate = (id: string) => {
    setSelectedId(id);
    setMoveError(null);
  };

  const moveCandidate = async (application: Application, stage: StageId) => {
    if (!supabase || !applications) return;
    setIsSaving(true);
    setMoveError(null);

    const stageChangedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("job_applications")
      .update({ stage, stage_changed_at: stageChangedAt })
      .eq("id", application.id)
      .select("id");

    setIsSaving(false);

    // An update blocked by row-level security returns no rows rather than an error.
    if (error || !data?.length) {
      console.error("Supabase error:", error);
      setMoveError("Couldn't move this candidate. Please try again.");
      return;
    }

    // Keep the list position: select whoever was next (or previous) in this stage.
    const index = stageApplications.findIndex((a) => a.id === application.id);
    const neighbor = stageApplications[index + 1] ?? stageApplications[index - 1] ?? null;
    setSelectedId(neighbor?.id ?? null);

    setApplications(
      applications.map((a) =>
        a.id === application.id ? { ...a, stage, stage_changed_at: stageChangedAt } : a
      )
    );
  };

  if (!job) {
    return (
      <main className="max-w-3xl w-full mx-auto px-5 md:px-8 py-10">
        <p className="text-secondary">
          Job not found.{" "}
          <Link href="/careers-management" className="text-content-link hover:underline">
            Back to all jobs
          </Link>
        </p>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:min-h-0">
      {/* Job header and stage tabs */}
      <div className="shrink-0 border-b border-gray-200">
        <div className="px-5 md:px-8 pt-6">
          <nav className="text-xs font-semibold tracking-wider uppercase text-secondary">
            <Link href="/careers-management" className="hover:text-heading transition-colors">
              All jobs
            </Link>
            <span className="mx-2">&rsaquo;</span>
            <span>{job.title}</span>
          </nav>
          <h1 className="font-heading text-2xl md:text-3xl font-medium text-heading mt-2">{job.title}</h1>
        </div>

        <div className="px-3 md:px-6 mt-4 flex overflow-x-auto" role="tablist">
          {ALL_STAGES.map((stage) => {
            const count = applications?.filter((a) => a.stage === stage.id).length ?? 0;
            const isActive = stage.id === activeStage;
            return (
              <button
                key={stage.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => selectStage(stage.id)}
                className={cn(
                  "shrink-0 flex items-center gap-2 px-3 py-3 text-sm border-b-2 -mb-px transition-colors",
                  isActive
                    ? "border-[#062F29] text-heading font-semibold"
                    : "border-transparent text-secondary hover:text-heading"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", stage.dot)} />
                {stage.label}
                <span className="min-w-6 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs text-secondary">
                  {applications === null ? "–" : count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="px-5 md:px-8 py-4 text-sm text-red-600">{error}</p>}

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Candidates in the active stage */}
        <aside className="md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 max-h-72 md:max-h-none overflow-y-auto">
          {applications !== null && stageApplications.length === 0 && (
            <p className="px-5 py-6 text-sm text-secondary">
              No candidates in {getStage(activeStage).label}.
            </p>
          )}
          <ul>
            {stageApplications.map((application) => (
              <li key={application.id}>
                <button
                  onClick={() => selectCandidate(application.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 border-b border-gray-100 flex items-center gap-3 transition-colors",
                    application.id === selected?.id ? "bg-gray-100" : "hover:bg-gray-50"
                  )}
                >
                  <Avatar application={application} size="sm" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-heading truncate">
                      {application.first_name} {application.last_name}
                    </span>
                    <span className="block text-xs text-secondary mt-0.5">
                      Applied {formatDate(application.created_at)}
                      {" · "}
                      <span className="text-amber-700">{daysInStage(application)}d in stage</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Selected application */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {selected && (
            <ApplicationDetail
              key={selected.id}
              job={job}
              application={selected}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isSaving={isSaving}
              moveError={moveError}
              onMove={(stage) => moveCandidate(selected, stage)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
