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
                This Terms of Service Agreement (&quot;Agreement&quot;) is between Willow Ed, PBC, a Delaware public benefit corporation doing business as Willow Education (&quot;Company&quot;), and the school, district, or organization that accesses the web application known as Willow Ed (the &quot;Application&quot;) on behalf of its students (&quot;School&quot;).
              </p>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  1. Grant of license
                </h2>
                <p className="text-secondary leading-relaxed">
                  Company grants the School a non-exclusive, non-transferable license for its students, faculty, and staff to access and use the Application, from any location, for the School&apos;s educational purposes only. This license is limited to the number of users stated in the purchase agreement or order between Company and the School.
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
                  4. Student data and privacy
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Company processes personal information of Users, including student education records, solely to provide, maintain, secure, and support the Application for the School, and, where applicable, as a &quot;school official&quot; with a legitimate educational interest under FERPA. The School retains ownership of all student data. Company does not sell student data, does not use it for targeted advertising, and does not use it to train generalized or foundation artificial intelligence models.
                </p>
                <p className="text-secondary leading-relaxed mb-4">
                  The Application includes an AI assistant that processes student input through third-party AI providers. Those providers are bound by contract not to train models on student data and to limit data retention. Every AI interaction is screened automatically, and content that raises a safety concern is routed to the School&apos;s designated staff for review. The AI assistant provides information and support only; it does not make or determine decisions affecting a student&apos;s academic or postsecondary record.
                </p>
                <p className="text-secondary leading-relaxed">
                  Company encrypts student data in transit and at rest, stores and processes it within the United States, and will notify the School of a confirmed security incident affecting its student data within seventy-two (72) hours. On the School&apos;s written request or on termination, Company will delete or return student data within thirty (30) days, with backup copies purged within ninety (90) days. Company&apos;s current list of subprocessors, including AI providers, is published in its Privacy Policy. The School is responsible for obtaining any parental consent that applicable law requires before student data is collected.
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
                  7. Warranties
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Company warrants that (a) the Application will be provided in a professional manner by qualified personnel; (b) the Application will materially conform to its documentation; and (c) to Company&apos;s knowledge, the Application does not infringe any third party&apos;s intellectual property rights. Company will make commercially reasonable efforts to maintain the availability of the Application, scheduling planned maintenance outside school hours where practicable. If the Application does not conform to this Section, Company will use commercially reasonable efforts to correct the nonconformity; if it cannot do so within thirty (30) days of written notice, the School may terminate this Agreement as to the affected functionality and receive a pro-rated refund of prepaid fees for the remaining term.
                </p>
                <p className="text-secondary leading-relaxed uppercase">
                  EXCEPT AS EXPRESSLY STATED IN THIS SECTION, THE APPLICATION IS PROVIDED &quot;AS IS,&quot; AND COMPANY DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT, AND ANY WARRANTY THAT THE APPLICATION WILL BE UNINTERRUPTED OR ERROR-FREE.
                </p>
              </div>

              {/* Section 8 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  8. Limitation of liability
                </h2>
                <p className="text-secondary leading-relaxed uppercase mb-4">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, OR DATA, ARISING OUT OF OR RELATING TO THIS AGREEMENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p className="text-secondary leading-relaxed uppercase mb-4">
                  EXCEPT AS PROVIDED BELOW, EACH PARTY&apos;S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT WILL NOT EXCEED THE FEES PAID OR PAYABLE BY THE SCHOOL TO COMPANY IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM. FOR COMPANY&apos;S BREACH OF ITS STUDENT DATA OBLIGATIONS UNDER SECTION 4, THAT CAP IS TWO (2) TIMES SUCH FEES.
                </p>
                <p className="text-secondary leading-relaxed uppercase">
                  THE EXCLUSIONS AND CAP ABOVE DO NOT APPLY TO ANY LIABILITY OF COMPANY FOR INFRINGEMENT OF A THIRD PARTY&apos;S INTELLECTUAL PROPERTY RIGHTS BY THE APPLICATION, TO EITHER PARTY&apos;S GROSS NEGLIGENCE OR WILLFUL MISCONDUCT, OR TO THE SCHOOL&apos;S PAYMENT OBLIGATIONS.
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

              {/* Section 12 */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  12. Changes to these Terms
                </h2>
                <p className="text-secondary leading-relaxed">
                  Company may update these Terms from time to time. Company will post the updated Terms at this address with a new effective date and, for any material change, will notify the School by email to its designated administrator at least thirty (30) days before the change takes effect. The School&apos;s continued use of the Application after the effective date constitutes acceptance of the updated Terms. Changes do not apply retroactively. Nothing in this Section alters a separate written services agreement, which continues to control as Section 11 provides.
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
