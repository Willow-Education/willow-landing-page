// Turns new FAQ suggestions into pull requests. Run by
// .github/workflows/faq-suggestions.yml from a checkout of main.
//
//   SUPABASE_URL               the project URL
//   SUPABASE_SERVICE_ROLE_KEY  reads and updates faq_suggestions
//   GH_TOKEN                   used by the gh CLI to open pull requests
//   FAQ_REVIEWERS              optional, comma-separated GitHub usernames

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { parseFaq, serializeFaq } from "../lib/one-goal-faq/format";
import { applySuggestion, suggestionPullRequest, type FaqSuggestion } from "../lib/one-goal-faq/suggestions";

const FAQ_FILE = "content/one-goal-faq.md";
// A cap per run keeps a burst of junk submissions from flooding the repo.
const MAX_PER_RUN = 10;

function run(command: string, args: string[]) {
  return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();
}

async function supabase(path: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", ...init.headers },
  });

  if (!response.ok) {
    throw new Error(`Supabase returned HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  return response;
}

async function mark(id: string, fields: Record<string, string>) {
  await supabase(`faq_suggestions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify(fields),
  });
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("Skipping: add the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY repository secrets to turn on FAQ suggestions.");
    return;
  }

  const response = await supabase(
    `faq_suggestions?status=eq.new&order=created_at.asc&limit=${MAX_PER_RUN}&select=id,created_at,item_id,question,current_answer,suggested_answer,reason,suggested_by`,
  );
  const suggestions = (await response.json()) as FaqSuggestion[];

  if (suggestions.length === 0) {
    console.log("No new FAQ suggestions.");
    return;
  }

  const base = run("git", ["rev-parse", "HEAD"]);
  const reviewers = (process.env.FAQ_REVIEWERS ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  for (const suggestion of suggestions) {
    run("git", ["checkout", "--quiet", "--force", base]);
    const applied = applySuggestion(parseFaq(readFileSync(join(process.cwd(), FAQ_FILE), "utf8")), suggestion);

    if (!applied) {
      console.log(`"${suggestion.question}" is no longer in the FAQ; marking the suggestion unmatched.`);
      await mark(suggestion.id, { status: "unmatched" });
      continue;
    }

    const branch = `faq-suggestion/${suggestion.id.slice(0, 8)}`;
    const { title, body } = suggestionPullRequest(suggestion, applied.before);
    const bodyFile = join(process.env.RUNNER_TEMP ?? "/tmp", `faq-suggestion-${suggestion.id}.md`);
    writeFileSync(bodyFile, body);
    writeFileSync(join(process.cwd(), FAQ_FILE), serializeFaq(applied.document));

    run("git", ["checkout", "--quiet", "-B", branch]);
    run("git", ["add", FAQ_FILE]);
    run("git", [
      "commit",
      "--quiet",
      "--allow-empty",
      "-m",
      `Suggested FAQ change: ${suggestion.question}`.slice(0, 200),
      "-m",
      `Suggested by ${suggestion.suggested_by}.`,
    ]);
    run("git", ["push", "--quiet", "--force", "origin", branch]);

    // A rerun after a failure partway through finds the pull request it
    // already opened instead of opening another.
    let url = "";
    try {
      url = run("gh", ["pr", "view", branch, "--json", "url,state", "--jq", 'select(.state == "OPEN") | .url']);
    } catch {}
    if (!url) {
      url = run("gh", ["pr", "create", "--base", "main", "--head", branch, "--title", title, "--body-file", bodyFile]);
    }

    for (const reviewer of reviewers) {
      try {
        run("gh", ["pr", "edit", url, "--add-reviewer", reviewer]);
      } catch {
        console.log(`Could not request a review from ${reviewer}.`);
      }
    }

    await mark(suggestion.id, { status: "opened", pull_request_url: url });
    console.log(`Opened ${url} for "${suggestion.question}" (from ${suggestion.suggested_by}).`);
  }

  run("git", ["checkout", "--quiet", "--force", base]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
