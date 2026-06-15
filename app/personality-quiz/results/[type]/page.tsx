import { notFound } from "next/navigation";
import type { Metadata } from "next";
import personalityTypes from "@/lib/data/personality-types.json";
import PersonalityResults, { type PersonalityType } from "../../PersonalityResults";

const TYPES = personalityTypes as PersonalityType[];

function findType(type: string): PersonalityType | undefined {
  const decoded = decodeURIComponent(type);
  return TYPES.find(t => t.id === decoded);
}

// Pre-render a page for every personality type at build time.
export function generateStaticParams() {
  return TYPES.map(t => ({ type: t.id }));
}

// Shareable results pages should never be indexed by search engines.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const pt = findType(type);
  const robots = { index: false, follow: false };

  if (!pt) {
    return { title: "Personality results — Willow", robots };
  }

  return {
    title: `${pt.title} — Willow Personality Results`,
    description: pt.shortDescription,
    robots,
  };
}

export default async function SharedPersonalityResultsPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const pt = findType(type);

  if (!pt) {
    notFound();
  }

  return <PersonalityResults personalityType={pt} ctaHref="/personality-quiz" />;
}
