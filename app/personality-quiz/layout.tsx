import { pageMetadata } from "@/lib/metadata";

// The page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Free Personality Quiz | Willow Education",
  description:
    "Take Willow's free personality quiz to discover your strengths, how you work best, and careers that fit who you are.",
  path: "/personality-quiz",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
