import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Free Willow curriculum sample";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Free download",
    title: "Get your free curriculum sample",
    subtitle: "See how Willow guides students from self-discovery to postsecondary planning.",
    cta: "Download",
    url: "willowed.org/curriculum-sample",
  });
}
