import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { pageMetadata } from "@/lib/metadata";
import { serviceProviders } from "@/lib/service-providers";

export const metadata = pageMetadata({
  title: "Privacy Policy | Willow Education",
  description:
    "Privacy Policy for Willow Education - How we collect, use, store, and protect your personal information.",
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white pt-16 sm:pt-24 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-[30px] text-heading text-left">
              Willow Ed Privacy Policy
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-0 pb-16 sm:pb-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <p className="text-base text-secondary leading-relaxed mb-12">
                Last updated: October 7, 2026
              </p>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  1. Who we are and who this policy covers
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Willow Ed, PBC, doing business as Willow Education (&quot;Willow,&quot; &quot;we&quot;), provides a career readiness curriculum and web application (the &quot;Platform&quot;) to schools, school districts and education organizations (&quot;Schools&quot;) for use by their students and staff. Questions about this policy go to <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>.
                </p>
                <p className="text-secondary leading-relaxed">
                  Most of the personal information we hold is student education records. The School owns those records; Willow processes them on the School&apos;s behalf and under its direction. Where a School has signed a services agreement with Willow that includes a data protection addendum, that agreement governs and controls over this policy to the extent of any conflict.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  2. Information we collect
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Account and roster information.</strong> Name, school email address, school, grade level and role, provided by the School directly or through a rostering or sign-in service such as Clever or Google. Sign-up does not require or validate a birthdate.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">What students create on the Platform.</strong> Responses to interest and strengths assessments, written reflections and portfolio content, postsecondary plans and application activity, bookmarked careers and colleges, and conversations with the Platform&apos;s AI assistant. A student may optionally use voice input, which is transcribed to text.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Optional contact details.</strong> A mobile phone number, only if a student or staff member opts in to text-message reminders.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Technical and usage data.</strong> Device and browser type, IP address, pages visited, actions taken and error reports, used to run and secure the Platform.
                </p>
                <p className="text-secondary leading-relaxed">
                  We do not collect Social Security numbers, government identification numbers, financial account numbers or payment card data from students or staff.
                </p>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  3. How we use information
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  We use personal information only to provide, maintain, secure and support the Platform for the School: to deliver the curriculum, personalize career and postsecondary recommendations, operate the AI assistant and its safety screening, provide reporting to the School&apos;s authorized staff, send account and task communications, provide support, and protect the Platform and its users.
                </p>
                <p className="text-secondary leading-relaxed">
                  Willow does not sell student data, does not use it for advertising, and does not use it to train AI models. Willow&apos;s AI providers operate under enterprise terms that prohibit training their models on Willow&apos;s data. We may create de-identified, aggregated data that cannot reasonably be linked to a student and use it to improve the Platform.
                </p>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  4. Artificial intelligence
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  The Platform includes an AI assistant, called Alma, and other AI-assisted features. This section describes how they handle student information.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">AI use.</strong> Willow&apos;s AI features, including the Alma assistant, send their prompts to Anthropic, the only generative AI provider Willow uses. A prompt contains the student&apos;s first name, grade, a short summary of the student&apos;s goals relevant to the conversation, and the student&apos;s typed message. Prompts never include email, phone, address, date of birth, demographic fields, or other students&apos; data. Alma conversations are kept for 24 months after their last activity, then deleted. Other AI features, such as reflections, exit tickets and offer-letter review, also send the student-written text or uploaded document they work on. Willow does not operate a proprietary AI model.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">OpenAI.</strong> OpenAI is used only to turn reference content (career and school descriptions) and search queries into numerical search data called embeddings. It generates no content and receives no student identifiers.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Provider retention.</strong> Anthropic retains API inputs and outputs for no longer than thirty (30) days; Willow has requested a zero-day retention setting. No embeddings or other derived representations of student content are stored.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Safety screening and escalation.</strong> Every conversation is screened automatically by a dedicated safety classifier. Content that indicates a possible safety concern, including self-harm, crisis, violence, bullying or hate speech, is routed in real time to authorized staff at the student&apos;s school and district, who review it on a dedicated safety-review screen. Where a crisis is detected, the assistant responds with supportive, hotline-aware language and staff are notified. The assistant is not a substitute for a qualified adult, and the student-facing wording says so.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">What the assistant can and cannot do.</strong> Alma provides information, coaching and recommendations only. It has read-only access to the information above. It cannot create, change, approve or finalize any entry in a student&apos;s academic or postsecondary record, and no decision about a student is made or determined by the assistant. It is instructed to coach a student&apos;s own writing and thinking, not to draft essays, applications or other work a student could submit as their own.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Disclosure and choice.</strong> AI features are marked on screen. Before first use, each student is shown an AI agreement describing how the assistant works and must accept it. A student who declines keeps full access to the rest of the Platform; only the assistant stays unavailable, and the student can accept later.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Logging and review.</strong> Every conversation with the assistant is logged in full and retained for twenty-four (24) months from its last activity, then permanently deleted. Flagged conversations are visible to authorized school and district staff. A School may request a student&apos;s conversation records at any time and Willow will provide them within thirty (30) days.
                </p>
                <p className="text-secondary leading-relaxed">
                  <strong className="font-semibold">Where processing happens.</strong> All AI processing of student data takes place in the United States.
                </p>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  5. How information is shared
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Willow shares student data only with the service providers listed below and in these school-directed ways: (a) Common App: once a school turns on its Common App integration, and only after a student links their Common App account and signs Common App&apos;s FERPA waiver, counselors, school administrators and the student&apos;s assigned teachers submit school reports, recommendations and related forms, which can include GPA, class rank, transcripts and letters, to the colleges on that student&apos;s Common App list; (b) counselors and school administrators can email a student&apos;s documents to a college&apos;s admissions address on file. Willow&apos;s only message to a parent or guardian is a request to sign an Early Decision agreement, sent only when the student asks. Willow also shares student data with the School itself and its authorized staff, and discloses it where the law requires.
                </p>
                <p className="text-secondary leading-relaxed">
                  We never sell student information, never share it for advertising, and will not transfer it in a merger, acquisition or bankruptcy except to a successor that agrees in writing to be bound by these commitments.
                </p>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  6. Service providers
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Willow uses the following providers to operate the Platform. Each is bound by written terms no less protective of student data than Willow&apos;s own commitments to Schools, and Willow remains responsible for their handling of student data.
                </p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="py-3 pr-6 font-heading text-base font-medium text-heading align-top">
                          Provider
                        </th>
                        <th className="py-3 font-heading text-base font-medium text-heading align-top">
                          Purpose
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceProviders.map(({ provider, purpose }) => (
                        <tr key={provider} className="border-b border-gray-200">
                          <td className="py-3 pr-6 text-secondary leading-relaxed align-top">
                            {provider}
                          </td>
                          <td className="py-3 text-secondary leading-relaxed align-top">
                            {purpose}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-secondary leading-relaxed">
                  Student data is stored in the United States. Willow will update this list within thirty (30) days of adding or removing a provider that handles student data, and will notify Schools under the terms of their agreements.
                </p>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  7. FERPA and student privacy law
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  When Willow serves a school, Willow acts as a school official under FERPA. It uses education records only for the school&apos;s purposes and does not redisclose them without the school&apos;s written permission, except as FERPA allows. Parents and eligible students exercise their rights to inspect, amend, and consent through their school. Willow performs a service the School would otherwise perform with its own staff and acts under the School&apos;s direct control with respect to the use and maintenance of education records.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  The AI providers named in Section 4 are service providers to Willow in the same sense. AI processing is part of delivering the Platform to the School; it is not a separate use, and it does not extend to training or any purpose outside the School&apos;s authorization.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  Willow supports parents&apos;, guardians&apos; and eligible students&apos; requests made through the School and responds to a School&apos;s request for a student&apos;s records, including AI conversation records, within thirty (30) days.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  <strong className="font-semibold">Students under 13.</strong> The Platform is provided to students through their School. Where a student is under 13, the School provides consent on the parent&apos;s behalf for the collection of the student&apos;s information for educational purposes, as the Children&apos;s Online Privacy Protection Act permits, and Willow relies on that consent. Willow collects from students under 13 only the information needed to provide the Platform, and does not use it for any commercial purpose. Grade 8 access is switched off for every School unless the School&apos;s administrator turns it on.
                </p>
                <p className="text-secondary leading-relaxed">
                  <strong className="font-semibold">State law.</strong> Willow&apos;s services agreements address the student privacy laws that apply to each School&apos;s state.
                </p>
              </div>

              {/* Section 8 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  8. Security
                </h2>
                <p className="text-secondary leading-relaxed">
                  Student data is encrypted in transit using TLS 1.2 or higher and at rest. Access is limited by role to the people who need it, staff and contractors with access to student data or Platform systems pass background checks and are required to complete security and privacy training, multi-factor authentication is enforced on Willow&apos;s corporate systems, and production systems are logged and monitored. Willow notifies affected Schools of a confirmed security incident involving their student data within seventy-two (72) hours.
                </p>
              </div>

              {/* Section 9 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  9. Retention and deletion
                </h2>
                <p className="text-secondary leading-relaxed">
                  Willow retains student data for the term of the School&apos;s agreement. Within thirty (30) days of a School&apos;s written request, or of the end of the agreement, Willow deletes the School&apos;s student data or returns it in a commonly used format, as the School elects, and provides written certification on request. Copies in backups are purged within ninety (90) days. AI assistant conversations are deleted twenty-four (24) months after their last activity regardless. Willow may retain de-identified data and records it is legally required to keep.
                </p>
              </div>

              {/* Section 10 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  10. Access and correction
                </h2>
                <p className="text-secondary leading-relaxed">
                  Students, parents and guardians exercise their access and correction rights through the School. School administrators and anyone with a question may also contact <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>, and we will respond promptly.
                </p>
              </div>

              {/* Section 11 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  11. Changes to this policy
                </h2>
                <p className="text-secondary leading-relaxed">
                  We may update this policy. We will post the updated version here with a new date and, for a material change affecting student data, notify School administrators by email at least thirty (30) days before it takes effect.
                </p>
              </div>

              {/* Section 12 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  12. Contact
                </h2>
                <p className="text-secondary leading-relaxed">
                  Willow Ed, PBC (d/b/a Willow Education), 167 Orchard Run, Cornwall, VT 05753. <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
