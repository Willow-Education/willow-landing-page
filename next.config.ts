import type { NextConfig } from "next";

// The partnership workspace app. Overridable only so the forwarding can be
// exercised against a local copy.
const workspaceOrigin = process.env.WORKSPACE_APP_ORIGIN ?? "https://one-goal-planning.vercel.app";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
