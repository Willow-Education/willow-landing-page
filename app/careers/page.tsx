import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { pageMetadata } from "@/lib/metadata";
import { CAREERS_EMAIL, getJobMeta, getOpenJobs } from "@/lib/data/jobs";

export const metadata = pageMetadata({
  title: "Careers | Willow Education",
  description:
    "Join Willow Education and help millions of students find their best-fit next step after high school.",
  path: "/careers",
});

export default function CareersPage() {
  const jobs = getOpenJobs();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-heading mb-6">
              Careers at Willow
            </h1>
            <p className="text-secondary text-base leading-relaxed">
              We&apos;re helping 10 million students find their best-fit next step by 2033. If that
              sounds like work you want to do, we&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-8">
              Open positions
            </h2>

            {jobs.length > 0 ? (
              <ul className="border-t border-gray-200">
                {jobs.map((job) => (
                  <li key={job.slug} className="border-b border-gray-200">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="group flex items-center justify-between gap-4 py-6"
                    >
                      <div>
                        <h3 className="font-heading text-lg md:text-xl font-medium text-heading group-hover:text-content-link transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-secondary text-sm mt-1">
                          {getJobMeta(job)}
                        </p>
                      </div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="shrink-0 text-secondary group-hover:text-content-link group-hover:translate-x-1 transition-all"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-secondary text-base leading-relaxed">
                We don&apos;t have any open positions right now. If you think you&apos;d be a great
                fit, email us at{" "}
                <a
                  href={`mailto:${CAREERS_EMAIL}`}
                  className="text-content-link underline hover:text-[#025f80]"
                >
                  {CAREERS_EMAIL}
                </a>
                .
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
