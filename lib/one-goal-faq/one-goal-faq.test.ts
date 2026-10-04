import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { allItems, parseFaq, serializeFaq } from "./format";
import {
  applyProposal,
  collectWorkspaceSources,
  isFaqProposal,
  isFaqUpdateLog,
  pendingSources,
  recordBatch,
  selectBatch,
  toIsoDate,
  withBaseline,
  type FaqProposal,
  type FaqUpdateLog,
} from "./update";

const markdown = readFileSync(join(__dirname, "../../content/one-goal-faq.md"), "utf8");
const storedLog: unknown = JSON.parse(
  readFileSync(join(__dirname, "../../content/one-goal-faq-updates.json"), "utf8"),
);

const context = {
  overview: { document: { title: "Plan" } },
  workstreams: [
    {
      slug: "sales-go-to-market",
      overview: { title: "Sales & Go-to-Market" },
      description: { topics: ["Sell"] },
      roadmap: { must_haves: { items: [] } },
      change_log: {
        entries: [
          { date: "September 16, 2026", summary: "Retreat changes.", changes: [] },
          { date: "October 1, 2026", summary: "Pricing guidance released.", changes: [] },
        ],
      },
    },
  ],
};
const oldNote = {
  id: "note-old", title: "P&G kickoff", meetingDate: "2026-09-18", createdAt: "2026-09-18T20:00:00Z",
  overview: ["Agreed an async FAQ."], decisions: [], nextSteps: [], workstreamSlugs: [],
};
const newNote = {
  id: "note-new", title: "Workshop 3", meetingDate: "2026-09-30", createdAt: "2026-10-01T14:00:00Z",
  participants: [{ name: "Jenny", organization: "onegoal" }],
  overview: ["Settled the price."], decisions: ["Base price plus per-student rate is final."],
  nextSteps: [], workstreamSlugs: ["sales-go-to-market"],
};
const sources = collectWorkspaceSources({ context, meetingNotes: [oldNote, newNote], documents: [] });
const emptyLog: FaqUpdateLog = { seedAsOf: "2026-09-29", lastCheckedAt: null, processedSources: {}, updates: [] };

let nextId = 0;
const makeId = () => `update-${(nextId += 1)}`;
const NOW = "2026-10-04T15:00:00.000Z";

function edit(overrides: Partial<FaqProposal["edits"][number]> = {}): FaqProposal["edits"][number] {
  return {
    itemId: "how-is-it-priced",
    question: "How is it priced?",
    status: "settled",
    statusNote: null,
    answer: "A base price plus a per-student rate.",
    reason: "Workshop 3 set the price.",
    sourceKeys: ["note:note-new"],
    ...overrides,
  };
}

describe("the FAQ file", () => {
  const faq = parseFaq(markdown);
  const items = allItems(faq);

  it("parses into tagged questions with unique ids", () => {
    expect(faq.title).toBe("OneGoal Partnership FAQ");
    expect(faq.sections).toHaveLength(10);
    expect(items).toHaveLength(99);
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(items.every((item) => item.answer.length > 0)).toBe(true);
    expect(items.filter((item) => item.status === null)).toHaveLength(0);
  });

  it("carries the launch edits and none of the export debris", () => {
    expect(markdown).not.toContain("PowerTogether");
    expect(markdown).not.toContain("****");
    expect(markdown).not.toContain("where the requirement is real");
    const price = items.find((item) => item.id === "what-is-the-senior-seminar-only-price");
    expect(price?.answer).toMatch(/^Senior-seminar-only pricing is coming later\./);
  });

  it("writes back exactly as it reads", () => {
    expect(serializeFaq(faq)).toBe(markdown);
  });

  it("keeps lists and tables that open an answer on their own paragraph", () => {
    const grades = items.find((item) => item.id === "what-do-students-achieve-by-grade");
    expect(grades?.answer.startsWith("| Grade |")).toBe(true);
    expect(grades?.statusNote).toBe("schema decision dial at 75%");
  });

  it("starts with an update log nothing has been checked against", () => {
    expect(isFaqUpdateLog(storedLog)).toBe(true);
    expect((storedLog as FaqUpdateLog).lastCheckedAt).toBeNull();
  });
});

