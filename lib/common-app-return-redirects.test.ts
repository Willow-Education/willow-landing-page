import { describe, it, expect } from "vitest";
import nextConfig from "../next.config";

// Common App returns students to the base URL registered on Willow's partner
// account, which is this site. These paths belong to the Willow app, not here.
const BRIDGE = "https://app.willowed.org/api/integrations/common-app";

async function redirects() {
  if (typeof nextConfig.redirects !== "function") {
    throw new TypeError("nextConfig.redirects is not a function");
  }
  return nextConfig.redirects();
}

describe("Common App return redirects", () => {
  it("redirects() forwards the connect return to the Willow bridge", async () => {
    expect(await redirects()).toContainEqual({
      source: "/student/common-app/callback",
      destination: `${BRIDGE}/student/common-app/callback`,
      permanent: false,
    });
  });

  it("redirects() forwards the FERPA return to the Willow bridge", async () => {
    expect(await redirects()).toContainEqual({
      source: "/student",
      destination: `${BRIDGE}/student`,
      permanent: false,
    });
  });

  it("redirects are temporary and host-independent", async () => {
    const entries = await redirects();
    const returns = entries.filter((entry) => entry.destination.startsWith(BRIDGE));
    expect(returns).toHaveLength(2);
    for (const entry of returns) {
      expect(entry.permanent).toBe(false);
      expect(entry).not.toHaveProperty("has");
    }
  });

  it("rewrites() still forwards /one-goal-planning", async () => {
    expect(await nextConfig.rewrites?.()).toEqual([
      {
        source: "/one-goal-planning",
        destination: "https://one-goal-planning.vercel.app/one-goal-planning",
      },
      {
        source: "/one-goal-planning/:path*",
        destination: "https://one-goal-planning.vercel.app/one-goal-planning/:path*",
      },
    ]);
  });
});
