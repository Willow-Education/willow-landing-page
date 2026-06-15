"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Briefcase, Target, BookOpen, Heart, Quotes } from "phosphor-react";
import type { ReactNode } from "react";

export interface PersonalityType {
  id: string;
  title: string;
  shortDescription: string;
  superpowers: string;
  workStyle: string;
  personalGoals: string[];
  studyTips: string[];
  relationshipTips: string;
  whatItMeans: string;
  areasToImprove: string;
  recommendedCareersOpening: string;
  recommendedCareers: Array<{
    onetCode: string;
    title: string;
    description: string;
  }>;
  possibleMajors: Array<{
    title: string;
    description: string;
  }>;
  inspirationalQuotes: Array<{
    quote: string;
    name: string;
    description: string;
  }>;
}

// Parse superpowers from string format
export function parseSuperpowers(superpowersStr: string): string[] {
  if (!superpowersStr) return [];
  return superpowersStr
    .split(" - ")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Strip stray markdown artifacts (bold markers, leading bullets/dashes) from copy
export function clean(s: string | undefined | null): string {
  return (s || "")
    .replace(/\*\*/g, "")
    .replace(/^[\s>*#•·\-–—]+/, "")
    .trim();
}

// Split "Title: body" copy on the first colon, cleaning both sides
export function splitTitle(s: string): { title: string; body: string } {
  const cleaned = clean(s);
  const idx = cleaned.indexOf(":");
  if (idx === -1) return { title: cleaned, body: "" };
  return { title: clean(cleaned.slice(0, idx)), body: clean(cleaned.slice(idx + 1)) };
}

// Consistent section header: mint icon chip + title
function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-9 h-9 rounded-full bg-[#D8FBDB] flex items-center justify-center shrink-0">
        {icon}
      </span>
      <h2 className="font-heading font-semibold text-xl md:text-2xl leading-tight text-heading">
        {title}
      </h2>
    </div>
  );
}

interface PersonalityResultsProps {
  personalityType: PersonalityType;
  /** Provide for the in-quiz view (resets quiz state). Omit for the standalone shareable page. */
  onRetake?: () => void;
  /** Where the call-to-action links when there is no onRetake handler. */
  ctaHref?: string;
}

export default function PersonalityResults({
  personalityType,
  onRetake,
  ctaHref = "/personality-quiz",
}: PersonalityResultsProps) {
  const superpowers = parseSuperpowers(personalityType.superpowers);
  const personalGoals = personalityType.personalGoals || [];
  const studyTips = personalityType.studyTips || [];
  const inspirationalQuotes = personalityType.inspirationalQuotes || [];
  const recommendedCareers = personalityType.recommendedCareers || [];
  const possibleMajors = personalityType.possibleMajors || [];
  const imageSrc = `/personality-type-images/${personalityType.id.toUpperCase().replace(/-/g, "")}.jpg`;
  const actionLabel = onRetake ? "Retake quiz" : "Take the quiz";

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-heading">
      {/* Header */}
      <header className="bg-[#F5F5F3]/85 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 4C11.164 4 4 11.164 4 20s7.164 16 16 16 16-7.164 16-16S28.836 4 20 4z" fill="#062F29"/>
                <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8z" fill="#F5F5F3"/>
                <path d="M20 12c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" fill="#062F29"/>
              </svg>
            </div>
            <span className="font-sans font-semibold text-sm text-heading">Your results</span>
          </div>
          {onRetake ? (
            <button
              onClick={onRetake}
              className="font-sans text-sm font-medium text-heading hover:underline"
            >
              {actionLabel}
            </button>
          ) : (
            <Link
              href={ctaHref}
              className="font-sans text-sm font-medium text-heading hover:underline"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-5 md:px-10 py-8 md:py-12 space-y-12 md:space-y-16">
        {/* Personality Type Hero */}
        <section className="bg-[#0A4A42] rounded-3xl p-6 md:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Star size={16} className="text-[#D8FBDB]" weight="fill" />
            <span className="font-sans font-semibold text-xs uppercase tracking-[0.08em] text-[#D8FBDB]">
              Your personality type
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <Image
              src={imageSrc}
              alt={personalityType.title}
              width={300}
              height={300}
              className="w-full max-w-[240px] mx-auto md:mx-0 aspect-square rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1">
              <h1 className="font-heading font-semibold text-3xl md:text-[40px] leading-tight text-white mb-4">
                {clean(personalityType.title)}
              </h1>
              <p className="font-sans text-base md:text-lg leading-relaxed text-white/80">
                {clean(personalityType.shortDescription)}
              </p>
            </div>
          </div>
        </section>

        {/* Superpowers */}
        {superpowers.length > 0 && (
          <section>
            <SectionHeader icon={<Star size={18} className="text-heading" weight="fill" />} title="Your superpowers" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {superpowers.map((superpower, index) => {
                const { title, body } = splitTitle(superpower);
                return (
                  <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5">
                    <h3 className="font-sans font-semibold text-base leading-snug text-heading">{title}</h3>
                    {body && (
                      <p className="font-sans text-sm leading-relaxed text-neutral-600 mt-1.5">{body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Work Style */}
        {personalityType.workStyle && (
          <section>
            <SectionHeader icon={<Briefcase size={18} className="text-heading" />} title="Your work style" />
            <p className="font-sans text-base leading-relaxed text-neutral-700 max-w-3xl">
              {clean(personalityType.workStyle)}
            </p>
          </section>
        )}

        {/* Personal Development Goals */}
        {personalGoals.length > 0 && (
          <section>
            <SectionHeader icon={<Target size={18} className="text-heading" />} title="Personal development goals" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalGoals.map((goal, index) => {
                const { title, body } = splitTitle(goal);
                return (
                  <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-full bg-[#D8FBDB] flex items-center justify-center mb-3">
                      <Target size={18} className="text-heading" />
                    </div>
                    <h3 className="font-sans font-semibold text-base leading-snug text-heading mb-1.5">{title}</h3>
                    {body && (
                      <p className="font-sans text-sm leading-relaxed text-neutral-600">{body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Study Tips & Relationship Tips Side by Side */}
        {(studyTips.length > 0 || personalityType.relationshipTips) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {studyTips.length > 0 && (
              <div>
                <SectionHeader icon={<BookOpen size={18} className="text-heading" />} title="Study tips" />
                <div className="space-y-4">
                  {studyTips.map((tip, index) => {
                    const { title, body } = splitTitle(tip);
                    return (
                      <div key={index} className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-sans font-semibold text-base leading-snug text-heading">{title}</h3>
                        {body && (
                          <p className="font-sans text-sm leading-relaxed text-neutral-600 mt-1">{body}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {personalityType.relationshipTips && (
              <div>
                <SectionHeader icon={<Heart size={18} className="text-heading" />} title="Relationship tips" />
                <p className="font-sans text-base leading-relaxed text-neutral-700">
                  {clean(personalityType.relationshipTips)}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Recommended Careers */}
        {recommendedCareers.length > 0 && (
          <section>
            <SectionHeader icon={<Briefcase size={18} className="text-heading" />} title="Recommended careers" />
            {personalityType.recommendedCareersOpening && (
              <p className="font-sans text-base leading-relaxed text-neutral-700 max-w-3xl mb-6 -mt-1">
                {clean(personalityType.recommendedCareersOpening)}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedCareers.map((career, index) => (
                <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D8FBDB] flex items-center justify-center shrink-0">
                    <Star size={18} className="text-heading" weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-base leading-snug text-heading">{clean(career.title)}</h3>
                    <p className="font-sans text-sm leading-relaxed text-neutral-600 mt-1">{clean(career.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Possible Majors */}
        {possibleMajors.length > 0 && (
          <section>
            <SectionHeader icon={<BookOpen size={18} className="text-heading" />} title="Possible majors" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {possibleMajors.map((major, index) => (
                <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <h3 className="font-sans font-semibold text-base leading-snug text-heading">{clean(major.title)}</h3>
                  <p className="font-sans text-sm leading-relaxed text-neutral-600 mt-1.5">{clean(major.description)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Inspirational Quotes */}
        {inspirationalQuotes.length > 0 && (
          <section>
            <SectionHeader icon={<Quotes size={18} className="text-heading" weight="fill" />} title="Inspiration from famous mentors" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inspirationalQuotes.map((quote, index) => (
                <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col">
                  <Quotes size={28} className="text-[#D8FBDB] mb-3" weight="fill" />
                  <p className="font-sans text-base leading-relaxed text-neutral-700 italic flex-1">
                    {clean(quote.quote)}
                  </p>
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-[#062F29] flex items-center justify-center shrink-0">
                      <span className="font-sans font-semibold text-sm text-[#D8FBDB]">
                        {quote.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm text-heading">{clean(quote.name)}</p>
                      <p className="font-sans text-xs leading-relaxed text-neutral-500">{clean(quote.description)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to action */}
        <div className="flex justify-center pt-2">
          {onRetake ? (
            <button
              onClick={onRetake}
              className="px-7 py-3 bg-[#062F29] hover:bg-[#0A4A42] text-white font-sans font-semibold text-sm rounded-full transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              {actionLabel}
            </button>
          ) : (
            <Link
              href={ctaHref}
              className="px-7 py-3 bg-[#062F29] hover:bg-[#0A4A42] text-white font-sans font-semibold text-sm rounded-full transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              {actionLabel}
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
