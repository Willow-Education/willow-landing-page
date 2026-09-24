import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Willow Education Privacy Policy";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Legal",
    title: "Privacy Policy",
    subtitle: "How we collect, use, store, and protect personal information.",
    cta: "Read the policy",
    url: "willowed.org/privacy",
  });
}
