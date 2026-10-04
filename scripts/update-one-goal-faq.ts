// Brings the partnership FAQ up to date with the workspace. Run every Monday
// by .github/workflows/update-one-goal-faq.yml, which opens a pull request
// with whatever this changes in content/; merging it publishes the changes.
//
//   WORKSPACE_PASSCODE  the partnership workspace passcode
//   OPENAI_API_KEY      key for the model that revises answers
//   OPENAI_MODEL        optional, defaults to the workspace's model
//   WORKSPACE_ORIGIN    optional, defaults to https://www.willowed.org
//   FAQ_SUMMARY_PATH    optional; where to write the pull request description

import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { parseFaq, serializeFaq } from "../lib/one-goal-faq/format";
import {
  applyProposal,
  batchForModel,
  collectWorkspaceSources,
  faqForModel,
  isFaqProposal,
  isFaqUpdateLog,
  pendingSources,
  proposalSchema,
  recordBatch,
  selectBatch,
  SYSTEM_PROMPT,
  withBaseline,
  type FaqProposal,
  type FaqSource,
  type FaqUpdate,
} from "../lib/one-goal-faq/update";

const FAQ_PATH = join(process.cwd(), "content/one-goal-faq.md");
const LOG_PATH = join(process.cwd(), "content/one-goal-faq-updates.json");
const ORIGIN = (process.env.WORKSPACE_ORIGIN ?? "https://www.willowed.org").replace(/\/$/, "");
const BASE = `${ORIGIN}/one-goal-planning`;
const MAX_BATCHES_PER_RUN = 10;

async function signIn(passcode: string) {
  const response = await fetch(`${BASE}/api/access`, {
    method: "POST",
    body: new URLSearchParams({ passcode }),
    redirect: "manual",
  });
  const cookie = response.headers
    .getSetCookie()
    .map((header) => header.split(";")[0])
    .find((pair) => pair.startsWith("one_goal_planning_access="));

  if (!cookie) {
    throw new Error(`The workspace did not accept the passcode (HTTP ${response.status}).`);
  }

  return cookie;
}

async function getJson(path: string, cookie: string) {
  const response = await fetch(`${BASE}${path}`, { headers: { cookie } });

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}.`);
  }

  return (await response.json()) as unknown;
}

function listFrom(payload: unknown, key: string) {
  const value = payload && typeof payload === "object" ? (payload as Record<string, unknown>)[key] : null;
  return Array.isArray(value) ? value : [];
}

async function propose(apiKey: string, input: unknown[]): Promise<FaqProposal> {
  const response = await fetch(`${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/responses`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      store: false,
      max_output_tokens: 24_000,
      input,
      text: {
        format: { type: "json_schema", name: "partnership_faq_update", strict: true, schema: proposalSchema },
      },
    }),
    signal: AbortSignal.timeout(300_000),
  });

  if (!response.ok) {
    throw new Error(`OpenAI returned HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
  }

  const payload = (await response.json()) as {
    status?: string;
    output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
  };

  if (payload.status === "incomplete") {
    throw new Error("OpenAI left the FAQ update unfinished.");
  }

  const text = payload.output
    ?.find((item) => item.type === "message")
    ?.content?.filter((part) => part.type === "output_text")
    .map((part) => part.text ?? "")
    .join("");
  const value: unknown = text ? JSON.parse(text) : null;

  if (!isFaqProposal(value)) {
    throw new Error("OpenAI returned an FAQ update in an unexpected shape.");
  }

  return value;
}

