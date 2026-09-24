import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, loadPublicJpeg, renderShareImage } from "@/lib/og/share-image";
import personalityTypes from "@/lib/data/personality-types.json";

const TYPES = personalityTypes as { id: string }[];

export const alt = "Willow personality quiz result";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return TYPES.map((t) => ({ type: t.id }));
}

export default async function Image({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const pt = TYPES.find((t) => t.id === decodeURIComponent(type));

  // Same picture the results page shows.
  return renderShareImage({
    image: pt
      ? await loadPublicJpeg(`/personality-type-images/${pt.id.toUpperCase().replace(/-/g, "")}.jpg`)
      : undefined,
  });
}
