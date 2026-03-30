"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion, useIsMobile } from "@/hooks/use-media-query";

// Image paths for staged loading
const CRITICAL_IMAGES = ["/hero-assets/hero-img-ui.png"];
const SECONDARY_IMAGES = ["/hero-assets/hero-img-slide-v2.png"];
const DECORATIVE_IMAGES = [
  "/hero-assets/paper.avif",
  "/hero-assets/paper-scrap-1.svg",
  "/hero-assets/paper-scrap-2.svg",
  "/hero-assets/paper-scrap-3.svg",
  "/hero-assets/paper-scrap-4.svg",
  "/hero-assets/paper-scrap-5.svg",
  "/hero-assets/paper-scrap-6.svg",
  "/hero-assets/notebook-pattern.png",
  "/hero-assets/noise-1.png",
  "/hero-assets/black-texture.jpg",
];

// Transition configs
const FADE_TRANSITION = "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)";
const DECORATIVE_TRANSITION = "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms";

// DEBUG: Set to true to simulate slow loading (remove before production)
const DEBUG_SLOW_LOADING = false;
const DEBUG_CRITICAL_DELAY = 2000;   // 2s delay for main image
const DEBUG_SECONDARY_DELAY = 3000;  // 3s delay for slide image
const DEBUG_DECORATIVE_DELAY = 4000; // 4s delay for decorative elements

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Track loading state for each image group
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const [decorativeLoaded, setDecorativeLoaded] = useState(false);

  // Track individual image loading for coordinated reveal
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const markImageLoaded = useCallback((src: string) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  // Check when all images in each group are loaded
  const handleCriticalLoad = useCallback(() => {
    if (DEBUG_SLOW_LOADING) {
      setTimeout(() => setCriticalLoaded(true), DEBUG_CRITICAL_DELAY);
    } else {
      setCriticalLoaded(true);
    }
  }, []);

  const handleSecondaryLoad = useCallback(() => {
    if (DEBUG_SLOW_LOADING) {
      setTimeout(() => setSecondaryLoaded(true), DEBUG_SECONDARY_DELAY);
    } else {
      setSecondaryLoaded(true);
    }
  }, []);

  // Scroll-based parallax animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Disable parallax on mobile or reduced motion
  const shouldAnimate = !prefersReducedMotion && !isMobile;

  // Smooth horizontal movement for the slide image
  const slideXRaw = useTransform(
    scrollYProgress,
    [0, 1],
    shouldAnimate ? [-20, 60] : [0, 0]
  );
  const slideX = useSpring(slideXRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Slight upward movement
  const slideYRaw = useTransform(
    scrollYProgress,
    [0, 1],
    shouldAnimate ? [10, -30] : [0, 0]
  );
  const slideY = useSpring(slideYRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Animation variants - disabled for reduced motion
  const textVariants = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  const imageVariants = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-24 md:pt-32 pb-0 bg-gradient-to-b from-white to-[#F5F1EB]"
    >
      {/* Placeholder layer - visible until decorative images load */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white to-[#F5F1EB] pointer-events-none"
        style={{
          opacity: decorativeLoaded ? 0 : 1,
          transition: FADE_TRANSITION,
        }}
        aria-hidden="true"
      />

      {/* Paper texture background - staged reveal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: decorativeLoaded ? 1 : 0,
          transition: DECORATIVE_TRANSITION,
        }}
        aria-hidden="true"
      >
        <Image
          src="/hero-assets/paper.avif"
          alt=""
          fill
          className="object-cover opacity-10"
          aria-hidden="true"
          loading="lazy"
          onLoad={() => markImageLoaded("/hero-assets/paper.avif")}
        />
      </div>

      {/* Decorative paper scraps - staged reveal */}
      <>
        {/* Paper scrap decorations - Right side */}
          <div
            className="absolute bottom-[-2px] right-0 w-[65%] max-w-[723px] h-auto z-[1] pointer-events-none"
            style={{
              opacity: decorativeLoaded ? 1 : 0,
              transition: DECORATIVE_TRANSITION,
            }}
            aria-hidden="true"
          >
            <Image
              src="/hero-assets/paper-scrap-1.svg"
              alt=""
              width={1006}
              height={478}
              className="w-full h-auto opacity-0"
              aria-hidden="true"
              loading="lazy"
              onLoad={() => markImageLoaded("/hero-assets/paper-scrap-1.svg")}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "url(/hero-assets/paper-scrap-1.svg)",
                maskSize: "100% 100%",
                WebkitMaskImage: "url(/hero-assets/paper-scrap-1.svg)",
                WebkitMaskSize: "100% 100%",
              }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-[-20%] w-[140%] h-[140%]"
                style={{
                  backgroundImage: "url(/hero-assets/notebook-pattern.png)",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  transform: "rotate(10deg)",
                }}
              />
            </div>
          </div>

          <div
            className="absolute bottom-[-2px] right-0 w-[68%] max-w-[765px] h-auto z-0 pointer-events-none"
            style={{
              opacity: decorativeLoaded ? 1 : 0,
              transition: DECORATIVE_TRANSITION,
            }}
            aria-hidden="true"
          >
            <Image
              src="/hero-assets/paper-scrap-2.svg"
              alt=""
              width={893}
              height={445}
              className="w-full h-auto"
              aria-hidden="true"
              loading="lazy"
              onLoad={() => markImageLoaded("/hero-assets/paper-scrap-2.svg")}
            />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "url(/hero-assets/noise-1.png)",
                backgroundSize: "200px",
                maskImage: "url(/hero-assets/paper-scrap-2.svg)",
                maskSize: "100% 100%",
                WebkitMaskImage: "url(/hero-assets/paper-scrap-2.svg)",
                WebkitMaskSize: "100% 100%",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Paper scrap decorations - Left side */}
          <Image
            src="/hero-assets/paper-scrap-4.svg"
            alt=""
            width={1373}
            height={570}
            className="absolute bottom-[-2px] left-0 w-[83%] max-w-[918px] h-auto z-0 pointer-events-none"
            style={{
              opacity: decorativeLoaded ? 1 : 0,
              transition: DECORATIVE_TRANSITION,
            }}
            aria-hidden="true"
            loading="lazy"
            onLoad={() => markImageLoaded("/hero-assets/paper-scrap-4.svg")}
          />

          <div
            className="absolute bottom-[-2px] left-0 w-[75%] max-w-[826px] h-auto z-[1] pointer-events-none"
            style={{
              opacity: decorativeLoaded ? 1 : 0,
              transition: DECORATIVE_TRANSITION,
            }}
            aria-hidden="true"
          >
            <Image
              src="/hero-assets/paper-scrap-3.svg"
              alt=""
              width={1370}
              height={564}
              className="w-full h-auto"
              aria-hidden="true"
              loading="lazy"
              onLoad={() => markImageLoaded("/hero-assets/paper-scrap-3.svg")}
            />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "url(/hero-assets/black-texture.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                maskImage: "url(/hero-assets/paper-scrap-3.svg)",
                maskSize: "100% 100%",
                WebkitMaskImage: "url(/hero-assets/paper-scrap-3.svg)",
                WebkitMaskSize: "100% 100%",
              }}
              aria-hidden="true"
            />
          </div>

          <Image
            src="/hero-assets/paper-scrap-6.svg"
            alt=""
            width={924}
            height={519}
            className="absolute bottom-[-2px] left-0 w-[30%] max-w-[319px] h-auto z-[2] pointer-events-none"
            style={{
              opacity: decorativeLoaded ? 1 : 0,
              transition: DECORATIVE_TRANSITION,
            }}
            aria-hidden="true"
            loading="lazy"
            onLoad={() => markImageLoaded("/hero-assets/paper-scrap-6.svg")}
          />

          <div
            className="absolute bottom-[-2px] left-0 w-[27%] max-w-[298px] h-auto z-[3] pointer-events-none"
            style={{
              opacity: decorativeLoaded ? 1 : 0,
              transition: DECORATIVE_TRANSITION,
            }}
            aria-hidden="true"
          >
            <Image
              src="/hero-assets/paper-scrap-5.svg"
              alt=""
              width={930}
              height={458}
              className="w-full h-auto opacity-0"
              aria-hidden="true"
              loading="lazy"
              onLoad={() => markImageLoaded("/hero-assets/paper-scrap-5.svg")}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "#ACF7B2",
                maskImage: "url(/hero-assets/paper-scrap-5.svg)",
                maskSize: "100% 100%",
                WebkitMaskImage: "url(/hero-assets/paper-scrap-5.svg)",
                WebkitMaskSize: "100% 100%",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "url(/hero-assets/noise-1.png)",
                backgroundSize: "200px",
                maskImage: "url(/hero-assets/paper-scrap-5.svg)",
                maskSize: "100% 100%",
                WebkitMaskImage: "url(/hero-assets/paper-scrap-5.svg)",
                WebkitMaskSize: "100% 100%",
              }}
              aria-hidden="true"
            />
          </div>
      </>

      {/* Text Content - Centered */}
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-5 md:px-10 max-w-4xl mx-auto"
      >
        <h1 className="text-[32px] md:text-5xl lg:text-[60px] text-heading mb-6">
          Career & postsecondary readiness built for economic mobility
        </h1>
        <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
          A curriculum and platform for purpose, AI fluency, and postsecondary
          success for your students.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/curriculum-sample">
            <Button variant="secondary">Get a curriculum sample</Button>
          </Link>
          <a
            href="https://calendly.com/d/cq6c-qdg-hjw/willow-curriculum-platform-demo-meeting?month=2025-12"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Request a proposal</Button>
          </a>
        </div>
      </motion.div>

      {/* Hero Image Composition */}
      <motion.div
        variants={imageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
        className="relative z-10 mt-12 md:mt-16 px-5 md:px-10 lg:px-16 max-w-7xl mx-auto mb-[-2px]"
      >
        <div className="relative w-full md:w-[76%] mx-auto md:-translate-x-[5%]">
          {/* UI Frame - Base layer with aspect ratio placeholder */}
          <div className="relative overflow-hidden [aspect-ratio:1223/743] bg-[#F5F1EB] rounded-t-lg">
            {/* Loading placeholder */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#F8F6F3] to-[#EBE7E0] rounded-t-lg"
              style={{
                opacity: criticalLoaded ? 0 : 1,
                transition: FADE_TRANSITION,
              }}
              aria-hidden="true"
            />
            <Image
              src="/hero-assets/hero-img-ui.png"
              alt="Willow curriculum interface"
              width={1223}
              height={919}
              quality={80}
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 76vw, 900px"
              className="absolute top-0 left-0 w-full h-auto"
              style={{
                opacity: criticalLoaded ? 1 : 0,
                transition: FADE_TRANSITION,
              }}
              priority
              fetchPriority="high"
              onLoad={handleCriticalLoad}
            />
          </div>

          {/* Slide Image - On top, positioned right, smooth scroll animation */}
          <motion.div
            style={shouldAnimate ? { x: slideX, y: slideY } : undefined}
            className="absolute top-[8%] md:top-[15%] right-[-20%] md:right-[-30%] w-[55%] md:w-[62%] z-10"
          >
            {/* Aspect ratio placeholder for slide */}
            <div className="relative [aspect-ratio:927/532]">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#F8F6F3] to-[#EBE7E0] rounded-lg shadow-2xl"
                style={{
                  opacity: secondaryLoaded ? 0 : 1,
                  transition: FADE_TRANSITION,
                }}
                aria-hidden="true"
              />
              <Image
                src="/hero-assets/hero-img-slide-v2.png"
                alt="Curriculum slide preview"
                width={927}
                height={532}
                quality={80}
                sizes="(max-width: 768px) 50vw, 500px"
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  opacity: secondaryLoaded ? 1 : 0,
                  transition: FADE_TRANSITION,
                }}
                priority
                onLoad={handleSecondaryLoad}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Preload decorative images after critical content is ready */}
      {criticalLoaded && !decorativeLoaded && (
        <DecorativePreloader
          images={DECORATIVE_IMAGES}
          onComplete={() => {
            if (DEBUG_SLOW_LOADING) {
              setTimeout(() => setDecorativeLoaded(true), DEBUG_DECORATIVE_DELAY);
            } else {
              setDecorativeLoaded(true);
            }
          }}
        />
      )}

      {/* Divider line */}
      <div className="w-full h-px bg-[#D5D7DA]" />
    </section>
  );
}

/**
 * Silently preloads decorative images in the background.
 * Uses requestIdleCallback for non-blocking preload.
 */
function DecorativePreloader({
  images,
  onComplete,
}: {
  images: string[];
  onComplete: () => void;
}) {
  const preloadedRef = useRef(0);
  const totalImages = images.length;

  const handleLoad = useCallback(() => {
    preloadedRef.current += 1;
    if (preloadedRef.current >= totalImages) {
      // Small delay for smooth visual transition
      setTimeout(onComplete, 50);
    }
  }, [totalImages, onComplete]);

  return (
    <div className="hidden" aria-hidden="true">
      {images.map((src) => (
        <link
          key={src}
          rel="preload"
          as="image"
          href={src}
          onLoad={handleLoad}
          onError={handleLoad}
        />
      ))}
    </div>
  );
}
