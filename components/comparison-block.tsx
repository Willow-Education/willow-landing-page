"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface ComparisonBlockProps {
  headline: string;
  description: string;
  willowCaption: string;
  overgradCaption: string;
  willowImage?: string;
  overgradImage?: string;
  reversed?: boolean;
}

export function ComparisonBlock({
  headline,
  description,
  willowCaption,
  overgradCaption,
  willowImage,
  overgradImage,
  reversed = false,
}: ComparisonBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const overgradPanel = (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video rounded-card overflow-hidden">
        {overgradImage ? (
          <Image
            src={overgradImage}
            alt={overgradCaption}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#D1D5DB]" />
        )}
      </div>
      <p className="text-sm text-secondary">{overgradCaption}</p>
    </div>
  );

  const willowPanel = (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video rounded-card overflow-hidden">
        {willowImage ? (
          <Image
            src={willowImage}
            alt={willowCaption}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#062F29]" />
        )}
      </div>
      <p className="text-sm text-secondary">{willowCaption}</p>
    </div>
  );

  return (
    <section className="py-20 md:py-30 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mb-10 md:mb-14">
            <h3 className="text-heading mb-4">{headline}</h3>
            <p className="text-secondary text-lg">{description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {reversed ? (
              <>
                {willowPanel}
                {overgradPanel}
              </>
            ) : (
              <>
                {overgradPanel}
                {willowPanel}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
