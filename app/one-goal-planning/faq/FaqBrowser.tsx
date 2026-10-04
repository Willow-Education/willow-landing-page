"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FAQ_STATUS_LABELS,
  FAQ_STATUSES,
  type FaqItem,
  type FaqSection,
  type FaqStatus,
} from "@/lib/one-goal-faq/format";
import type { FaqSourceRef, FaqUpdate } from "@/lib/one-goal-faq/update";

// Answers changed this recently carry an "Updated" marker in the list.
const RECENT_CHANGE_MS = 14 * 24 * 60 * 60_000;
const COLLAPSED_UPDATE_COUNT = 5;

type StatusFilter = FaqStatus | "all";

const STATUS_STYLES: Record<FaqStatus, string> = {
  settled: "bg-[#acf7b2] text-[#171b4a]",
  working: "bg-[#dff8f8] text-[#0f6568]",
  open: "bg-[#fff0ed] text-[#a52d1f]",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Content comes from the repo and the update model: keep raw HTML off and
// images out.
function Answer({ content }: { content: string }) {
  return (
    <div className="faq-markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        disallowedElements={["img"]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

function StatusPill({ status }: { status: FaqStatus | null }) {
  if (!status) {
    return null;
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] ${STATUS_STYLES[status]}`}
    >
      {FAQ_STATUS_LABELS[status]}
    </span>
  );
}

function SourceList({ sources }: { sources: FaqSourceRef[] }) {
  return (
    <>
      {sources.map((source, index) => {
        const label = source.date ? `${source.label} (${formatDate(`${source.date}T12:00:00`)})` : source.label;

        return (
          <span key={source.key}>
            {index > 0 ? "; " : ""}
            {source.href ? (
              <a
                href={source.href}
                target={source.href.startsWith("/") ? undefined : "_blank"}
                rel="noreferrer"
                className="font-semibold text-[#0f7c80] underline underline-offset-2 hover:text-[#171b4a]"
              >
                {label}
              </a>
            ) : (
              <span className="font-semibold text-[#3b4250]">{label}</span>
            )}
          </span>
        );
      })}
    </>
  );
}

const NAME_STORAGE_KEY = "willow-faq-suggester-name";

const FIELD_CLASS =
  "mt-2 w-full rounded-xl border border-[#171b4a]/15 bg-white px-4 py-3 text-[15px] text-[#252b37] outline-none transition focus:border-[#17bfc2] focus:ring-4 focus:ring-[#17e1e3]/15";

// Sends a suggested improvement to one answer. It reaches James and Ryan as a
// pull request they can accept, revise, or reject.
function SuggestForm({ item, onDone }: { item: FaqItem; onDone: () => void }) {
  const [answer, setAnswer] = useState(item.answer);
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"editing" | "sending" | "sent">("editing");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      // Remembering the name is a convenience; storage can be unavailable.
      setName(window.localStorage.getItem(NAME_STORAGE_KEY) ?? "");
    } catch {}
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState("sending");
    setError("");

    try {
      const response = await fetch("/one-goal-planning/faq/suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ itemId: item.id, suggestedAnswer: answer, reason, suggestedBy: name }),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload ? (payload as { error?: unknown }).error : null;
        throw new Error(typeof message === "string" ? message : "The suggestion could not be sent.");
      }

      try {
        window.localStorage.setItem(NAME_STORAGE_KEY, name.trim());
      } catch {}
      setState("sent");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "The suggestion could not be sent.");
      setState("editing");
    }
  };

  if (state === "sent") {
    return (
      <div role="status" className="mt-5 rounded-xl bg-[#e8f9ea] px-4 py-3 text-sm text-[#315c3b]">
        <p className="font-bold">Thanks, your suggestion is in.</p>
        <p className="mt-1">James and Ryan will review it and accept or revise it. The answer here changes once they do.</p>
        <button type="button" onClick={onDone} className="mt-2 text-xs font-bold text-[#0f7c80] hover:underline">
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4 rounded-xl border border-[#171b4a]/10 bg-[#fafaf8] p-4 sm:p-5">
      <p className="text-sm font-bold text-[#171b4a]">Suggest an improvement</p>
      <div>
        <label htmlFor={`suggest-reason-${item.id}`} className="text-sm font-semibold text-[#171b4a]">
          What is dated or wrong?
        </label>
        <textarea
          id={`suggest-reason-${item.id}`}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={2}
          required
          minLength={5}
          maxLength={2000}
          placeholder="e.g. Pricing guidance went out at Workshop 3 on Oct 26."
          className={FIELD_CLASS}
        />
      </div>
      <div>
        <label htmlFor={`suggest-answer-${item.id}`} className="text-sm font-semibold text-[#171b4a]">
          The answer as it should read
        </label>
        <textarea
          id={`suggest-answer-${item.id}`}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          rows={Math.min(16, Math.max(5, Math.ceil(answer.length / 90)))}
          required
          maxLength={12000}
          className={`${FIELD_CLASS} leading-6`}
        />
      </div>
      <div>
        <label htmlFor={`suggest-name-${item.id}`} className="text-sm font-semibold text-[#171b4a]">
          Your name
        </label>
        <input
          id={`suggest-name-${item.id}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className={FIELD_CLASS}
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-semibold text-[#a52d1f]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-[#171b4a] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? "Sending…" : "Send suggestion"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={state === "sending"}
          className="rounded-full border border-[#171b4a]/12 bg-white px-5 py-2.5 text-sm font-bold text-[#59635f] transition-colors hover:text-[#171b4a]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FaqEntry({
  item,
  isOpen,
  onToggle,
  update,
  now,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  update: FaqUpdate | undefined;
  now: number;
}) {
  const [copied, setCopied] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const isRecent = update && now > 0 && now - Date.parse(update.at) < RECENT_CHANGE_MS;

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${item.id}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      window.location.hash = `faq-${item.id}`;
    }
  };

  return (
    <li
      id={`faq-${item.id}`}
      className="scroll-mt-6 rounded-2xl border border-[#171b4a]/10 bg-white shadow-[0_1px_2px_rgba(23,27,74,0.05)]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-6"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold leading-snug text-[#171b4a]">{item.question}</span>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={item.status} />
            {item.statusNote ? (
              <span className="text-xs font-semibold text-[#737b78]">{item.statusNote}</span>
            ) : null}
            {isRecent && update ? (
              <span className="inline-flex rounded-full bg-[#171b4a] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#acf7b2]">
                {update.kind === "added" ? "New" : "Updated"} {formatDate(update.at)}
              </span>
            ) : null}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#f1f1ed] text-[#59635f] transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      {isOpen ? (
        <div id={`faq-answer-${item.id}`} className="border-t border-[#171b4a]/10 px-5 py-5 sm:px-6">
          <div className="text-[15px] text-[#3b4250]">
            <Answer content={item.answer} />
          </div>
          <div className="mt-5 flex flex-col gap-3 border-t border-dashed border-[#171b4a]/10 pt-4 text-sm text-[#737b78] sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0">
              {update ? (
                <>
                  Updated automatically {formatDate(update.at)} from <SourceList sources={update.sources} />.
                </>
              ) : (
                "From the Sept 29 FAQ, or edited since by hand."
              )}
            </p>
            <div className="flex shrink-0 flex-wrap gap-2 self-start">
              <button
                type="button"
                onClick={() => setIsSuggesting(true)}
                disabled={isSuggesting}
                className="rounded-full border border-[#171b4a]/12 bg-white px-3.5 py-1.5 text-xs font-bold text-[#59635f] transition-colors hover:border-[#17bfc2] hover:text-[#171b4a] disabled:opacity-50"
              >
                Suggest an improvement
              </button>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="rounded-full border border-[#171b4a]/12 bg-white px-3.5 py-1.5 text-xs font-bold text-[#59635f] transition-colors hover:border-[#17bfc2] hover:text-[#171b4a]"
              >
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
          </div>
          {isSuggesting ? <SuggestForm item={item} onDone={() => setIsSuggesting(false)} /> : null}
        </div>
      ) : null}
    </li>
  );
}

