import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Willow Education";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Career & postsecondary readiness",
    title: "Built for economic mobility",
    subtitle: "A curriculum and platform for purpose, AI fluency, and postsecondary success.",
    cta: "Learn more",
    url: "willowed.org",
  });
}
