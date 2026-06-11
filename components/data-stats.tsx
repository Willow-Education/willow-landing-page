"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Stat {
  number: string;
  label: string;
  subtext: string;
}

const stats: Stat[] = [
  {
    number: "60%",
    label: "of jobs face AI disruption",
    subtext:
      "As technology rapidly reshapes the workforce, quality postsecondary education and durable skills have never been more important.",
  },
  {
    number: "400+",
    label: "flexible, skill-aligned lessons",
    subtext:
      "Willow provides districts with a comprehensive, coherent, AI-native curriculum and high quality instructional materials.",
  },
  {
    number: "50%",
    label: "higher enrollment in high-ROI programs",
    subtext:
      "Students in a Willow pilot were 50% more likely to choose high-quality, positive ROI postsecondary programs, setting them on a direct path toward economic mobility.",
  },
];

export function DataStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="text-center px-4"
            >
              <h3 className="font-heading text-[60px] font-medium text-primary mb-3 tracking-tight">
                {stat.number}
              </h3>
              <p className="text-[14px] font-semibold text-[#252B37] mb-4">
                {stat.label}
              </p>
              <p className="text-secondary text-[14px] leading-relaxed">
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