function UpdateEntry({ update, onOpen }: { update: FaqUpdate; onOpen: (itemId: string) => void }) {
  const [showBefore, setShowBefore] = useState(false);

  return (
    <li className="rounded-xl border border-[#171b4a]/10 bg-white px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-[#171b4a]">
          {update.kind === "added" ? "New question" : "Answer updated"}
        </span>
        <span className="text-[#8b9692]">{formatDateTime(update.at)}</span>
      </div>
      <button
        type="button"
        onClick={() => onOpen(update.itemId)}
        className="mt-2 text-left font-semibold text-[#171b4a] underline-offset-2 hover:underline"
      >
        {update.question}
      </button>
      <p className="mt-1 text-sm leading-6 text-[#59635f]">
        {update.reason}
        {update.sources.length > 0 ? (
          <>
            {" "}Source: <SourceList sources={update.sources} />.
          </>
        ) : null}
      </p>
      {update.previousAnswer ? (
        <button
          type="button"
          onClick={() => setShowBefore((value) => !value)}
          className="mt-2 text-xs font-bold text-[#0f7c80] hover:underline"
        >
          {showBefore ? "Hide the earlier answer" : "Show the earlier answer"}
        </button>
      ) : null}
      {showBefore && update.previousAnswer ? (
        <div className="mt-3 rounded-lg bg-[#f5f5f2] px-4 py-3 text-sm text-[#59635f]">
          <Answer content={update.previousAnswer} />
        </div>
      ) : null}
    </li>
  );
}

