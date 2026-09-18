import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of Service | Willow Education",
  description:
    "Willow Ed Terms of Service Agreement for schools using the Willow Ed web application.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white pt-16 sm:pt-24 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-[30px] text-heading text-left">
              Willow Ed Terms of Service
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-0 pb-16 sm:pb-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <h2 className="font-heading text-xl font-medium text-heading mb-4">
                Terms of service agreement
              </h2>
              <p className="text-base text-secondary leading-relaxed mb-4">
                Effective September 18, 2026.
              </p>
              <p className="text-base text-secondary leading-relaxed mb-12">
                This Terms of Service Agreement (&quot;Agreement&quot;) is made between Willow Education and your school &quot;School&quot; regarding the use of the web application known as Willow Ed (&quot;Application&quot;).
              </p>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  1. Grant of license
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Company grants School a non-exclusive, non-transferable license to access and use the Application within the School&apos;s premises for educational purposes only.
                </p>
                <p className="text-secondary leading-relaxed">
                  This license is limited to the number of users stipulated in the purchase agreement between the Company and the School.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  2. User responsibility
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  School is responsible for the actions of its students, faculty, and staff related to the use of the Application (&quot;Users&quot;).
                </p>
                <p className="text-secondary leading-relaxed">
                  School will ensure Users comply with this Agreement and refrain from any activity that disrupts the Application or infringes on the rights of others.
                </p>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  3. Intellectual property
                </h2>
                <p className="text-secondary leading-relaxed">
                  Company retains all intellectual property rights in and to the Application, including code, design, and documentation. School and Users may not copy, modify, or reverse-engineer the Application.
                </p>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  4. Data privacy
                </h2>
                <p className="text-secondary leading-relaxed">
                  Company will collect and process personal data from Users in accordance with applicable privacy laws, including FERPA (Family Educational Rights and Privacy Act) if operating in the U.S. Company will have in place security measures that protect this data from unauthorized access, use, or disclosure. School will gain proper consent from parents or guardians when required before allowing student data to be collected.
                </p>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  5. Fees and payment
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  School shall pay Company the fees indicated in the purchase agreement within the timeframe outlined in the purchase agreement.
                </p>
                <p className="text-secondary leading-relaxed">
                  Late payments may incur interest or additional fees.
                </p>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  6. Support and maintenance
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Company will provide technical support to the School during standard business hours via email and phone.
                </p>
                <p className="text-secondary leading-relaxed">
                  Company will update the Application to provide bug fixes and maintain compatibility with standard web browsers.
                </p>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  7. Warranty disclaimer
                </h2>
                <p className="text-secondary leading-relaxed uppercase">
                  THE APPLICATION IS PROVIDED &quot;AS IS&quot; WITH NO WARRANTIES EXPRESS OR IMPLIED. COMPANY DISCLAIMS ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>

              {/* Section 8 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  8. Limitation of liability
                </h2>
                <p className="text-secondary leading-relaxed uppercase">
                  COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM THIS AGREEMENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </div>

              {/* Section 9 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  9. Termination
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Either party may terminate this Agreement if the other materially breaches it and fails to cure that breach within thirty (30) days of written notice describing the breach. For non-payment, the cure period is ten (10) days. A breach that by its nature cannot be cured, including misuse or unauthorized disclosure of student data, infringement of intellectual property, or breach of confidentiality, permits the non-breaching party to terminate on written notice without a cure period.
                </p>
                <p className="text-secondary leading-relaxed">
                  Upon termination, the School will cease all use of the Application and return or destroy any Company materials related to it. Company will return or delete student data as the data protection terms of the parties&apos; services agreement provide, or on the School&apos;s written instruction where no such agreement is in place.
                </p>
              </div>

              {/* Section 10 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  10. Governing law and jurisdiction
                </h2>
                <p className="text-secondary leading-relaxed">
                  This Agreement is governed by the laws of the State of Vermont, without regard to its conflict of laws rules. The parties submit to the exclusive jurisdiction of the state and federal courts located in Vermont.
                </p>
              </div>

              {/* Section 11 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  11. Relationship to a services agreement
                </h2>
                <p className="text-secondary leading-relaxed">
                  If the School and Company have entered into a separate written services agreement covering the Application, that agreement governs and controls over these Terms to the extent of any conflict. These Terms apply only where no such agreement is in place, and only to the extent they do not conflict with it.
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
