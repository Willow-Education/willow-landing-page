import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, renderShareImage } from "@/lib/og/share-image";
import { getJob, getJobMeta, getOpenJobs } from "@/lib/data/jobs";

export const alt = "Open position at Willow Education";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getOpenJobs().map((job) => ({ slug: job.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);

  return renderShareImage({
    eyebrow: "Now hiring",
    title: job?.title ?? "Careers at Willow",
    subtitle: job ? getJobMeta(job) : "Willow Education",
    cta: "Apply now",
    url: "willowed.org/careers",
  });
}