describe("finding new workspace records", () => {
  it("reads plan, tracked changes, notes, and documents", () => {
    expect(sources.map((source) => source.kind)).toEqual([
      "plan", "plan", "workstream-change", "workstream-change", "meeting-note", "meeting-note",
    ]);
    expect(toIsoDate("September 16, 2026")).toBe("2026-09-16");
    expect(toIsoDate("2026-10-01T14:00:00Z")).toBe("2026-10-01");
    expect(toIsoDate("soon")).toBeNull();
  });

  it("treats only records after the seed date as new on the first check", () => {
    const log = withBaseline(emptyLog, sources);
    expect(pendingSources(log, sources).map((source) => source.label)).toEqual([
      "Workshop 3",
      "Sales & Go-to-Market: Pricing guidance released.",
    ]);
  });

  it("re-queues a record whose content changes", () => {
    const log = { ...withBaseline(emptyLog, sources), lastCheckedAt: NOW };
    const changed = collectWorkspaceSources({
      context,
      meetingNotes: [{ ...oldNote, decisions: ["A later decision."] }, newNote],
      documents: [],
    });
    expect(pendingSources(log, changed).map((source) => source.key)[0]).toBe("note:note-old");
  });

  it("batches within limits but always takes one record", () => {
    const pending = pendingSources(withBaseline(emptyLog, sources), sources);
    expect(selectBatch(pending, { maxSources: 1, maxCharacters: 1e6 })).toHaveLength(1);
    expect(selectBatch(pending, { maxSources: 8, maxCharacters: 1 })).toHaveLength(1);
    expect(selectBatch(pending, { maxSources: 8, maxCharacters: 1e6 })).toHaveLength(2);
  });
});

describe("applying a proposal", () => {
  const faq = parseFaq(markdown);
  const batch = pendingSources(withBaseline(emptyLog, sources), sources);

  it("applies sourced edits and additions and drops everything else", () => {
    const proposal: FaqProposal = {
      summary: "Workshop 3 set the price.",
      edits: [
        edit(),
        edit({ itemId: "what-is-the-offer", sourceKeys: ["note:invented"] }),
        edit({ itemId: "no-such-question" }),
        edit({ itemId: "is-there-a-pilot-option", answer: "" }),
      ],
      additions: [
        {
          sectionId: "pricing-packaging-and-contracting", afterItemId: "how-is-it-priced",
          question: "When can I quote a price?", status: "settled", statusNote: null,
          answer: "Now, using the released guidance.", reason: "Pricing guidance was released.",
          sourceKeys: ["note:note-new"],
        },
        {
          sectionId: "sources", afterItemId: null, question: "Should not land?", status: null,
          statusNote: null, answer: "Sources has no questions.", reason: "x", sourceKeys: ["note:note-new"],
        },
        {
          sectionId: "pricing-packaging-and-contracting", afterItemId: null, question: "how is it priced?",
          status: null, statusNote: null, answer: "Duplicate.", reason: "x", sourceKeys: ["note:note-new"],
        },
      ],
    };
    expect(isFaqProposal(proposal)).toBe(true);

    const result = applyProposal({ document: faq, proposal, batch, now: NOW, makeId });
    const pricing = result.document.sections.find((section) => section.id === "pricing-packaging-and-contracting")!;
    const index = pricing.items.findIndex((item) => item.id === "how-is-it-priced");

    expect(pricing.items[index].answer).toBe("A base price plus a per-student rate.");
    expect(pricing.items[index].status).toBe("settled");
    expect(pricing.items[index + 1].question).toBe("When can I quote a price?");
    expect(result.updates.map((update) => update.kind)).toEqual(["edited", "added"]);
    expect(result.updates[0].previousAnswer).toMatch(/^One structure for every district/);
    expect(result.updates[0].sources.map((source) => source.key)).toEqual(["note:note-new"]);
    expect(result.skipped).toHaveLength(5);
    expect(allItems(faq).find((item) => item.id === "how-is-it-priced")?.status).toBe("working");

    const written = parseFaq(serializeFaq(result.document));
    expect(allItems(written).find((item) => item.question === "When can I quote a price?")?.status).toBe("settled");
  });

  it("records reviewed records and keeps the newest updates first", () => {
    const result = applyProposal({ document: faq, proposal: { summary: "", edits: [edit()], additions: [] }, batch, now: NOW, makeId });
    const log = recordBatch(withBaseline(emptyLog, sources), batch, result.updates);
    expect(pendingSources(log, sources)).toHaveLength(0);
    expect(log.updates[0].itemId).toBe("how-is-it-priced");
    expect(isFaqUpdateLog(log)).toBe(true);
  });

  it("rejects malformed proposals", () => {
    expect(isFaqProposal({ summary: "x", edits: [{ ...edit(), status: "final" }], additions: [] })).toBe(false);
    expect(isFaqProposal({ summary: "x", edits: [], additions: [{ question: "Q?" }] })).toBe(false);
  });
});
