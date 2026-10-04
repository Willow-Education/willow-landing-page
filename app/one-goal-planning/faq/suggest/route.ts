import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { parseFaq } from "@/lib/one-goal-faq/format";
import { findItem, readSuggestionInput } from "@/lib/one-goal-faq/suggestions";
import { checkWorkspaceSession, WORKSPACE_SESSION_COOKIE } from "@/lib/one-goal-faq/workspace";
import { sendFormNotification } from "@/lib/resend";
import { supabase } from "@/lib/supabase";

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

// Saves a suggested improvement to one FAQ answer. A GitHub Action turns it
// into a pull request for James or Ryan to accept, revise, or reject.
export async function POST(request: Request) {
  const session = await checkWorkspaceSession((await cookies()).get(WORKSPACE_SESSION_COOKIE)?.value);

  if (session !== "valid") {
    return errorResponse("Enter the partnership passcode to continue.", 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("The suggestion could not be read.", 400);
  }

  const parsed = readSuggestionInput(body);

  if (!parsed.ok) {
    return errorResponse(parsed.error, 400);
  }

  const { input } = parsed;
  // The question and current answer come from the FAQ as published, never
  // from the browser.
  const faq = parseFaq(await readFile(join(process.cwd(), "content/one-goal-faq.md"), "utf8"));
  const item = findItem(faq, input.itemId);

  if (!item) {
    return errorResponse("That question is no longer in the FAQ. Reload the page.", 404);
  }

  if (input.suggestedAnswer === item.answer.trim()) {
    return errorResponse("Change the answer before sending the suggestion.", 400);
  }

  if (!supabase) {
    return errorResponse("Suggestions are not switched on yet.", 503);
  }

  const { error } = await supabase.from("faq_suggestions").insert({
    item_id: item.id,
    question: item.question,
    current_answer: item.answer,
    suggested_answer: input.suggestedAnswer,
    reason: input.reason,
    suggested_by: input.suggestedBy,
  });

  if (error) {
    console.error("Failed to save an FAQ suggestion.", error);
    return errorResponse("The suggestion could not be saved. Try again in a moment.", 503);
  }

  // A heads-up for James; the pull request follows within a couple of hours.
  await sendFormNotification({
    formName: "FAQ suggestion",
    data: {
      Question: item.question,
      "Suggested by": input.suggestedBy,
      "What is dated or wrong": input.reason,
      "Suggested answer": input.suggestedAnswer,
      "Current answer": item.answer,
    },
  }).catch((notifyError) => console.error("Failed to email an FAQ suggestion.", notifyError));

  return Response.json({ ok: true }, { status: 201 });
}
