"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FinalCTA } from "@/components/final-cta";

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const challengeRef = useRef(null);
  const challengeInView = useInView(challengeRef, { once: true, margin: "-100px" });

  const solutionRef = useRef(null);
  const solutionInView = useInView(solutionRef, { once: true, margin: "-100px" });

  const progressRef = useRef(null);
  const progressInView = useInView(progressRef, { once: true, margin: "-100px" });

  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-heading mb-6">
                Why we&apos;re building Willow
              </h1>
              <p className="text-secondary text-base leading-relaxed">
                (TL;DR: The system is broken, but it&apos;s fixable. We&apos;re helping 10 million students find their best-fit next step by 2033.)
              </p>
            </motion.div>
          </div>
        </section>

        {/* Personal Note Section */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-6 flex items-center flex-wrap gap-2">
                <span>A note from our</span>
                <span className="relative inline-block w-[80px] h-[50px] md:w-[100px] md:h-[60px] rounded-full overflow-hidden">
                  <Image
                    src="/about-us-assets/james-cryan-profile.jpeg"
                    alt="James Cryan"
                    fill
                    className="object-cover"
                  />
                </span>
                <span>founder</span>
              </h4>
              <div className="space-y-6 text-secondary text-base leading-relaxed">
                <p>
                  My wife Liz is a pediatrician. Anyone who knows us well knows that I delight in drawing way too many comparisons between the challenges in our healthcare system and our education system.
                </p>
                <p>
                  In primary care medicine, we would never refer a patient to a specialist or next step, and never check back in to see if it was successful. However, we do that every year with students who leave our systems, but we don&apos;t track if they were successful. The painful truth is that the majority of students from low-income households are too often making known low-quality next steps, where they&apos;re more likely to be worse off than better off.
                </p>
                <p>
                  Why? One reason is that we (as educators) aren&apos;t being honest with them about which next steps (whether college or career) are high quality, and which aren&apos;t.
                </p>
                <p>
                  I spent years leading high-performing schools, and I&apos;ll be the first to admit: I was wrong about a lot of things. I used to think a &ldquo;college-for-all&rdquo; mantra was the only way to ensure rigor and equity. But the data tells a different, more complicated story.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-10 md:py-20 bg-white">
          <motion.div
            ref={challengeRef}
            initial={{ opacity: 0, y: 30 }}
            animate={challengeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16 mb-16 md:mb-20">
              <h4 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-6">
                The challenge: a system in crisis
              </h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                We have to be honest about the reality our students are facing:
              </p>
            </div>

            {/* Three Column Grid */}
            <div className="max-w-5xl mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row justify-start items-start gap-12 md:gap-12 lg:gap-16 mb-16">
              <div className="flex flex-col items-start max-w-[280px]">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/about-us-assets/completion-gap-icon.svg"
                    alt="Completion gap icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-heading text-lg font-medium text-heading mb-2">
                  The completion gap
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  85% of students from low-income households don&apos;t complete college by age 24.
                </p>
              </div>

              <div className="flex flex-col items-start max-w-[280px]">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/about-us-assets/debt-trap.svg"
                    alt="Debt trap icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-heading text-lg font-medium text-heading mb-2">
                  The debt trap
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  There is currently $300 billion in debt held by 40 million people who didn&apos;t even finish their degree.
                </p>
              </div>

              <div className="flex flex-col items-start max-w-[280px]">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/about-us-assets/underemployment-trap.svg"
                    alt="Underemployment trap icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-heading text-lg font-medium text-heading mb-2">
                  The underemployment trap
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  More than half of recent college graduates are underemployed a year after they finish school.
                </p>
              </div>
            </div>

            {/* Closing statement */}
            <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
              <p className="text-gray-600 text-base leading-relaxed">
                Quality college and professional programs can be life-changing. However, the inverse is true too. Dropping out with debt is the WORST outcome for young people. We have to be honest with our students about what programs are good, and which to avoid.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Platform Statement Section */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-heading text-xl md:text-2xl leading-relaxed"
            >
              We&apos;ve built a student success platform that cuts through the noise. Whether it&apos;s an apprenticeship, a certification, or a four-year degree, we help students find their best-fit, best-quality education next step.
            </motion.p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-10 md:py-20 bg-white">
          <motion.div
            ref={solutionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16 mb-16 md:mb-20">
              <h4 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-6">
                The Willow solution: beyond &ldquo;college vs. career&rdquo;
              </h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Willow, we don&apos;t believe in a &ldquo;college vs. workforce&rdquo; binary. It&apos;s about college, professional programs, and good first-jobs. Equity requires honesty about costs, outcomes, and quality.
              </p>
            </div>

            {/* Three Column Grid */}
            <div className="max-w-5xl mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row justify-start items-start gap-12 md:gap-12 lg:gap-16">
              <div className="flex flex-col items-start max-w-[280px]">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/about-us-assets/roi-transparency.svg"
                    alt="ROI transparency icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-heading text-lg font-medium text-heading mb-2">
                  ROI transparency
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We provide personalized ROI projections so students understand the financial impact of their choices before they sign on the dotted line.
                </p>
              </div>

              <div className="flex flex-col items-start max-w-[280px]">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/about-us-assets/comprehensive-pathways.svg"
                    alt="Comprehensive pathways icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-heading text-lg font-medium text-heading mb-2">
                  Comprehensive pathways
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our database includes 220,000+ verified programs, from traditional degrees to high-quality professional certifications.
                </p>
              </div>

              <div className="flex flex-col items-start max-w-[280px]">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/about-us-assets/ai-powered-support.svg"
                    alt="AI-powered support icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-heading text-lg font-medium text-heading mb-2">
                  AI-powered support
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our 24/7 career coach, Alma, ensures that no student has to navigate these massive life decisions alone.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Progress Section */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16">
            <motion.div
              ref={progressRef}
              initial={{ opacity: 0, y: 30 }}
              animate={progressInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-4">
                Our progress (and where we&apos;re going)
              </h4>
              <div className="space-y-6 text-secondary text-base leading-relaxed">
                <p>
                  We are a Public Benefit Corporation founded in 2023 with a &ldquo;North Star&rdquo; goal: <strong className="text-heading">Help 10 million students realize their full potential by 2033.</strong>
                </p>
                <p>
                  It&apos;s working. In our early pilots, students using Willow were 50% more likely to choose high-ROI programs compared to their peers. We&apos;re currently partnering with some of the most innovative schools systems in the country like Achievement First and DSST Public Schools to prove that when students have better information, they make better lives.
                </p>
                <p>
                  Join us in building a better map for the next generation.
                  <br /><br />
                  Onwards,
                </p>
              </div>
              <Image
                src="/about-us-assets/james-cryan-signature.png"
                alt="James Cryan signature"
                width={270}
                height={90}
                className="mt-8"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAECAYAAAC3OK7NAAAAAklEQVR4AewaftIAAAA+SURBVBXBsQ2AMBAEwT3LjqADOqACCnBEQU744cTb7MzXsXTg7sG7hWuFvYF3HdcIPGp4lnCPcM/h3MC/jT/4PRITlRNZFgAAAABJRU5ErkJggg=="
              />
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-10 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
            <motion.div
              ref={teamRef}
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-4">
                Meet the team
              </h2>
              <p className="text-secondary text-base leading-relaxed mb-8">
                We&apos;re a group of educators, designers, and builders who believe the system is fixable.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-heading">James Cryan</h3>
                  <p className="text-secondary text-sm font-medium mb-2">Founder & CEO</p>
                  <p className="text-secondary text-sm leading-relaxed mb-2">
                  The founder and former CEO of Rocky Mountain Prep, one of Colorado&apos;s most successful public charter school networks. James has almost two decades of experience as a public school teacher and leader.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/jamescryan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#004182] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-heading">Jaime Hudgins</h3>
                  <p className="text-secondary text-sm font-medium mb-2">Chief Academic Officer</p>
                  <p className="text-secondary text-sm leading-relaxed mb-2">
                    Jaime brings over 17 years in education as a teacher, curriculum specialist, assistant principal, and Chief Academic Officer. She&apos;s led academics for a five-school network and scaled instructional practices nationally, and her deepest passion lives in future-focused curriculum—the work that helps students discover who they are and chart their own paths forward.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/jaime-hudgins/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#004182] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-heading">Liz Wise</h3>
                  <p className="text-secondary text-sm font-medium mb-2">Quality Assurance & Operations</p>
                  <p className="text-secondary text-sm leading-relaxed mb-2">
Liz has lived, breathed, and led successful school operations, with a focus on enrollment coordination, social media and quality assurance.                  </p>
                  <a
                    href="https://www.linkedin.com/in/lizwise487/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#004182] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-heading">Ryan York</h3>
                  <p className="text-secondary text-sm font-medium mb-2">Chief Product & Technology Officer</p>
                  <p className="text-secondary text-sm leading-relaxed mb-2">
                    Ryan has worked in education for 18 years as a teacher, instructional coach, principal, and charter school founder/co-CEO.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/ryan-york-148356a9/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#004182] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
