const phases = [
  {
    roman: "I",
    period: "Now through June 15",
    title: "Applications open.",
    body: "Districts apply. Selection panel reviews. Target mix: urban, suburban, rural, large, small, charter, traditional.",
    pill: "Deadline · June 15, 2026",
  },
  {
    roman: "II",
    period: "Summer 2026",
    title: "Selection and onboarding.",
    body: "Selected districts announced in July. Subgrant funds flow. Readiness assessment. District design teams form.",
    pill: "Cohort named · July 2026",
  },
  {
    roman: "III",
    period: "Sept 2026 – June 2027",
    title: "Co-build and pilot.",
    body: "First in-person convening (mid to late September 2026). Monthly virtual workshops. Active pilots across two semesters. Second convening in spring 2027.",
    pill: "First convening · Sept 2026",
  },
  {
    roman: "IV",
    period: "Summer 2027 – 2028",
    title: "Scale across the district.",
    body: "Districts execute a plan to bring Opportunity Advising to all middle and high school students by year two. Insights brief published. Cohort voices carry the movement.",
    pill: "All students · Year 2",
  },
];

export function Timeline() {
  return (
    <section
      id="timeline"
      className="bg-white border-t border-[#E5E5E0] py-20 md:py-30 scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16 md:mb-20">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
              The arc
            </p>
            <h2 className="font-heading font-medium text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
              Eighteen months, four phases.
            </h2>
          </div>
        </div>

        <ol className="relative">
          {phases.map((p, i) => (
            <li
              key={p.roman}
              className="relative grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-12 py-8 md:py-10 border-t border-[#E5E5E0] last:border-b"
            >
              <div className="md:col-span-3 flex items-start gap-5">
                <span className="font-heading text-[44px] md:text-[56px] leading-none tracking-tight text-[#0A0A0A]">
                  {p.roman}
                </span>
                <div className="pt-1 md:pt-2">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252]">
                    Phase {i + 1}
                  </p>
                  <p className="mt-1 text-[13px] text-[#2D2D2D]">
                    {p.period}
                  </p>
                </div>
              </div>
              <div className="md:col-span-7 md:col-start-4">
                <h3 className="font-heading font-medium text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] md:text-base text-[#2D2D2D] leading-[1.6] max-w-[60ch]">
                  {p.body}
                </p>
              </div>
              <div className="md:col-span-2 md:col-start-11 flex md:justify-end">
                <span className="inline-flex items-center text-[12px] font-medium text-[#0A0A0A] border border-[#0A0A0A]/15 rounded-full px-3 py-1.5 bg-[#FAFAF7]">
                  {p.pill}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
