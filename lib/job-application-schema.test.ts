import { describe, expect, it } from "vitest";
import { getJob } from "@/lib/data/jobs";
import { buildJobApplicationSchema } from "@/lib/validations";

const job = getJob("product-manager")!;
const schema = buildJobApplicationSchema(job.application);

const complete = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  portfolioUrl: "",
  answers: {
    "public-school": "No",
    edtech: "No",
    "problem-to-launch": "I took a problem to launch.",
    "changed-mind": "Research changed my mind.",
    "ai-prototyping": "Yes, I already do this",
    salary: "I'd like to discuss",
  },
};

function errorPaths(input: unknown) {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.errors.map((e) => e.path.join("."));
}

describe("Product Manager application schema", () => {
  it("accepts a complete application with no portfolio or video", () => {
    const result = schema.safeParse(complete);
    expect(result.success).toBe(true);
    expect(result.success && result.data.portfolioUrl).toBe("");
    expect(result.success && result.data.videoUrl).toBe("");
  });

  it("normalizes a portfolio link typed without a protocol", () => {
    const result = schema.safeParse({ ...complete, portfolioUrl: "example.com/work" });
    expect(result.success && result.data.portfolioUrl).toBe("https://example.com/work");
  });

  it("requires every required question", () => {
    expect(errorPaths({ ...complete, answers: {} })).toEqual([
      "answers.public-school",
      "answers.edtech",
      "answers.problem-to-launch",
      "answers.changed-mind",
      "answers.ai-prototyping",
      "answers.salary",
    ]);
  });

  it("rejects a choice that isn't one of the options", () => {
    expect(errorPaths({ ...complete, answers: { ...complete.answers, salary: "$1M" } })).toEqual([
      "answers.salary",
    ]);
  });

  it("leaves the follow-ups optional when they are shown", () => {
    const answers = { ...complete.answers, "public-school": "Yes, working directly with a public school in another capacity", edtech: "Yes" };
    expect(errorPaths({ ...complete, answers })).toEqual([]);
  });
});
