import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, loadPublicJpeg, renderShareImage } from "@/lib/og/share-image";
import personalityTypes from "@/lib/data/personality-types.json";

const TYPES = personalityTypes as { id: string; title: string }[];

export const alt = "Willow personality quiz result";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return TYPES.map((t) => ({ type: t.id }));
}

export default async function Image({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const pt = TYPES.find((t) => t.id === decodeURIComponent(type));

  return renderShareImage({
    eyebrow: "My personality type",
    title: pt?.title ?? "Willow Personality Quiz",
    subtitle: "Discover yours with Willow's free personality quiz.",
    cta: "Take the quiz",
    url: "willowed.org/personality-quiz",
    // Same image the results page shows.
    image: pt
      ? await loadPublicJpeg(`/personality-type-images/${pt.id.toUpperCase().replace(/-/g, "")}.jpg`)
      : undefined,
  });
}
