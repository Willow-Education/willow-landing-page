import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/one-goal-planning",
        destination:
          "https://one-goal-planning.vercel.app/one-goal-planning",
      },
      {
        source: "/one-goal-planning/:path*",
        destination:
          "https://one-goal-planning.vercel.app/one-goal-planning/:path*",
      },
    ];
  },
  // The partnership FAQ page reads its content files at request time.
  outputFileTracingIncludes: {
    "/one-goal-planning/faq": ["./content/one-goal-faq.md", "./content/one-goal-faq-updates.json"],
  },
  images: {
    qualities: [75, 80, 85, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
