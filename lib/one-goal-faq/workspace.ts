// The partnership workspace is a separate app that this site forwards
// /one-goal-planning/* to (see next.config.ts). The FAQ page is served from
// this site instead, so it checks the visitor's workspace sign-in by asking
// the workspace itself: the same passcode and cookie, nothing to configure.

// Overridable only so the flow can be exercised against a local stand-in.
export const WORKSPACE_APP_ORIGIN = process.env.WORKSPACE_APP_ORIGIN ?? "https://one-goal-planning.vercel.app";
export const WORKSPACE_BASE_PATH = "/one-goal-planning";
export const WORKSPACE_SESSION_COOKIE = "one_goal_planning_access";
export const WORKSPACE_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type WorkspaceSession = "valid" | "invalid" | "unavailable";

export async function checkWorkspaceSession(token: string | undefined): Promise<WorkspaceSession> {
  if (!token) {
    return "invalid";
  }

  try {
    // The ask endpoint only accepts POST, so a signed-in GET is refused with
    // 405 before any work happens, and a signed-out one with 401.
    const response = await fetch(`${WORKSPACE_APP_ORIGIN}${WORKSPACE_BASE_PATH}/api/ask`, {
      headers: { cookie: `${WORKSPACE_SESSION_COOKIE}=${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (response.status === 401) {
      return "invalid";
    }

    return response.status === 405 || response.ok ? "valid" : "unavailable";
  } catch {
    return "unavailable";
  }
}