export function FaqBrowser({
  sections,
  updates,
  lastCheckedAt,
}: {
  sections: FaqSection[];
  updates: FaqUpdate[];
  lastCheckedAt: string | null;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [now, setNow] = useState(0);

  const allItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);
  const knownIds = useMemo(() => new Set(allItems.map((item) => item.id)), [allItems]);
  // Newest change per question, for the "Updated" marker and its sources.
  const latestUpdate = useMemo(() => {
    const byItem = new Map<string, FaqUpdate>();
    for (const update of updates) {
      if (!byItem.has(update.itemId)) {
        byItem.set(update.itemId, update);
      }
    }
    return byItem;
  }, [updates]);
  const visibleUpdates = updates.filter((update) => knownIds.has(update.itemId));

  const openItem = (id: string, smooth = true) => {
    setQuery("");
    setStatusFilter("all");
    setOpenIds((current) => new Set(current).add(id));
    window.requestAnimationFrame(() =>
      document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }),
    );
  };

  // Time-based markers are computed after mount so server and client agree,
  // and a linked question opens on arrival.
  useEffect(() => {
    setNow(Date.now());
    const id = window.location.hash.replace(/^#faq-/, "");
    if (id && knownIds.has(id)) {
      openItem(id, false);
    }
    // Runs once on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const isFiltering = terms.length > 0 || statusFilter !== "all";
  const visibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const text = `${item.question}\n${item.answer}`.toLowerCase();
        return (statusFilter === "all" || item.status === statusFilter) && terms.every((term) => text.includes(term));
      }),
    }))
    .filter((section) => !isFiltering || section.items.length > 0);
  const visibleCount = visibleSections.reduce((total, section) => total + section.items.length, 0);
  const visibleIds = visibleSections.flatMap((section) => section.items.map((item) => item.id));
  const allOpen = visibleIds.length > 0 && visibleIds.every((id) => openIds.has(id));
  const statusCounts = Object.fromEntries(
    FAQ_STATUSES.map((status) => [status, allItems.filter((item) => item.status === status).length]),
  ) as Record<FaqStatus, number>;

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const shownUpdates = showAllUpdates ? visibleUpdates : visibleUpdates.slice(0, COLLAPSED_UPDATE_COUNT);

  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#252b37]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <a
          href="/one-goal-planning"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#59635f] hover:text-[#171b4a]"
        >
          <span aria-hidden="true">←</span> Partnership workspace
        </a>

        <header className="mt-5 rounded-2xl bg-[#171b4a] px-6 py-10 text-white sm:px-10 sm:py-14">
          <span className="inline-flex rounded-md bg-[#acf7b2] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.13em] text-[#171b4a]">
            For sales and implementation teams
          </span>
          <h1 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl">Partnership FAQ</h1>
          <p className="mt-5 max-w-3xl text-lg font-semibold text-white/75">
            The shared answer sheet for OneGoal and Willow teams selling and launching the integrated model. It
            updates as new meeting notes, documents, and workstream changes land in the workspace.
          </p>
          {lastCheckedAt ? (
            <p className="mt-5 text-sm text-white/60">Last updated from the workspace {formatDateTime(lastCheckedAt)}.</p>
          ) : null}
        </header>

        {visibleUpdates.length > 0 ? (
          <section className="mt-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#c93623]">Recent updates</p>
            <ul className="mt-3 space-y-2.5">
              {shownUpdates.map((update) => (
                <UpdateEntry key={update.id} update={update} onOpen={openItem} />
              ))}
            </ul>
            {visibleUpdates.length > COLLAPSED_UPDATE_COUNT ? (
              <button
                type="button"
                onClick={() => setShowAllUpdates((value) => !value)}
                className="mt-3 text-sm font-bold text-[#0f7c80] hover:underline"
              >
                {showAllUpdates ? "Show fewer" : `Show all ${visibleUpdates.length} updates`}
              </button>
            ) : null}
          </section>
        ) : null}

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="block w-full lg:max-w-md">
              <span className="sr-only">Search the FAQ</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions and answers"
                className="w-full rounded-full border border-[#171b4a]/15 bg-white px-5 py-3 text-[#252b37] outline-none transition focus:border-[#17bfc2] focus:ring-4 focus:ring-[#17e1e3]/15"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
              {(["all", ...FAQ_STATUSES] as StatusFilter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={statusFilter === option}
                  onClick={() => setStatusFilter(option)}
                  className={
                    statusFilter === option
                      ? "rounded-full bg-[#171b4a] px-4 py-2 text-sm font-bold text-white"
                      : "rounded-full bg-white px-4 py-2 text-sm font-bold text-[#59635f] transition-colors hover:text-[#171b4a]"
                  }
                >
                  {option === "all" ? `All ${allItems.length}` : `${FAQ_STATUS_LABELS[option]} ${statusCounts[option]}`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setOpenIds(allOpen ? new Set() : new Set(visibleIds))}
                className="rounded-full border border-[#171b4a]/12 bg-white px-4 py-2 text-sm font-bold text-[#59635f] transition-colors hover:border-[#17bfc2] hover:text-[#171b4a]"
              >
                {allOpen ? "Collapse all" : "Expand all"}
              </button>
            </div>
          </div>

          {!isFiltering ? (
            <nav aria-label="FAQ sections" className="mt-6 flex flex-wrap gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  className="rounded-full border border-[#171b4a]/10 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-[#59635f] transition-colors hover:border-[#17bfc2] hover:text-[#171b4a]"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          ) : (
            <p className="mt-6 text-sm font-semibold text-[#59635f]">
              {visibleCount} {visibleCount === 1 ? "answer matches" : "answers match"}.
            </p>
          )}

          {visibleSections.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-[#171b4a]/20 bg-white/65 px-6 py-14 text-center text-[#59635f]">
              Nothing matches. Try fewer words, or ask Jenny or James.
            </div>
          ) : (
            <div className="mt-10 space-y-14 pb-16">
              {visibleSections.map((section) => (
                <section key={section.id} id={`section-${section.id}`} className="scroll-mt-6">
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#171b4a]">{section.title}</h2>
                  {section.intro && !isFiltering ? (
                    <div className="mt-4 max-w-4xl text-[15px] text-[#3b4250]">
                      <Answer content={section.intro} />
                    </div>
                  ) : null}
                  {section.items.length > 0 ? (
                    <ul className="mt-6 space-y-3">
                      {section.items.map((item) => (
                        <FaqEntry
                          key={item.id}
                          item={item}
                          isOpen={openIds.has(item.id)}
                          onToggle={() => toggle(item.id)}
                          update={latestUpdate.get(item.id)}
                          now={now}
                        />
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
