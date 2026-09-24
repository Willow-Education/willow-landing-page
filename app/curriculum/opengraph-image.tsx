import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Willow's career and college readiness curriculum";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Curriculum",
    title: "Help every student graduate with purpose",
    subtitle: "Ready-to-teach career and college readiness lessons.",
    cta: "See the curriculum",
    url: "willowed.org/curriculum",
  });
}
