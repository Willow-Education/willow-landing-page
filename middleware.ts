import { NextResponse, type NextRequest } from "next/server";

import { WORKSPACE_APP_ORIGIN } from "@/lib/one-goal-faq/workspace";
import { isFaqPath, WORKSPACE_LINKS_SCRIPT } from "@/lib/one-goal-faq/workspace-links";

// Full page loads of the partnership workspace are fetched here instead of
// through the plain rewrite in next.config.ts, so the FAQ links can be added
// to the page (see lib/one-goal-faq/workspace-links.ts). Everything else (the
// workspace's scripts, data requests, in-app navigation, form posts, and the
// FAQ itself, which this site serves) continues straight to the rewrite.

const DROPPED_HEADERS = ["content-encoding", "content-length", "transfer-encoding", "connection"];
const FORWARDED_HEADERS = ["cookie", "accept", "accept-language", "user-agent"];

function isPageLoad(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  return (
    request.method === "GET" &&
    !isFaqPath(pathname) &&
    !pathname.startsWith("/one-goal-planning/_next/") &&
    !pathname.startsWith("/one-goal-planning/api/") &&
    !request.headers.has("rsc") &&
    !request.headers.has("next-router-prefetch") &&
    !searchParams.has("_rsc") &&
    (request.headers.get("accept") ?? "").includes("text/html")
  );
}

export async function middleware(request: NextRequest) {
  if (!isPageLoad(request)) {
    return NextResponse.next();
  }

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  // Tell the workspace which address the visitor used, as the rewrite does.
  headers.set("x-forwarded-host", request.nextUrl.host);
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  let upstream: Response;

  try {
    upstream = await fetch(`${WORKSPACE_APP_ORIGIN}${request.nextUrl.pathname}${request.nextUrl.search}`, {
      headers,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    // If anything goes wrong here, serve the workspace exactly as before.
    return NextResponse.next();
  }

  const responseHeaders = new Headers(upstream.headers);
  for (const name of DROPPED_HEADERS) {
    responseHeaders.delete(name);
  }

  // A redirect to the sign-in page must stay on this site's address, whether
  // the workspace sends it as a full or a relative URL.
  const location = responseHeaders.get("location");
  if (location) {
    const target = new URL(location, WORKSPACE_APP_ORIGIN);
    const local = target.origin === new URL(WORKSPACE_APP_ORIGIN).origin || target.origin === request.nextUrl.origin;
    responseHeaders.set(
      "location",
      local ? new URL(`${target.pathname}${target.search}${target.hash}`, request.nextUrl.origin).toString() : target.toString(),
    );
  }

  const isHtml = (upstream.headers.get("content-type") ?? "").includes("text/html");

  if (!isHtml || !upstream.body) {
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  }

  const html = await upstream.text();
  const withLinks = html.includes("</body>")
    ? html.replace(/<\/body>(?![\s\S]*<\/body>)/, `${WORKSPACE_LINKS_SCRIPT}</body>`)
    : html;

  return new Response(withLinks, { status: upstream.status, headers: responseHeaders });
}

export const config = {
  matcher: ["/one-goal-planning", "/one-goal-planning/:path*"],
};
