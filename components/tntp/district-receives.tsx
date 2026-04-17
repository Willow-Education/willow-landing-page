const items = [
  {
    title: "$50,000 subgrant",
    body: "Backfill teacher time, fund planning days, cover travel to convenings.",
  },
  {
    title: "Curriculum & platform",
    body: "The Opportunity Advising hybrid advising platform and curriculum at no cost during the cohort.",
  },
  {
    title: "Implementation support",
    body: "Readiness assessment, service blueprints, and professional learning from TNTP.",
  },
  {
    title: "Peer cohort",
    body: "Nine to eleven other innovative districts working on the same problem together.",
  },
  {
    title: "Learning science contribution",
    body: "Standing in published research and case studies. Your district's data feeds TNTP's Mobility Research Lab and shapes what the field learns about advisory.",
  },
  {
    title: "Scale plan",
    body: "A credible plan to reach all middle and high school students in year two, built with us.",
  },
];

export function DistrictReceives() {
  return (
    <section className="bg-[#FAFAF7] py-20 md:py-30">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="bg-white border border-[#E5E5E0] rounded-3xl p-8 md:p-14 lg:p-20 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12 md:mb-16">
            <div className="md:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
                What your district receives
              </p>
              <h2 className="font-heading font-medium text-[32px] md:text-[44px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
                Real investment, not a trial.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 text-[17px] md:text-[19px] text-[#2D2D2D] leading-[1.6] md:pt-4">
              <p>
                Selected districts receive a $50,000 subgrant and a full stack
                of support across the 18-month arc.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {items.map((item, i) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 pt-6 border-t border-[#E5E5E0]"
              >
                <span className="font-heading text-xs text-[#B45309] tracking-[0.08em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading font-medium text-[19px] md:text-[20px] leading-[1.25] tracking-[-0.01em] text-[#0A0A0A]">
                  {item.title}
                </h3>
                <p className="text-[15px] text-[#2D2D2D] leading-[1.55]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
