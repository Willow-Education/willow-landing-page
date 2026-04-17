export function FinalCta() {
  return (
    <section className="bg-[#0A0A0A] text-[#FAFAF7] py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16 text-center">
        <h2 className="font-heading font-medium text-[40px] md:text-[64px] lg:text-[80px] leading-[1.05] tracking-[-0.02em] max-w-[20ch] mx-auto">
          Transform advisory. Transform opportunity.
        </h2>
        <p className="mt-8 md:mt-10 text-lg md:text-[20px] lg:text-[22px] text-[#D4D4D4] leading-[1.5] max-w-[58ch] mx-auto">
          Ten to twelve districts. Eighteen months. One shared bet. If your
          district is ready to build rather than wait, we want to hear from
          you.
        </p>
        <div className="mt-10 md:mt-12">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 text-[15px] font-medium bg-[#FAFAF7] text-[#0A0A0A] px-6 py-3.5 rounded-full hover:bg-white transition-colors"
          >
            Apply by June 15 <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
