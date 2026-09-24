import type { Metadata } from "next";

// Page metadata with matching Open Graph / Twitter tags, so shared links show
// this page's title and description rather than the homepage's. The preview
// image defaults to the shared Willow logo card (app/opengraph-image.tsx).
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  path: string;
  // URL of a route's own opengraph-image, if it has one.
  image?: string;
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
      images: [{ url: image, width: 1200, height: 630, alt: "Willow Education" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
