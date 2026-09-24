import { pageMetadata } from "@/lib/metadata";

// The page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "About Us | Willow Education",
  description:
    "Why we're building Willow: helping 10 million students find their best-fit next step after high school by 2033.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
