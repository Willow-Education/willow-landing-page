import type { NextConfig } from "next";

// The partnership workspace app. Overridable only so the forwarding can be
// exercised against a local copy.
const workspaceOrigin = process.env.WORKSPACE_APP_ORIGIN ?? "https://one-goal-planning.vercel.app";

// Common App sends students back to the base URL registered on Willow's partner
// account, and that base is this marketing site, so both return legs arrive
// here: `/student/common-app/callback?RequestId=…` after connecting, and
// `//student` (Next collapses the doubled slash) after the FERPA waiver.
// Forward them to the Willow app's return bridge, which owns where the student
// lands. Next passes the query string through. Remove these once Common App
// re-registers the base as the bridge itself.
const COMMON_APP_RETURN_BRIDGE =
  "https://app.willowed.org/api/integrations/common-app";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/student/common-app/callback",
        destination: `${COMMON_APP_RETURN_BRIDGE}/student/common-app/callback`,
        permanent: false,
      },
      {
        source: "/student",
        destination: `${COMMON_APP_RETURN_BRIDGE}/student`,
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/one-goal-planning",
        destination: `${workspaceOrigin}/one-goal-planning`,
      },
      {
        source: "/one-goal-planning/:path*",
        destination: `${workspaceOrigin}/one-goal-planning/:path*`,
      },
    ];
  },
  // The partnership FAQ page reads its content files at request time.
  outputFileTracingIncludes: {
    "/one-goal-planning/faq": ["./content/one-goal-faq.md", "./content/one-goal-faq-updates.json"],
    "/one-goal-planning/faq/suggest": ["./content/one-goal-faq.md"],
  },
  images: {
    qualities: [75, 80, 85, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
