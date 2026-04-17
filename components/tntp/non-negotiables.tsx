const items = [
  {
    title: "Protected advisory time.",
    body: "At least 30 minutes once a week, treated as core time. Not a catch-all, not a study hall, not a prep period for teachers.",
  },
  {
    title: "Every student known by multiple trusted adults.",
    body: "Belonging is a structural property of the school, not a relationship lottery. Every student has an advisor who knows them well — and at least one more adult who can speak to their strengths, story, and aspirations.",
  },
  {
    title: "A high-quality, sequenced, shared curriculum.",
    body: "Every advisor works from the same scope and sequence. Purpose-building, career exploration, and postsecondary planning show up on a schedule.",
  },
  {
    title: "All staff act as opportunity brokers, not just counselors.",
    body: "Every adult helps students explore careers and evaluate the quality of postsecondary options. Completion rates and labor-market ROI are part of the conversation across the building.",
  },
  {
    title: "AI fluency built through the curriculum.",
    body: "AI-readiness is career readiness. Advisors use AI to prepare, prioritize, and personalize. Students build AI-fluency skills through advisory content, not by accident.",
  },
  {
    title: "Continuous improvement cycles with real measurement.",
    body: "District- and school-level data feedback loops. Student Mobility Experiences Survey anchors the evidence base across the cohort.",
  },
];

const alsoRequired = [
  "A named district point person accountable for the work.",
  "A team of two to three leaders attending each convening.",
  "A plan to reach all middle and high school students by year two.",
  "Transform an existing advisory, homeroom, or similar course. No new period required.",
  "Contribute to the shared learning agenda. Data, interviews, and candid reflection that feed the research.",
];

export function NonNegotiables() {
  return (
    <section
      id="commitment"
      className="bg-[#FAFAF7] py-20 md:py-30 scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-12">
          {/* Left: header + Also required */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
                What we ask
              </p>
              <h2 className="font-heading font-medium text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
                The non-negotiables.
              </h2>
              <p className="mt-6 text-[15px] md:text-base text-[#2D2D2D] leading-[1.6] max-w-[38ch]">
                Every cohort district commits to these six. They come straight
                from the research. If any is missing, it isn&rsquo;t
                Opportunity Advising. It&rsquo;s a rebranded homeroom.
              </p>

              <div className="mt-10 pt-8 border-t border-[#E5E5E0]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-5">
                  Also required
                </p>
                <ul className="flex flex-col gap-3 text-[14px] text-[#2D2D2D]">
                  {alsoRequired.map((r) => (
                    <li key={r} className="flex gap-3 leading-[1.5]">
                      <span className="text-[#B45309] flex-shrink-0 mt-[2px]">
                        +
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: numbered items */}
          <div className="md:col-span-7 md:col-start-6">
            <ol className="divide-y divide-[#E5E5E0] border-t border-b border-[#E5E5E0]">
              {items.map((item, i) => (
                <li key={item.title} className="py-7 md:py-9 flex flex-col gap-3">
                  <div className="flex items-baseline gap-5">
                    <span className="font-heading text-[13px] tracking-[0.12em] text-[#B45309]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading font-medium text-[19px] md:text-[22px] leading-[1.25] tracking-[-0.005em] text-[#0A0A0A] uppercase">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[15px] md:text-base text-[#2D2D2D] leading-[1.6] pl-[42px]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
