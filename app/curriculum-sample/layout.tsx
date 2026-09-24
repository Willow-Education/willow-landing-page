import { pageMetadata } from "@/lib/metadata";

// The page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Free Curriculum Sample | Willow Education",
  description:
    "Download a free curriculum sample to see how Willow guides students through self-discovery, career exploration, and postsecondary planning.",
  path: "/curriculum-sample",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
