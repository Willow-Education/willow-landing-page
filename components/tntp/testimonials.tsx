import { cn } from "@/lib/utils";
import { fraunces } from "./fonts";

const testimonials = [
  {
    quote:
      "I'm seeing students engage in a different way than they ever have before.",
    name: "Vinny Caricato",
    role: "Director, KIPP Forward",
  },
  {
    quote:
      "This partnership has truly transformed the way my team and students thrive.",
    name: "Wauneta Vann",
    role: "High School Principal, Rocky Mountain Prep RISE",
  },
  {
    quote:
      "Our entire Pathsmith framework is embedded into the curriculum and platform.",
    name: "Tim Taylor",
    role: "President, America Succeeds",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#FAFAF7] py-20 md:py-30">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-10 md:mb-14">
          From the field
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-white border border-[#E5E5E0] rounded-2xl p-7 md:p-8 flex flex-col justify-between gap-8"
            >
              <blockquote
                className={cn(
                  fraunces.className,
                  "italic text-[#0A0A0A] text-[22px] md:text-[24px] leading-[1.3] tracking-[-0.005em]"
                )}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0A0A0A]">
                  {t.name}
                </span>
                <span className="text-[13px] text-[#525252]">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
