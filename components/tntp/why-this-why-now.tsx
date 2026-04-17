import { cn } from "@/lib/utils";
import { fraunces } from "./fonts";

export function WhyThisWhyNow() {
  return (
    <section className="bg-white border-t border-[#E5E5E0] py-20 md:py-30 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        {/* Eyebrow */}
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-10 md:mb-14">
          Why this, why now
        </p>

        {/* Display stat + pull quote */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 mb-16 md:mb-24 items-start">
          <div className="md:col-span-5">
            <div className="font-heading font-medium leading-[0.88] tracking-[-0.04em] text-[120px] md:text-[160px] lg:text-[200px] text-[#0A0A0A]">
              38
              <span className="text-[#B45309]">.</span>
            </div>
            <p className="mt-5 text-base md:text-lg text-[#2D2D2D] max-w-[28ch] leading-[1.45]">
              Minutes of real advising the average American high schooler
              receives across a full school year.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7 md:pt-8">
            <blockquote
              className={cn(
                fraunces.className,
                "italic text-[#0A0A0A] text-[28px] md:text-[36px] lg:text-[44px] leading-[1.25] tracking-[-0.01em]"
              )}
            >
              &ldquo;I liked school. I just never knew what I was preparing
              for.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Body paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-3 space-y-6 text-[17px] md:text-[19px] text-[#2D2D2D] leading-[1.6]">
            <p>
              A senior said that to us last year, two weeks before graduation.
              She had a 3.6 GPA, a seat at a four-year college, and no clear
              sense of why. She is not an outlier. Only 37 percent of middle
              and high schoolers say their coursework is connected to the real
              world. Only 21 percent of teachers say their college-bound
              students are very prepared. For students heading straight to the
              workforce, it&rsquo;s 10 percent.
            </p>
            <p>
              While many districts have developed a portrait of a graduate,
              fewer have changed how they teach and measure those durable
              skills. Transforming advisory, or a similar space, is the spine
              that belonging, durable skills, and career readiness build on.
            </p>
            <p>
              Done well, it is also where purpose gets built. Not in a single
              reflection or career quiz. Over years, through repeated cycles
              of exploration and feedback, with an advisor who actually knows
              the student. That&rsquo;s the bet.
            </p>
            <p>
              And the field deserves better evidence on whether it&rsquo;s
              working. Advisory has not been studied the way core instruction
              has. The co-build is designed to produce real learning science
              on what belonging, purpose-building, and career readiness
              actually take inside a secondary school day, so what we learn
              travels beyond the cohort.
            </p>
          </div>
        </div>

        {/* Source */}
        <p className="mt-12 md:mt-16 text-xs text-[#737373] md:text-center">
          Sources: Walton Family Foundation / Gallup 2025 Gen Z Study; Walton
          Family Foundation / RAND 2024 Teacher Survey.
        </p>
      </div>
    </section>
  );
}
