import { pageMetadata } from "@/lib/metadata";

// The page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Curriculum | Willow Education",
  description:
    "Willow's career and college readiness curriculum gives students the self-awareness, future planning, and durable skills they need to thrive during and after high school.",
  path: "/curriculum",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
