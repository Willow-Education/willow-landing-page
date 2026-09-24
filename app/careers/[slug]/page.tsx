import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PaperHero } from "@/components/careers/paper-hero";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  CurrencyDollar,
  EnvelopeSimple,
  MapPin,
} from "@/components/careers/icons";
import { pageMetadata } from "@/lib/metadata";
import { CAREERS_EMAIL, getJob, getJobTags, getOpenJobs, type Job } from "@/lib/data/jobs";
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

  return pageMetadata({
    title: `${job.title} | Careers at Willow Education`,
    description: job.summary,
    path: `/careers/${job.slug}`,
  });
}

function jobFacts(job: Job) {
  return [
    { icon: Briefcase, label: "Team", value: job.team },
    { icon: Clock, label: "Type", value: job.type },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: CurrencyDollar, label: "Salary", value: job.salary },
  ].filter((fact): fact is typeof fact & { value: string } => Boolean(fact.value));
}

const applyButtonClass =
  "inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#062F29] text-white rounded-lg text-base font-semibold transition-all duration-300 hover:rounded-[14px]";

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

  const facts = jobFacts(job);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <PaperHero>
          <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-secondary text-sm font-medium hover:text-heading transition-colors mb-8"
            >
              <ArrowLeft size={16} weight="bold" />
              All open roles
            </Link>
            <div className="flex flex-wrap gap-2 mb-5">
              {getJobTags(job).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center h-7 px-3 rounded-full bg-[#ACF7B2]/60 text-[#062F29] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-heading mb-6">{job.title}</h1>
            <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
              {job.summary}
            </p>
            <a href="#apply" className={applyButtonClass}>
              Apply for this role
              <ArrowRight size={18} weight="bold" />
            </a>
          </div>
        </PaperHero>

        {/* Job Details */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-16 items-start">
            <div className="divide-y divide-gray-200">
              {job.sections.map((section) => (
                <div key={section.heading} className="py-10 first:pt-0 last:pb-0">
                  <h2 className="font-heading text-2xl md:text-[28px] font-medium text-heading mb-5">
                    {section.heading}
                  </h2>
                  <div className="space-y-4 text-secondary text-base md:text-lg leading-relaxed">
                    {section.blocks.map((block, i) =>
                      typeof block === "string" ? (
                        <p key={i}>{block}</p>
                      ) : (
                        <ul key={i} className="space-y-3">
                          {block.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-[5px] md:mt-[6px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ACF7B2]">
                                <Check size={12} weight="bold" className="text-[#062F29]" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <aside className="lg:sticky lg:top-24 order-first lg:order-none">
              <div className="rounded-card border border-gray-200 bg-white shadow-subtle p-6">
                <h2 className="font-heading text-xl font-medium text-heading mb-5">{job.title}</h2>
                <dl className="space-y-4 mb-6">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-200">
                        <Icon size={20} className="text-[#062F29]" />
                      </span>
                      <div>
                        <dt className="text-xs text-secondary">{label}</dt>
                        <dd className="text-sm font-semibold text-heading">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                {/* On mobile the hero's button is just above this card. */}
                <a href="#apply" className={`${applyButtonClass} w-full hidden lg:inline-flex`}>
                  Apply for this role
                </a>
                <p className="lg:mt-5 pt-5 border-t border-gray-200 text-sm text-secondary leading-relaxed">
                  <EnvelopeSimple size={16} className="inline -mt-0.5 mr-1.5 text-[#062F29]" />
                  Questions? Email{" "}
                  <a
                    href={`mailto:${CAREERS_EMAIL}`}
                    className="text-content-link underline hover:text-[#025f80]"
                  >
                    {CAREERS_EMAIL}
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Application */}
        <section id="apply" className="py-16 md:py-24 bg-[#F5F1EB] scroll-mt-16">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-heading mb-4">
              Apply for this role
            </h2>
            <p className="text-secondary text-base md:text-lg leading-relaxed mb-10">
              We read every application. Have your resume, a portfolio link, and a short video
              ready before you start.
            </p>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-subtle p-6 md:p-10">
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
