"use client";

import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

const districtTypes = [
  "Urban traditional",
  "Suburban traditional",
  "Rural traditional",
  "Charter network",
  "Independent charter",
  "Other",
];

const priorityOptions = [
  "Career-connected learning",
  "Purpose-development",
  "AI-readiness",
];

const inputBase =
  "w-full bg-white border border-[#E5E5E0] rounded-lg px-4 py-3 text-[15px] text-[#0A0A0A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-[13px] font-medium text-[#0A0A0A] mb-2 flex items-center gap-1">
      {children}
      {required && <span className="text-[#B45309]">*</span>}
    </label>
  );
}

function Helper({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[#525252] mb-3 leading-[1.5]">{children}</p>
  );
}

function SectionHeader({
  num,
  title,
}: {
  num: string;
  title: string;
}) {
  return (
    <div className="flex items-baseline gap-4 mb-8 pb-4 border-b border-[#E5E5E0]">
      <span className="font-heading text-sm text-[#B45309] tracking-[0.08em]">
        {num}
      </span>
      <h3 className="font-heading font-medium text-[20px] md:text-[22px] tracking-[-0.01em] text-[#0A0A0A]">
        {title}
      </h3>
    </div>
  );
}

export function Application() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const formId = process.env.NEXT_PUBLIC_FORMSPREE_TNTP_FORM_ID;

    if (!formId) {
      setStatus("error");
      setErrorMessage(
        "Form is not yet configured. Email cobuild@opportunityadvising.org to apply directly."
      );
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        window.scrollTo({
          top: formEl.getBoundingClientRect().top + window.scrollY - 100,
          behavior: "smooth",
        });
      } else {
        setStatus("error");
        setErrorMessage(
          "Something went wrong. Please try again or email cobuild@opportunityadvising.org."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again or email cobuild@opportunityadvising.org."
      );
    }
  }

  if (status === "success") {
    return (
      <section id="apply" className="bg-[#FAFAF7] py-20 md:py-30 scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="bg-white border border-[#E5E5E0] rounded-3xl p-10 md:p-16 lg:p-20 max-w-[820px] mx-auto text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#B45309] mb-5">
              Application received
            </p>
            <h2 className="font-heading font-medium text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[#0A0A0A] mb-6">
              Thanks. We received your application.
            </h2>
            <p className="text-[17px] text-[#2D2D2D] leading-[1.6] max-w-[52ch] mx-auto">
              You&rsquo;ll hear from the selection team within two weeks.
              Questions in the meantime:{" "}
              <a
                href="mailto:cobuild@opportunityadvising.org"
                className="text-[#B45309] underline underline-offset-4 hover:text-[#0A0A0A]"
              >
                cobuild@opportunityadvising.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="bg-[#FAFAF7] py-20 md:py-30 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
        {/* Header */}
        <div className="max-w-[820px] mx-auto mb-12 md:mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#525252] mb-4">
            Apply
          </p>
          <h2 className="font-heading font-medium text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#0A0A0A]">
            Tell us about your district.
          </h2>
          <p className="mt-6 text-[17px] md:text-[19px] text-[#2D2D2D] leading-[1.6]">
            Applications are short by design. We want to understand your
            district&rsquo;s readiness, your starting point, and why this work
            matters where you sit. Deadline:{" "}
            <span className="text-[#0A0A0A] font-medium">June 15, 2026</span>.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white border border-[#E5E5E0] rounded-3xl p-6 md:p-10 lg:p-14 max-w-[860px] mx-auto"
        >
          {/* District */}
          <div className="mb-12 md:mb-14">
            <SectionHeader num="01" title="District" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label required>District name</Label>
                <input
                  name="district_name"
                  required
                  placeholder="e.g., Austin ISD"
                  className={inputBase}
                />
              </div>
              <div>
                <Label required>State</Label>
                <input
                  name="state"
                  required
                  placeholder="e.g., Texas"
                  className={inputBase}
                />
              </div>
              <div>
                <Label required>Approx. secondary student count</Label>
                <input
                  name="student_count"
                  required
                  placeholder="e.g., 12,500"
                  className={inputBase}
                />
              </div>
              <div>
                <Label required>District type</Label>
                <select
                  name="district_type"
                  required
                  defaultValue=""
                  className={cn(inputBase, "appearance-none pr-10 bg-white")}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {districtTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Point person */}
          <div className="mb-12 md:mb-14">
            <SectionHeader num="02" title="Point person" />
            <Helper>
              One named district leader accountable for the work.
              Superintendent, chief academic officer, chief of secondary, or
              equivalent.
            </Helper>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label required>Full name</Label>
                <input
                  name="contact_name"
                  required
                  className={inputBase}
                />
              </div>
              <div>
                <Label required>Role / title</Label>
                <input
                  name="contact_role"
                  required
                  className={inputBase}
                />
              </div>
              <div>
                <Label required>Email</Label>
                <input
                  type="email"
                  name="contact_email"
                  required
                  className={inputBase}
                />
              </div>
              <div>
                <Label>Phone (optional)</Label>
                <input
                  type="tel"
                  name="contact_phone"
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* Starting point */}
          <div className="mb-12 md:mb-14">
            <SectionHeader num="03" title="Your starting point" />

            <div className="mb-7">
              <Label required>
                Q1. What do you currently offer in place of advisory?
              </Label>
              <Helper>
                Advisory, homeroom, seminar, mentor block, etc. Briefly
                describe how it works today.
              </Helper>
              <textarea
                name="q1_current_advisory"
                required
                rows={4}
                placeholder="A few sentences is plenty."
                className={cn(inputBase, "resize-y")}
              />
            </div>

            <div className="mb-7">
              <Label required>
                Q2. Do you have a Vision or Portrait of a Graduate?
              </Label>
              <div className="flex flex-wrap gap-4 mb-3">
                {["Yes", "In progress", "Not yet"].map((v) => (
                  <label
                    key={v}
                    className="inline-flex items-center gap-2 text-[14px] text-[#2D2D2D] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="q2_portrait"
                      value={v}
                      required
                      className="w-4 h-4 accent-[#0A0A0A]"
                    />
                    {v}
                  </label>
                ))}
              </div>
              <textarea
                name="q2_portrait_detail"
                rows={3}
                placeholder="If yes or in progress, briefly describe it and how it's shaping your work."
                className={cn(inputBase, "resize-y")}
              />
            </div>

            <div className="mb-7">
              <Label>
                Q3. Is career-connected learning, purpose-development, or
                AI-readiness a strategic priority for your district?
              </Label>
              <div className="flex flex-wrap gap-4 mb-3">
                {priorityOptions.map((opt) => (
                  <label
                    key={opt}
                    className="inline-flex items-center gap-2 text-[14px] text-[#2D2D2D] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="q3_priorities"
                      value={opt}
                      className="w-4 h-4 accent-[#0A0A0A]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <textarea
                name="q3_priority_detail"
                rows={3}
                placeholder="Briefly note where these show up in your strategic plan, board goals, or current initiatives."
                className={cn(inputBase, "resize-y")}
              />
            </div>

            <div className="mb-7">
              <Label required>
                Q4. Why is your district ready to co-build Opportunity
                Advising?
              </Label>
              <textarea
                name="q4_readiness"
                required
                rows={5}
                placeholder="What's your stake in advisory. What problem do you want this to solve. What conditions make now the right moment."
                className={cn(inputBase, "resize-y")}
              />
            </div>

            <div>
              <Label required>
                Q5. Pilot scope for 2026–27. Which schools and grade levels
                would you start with?
              </Label>
              <textarea
                name="q5_pilot_scope"
                required
                rows={3}
                placeholder="Name the schools and grades you'd bring to the pilot."
                className={cn(inputBase, "resize-y")}
              />
            </div>
          </div>

          {/* Commitments */}
          <div className="mb-10 md:mb-12">
            <SectionHeader num="04" title="Commitments" />
            <div className="flex flex-col gap-4">
              {[
                "We commit to the non-negotiables of Opportunity Advising.",
                "We will send a team of two to three district leaders to both in-person convenings (fall 2026 and spring 2027).",
                "We will craft a plan to scale Opportunity Advising to all middle and high school students by year two.",
              ].map((c, i) => (
                <label
                  key={c}
                  className="flex items-start gap-3 p-4 border border-[#E5E5E0] rounded-lg hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={`commitment_${i + 1}`}
                    value="yes"
                    required
                    className="w-4 h-4 mt-1 accent-[#0A0A0A] flex-shrink-0"
                  />
                  <span className="text-[14px] md:text-[15px] text-[#2D2D2D] leading-[1.5]">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 border-t border-[#E5E5E0] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-[13px] text-[#525252] leading-[1.5] max-w-[38ch]">
              Applications close June 15, 2026. Selections announced in July.
            </p>
            <div className="flex flex-col items-stretch md:items-end gap-3">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center gap-2 text-[15px] font-medium bg-[#0A0A0A] text-[#FAFAF7] px-6 py-3 rounded-full hover:bg-[#2D2D2D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  "Submitting…"
                ) : (
                  <>
                    Submit application <span aria-hidden>→</span>
                  </>
                )}
              </button>
              {status === "error" && errorMessage && (
                <p className="text-[13px] text-[#B91C1C] max-w-[32ch] text-right">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
