import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { allItems, parseFaq, serializeFaq } from "./format";
import { applySuggestion, findItem, readSuggestionInput, suggestionPullRequest } from "./suggestions";

const faq = parseFaq(readFileSync(join(__dirname, "../../content/one-goal-faq.md"), "utf8"));
const priced = findItem(faq, "how-is-it-priced")!;
const suggestion = {
  id: "0b5c1f7e-1111-2222-3333-444455556666",
  created_at: "2026-10-27T15:00:00Z",
  item_id: "how-is-it-priced",
  question: "How is it priced?",
  current_answer: priced.answer,
  suggested_answer: "A base price plus a per-student rate, released at Workshop 3.",
  reason: "Pricing guidance went out at Workshop 3.",
  suggested_by: "Jenny Estevez-Cray",
};

describe("reading a suggestion", () => {
  it("accepts a complete suggestion and trims it", () => {
    expect(
      readSuggestionInput({ itemId: " how-is-it-priced ", suggestedAnswer: " New. ", reason: " Dated now. ", suggestedBy: " Jenny " }),
    ).toEqual({ ok: true, input: { itemId: "how-is-it-priced", suggestedAnswer: "New.", reason: "Dated now.", suggestedBy: "Jenny" } });
  });

  it("asks for each missing piece", () => {
    const base = { itemId: "x", suggestedAnswer: "New.", reason: "Dated now.", suggestedBy: "Jenny" };
    expect(readSuggestionInput({ ...base, suggestedAnswer: " " }).ok).toBe(false);
    expect(readSuggestionInput({ ...base, reason: "old" }).ok).toBe(false);
    expect(readSuggestionInput({ ...base, suggestedBy: "J" }).ok).toBe(false);
    expect(readSuggestionInput({ ...base, suggestedAnswer: "x".repeat(12_001) }).ok).toBe(false);
    expect(readSuggestionInput(null).ok).toBe(false);
  });
});

describe("applying a suggestion", () => {
  it("replaces only that answer and keeps the file format", () => {
    const applied = applySuggestion(faq, suggestion)!;
    const written = parseFaq(serializeFaq(applied.document));

    expect(findItem(written, "how-is-it-priced")?.answer).toBe(suggestion.suggested_answer);
    expect(findItem(written, "how-is-it-priced")?.status).toBe(priced.status);
    const others = (document: typeof faq) =>
      allItems(document).filter((item) => item.id !== "how-is-it-priced").map((item) => item.answer);
    expect(others(written)).toEqual(others(faq));
  });

  it("finds the question by its wording when its id has changed", () => {
    expect(applySuggestion(faq, { ...suggestion, item_id: "old-id" })?.before.id).toBe("how-is-it-priced");
    expect(applySuggestion(faq, { ...suggestion, item_id: "gone", question: "Gone?" })).toBeNull();
  });

  it("writes a pull request that shows both versions and how to act on it", () => {
    const { title, body } = suggestionPullRequest(suggestion, priced);
    expect(title).toBe("FAQ suggestion: How is it priced?");
    expect(body).toContain("**Jenny Estevez-Cray** suggested a change to this answer on Oct 27, 2026.");
    expect(body).toContain("> Pricing guidance went out at Workshop 3.");
    expect(body).toContain("**Accept:** merge");
    expect(body).not.toContain("has changed since");
    expect(suggestionPullRequest({ ...suggestion, current_answer: "Older text." }, priced).body).toContain(
      "has changed since this suggestion was made",
    );
  });
});
