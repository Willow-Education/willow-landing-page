const callouts = [
  {
    title: "Use the block your district already has.",
    body: "Thirty minutes a week is enough to start. We're not asking you to add a period. We're asking you to take the block your district already protects and treat it like a core class.",
  },
  {
    title: "Every student. Not just some.",
    body: "We serve all students. Not just the college-bound. Not just the at-risk. Not just the ones who already know what they want. Advisory is the one structure that reliably reaches every one of them.",
  },
  {
    title: "Quality and ROI drive every path.",
    body: "College, apprenticeship, workforce, military, entrepreneurship. Students evaluate each one by completion rates and labor-market ROI, not by default or by who in their life went where.",
  },
];

export function WhyDifferent() {
  return (
    <section className="bg-[#0A0A0A] text-[#FAFAF7] py-20 md:py-30 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        {/* Header */}
        <div className="max-w-[900px] mb-16 md:mb-24">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#B45309] mb-5">
            Why this is different
          </p>
          <h2 className="font-heading font-medium text-[36px] md:text-[52px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] max-w-[18ch]">
            The opposite starting place.
          </h2>
          <p className="mt-8 md:mt-10 text-lg md:text-[20px] lg:text-[22px] text-[#D4D4D4] leading-[1.5] max-w-[58ch]">
            Too many systems think about career readiness as a platform to
            deploy. We think about it as the experiences, relationships, and
            durable skills students need while they explore who they are and
            where they&rsquo;re headed. Purpose first. Curriculum and advisor
            practice next. The platform is the last mile, not the starting
            line.
          </p>
        </div>

        {/* Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {callouts.map((c, i) => (
            <div key={c.title} className="flex flex-col gap-3">
              <span className="font-heading text-sm text-[#B45309] tracking-[0.08em] mb-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading font-medium text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.01em] text-[#FAFAF7]">
                {c.title}
              </h3>
              <p className="text-[15px] text-[#A3A3A3] leading-[1.55]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
