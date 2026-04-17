const cards = [
  {
    num: "01",
    eyebrow: "Convene",
    title: "Two 2-day in-person convenings.",
    body: "One in fall (mid to late September 2026) to launch the co-build. One in spring (2027) to synthesize and plan scale. Bring a team of two or three district leaders to each.",
  },
  {
    num: "02",
    eyebrow: "Work",
    title: "Monthly virtual workshops.",
    body: "Between convenings, cohort districts meet monthly to solve real problems, refine routines, and share artifacts. Workshops are working sessions, not webinars.",
  },
  {
    num: "03",
    eyebrow: "Pilot",
    title: "Pilot with real students.",
    body: "Districts run Opportunity Advising in selected schools and grade levels during the 2026–27 school year. Live classrooms, real data, honest reflection.",
  },
];

export function CoBuild() {
  return (
    <section
      id="how-it-works"
      className="bg-white border-t border-[#E5E5E0] py-20 md:py-30 scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16 md:mb-24">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
              The co-build
            </p>
            <h2 className="font-heading font-medium text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
              You&rsquo;re not a pilot site. You&rsquo;re a co-builder.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 text-[17px] md:text-[19px] text-[#2D2D2D] leading-[1.6]">
            <p>
              A pilot says: we built the thing, try it. A co-build says: we
              have a framework, a curriculum, and a platform. Come help us
              finish building it for the real conditions in real districts.
              Selected districts get a seat at the design table, subgrant
              funding, and 18 months of deep support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {cards.map((c) => (
            <div
              key={c.num}
              className="bg-[#FAFAF7] border border-[#E5E5E0] rounded-2xl p-7 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm text-[#B45309] tracking-[0.08em]">
                  {c.num}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#525252]">
                  {c.eyebrow}
                </span>
              </div>
              <h3 className="font-heading font-medium text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                {c.title}
              </h3>
              <p className="text-[15px] text-[#2D2D2D] leading-[1.55]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
