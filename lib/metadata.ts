import type { Metadata } from "next";

// Page metadata with matching Open Graph / Twitter tags, so shared links show
// this page's title and description rather than the homepage's. The preview
// image comes from the nearest opengraph-image.tsx.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: "Willow Education",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
