import { pageMetadata } from "@/lib/metadata";

// The page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Willow vs Others | Willow Education",
  description:
    "Legacy platforms help you track who graduates. Willow helps you ensure they thrive. See how Willow compares.",
  path: "/willow-vs-others",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
