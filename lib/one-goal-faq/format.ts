// The partnership FAQ lives in content/one-goal-faq.md so anyone can edit it on
// GitHub. This module reads that file into sections and questions and writes
// it back out in the same shape, so automatic updates and hand edits share
// one format. No server or browser APIs: the page, the update script, and the
// tests all use it.

export const FAQ_STATUSES = ["settled", "working", "open"] as const;
export type FaqStatus = (typeof FAQ_STATUSES)[number];

export const FAQ_STATUS_LABELS: Record<FaqStatus, string> = {
  settled: "Settled",
  working: "Working",
  open: "Open",
};

export type FaqItem = {
  id: string;
  question: string;
  status: FaqStatus | null;
  // Qualifier shown beside the tag, such as "schema dial at 75%".
  statusNote: string | null;
  answer: string;
};

export type FaqSection = {
  id: string;
  title: string;
  intro: string | null;
  items: FaqItem[];
};

export type FaqDocument = {
  title: string;
  // Everything between the title and the first section, kept verbatim so the
  // editing notes at the top of the file survive automatic rewrites.
  preamble: string;
  sections: FaqSection[];
};

export function isFaqStatus(value: unknown): value is FaqStatus {
  return typeof value === "string" && (FAQ_STATUSES as readonly string[]).includes(value);
}

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .split("-")
      .slice(0, 9)
      .join("-") || "question"
  );
}

// A question is a bold run at the start of a paragraph that ends like a
// question or a label: "**What is Alma? (Settled)** Willow's AI advisor..."
const QUESTION_LINE = /^\*\*(.+?[?:)])\*\*(?:\s+(.*))?$/;
const TAG = /^(.*?)\s*\((Settled|Working|Open)(?:[;,]?\s*(.*))?\)$/i;

function readQuestion(head: string) {
  const tagged = TAG.exec(head.trim());

  if (!tagged) {
    return { question: head.trim().replace(/:$/, ""), status: null, statusNote: null };
  }

  return {
    question: tagged[1].trim().replace(/:$/, ""),
    status: tagged[2].toLowerCase() as FaqStatus,
    statusNote: tagged[3]?.trim() || null,
  };
}

function uniqueId(base: string, taken: Set<string>) {
  let candidate = base;

  for (let suffix = 2; taken.has(candidate); suffix += 1) {
    candidate = `${base}-${suffix}`;
  }

  taken.add(candidate);
  return candidate;
}

export function parseFaq(markdown: string): FaqDocument {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const ids = new Set<string>();
  const sections: FaqSection[] = [];
  const preamble: string[] = [];
  let title = "";
  let section: (FaqSection & { introLines: string[] }) | null = null;
  let item: (FaqItem & { answerLines: string[] }) | null = null;
  let previousBlank = true;

  const closeItem = () => {
    if (item && section) {
      const { answerLines, ...rest } = item;
      section.items.push({ ...rest, answer: answerLines.join("\n").trim() });
    }
    item = null;
  };

  const closeSection = () => {
    closeItem();
    if (section) {
      const { introLines, ...rest } = section;
      sections.push({ ...rest, intro: introLines.join("\n").trim() || null });
    }
    section = null;
  };

  for (const line of lines) {
    if (!section && !title && line.startsWith("# ")) {
      title = line.slice(2).trim();
    } else if (line.startsWith("## ")) {
      closeSection();
      const heading = line.slice(3).trim();
      section = { id: uniqueId(slugify(heading), ids), title: heading, intro: null, items: [], introLines: [] };
    } else if (!section) {
      preamble.push(line);
    } else {
      const match = previousBlank ? QUESTION_LINE.exec(line) : null;

      if (match) {
        closeItem();
        const parsed = readQuestion(match[1]);
        item = {
          id: uniqueId(slugify(parsed.question), ids),
          ...parsed,
          answer: "",
          answerLines: match[2] ? [match[2]] : [],
        };
      } else if (item) {
        (item as { answerLines: string[] }).answerLines.push(line);
      } else {
        section.introLines.push(line);
      }
    }

    previousBlank = line.trim() === "";
  }

  closeSection();

  return { title, preamble: preamble.join("\n").trim(), sections };
}

function questionLine(item: FaqItem) {
  const tag = item.status
    ? ` (${FAQ_STATUS_LABELS[item.status]}${item.statusNote ? `; ${item.statusNote}` : ""})`
    : "";
  return `**${item.question}${tag}**`;
}

// Lists and tables cannot share a line with the question, so they start on
// their own paragraph.
const BLOCK_START = /^(- |\* |\d+\. |\|)/;

export function serializeFaq(document: FaqDocument): string {
  const parts: string[] = [`# ${document.title}`];

  if (document.preamble) {
    parts.push(document.preamble);
  }

  for (const section of document.sections) {
    parts.push(`## ${section.title}`);

    if (section.intro) {
      parts.push(section.intro);
    }

    for (const item of section.items) {
      const answer = item.answer.trim();
      parts.push(
        BLOCK_START.test(answer)
          ? `${questionLine(item)}\n\n${answer}`
          : `${questionLine(item)} ${answer}`,
      );
    }
  }

  return `${parts.join("\n\n")}\n`;
}

export function allItems(document: FaqDocument) {
  return document.sections.flatMap((section) => section.items);
}
