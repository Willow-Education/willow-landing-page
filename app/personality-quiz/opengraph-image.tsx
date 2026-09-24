import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";

export const alt = "Willow's free personality quiz";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: "Free personality quiz",
    title: "Where your journey to self\u2011discovery begins",
    subtitle: "Discover your strengths and the careers that fit you.",
    cta: "Take the quiz",
    url: "willowed.org/personality-quiz",
  });
}
