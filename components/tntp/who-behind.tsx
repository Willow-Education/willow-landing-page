const partners = [
  {
    name: "TNTP",
    body: "Thirty years rebuilding teaching and learning systems. Published Paths of Opportunity and Opportunity Makers. The Mobility Research Lab anchors the evidence agenda.",
    chips: ["Research", "Implementation", "Scale"],
  },
  {
    name: "Willow Education",
    body: "Building the leading platform for career-connected learning and postsecondary readiness. Human-led, AI-enabled hybrid advising — curriculum plus platform plus practice. Founded by James Cryan, former founder and CEO of Rocky Mountain Prep.",
    chips: ["Platform", "Curriculum", "Practice"],
  },
  {
    name: "Gates Foundation",
    body: "Funding partner for the co-build. Aligned with Gates's April 2026 AI strategy: AI-enabled advising, system interoperability, and quality data and outcomes.",
    chips: ["Funding", "Evidence", "Field"],
  },
];

export function WhoBehind() {
  return (
    <section className="bg-white border-t border-[#E5E5E0] py-20 md:py-30">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14 md:mb-20">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
              Who&rsquo;s behind this
            </p>
            <h2 className="font-heading font-medium text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
              A partnership, not a vendor pitch.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-4 text-[17px] md:text-[19px] text-[#2D2D2D] leading-[1.6]">
            <p>
              Three organizations co-lead the co-build. Each brings a
              different asset. Together, we have the research, the delivery
              system, and the capital to do this at national scale.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {partners.map((p) => (
            <div
              key={p.name}
              className="bg-[#FAFAF7] border border-[#E5E5E0] rounded-2xl p-7 md:p-8 flex flex-col gap-5"
            >
              <h3 className="font-heading font-medium text-[24px] md:text-[26px] leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                {p.name}
              </h3>
              <p className="text-[15px] text-[#2D2D2D] leading-[1.55] flex-1">
                {p.body}
              </p>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E5E5E0]">
                {p.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.08em] text-[#525252] bg-white border border-[#E5E5E0] rounded-full px-2.5 py-1"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
