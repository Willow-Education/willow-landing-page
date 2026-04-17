const cards = [
  {
    num: "01",
    eyebrow: "Belonging by design",
    title: "Every student is known by multiple adults.",
    body: "Belonging as a structural property of the school. Strengths, story, and aspirations documented and shared. Relationships that last across grades.",
  },
  {
    num: "02",
    eyebrow: "Consistency",
    title: "A shared curriculum, not just a shared intent.",
    body: "Every advisor works from the same high-quality scope and sequence. Purpose-building, career exploration, and postsecondary planning show up on a schedule, not when an advisor has time to wing it.",
  },
  {
    num: "03",
    eyebrow: "Coherence",
    title: "Advising is the connective tissue.",
    body: "Links core academics, career-connected learning, CTE, and postsecondary pathways into one student experience. Same advisor, same playbook, same direction.",
  },
  {
    num: "04",
    eyebrow: "AI for human potential",
    title: "Human relationships first. AI supports.",
    body: "Advisors use AI to prepare, prioritize, and personalize. Students use it to reflect, create, and decide. The technology unlocks the relationship. It does not replace it.",
  },
];

export function WhatItIs() {
  return (
    <section
      id="what-it-is"
      className="bg-[#FAFAF7] border-t border-[#E5E5E0] py-20 md:py-30 scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16 md:mb-24">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
              The model
            </p>
            <h2 className="font-heading font-medium text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
              What Opportunity Advising is.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-5 text-[17px] md:text-[19px] text-[#2D2D2D] leading-[1.6]">
            <p>
              A purpose-led, curriculum-led approach to advisory. Treated with
              the same seriousness as a core academic class. Sequenced,
              high-quality content. Consistent routines. Protected time.
              Measured outcomes. A coherent connection to the rest of the
              student&rsquo;s school experience.
            </p>
            <p>
              Grounded in TNTP&rsquo;s Paths of Opportunity and Opportunity
              Makers research. Delivered through a hybrid advising platform
              that unlocks the human relationship rather than replacing it.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {cards.map((c) => (
            <div
              key={c.num}
              className="bg-white border border-[#E5E5E0] rounded-2xl p-7 md:p-9 flex flex-col gap-4 hover:border-[#0A0A0A]/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm text-[#B45309] tracking-[0.08em]">
                  {c.num}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#525252]">
                  {c.eyebrow}
                </span>
              </div>
              <h3 className="font-heading font-medium text-[22px] md:text-[26px] lg:text-[28px] leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                {c.title}
              </h3>
              <p className="text-[15px] md:text-base text-[#2D2D2D] leading-[1.55]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
