"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { WORKSPACE_BASE_PATH } from "@/lib/one-goal-faq/workspace";

// Alma is the partnership workspace's guide. The workspace app owns her: this
// page only renders the chat and posts to the workspace's ask endpoint, which
// shares this domain and the passcode cookie, so the answers and the record
// behind them are the same ones the workspace pages get. Keep the limits in
// step with the workspace's planning-records.ts.
const ASK_URL = `${WORKSPACE_BASE_PATH}/api/ask`;
const MAX_QUESTION_CHARACTERS = 1_000;
const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_MESSAGE_CHARACTERS = 4_000;

const STARTERS = [
  "What has the partnership decided most recently?",
  "What is still unresolved from the last few meetings?",
  "Who should I talk to about district data and safety?",
];

type Citation = { meetingNoteId: string; quote: string | null };
type CitedMeeting = { id: string; title: string; meetingDate: string | null };

type Turn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  citedMeetings?: CitedMeeting[];
};

type Answer = { answer: string; citations: Citation[]; citedMeetings: CitedMeeting[] };

function readAnswer(payload: unknown): Answer | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const value = payload as Record<string, unknown>;

  if (typeof value.answer !== "string" || !Array.isArray(value.citations)) {
    return null;
  }

  const citations = value.citations.filter(
    (citation): citation is Citation =>
      Boolean(citation) &&
      typeof citation === "object" &&
      typeof (citation as Citation).meetingNoteId === "string" &&
      ((citation as Citation).quote === null || typeof (citation as Citation).quote === "string"),
  );
  const citedMeetings = Array.isArray(value.citedMeetings)
    ? value.citedMeetings.filter(
        (meeting): meeting is CitedMeeting =>
          Boolean(meeting) &&
          typeof meeting === "object" &&
          typeof (meeting as CitedMeeting).id === "string" &&
          typeof (meeting as CitedMeeting).title === "string" &&
          ((meeting as CitedMeeting).meetingDate === null ||
            typeof (meeting as CitedMeeting).meetingDate === "string"),
      )
    : [];

  return { answer: value.answer, citations, citedMeetings };
}

// Same wording and format as the workspace's Meeting Notes page.
function formatMeetingDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Meeting date not captured";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function isWorkspaceLink(href: string | undefined) {
  return Boolean(href && (href === WORKSPACE_BASE_PATH || href.startsWith(`${WORKSPACE_BASE_PATH}/`)));
}

