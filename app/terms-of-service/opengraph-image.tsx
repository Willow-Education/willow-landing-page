import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Willow Education Terms of Service";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Legal",
    title: "Terms of Service",
    subtitle: "The agreement for schools using the Willow web application.",
    cta: "Read the terms",
    url: "willowed.org/terms-of-service",
  });
}
