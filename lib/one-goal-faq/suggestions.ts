// Suggested improvements to FAQ answers. People with the workspace passcode
// submit them on the FAQ page; a GitHub Action turns each one into a pull
// request against content/one-goal-faq.md, where James or Ryan merge it to
// accept, edit it to revise, or close it to reject. Pure functions only.

import { allItems, type FaqDocument, type FaqItem } from "./format";

export const SUGGESTION_LIMITS = {
  answer: 12_000,
  reasonMin: 5,
  reason: 2_000,
  nameMin: 2,
  name: 100,
} as const;

export type SuggestionInput = {
  itemId: string;
  suggestedAnswer: string;
  reason: string;
  suggestedBy: string;
};

// A row in the faq_suggestions table (supabase/faq_suggestions.sql).
export type FaqSuggestion = {
  id: string;
  created_at: string;
  item_id: string;
  question: string;
  current_answer: string;
  suggested_answer: string;
  reason: string;
  suggested_by: string;
};

export function readSuggestionInput(
  value: unknown,
): { ok: true; input: SuggestionInput } | { ok: false; error: string } {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const text = (key: string) => (typeof record[key] === "string" ? (record[key] as string).trim() : "");
  const input = {
    itemId: text("itemId"),
    suggestedAnswer: text("suggestedAnswer"),
    reason: text("reason"),
    suggestedBy: text("suggestedBy"),
  };

  if (!input.itemId) {
    return { ok: false, error: "Choose a question to suggest a change to." };
  }

  if (!input.suggestedAnswer || input.suggestedAnswer.length > SUGGESTION_LIMITS.answer) {
    return { ok: false, error: "Write the answer as you think it should read." };
  }

  if (input.reason.length < SUGGESTION_LIMITS.reasonMin || input.reason.length > SUGGESTION_LIMITS.reason) {
    return { ok: false, error: "Say briefly what is dated or wrong." };
  }

  if (input.suggestedBy.length < SUGGESTION_LIMITS.nameMin || input.suggestedBy.length > SUGGESTION_LIMITS.name) {
    return { ok: false, error: "Add your name so James or Ryan can follow up." };
  }

  return { ok: true, input };
}

export function findItem(document: FaqDocument, itemId: string) {
  return allItems(document).find((item) => item.id === itemId) ?? null;
}

// Replaces one answer. Matches by id first, then by the question as it read
// when the suggestion was made, in case an earlier edit changed the id.
export function applySuggestion(
  document: FaqDocument,
  suggestion: Pick<FaqSuggestion, "item_id" | "question" | "suggested_answer">,
): { document: FaqDocument; before: FaqItem; after: FaqItem } | null {
  const matches = (item: FaqItem) =>
    item.id === suggestion.item_id || item.question.toLowerCase() === suggestion.question.toLowerCase();
  const section = document.sections.find((candidate) => candidate.items.some(matches));

  if (!section) {
    return null;
  }

  const before = section.items.find(matches)!;
  const after: FaqItem = { ...before, answer: suggestion.suggested_answer.trim() };

  return {
    before,
    after,
    document: {
      ...document,
      sections: document.sections.map((candidate) =>
        candidate === section
          ? { ...candidate, items: candidate.items.map((item) => (item === before ? after : item)) }
          : candidate,
      ),
    },
  };
}

function quote(text: string) {
  return text
    .trim()
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

export function suggestionPullRequest(suggestion: FaqSuggestion, before: FaqItem) {
  const submitted = new Date(suggestion.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
  const changedSince = before.answer.trim() !== suggestion.current_answer.trim();

  return {
    title: `FAQ suggestion: ${suggestion.question}`.slice(0, 240),
    body: [
      `**${suggestion.suggested_by}** suggested a change to this answer on ${submitted}.`,
      "",
      "**Why**",
      "",
      quote(suggestion.reason),
      "",
      "- **Accept:** merge this pull request. The FAQ updates within a few minutes.",
      "- **Revise:** edit `content/one-goal-faq.md` in this pull request (Files changed → ⋯ → Edit file), then merge.",
      "- **Reject:** close it.",
      ...(changedSince
        ? ["", "_The answer has changed since this suggestion was made. Compare against the current version below before merging._"]
        : []),
      "",
      "**Current answer**",
      "",
      quote(before.answer),
      "",
      "**Suggested answer**",
      "",
      quote(suggestion.suggested_answer),
      "",
    ].join("\n"),
  };
}