// Model output: raw HTML off, images out. Workspace links stay in this tab;
// anything else opens in a new one.
function AnswerBody({ content }: { content: string }) {
  return (
    <div className="faq-markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        disallowedElements={["img"]}
        components={{
          a: ({ href, children }) =>
            isWorkspaceLink(href) ? (
              <a href={href}>{children}</a>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
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

function AlmaMark({ size = "size-9" }: { size?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid ${size} shrink-0 place-items-center rounded-full bg-[#acf7b2] text-sm font-black text-[#171b4a]`}
    >
      A
    </span>
  );
}

function Sources({ citations, citedMeetings }: { citations: Citation[]; citedMeetings: CitedMeeting[] }) {
  const cited = citations
    .map((citation) => ({
      citation,
      meeting: citedMeetings.find((meeting) => meeting.id === citation.meetingNoteId),
    }))
    .filter((entry): entry is { citation: Citation; meeting: CitedMeeting } => entry.meeting !== undefined);

  if (cited.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-[#171b4a]/10 pt-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#c93623]">Sources</p>
      <ul className="mt-2 space-y-2">
        {cited.map(({ citation, meeting }) => (
          <li key={`${meeting.id}-${citation.quote ?? ""}`}>
            <a
              href={`${WORKSPACE_BASE_PATH}/meeting-notes#meeting-note-${encodeURIComponent(meeting.id)}`}
              className="block w-full rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[#f1f1ed]"
            >
              <span className="block text-[13px] font-bold text-[#171b4a]">{meeting.title}</span>
              <span className="block text-xs text-[#737b78]">{formatMeetingDate(meeting.meetingDate)}</span>
              {citation.quote ? (
                <span className="mt-1.5 block border-l-2 border-[#17e1e3] pl-2.5 text-xs italic leading-5 text-[#59635f]">
                  “{citation.quote}”
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AlmaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, isPending]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, isOpen]);

  const ask = useCallback(
    async (rawQuestion: string) => {
      const trimmed = rawQuestion.trim();

      if (!trimmed || isPending) {
        return;
      }

      setError("");
      setIsPending(true);
      setQuestion("");

      const asked: Turn = { id: crypto.randomUUID(), role: "user", content: trimmed };
      // Snapshot before appending so the request carries the prior turns only.
      const history = turns.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({
        role,
        content: content.slice(0, MAX_HISTORY_MESSAGE_CHARACTERS),
      }));

      setTurns((current) => [...current, asked]);

      try {
        const response = await fetch(ASK_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question: trimmed, history, assistant: "alma", currentPage: "/faq" }),
        });
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            payload && typeof payload === "object" && "error" in payload
              ? (payload as { error?: unknown }).error
              : undefined;

          throw new Error(typeof message === "string" ? message : "Alma could not answer that.");
        }

        const answer = readAnswer(payload);

        if (!answer) {
          throw new Error("Alma returned an incomplete answer.");
        }

        setTurns((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: answer.answer,
            citations: answer.citations,
            citedMeetings: answer.citedMeetings,
          },
        ]);
      } catch (askError) {
        setError(askError instanceof Error ? askError.message : "Alma could not answer that.");
        // Put the question back so a failed ask is one click from a retry.
        setTurns((current) => current.filter((turn) => turn.id !== asked.id));
        setQuestion(trimmed);
      } finally {
        setIsPending(false);
      }
    },
    [isPending, turns],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(question);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void ask(question);
    }
  };

  const startOver = () => {
    setTurns([]);
    setError("");
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ask Alma, the workspace guide"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#171b4a] py-2 pl-2 pr-5 text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(23,27,74,0.28)] transition-transform hover:-translate-y-0.5"
      >
        <AlmaMark size="size-8" />
        Ask Alma
      </button>
    );
  }

  return (
    <section
      role="dialog"
      aria-label="Alma, the workspace guide"
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-white text-[#252b37] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(44rem,calc(100dvh-2.5rem))] sm:w-[26rem] sm:rounded-2xl sm:border sm:border-[#171b4a]/10 sm:shadow-[0_18px_48px_rgba(23,27,74,0.24)]"
    >
      <header className="flex items-center gap-3 border-b border-[#171b4a]/10 px-5 py-4">
        <AlmaMark />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-[#171b4a]">Alma</h2>
          <p className="text-xs text-[#737b78]">Willow&apos;s AI assistant</p>
        </div>
        {turns.length > 0 ? (
          <button
            type="button"
            onClick={startOver}
            disabled={isPending}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-[#59635f] transition-colors hover:bg-[#f1f1ed] hover:text-[#171b4a] disabled:opacity-50"
          >
            Start over
          </button>
        ) : null}
        <button
          type="button"
          onClick={close}
          aria-label="Close Alma"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-[#171b4a]/10 bg-white text-xl leading-none text-[#59635f] transition-colors hover:border-[#17bfc2] hover:text-[#171b4a]"
        >
          ×
        </button>
      </header>

      <div ref={conversationRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        {turns.length === 0 ? (
          <div>
            <p className="leading-6 text-[#59635f]">
              Hi, I&apos;m Alma, Willow&apos;s AI assistant. Ask me anything about the partnership, or where to find something in the
              workspace. I answer from the operating plan, the workstreams, the people directory, and the
              meeting record.
            </p>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#c93623]">Try asking</p>
            <div className="mt-3 space-y-2">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void ask(starter)}
                  className="w-full rounded-xl border border-[#171b4a]/12 bg-[#fafaf7] px-3.5 py-3 text-left text-[13px] font-semibold leading-5 text-[#171b4a] transition-colors hover:border-[#17bfc2] hover:bg-white"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {turns.map((turn) =>
              turn.role === "user" ? (
                <div key={turn.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[#171b4a] px-4 py-2.5 text-sm leading-6 text-white">
                    {turn.content}
                  </p>
                </div>
              ) : (
                <div
                  key={turn.id}
                  className="rounded-2xl rounded-bl-md border border-[#171b4a]/10 bg-[#fafaf7] px-4 py-3.5 text-sm text-[#252b37]"
                >
                  <AnswerBody content={turn.content} />
                  {turn.citations && turn.citedMeetings ? (
                    <Sources citations={turn.citations} citedMeetings={turn.citedMeetings} />
                  ) : null}
                </div>
              ),
            )}
          </div>
        )}

        {isPending ? (
          <div
            role="status"
            className="mt-5 flex items-center gap-3 rounded-xl bg-[#e8f9ea] px-4 py-3 text-sm font-semibold text-[#315c3b]"
          >
            <span
              className="size-4 animate-spin rounded-full border-2 border-[#315c3b]/25 border-t-[#315c3b]"
              aria-hidden="true"
            />
            Alma is reading the workspace…
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[#171b4a]/10 px-5 py-4">
        {error ? (
          <p role="alert" className="mb-3 rounded-xl bg-[#fff0ed] px-3.5 py-2.5 text-sm font-semibold text-[#a52d1f]">
            {error}
          </p>
        ) : null}
        <textarea
          ref={inputRef}
          value={question}
          disabled={isPending}
          maxLength={MAX_QUESTION_CHARACTERS}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          aria-label="Your question for Alma"
          placeholder="Ask about the plan, a workstream, a meeting…"
          className="w-full resize-none rounded-xl border border-[#171b4a]/15 bg-white px-3.5 py-2.5 text-sm leading-6 text-[#252b37] outline-none transition focus:border-[#17bfc2] focus:ring-4 focus:ring-[#17e1e3]/15 disabled:bg-[#f1f1ed]"
        />
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="text-xs text-[#8b9692]">Enter to send · Shift+Enter for a new line</span>
          <button
            type="submit"
            disabled={isPending || question.trim().length === 0}
            className="rounded-full bg-[#ff4f35] px-5 py-2.5 text-sm font-extrabold text-[#171b4a] shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50"
          >
            {isPending ? "Asking…" : "Ask"}
          </button>
        </div>
      </form>
    </section>
  );
}
