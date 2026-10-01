"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";

interface FinalCTAProps {
  headline?: string;
  singleButton?: {
    text: string;
    href: string;
  };
  sectionClassName?: string;
}

export function FinalCTA({ headline, singleButton, sectionClassName = "py-20 md:py-30" }: FinalCTAProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className={`${sectionClassName} bg-white`}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#ACF7B2] rounded-[12px] p-10 md:p-[80px] text-center overflow-hidden"
        >
          <Image
            src="/cta-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-10 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h3 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-8 max-w-4xl mx-auto leading-tight">
              {headline || "Ready to put your students on a purposeful path to social and economic mobility?"}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {singleButton ? (
                <Link href={singleButton.href}>
                  <Button variant="primary">
                    {singleButton.text}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/curriculum-sample">
                    <Button variant="white">
                      Get a curriculum sample
                    </Button>
                  </Link>
                  <a href="https://calendly.com/d/cq6c-qdg-hjw/willow-curriculum-platform-demo-meeting?month=2025-12" target="_blank" rel="noopener noreferrer">
                    <Button variant="primary">
                      Request a proposal
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
