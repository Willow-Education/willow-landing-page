import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "About Willow Education";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "About us",
    title: "Why we're building Willow",
    subtitle: "Helping 10 million students find their best-fit next step by 2033.",
    cta: "Read our story",
    url: "willowed.org/about",
  });
}
