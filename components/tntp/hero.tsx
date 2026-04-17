import { cn } from "@/lib/utils";

const stats = [
  { number: "10–12", label: "innovative districts selected nationally" },
  { number: "$50K", label: "subgrant per district to co-build" },
  { number: "18 mo.", label: "co-design arc from fall 2026" },
  { number: "3", label: "partners leading the work" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative pt-32 md:pt-40 pb-16 md:pb-24"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
          <span className="inline-flex items-center text-xs md:text-[13px] font-medium text-[#0A0A0A] border border-[#0A0A0A]/15 rounded-full px-3 py-1.5 bg-white">
            Co-Build Challenge · 2026&ndash;2028
          </span>
          <span className="inline-flex items-center text-xs md:text-[13px] font-medium text-[#B45309] border border-[#B45309]/25 rounded-full px-3 py-1.5 bg-[#FDF6EC]">
            Applications open through June 15
          </span>
        </div>

        {/* Headline */}
        <h1
          className={cn(
            "font-heading font-medium tracking-[-0.02em] text-[40px] leading-[1.05]",
            "md:text-[64px] lg:text-[84px] xl:text-[92px]",
            "max-w-[18ch]"
          )}
        >
          Advisory is the most underused hour in American high schools.{" "}
          <span className="text-[#737373]">Help us change that.</span>
        </h1>

        {/* Subhead */}
        <p className="mt-8 md:mt-10 max-w-[58ch] text-base md:text-lg lg:text-[19px] text-[#2D2D2D] leading-[1.55]">
          We&rsquo;re looking for 10 to 12 innovative districts to co-build
          Opportunity Advising with us. A national partnership between TNTP,
          Willow Education, and the Gates Foundation to turn advisory into the
          delivery system for belonging, coherence, career readiness, and
          postsecondary success.
        </p>

        {/* Buttons */}
        <div className="mt-8 md:mt-10 flex flex-wrap gap-3">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 text-[15px] font-medium bg-[#0A0A0A] text-[#FAFAF7] px-5 py-3 rounded-full hover:bg-[#2D2D2D] transition-colors"
          >
            Apply by June 15 <span aria-hidden>→</span>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-[#0A0A0A] border border-[#0A0A0A]/20 px-5 py-3 rounded-full hover:bg-[#0A0A0A]/5 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 md:gap-x-8 border-t border-[#E5E5E0] pt-10 md:pt-12">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-heading text-[28px] md:text-[32px] lg:text-[36px] tracking-[-0.015em] text-[#0A0A0A] leading-none">
                {s.number}
              </div>
              <p className="mt-3 text-sm md:text-[13px] text-[#525252] max-w-[22ch] leading-[1.45]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Partner bar */}
        <div className="mt-12 md:mt-16 flex items-center gap-3 text-xs md:text-[11px] uppercase tracking-[0.14em] text-[#737373]">
          <span>Co-led by</span>
          <span className="h-px flex-1 max-w-12 bg-[#E5E5E0]" />
          <span className="text-[#0A0A0A] font-medium">TNTP</span>
          <span className="text-[#BBB]">·</span>
          <span className="text-[#0A0A0A] font-medium">Willow Education</span>
          <span className="text-[#BBB]">·</span>
          <span className="text-[#0A0A0A] font-medium">Gates Foundation</span>
        </div>
      </div>
    </section>
  );
}
