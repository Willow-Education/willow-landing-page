import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Careers at Willow Education";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Careers",
    title: "Join the team at Willow",
    subtitle: "Help 10 million students find their best-fit next step.",
    cta: "See open roles",
    url: "willowed.org/careers",
  });
}
