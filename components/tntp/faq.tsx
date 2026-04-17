"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do we need to create a new period in our master schedule?",
    a: "No. Opportunity Advising is designed to transform the time most districts already protect. Advisory, homeroom, seminar, mentor block. If you don't have a protected block today, we'll help you design one into the schedule.",
  },
  {
    q: "Do we need to adopt Willow's platform to participate?",
    a: "Cohort districts use the Opportunity Advising hybrid advising platform and curriculum during the co-build period. Both are included at no additional cost. We're looking for districts who want to build with us, and the platform is one of the things we're refining together.",
  },
  {
    q: "Is $50,000 enough to fund this work?",
    a: "The subgrant is designed to cover the extra cost of participating: backfill time for design team educators, planning days, data collection, travel to convenings. The core implementation support, curriculum, and platform access are provided in addition to the subgrant.",
  },
  {
    q: "What happens after the 18 months?",
    a: "Cohort districts have a clear path to continued partnership on standard commercial terms. Many will become flagship sites for the scaled offer. Districts are not locked in, and nothing about the cohort requires a multi-year commercial commitment on the other side.",
  },
  {
    q: "Who do we contact with questions before applying?",
    a: "Email cobuild@opportunityadvising.org. We're happy to jump on a 20-minute call with district teams weighing whether to apply.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-white border-t border-[#E5E5E0] py-20 md:py-30 scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
                Common questions
              </p>
              <h2 className="font-heading font-medium text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
                Before you apply.
              </h2>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <ul className="border-t border-b border-[#E5E5E0] divide-y divide-[#E5E5E0]">
              {faqs.map((f, i) => {
                const open = openIndex === i;
                return (
                  <li key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      className="w-full py-6 md:py-7 flex items-start justify-between gap-6 text-left group"
                    >
                      <span className="font-heading text-[17px] md:text-[19px] font-medium text-[#0A0A0A] leading-[1.3] tracking-[-0.005em]">
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          "relative w-6 h-6 flex-shrink-0 mt-1 transition-transform duration-300",
                          open && "rotate-45"
                        )}
                        aria-hidden
                      >
                        <span className="absolute inset-0 m-auto w-4 h-[1.5px] bg-[#0A0A0A]" />
                        <span className="absolute inset-0 m-auto h-4 w-[1.5px] bg-[#0A0A0A]" />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300",
                        open
                          ? "grid-rows-[1fr] opacity-100 pb-6 md:pb-7"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[15px] md:text-base text-[#2D2D2D] leading-[1.65] max-w-[62ch] pr-6">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
