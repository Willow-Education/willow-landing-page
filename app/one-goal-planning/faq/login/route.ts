import { NextResponse } from "next/server";

import {
  WORKSPACE_APP_ORIGIN,
  WORKSPACE_BASE_PATH,
  WORKSPACE_SESSION_COOKIE,
  WORKSPACE_SESSION_MAX_AGE,
} from "@/lib/one-goal-faq/workspace";

const FAQ_PATH = `${WORKSPACE_BASE_PATH}/faq`;

function backToFaq(request: Request, error?: string) {
  const url = new URL(FAQ_PATH, request.url);

  if (error) {
    url.searchParams.set("error", error);
  }

  return NextResponse.redirect(url, 303);
}

// Signs in with the workspace passcode and lands back on the FAQ. The workspace
// checks the passcode and issues the session; this only relays it.
export async function POST(request: Request) {
  let passcode: FormDataEntryValue | null = null;

  try {
    passcode = (await request.formData()).get("passcode");
  } catch {
    return backToFaq(request, "invalid");
  }

  if (typeof passcode !== "string" || !passcode) {
    return backToFaq(request, "invalid");
  }

  let token: string | undefined;

  try {
    const response = await fetch(`${WORKSPACE_APP_ORIGIN}${WORKSPACE_BASE_PATH}/api/access`, {
      method: "POST",
      body: new URLSearchParams({ passcode }),
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    token = response.headers
      .getSetCookie()
      .map((header) => header.split(";")[0])
      .find((pair) => pair.startsWith(`${WORKSPACE_SESSION_COOKIE}=`))
      ?.slice(WORKSPACE_SESSION_COOKIE.length + 1);
  } catch {
    return backToFaq(request, "unavailable");
  }

  if (!token) {
    return backToFaq(request, "invalid");
  }

  const response = backToFaq(request);
  response.cookies.set({
    name: WORKSPACE_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: WORKSPACE_BASE_PATH,
    maxAge: WORKSPACE_SESSION_MAX_AGE,
  });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
