import type { Metadata } from "next";
import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { parseFaq } from "@/lib/one-goal-faq/format";
import { isFaqUpdateLog, type FaqUpdateLog } from "@/lib/one-goal-faq/update";
import {
  checkWorkspaceSession,
  WORKSPACE_BASE_PATH,
  WORKSPACE_SESSION_COOKIE,
} from "@/lib/one-goal-faq/workspace";
import { FaqBrowser } from "./FaqBrowser";

// Partnership-internal: behind the workspace passcode and never indexed.
export const metadata: Metadata = {
  title: "Partnership FAQ | Willow × OneGoal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalid: "That passcode did not work. Try again.",
  unavailable: "The partnership workspace could not be reached. Try again in a moment.",
};

function PasscodeForm({ error }: { error?: string }) {
  return (
    <main className="min-h-screen bg-[#f5f5f2] flex items-center justify-center px-4">
      <form
        method="post"
        action={`${WORKSPACE_BASE_PATH}/faq/login`}
        className="w-full max-w-sm rounded-2xl bg-white border border-[#171b4a]/10 p-8 shadow-[0_1px_3px_rgba(23,27,74,0.08)]"
      >
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c93623]">Willow × OneGoal</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#171b4a]">Partnership FAQ</h1>
        <p className="mt-2 text-sm leading-6 text-[#59635f]">Enter the partnership workspace passcode.</p>
        <label htmlFor="passcode" className="sr-only">
          Passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="mt-5 w-full rounded-xl border border-[#171b4a]/15 bg-white px-4 py-3 text-[#252b37] outline-none transition focus:border-[#17bfc2] focus:ring-4 focus:ring-[#17e1e3]/15"
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm font-semibold text-[#a52d1f]">
            {ERRORS[error] ?? ERRORS.invalid}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-[#171b4a] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Open the FAQ
        </button>
      </form>
    </main>
  );
}

async function readContent() {
  const directory = join(process.cwd(), "content");
  const [markdown, rawLog] = await Promise.all([
    readFile(join(directory, "one-goal-faq.md"), "utf8"),
    readFile(join(directory, "one-goal-faq-updates.json"), "utf8"),
  ]);
  const log: unknown = JSON.parse(rawLog);
  const emptyLog: FaqUpdateLog = { seedAsOf: "", lastCheckedAt: null, processedSources: {}, updates: [] };

  return { faq: parseFaq(markdown), log: isFaqUpdateLog(log) ? log : emptyLog };
}

export default async function PartnershipFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const token = (await cookies()).get(WORKSPACE_SESSION_COOKIE)?.value;
  const session = await checkWorkspaceSession(token);

  if (session !== "valid") {
    const { error } = await searchParams;
    return <PasscodeForm error={session === "unavailable" && token ? "unavailable" : error} />;
  }

  const { faq, log } = await readContent();

  return (
    <FaqBrowser
      sections={faq.sections}
      updates={log.updates.slice(0, 60)}
      lastCheckedAt={log.lastCheckedAt}
    />
  );
}
