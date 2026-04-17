import type { Metadata } from "next";
import { TntpHeader } from "@/components/tntp/header";
import { TntpFooter } from "@/components/tntp/footer";
import { Hero } from "@/components/tntp/hero";
import { WhyThisWhyNow } from "@/components/tntp/why-this-why-now";
import { WhatItIs } from "@/components/tntp/what-it-is";
import { WhyDifferent } from "@/components/tntp/why-different";
import { Testimonials } from "@/components/tntp/testimonials";
import { CoBuild } from "@/components/tntp/co-build";
import { DistrictReceives } from "@/components/tntp/district-receives";
import { Timeline } from "@/components/tntp/timeline";
import { NonNegotiables } from "@/components/tntp/non-negotiables";
import { WhoBehind } from "@/components/tntp/who-behind";
import { Application } from "@/components/tntp/application";
import { Faq } from "@/components/tntp/faq";
import { FinalCta } from "@/components/tntp/final-cta";

export const metadata: Metadata = {
  metadataBase: new URL("https://opportunityadvising.org"),
  title:
    "Opportunity Advising | A co-build challenge from TNTP, Willow Education & the Gates Foundation",
  description:
    "We're looking for 10 to 12 innovative districts to co-build Opportunity Advising — turning advisory into the delivery system for belonging, coherence, career readiness, and postsecondary success. Applications open through June 15, 2026.",
  openGraph: {
    type: "website",
    title: "Opportunity Advising",
    description:
      "10 to 12 districts. $50K subgrants. 18 months to co-build the model for advisory that actually works.",
    siteName: "Opportunity Advising",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opportunity Advising",
    description:
      "A co-build challenge from TNTP, Willow Education, and the Gates Foundation.",
  },
  robots: { index: true, follow: true },
};

export default function OpportunityAdvisingPage() {
  return (
    <div className="bg-[#FAFAF7] text-[#0A0A0A] font-sans antialiased">
      <TntpHeader />
      <main>
        <Hero />
        <WhyThisWhyNow />
        <WhatItIs />
        <WhyDifferent />
        <Testimonials />
        <CoBuild />
        <DistrictReceives />
        <Timeline />
        <NonNegotiables />
        <WhoBehind />
        <Application />
        <Faq />
        <FinalCta />
      </main>
      <TntpFooter />
    </div>
  );
}