function stableJson(value: Record<string, string>) {
  return JSON.stringify(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

function link(label: string, href: string | null) {
  if (!href) {
    return label;
  }

  return `[${label}](${href.startsWith("/") ? `${ORIGIN}${href}` : href})`;
}

function quote(text: string) {
  return text.split("\n").map((line) => `> ${line}`).join("\n");
}

// The description of the weekly pull request: every change, why, and from
// which record, so it can be reviewed without opening the files.
function summarize(updates: FaqUpdate[], reviewed: FaqSource[], document: ReturnType<typeof parseFaq>) {
  const answers = new Map(document.sections.flatMap((section) => section.items).map((item) => [item.id, item.answer]));
  const lines = [
    `This week's automatic review of the partnership workspace read ${reviewed.length} new or changed ${
      reviewed.length === 1 ? "record" : "records"
    } and proposes ${updates.length} FAQ ${updates.length === 1 ? "change" : "changes"}.`,
    "",
    "Merge to publish them at willowed.org/one-goal-planning/faq. To fix something first, edit `content/one-goal-faq.md` in this pull request. Close it to skip these changes; next Monday's run will propose them again with anything newer.",
  ];

  for (const update of updates) {
    lines.push("", `### ${update.kind === "added" ? "New question: " : ""}${update.question}`, "", update.reason);

    if (update.sources.length > 0) {
      lines.push("", `Source: ${update.sources.map((source) => link(source.date ? `${source.label} (${source.date})` : source.label, source.href)).join("; ")}`);
    }

    lines.push(
      "",
      "<details><summary>Before and after</summary>",
      "",
      update.previousAnswer ? `**Before**\n\n${quote(update.previousAnswer)}\n` : "_New question._\n",
      `**After**\n\n${quote(answers.get(update.itemId) ?? "")}`,
      "",
      "</details>",
    );
  }

  lines.push("", "<details><summary>Records reviewed</summary>", "");
  for (const record of reviewed) {
    lines.push(`- ${link(record.label, record.href)}${record.date ? ` (${record.date})` : ""}`);
  }
  lines.push("", "</details>");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const passcode = process.env.WORKSPACE_PASSCODE;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!passcode || !apiKey) {
    console.log("Skipping: add the WORKSPACE_PASSCODE and OPENAI_API_KEY repository secrets to turn on FAQ updates.");
    return;
  }

  const storedLog: unknown = JSON.parse(readFileSync(LOG_PATH, "utf8"));

  if (!isFaqUpdateLog(storedLog)) {
    throw new Error("content/one-goal-faq-updates.json is not in the expected format.");
  }

  const cookie = await signIn(passcode);
  const [context, notes, documents] = await Promise.all([
    getJson("/api/context", cookie),
    getJson("/api/meeting-notes", cookie),
    getJson("/api/documents", cookie),
  ]);
  const sources = collectWorkspaceSources({
    context,
    meetingNotes: listFrom(notes, "notes"),
    documents: listFrom(documents, "documents"),
  });

  let log = withBaseline(storedLog, sources);
  let document = parseFaq(readFileSync(FAQ_PATH, "utf8"));
  const runUpdates: FaqUpdate[] = [];
  const reviewed: FaqSource[] = [];

  for (let round = 0; round < MAX_BATCHES_PER_RUN; round += 1) {
    const pending = pendingSources(log, sources);

    if (pending.length === 0) {
      break;
    }

    const batch = selectBatch(pending, { maxSources: 8, maxCharacters: 60_000 });
    console.log(`Reviewing ${batch.length} of ${pending.length} new records: ${batch.map((record) => record.label).join("; ")}`);

    const proposal = await propose(apiKey, [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `<current_faq>\n${JSON.stringify(faqForModel(document))}\n</current_faq>` },
      {
        role: "user",
        content: `<new_records>\n${JSON.stringify(batchForModel(batch))}\n</new_records>\n\nReturn the FAQ changes these records call for.`,
      },
    ]);
    const applied = applyProposal({
      document,
      proposal,
      batch,
      now: new Date().toISOString(),
      makeId: randomUUID,
    });

    if (applied.skipped.length > 0) {
      console.log(`Skipped proposals: ${applied.skipped.join(", ")}`);
    }

    console.log(`${applied.updates.length} change(s). ${proposal.summary}`);
    document = applied.document;
    log = recordBatch(log, batch, applied.updates);
    runUpdates.push(...applied.updates);
    reviewed.push(...batch);
  }

  // Only write when something was reviewed, so a quiet week makes no commit
  // and no pull request.
  if (stableJson(log.processedSources) === stableJson(storedLog.processedSources) && storedLog.lastCheckedAt) {
    console.log("Nothing new in the workspace.");
    return;
  }

  log = { ...log, lastCheckedAt: new Date().toISOString() };
  writeFileSync(FAQ_PATH, serializeFaq(document));
  writeFileSync(LOG_PATH, `${JSON.stringify(log, null, 2)}\n`);

  if (process.env.FAQ_SUMMARY_PATH) {
    writeFileSync(process.env.FAQ_SUMMARY_PATH, summarize(runUpdates, reviewed, document));
  }

  console.log(`Done: ${runUpdates.length} FAQ change(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
