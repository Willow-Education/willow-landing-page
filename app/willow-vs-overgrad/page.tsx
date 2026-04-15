"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FinalCTA } from "@/components/final-cta";
import { ComparisonBlock } from "@/components/comparison-block";
import { CheckCircle } from "phosphor-react";
import { WillowLogo } from "@/components/willow-logo";

/* ─── Comparison table data ─── */

const comparisonRows = [
  {
    feature: "Core approach",
    willow: "Curriculum + guidance platform",
    overgrad: "Data tracking + operations platform",
  },
  {
    feature: "Embedded curriculum",
    willow: "150+ structured lessons, built-in LMS",
    overgrad: "No curriculum — downloadable resources only",
  },
  {
    feature: "AI guidance",
    willow: "Alma: persistent AI career coach with AI-enabled advising",
    overgrad: "Basic AI features for search and recommendations",
  },
  {
    feature: "Postsecondary pathways",
    willow: "220K+ college and professional programs",
    overgrad: "College-focused, districts add other pathways manually",
  },
  {
    feature: "Quality indicators",
    willow: "Personalized, program-level ROI",
    overgrad: "Institutional completion rates",
  },
  {
    feature: "Career exploration",
    willow: "Psychometric assessments + short-form video",
    overgrad: "O*NET-based tools and text descriptions",
  },
  {
    feature: "Counselor dashboard",
    willow: "Action-oriented, prioritized alerts",
    overgrad: "Data tables and reports",
  },
];

/* ─── Deep-dive sections data ─── */

const comparisonSections = [
  {
    headline:
      "A complete curriculum built in — not a platform you have to build lessons around.",
    description:
      "Willow includes 150+ structured, low-prep lessons that drop directly into your advisory or seminar blocks. Overgrad is a planning tool with no embedded curriculum — your staff still has to find, build, and sequence the instruction themselves.",
    overgradCaption:
      "Downloadable slide decks and handouts — no built-in curriculum.",
    willowCaption:
      "150+ sequenced lessons with built-in LMS, ready for advisory blocks.",
  },
  {
    headline:
      "A career coach for every student — not a help center with a chat box.",
    description:
      "Alma is an AI-native career coach that gives every student 24/7 personalized guidance — from self-discovery through program selection. It scales your counseling team without adding headcount, so staff can focus on the students who need them most.",
    overgradCaption: "Basic AI chat and support center.",
    willowCaption:
      "Alma — personalized AI career coach that guides students from interests to enrollment.",
  },
  {
    headline: "Career discovery with short-form videos.",
    description:
      "Willow combines psychometric assessments with short-form, day-in-the-life career videos — the format students already engage with. Overgrad relies on O*NET-based tools and text descriptions that most students skip.",
    overgradCaption: "Text-based career clusters from O*NET.",
    willowCaption:
      "Video-first career discovery with personality-matched recommendations.",
  },
  {
    headline:
      "Not just a college database. 220,000+ programs with student-personalized ROI.",
    description:
      "Willow is the only platform where students compare college and professional programs side-by-side with personalized ROI projections. Students see what a program actually costs them, what graduates earn, and whether it's worth the investment — before they apply.",
    overgradCaption:
      "College-focused search with institutional completion rates.",
    willowCaption:
      "College + professional programs with personalized, program-level ROI.",
  },
  {
    headline:
      "See who needs attention — without drowning in spreadsheets.",
    description:
      "Willow's Senior Command Center surfaces what matters: missing documents, FAFSA status, approaching deadlines, and at-risk students — in a clean, scannable view. Counselors act on insights instead of hunting through rows.",
    overgradCaption: "Dense student data table.",
    willowCaption:
      "Action-oriented dashboard with built-in prioritization.",
  },
];

/* ─── Hero section ─── */

function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-30 bg-[#ACF7B2]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-heading mb-6">
            <span className="whitespace-nowrap">Overgrad records outcomes.</span>
            <br />
            <span className="underline decoration-heading decoration-2 underline-offset-4">
              Willow shapes them.
            </span>
          </h1>
          <p className="text-heading/80 text-lg md:text-xl leading-relaxed">
            With a structured curriculum, AI-native coaching, and the only
            platform that shows students program-level ROI across 220,000+
            college and professional pathways.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Comparison table section ─── */

function ComparisonTableSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-30 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-heading text-[32px] md:text-[40px] mb-10 md:mb-14">
            Quick comparison
          </h2>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-8 w-1/4 text-sm font-medium text-secondary uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="text-left py-4 px-8 w-[37.5%]">
                    <WillowLogo className="h-[25.2px] w-auto" />
                  </th>
                  <th className="text-left py-4 pl-8 w-[37.5%]">
                    <Image
                      src="/vs-overgrad/overgrad-logo.svg"
                      alt="Overgrad"
                      width={495}
                      height={107}
                      className="h-6 w-auto"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-5 pr-8 text-sm font-semibold text-heading">
                      {row.feature}
                    </td>
                    <td className="py-5 px-8 bg-[#062F29]/[0.03]">
                      <div className="flex items-start gap-2">
                        <CheckCircle
                          size={20}
                          weight="fill"
                          className="text-[#062F29] mt-0.5 shrink-0"
                        />
                        <span className="text-primary text-[15px]">
                          {row.willow}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 pl-8 text-secondary text-[15px]">
                      {row.overgrad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden flex flex-col gap-6">
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-card p-5"
              >
                <p className="text-sm font-semibold text-heading mb-4">
                  {row.feature}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="bg-[#062F29]/[0.03] rounded-lg p-3">
                    <WillowLogo className="h-[16.8px] w-auto mb-1" />
                    <div className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        weight="fill"
                        className="text-[#062F29] mt-0.5 shrink-0"
                      />
                      <span className="text-primary text-sm">{row.willow}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <Image
                      src="/vs-overgrad/overgrad-logo.svg"
                      alt="Overgrad"
                      width={495}
                      height={107}
                      className="h-4 w-auto mb-1"
                    />
                    <span className="text-secondary text-sm">
                      {row.overgrad}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ─── */

export default function WillowVsOvergrad() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ComparisonTableSection />
        {comparisonSections.map((section, i) => (
          <ComparisonBlock
            key={i}
            headline={section.headline}
            description={section.description}
            willowCaption={section.willowCaption}
            overgradCaption={section.overgradCaption}
            reversed={i % 2 === 1}
            {...(i === 0 && {
              willowContent: (
                <div className="relative aspect-video rounded-card overflow-hidden bg-[#062F29] p-6">
                  <div className="relative w-full h-full">
                    <Image
                      src="/hero-assets/hero-img-ui.png"
                      alt="Willow curriculum interface"
                      width={1223}
                      height={919}
                      className="absolute top-0 left-0 w-full h-auto rounded-md"
                    />
                    <Image
                      src="/hero-assets/hero-img-slide-v2.png"
                      alt="Curriculum slide preview"
                      width={927}
                      height={532}
                      className="absolute bottom-6 right-12 w-[55%] h-auto drop-shadow-2xl rounded-md"
                    />
                  </div>
                </div>
              ),
            })}
          />
        ))}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
