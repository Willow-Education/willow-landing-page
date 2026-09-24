import Image from "next/image";

// Page-top section for the careers pages, echoing the homepage hero: warm
// paper texture with torn-paper scraps along the bottom edge.

function maskStyle(src: string): React.CSSProperties {
  return {
    maskImage: `url(${src})`,
    maskSize: "100% 100%",
    WebkitMaskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%",
  };
}

export function PaperHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-28 md:pt-40 md:pb-40 bg-gradient-to-b from-white to-[#F5F1EB]">
      <Image
        src="/hero-assets/paper.avif"
        alt=""
        fill
        className="object-cover opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Right: notebook-paper scrap over a plain paper scrap */}
      <div
        className="absolute bottom-[-2px] right-0 w-[48%] max-w-[460px] aspect-[1006/475] pointer-events-none"
        aria-hidden="true"
      >
        <Image src="/hero-assets/paper-scrap-2.svg" alt="" fill className="object-fill" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/hero-assets/noise-1.png)",
            backgroundSize: "200px",
            ...maskStyle("/hero-assets/paper-scrap-2.svg"),
          }}
        />
      </div>
      <div
        className="absolute bottom-[-2px] right-0 w-[44%] max-w-[420px] aspect-[917/417] overflow-hidden pointer-events-none"
        style={maskStyle("/hero-assets/paper-scrap-1.svg")}
        aria-hidden="true"
      >
        <div
          className="absolute inset-[-20%]"
          style={{
            backgroundImage: "url(/hero-assets/notebook-pattern.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "rotate(10deg)",
          }}
        />
      </div>

      {/* Left: mint scrap */}
      <div
        className="absolute bottom-[-2px] left-0 w-[34%] max-w-[300px] aspect-[846/371] pointer-events-none"
        aria-hidden="true"
      >
        <Image src="/hero-assets/paper-scrap-6.svg" alt="" fill className="object-fill" />
      </div>
      <div
        className="absolute bottom-[-2px] left-0 w-[31%] max-w-[280px] aspect-[846/326] pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ backgroundColor: "#ACF7B2", ...maskStyle("/hero-assets/paper-scrap-5.svg") }} />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/hero-assets/noise-1.png)",
            backgroundSize: "200px",
            ...maskStyle("/hero-assets/paper-scrap-5.svg"),
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
