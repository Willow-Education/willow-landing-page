import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "How Willow compares to other platforms";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Willow vs others",
    title: "From graduation compliance to economic mobility",
    subtitle: "See how Willow compares to legacy platforms.",
    cta: "Compare",
    url: "willowed.org/willow-vs-others",
  });
}
