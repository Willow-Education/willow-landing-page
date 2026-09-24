import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getJob, getJobMeta, getOpenJobs } from "@/lib/data/jobs";
import { ApplicationForm } from "./ApplicationForm";

// Pre-render a page for every open job at build time.
export function generateStaticParams() {
  return getOpenJobs().map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);

  if (!job) {
    return { title: "Careers | Willow Education" };
  }

  return {
    title: `${job.title} | Careers at Willow Education`,
    description: job.summary,
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-secondary text-sm hover:text-heading transition-colors mb-8"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              All open positions
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-heading mb-4">{job.title}</h1>
            <p className="text-secondary text-base mb-8">{getJobMeta(job)}</p>
            <a
              href="#apply"
              className="inline-flex items-center justify-center h-12 px-6 bg-[#062F29] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px]"
            >
              Apply for this role
            </a>
          </div>
        </section>

        {/* Job Details */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16 space-y-12">
            {job.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-6">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-secondary text-base leading-relaxed">
                  {section.blocks.map((block, i) =>
                    typeof block === "string" ? (
                      <p key={i}>{block}</p>
                    ) : (
                      <ul key={i} className="list-disc pl-5 space-y-2">
                        {block.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </div>
            ))}

            <div id="apply" className="border-t border-gray-200 pt-12 scroll-mt-24">
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-8">
                Apply for this role
              </h2>
              <ApplicationForm
                jobSlug={job.slug}
                jobTitle={job.title}
                application={job.application}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
