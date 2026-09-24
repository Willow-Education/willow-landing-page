import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FinalCTA } from "@/components/final-cta";
import { PaperHero } from "@/components/careers/paper-hero";
import { ArrowRight, Sparkle, Target, UsersThree } from "@/components/careers/icons";
import { pageMetadata } from "@/lib/metadata";
import { CAREERS_EMAIL, getJobTags, getOpenJobs } from "@/lib/data/jobs";

export const metadata = pageMetadata({
  title: "Careers | Willow Education",
  description:
    "Join Willow Education and help millions of students find their best-fit next step after high school.",
  path: "/careers",
});

const heroImages = [
  { src: "/personality-type-images/SOCIAL_AGREEABLENESS.jpg", className: "left-0 top-10 w-44 h-44 lg:w-52 lg:h-52 rotate-[-6deg]" },
  { src: "/personality-type-images/ARTISTIC_OPENNESS.jpg", className: "right-0 top-0 w-40 h-40 lg:w-48 lg:h-48 rotate-[8deg]" },
  { src: "/personality-type-images/ENTERPRISING_EXTRAVERSION.jpg", className: "left-24 lg:left-32 bottom-0 w-40 h-40 lg:w-48 lg:h-48 rotate-[4deg]" },
];

const reasons = [
  {
    icon: Target,
    title: "A clear mission",
    description:
      "We're a public benefit corporation with one North Star: help 10 million students find their best-fit next step by 2033.",
  },
  {
    icon: UsersThree,
    title: "Small team, real ownership",
    description:
      "There are very few layers between understanding a problem, making a decision, and building something better.",
  },
  {
    icon: Sparkle,
    title: "AI-first",
    description:
      "We use AI every day to research problems, prototype ideas, and put working product in front of users fast.",
  },
];

export default function CareersPage() {
  const jobs = getOpenJobs();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <PaperHero>
          <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 grid lg:grid-cols-[1fr_420px] gap-12 items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-content-link mb-4">
                Careers at Willow
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-heading mb-6">
                Help students find their best-fit next step
              </h1>
              <p className="text-secondary text-lg md:text-xl leading-relaxed mb-8">
                We&apos;re helping 10 million students find their best-fit next step by 2033. If
                that sounds like work you want to do, we&apos;d love to hear from you.
              </p>
              <a
                href="#open-roles"
                className="inline-flex items-center gap-2 h-12 px-6 bg-[#062F29] text-white rounded-lg text-base font-semibold transition-all duration-300 hover:rounded-[14px]"
              >
                See open roles
                <ArrowRight size={18} weight="bold" />
              </a>
            </div>

            <div className="relative h-[380px] hidden lg:block" aria-hidden="true">
              {heroImages.map((image) => (
                <div
                  key={image.src}
                  className={`absolute rounded-2xl overflow-hidden shadow-lg border-4 border-white ${image.className}`}
                >
                  <Image src={image.src} alt="" fill className="object-cover" sizes="208px" />
                </div>
              ))}
            </div>
          </div>
        </PaperHero>

        {/* Why Willow */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-heading mb-12 md:mb-16 max-w-2xl">
              Why work at Willow
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              {reasons.map(({ icon: Icon, title, description }) => (
                <div key={title}>
                  <div className="w-14 h-14 rounded-2xl bg-[#ACF7B2] flex items-center justify-center mb-5">
                    <Icon size={28} weight="regular" className="text-[#062F29]" />
                  </div>
                  <h3 className="font-heading text-xl font-medium text-heading mb-2">{title}</h3>
                  <p className="text-secondary text-base leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-roles" className="py-20 md:py-28 bg-gray-50 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-heading mb-10">
              Open roles
            </h2>

            {jobs.length > 0 ? (
              <ul className="grid gap-5">
                {jobs.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/careers/${job.slug}`}
                      className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-10 bg-white rounded-card border border-gray-200 shadow-subtle p-6 md:p-8 transition-shadow hover:shadow-lg"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getJobTags(job).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center h-7 px-3 rounded-full bg-[#ACF7B2]/60 text-[#062F29] text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-heading text-2xl md:text-[28px] font-medium text-heading mb-2">
                          {job.title}
                        </h3>
                        <p className="text-secondary text-base leading-relaxed max-w-3xl">
                          {job.summary}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 shrink-0 text-[#062F29] font-semibold">
                        View role
                        <ArrowRight
                          size={18}
                          weight="bold"
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-white rounded-card border border-gray-200 shadow-subtle p-6 md:p-8">
                <p className="text-secondary text-base leading-relaxed">
                  We don&apos;t have any open positions right now. If you think you&apos;d be a
                  great fit, email us at{" "}
                  <a
                    href={`mailto:${CAREERS_EMAIL}`}
                    className="text-content-link underline hover:text-[#025f80]"
                  >
                    {CAREERS_EMAIL}
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </section>

        <FinalCTA
          headline="Don't see the right role? We'd still love to hear from you."
          singleButton={{ text: `Email ${CAREERS_EMAIL}`, href: `mailto:${CAREERS_EMAIL}` }}
        />
      </main>
      <Footer />
    </>
  );
}
