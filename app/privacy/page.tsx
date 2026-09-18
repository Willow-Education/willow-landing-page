import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | Willow Education",
  description:
    "Privacy Policy for Willow Education - How we collect, use, store, and protect your personal information.",
};

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
              <h2 className="font-heading text-xl font-medium text-heading mb-4">
                Privacy policy for Willow Education
              </h2>
              <p className="text-base text-secondary leading-relaxed mb-4">
                Last updated: September 18, 2026
              </p>
              <p className="text-base text-secondary leading-relaxed mb-12">
                Welcome to Willow Education! This Privacy Policy explains how we collect, use, store, and protect the personal information of our users. By accessing or using our web app, you agree to the terms and conditions outlined in this policy. If you have any questions or concerns regarding your data, please contact us at <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>.
              </p>

              {/* Information We Collect */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Information we collect
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  We collect personal information from users in the following ways:
                </p>
                <p className="text-secondary leading-relaxed mb-2">
                  1. Google Login: When you sign up or log in using Google OAuth, we collect the following information:
                </p>
                <ul className="list-disc list-inside text-secondary leading-relaxed mb-4 ml-4">
                  <li>First name</li>
                  <li>Last name</li>
                  <li>Email address</li>
                </ul>
                <p className="text-secondary leading-relaxed mb-2">
                  2. Additional personal information you provide may include:
                </p>
                <ul className="list-disc list-inside text-secondary leading-relaxed ml-4">
                  <li>Birthday</li>
                  <li>School</li>
                  <li>IP address</li>
                  <li>Phone number</li>
                </ul>
              </div>

              {/* Use of Collected Information */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Use of collected information
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  The personal information we collect is used for the following purposes:
                </p>
                <ul className="list-disc list-inside text-secondary leading-relaxed mb-4 ml-4">
                  <li>Personalizing recommendations for postsecondary programs based on user interests and preferences.</li>
                  <li>Managing user accounts, and ensuring secure access to our platform.</li>
                  <li>Providing relevant educational content and program recommendations.</li>
                  <li>Sending necessary communications related to user accounts, tasks, and updates.</li>
                </ul>
                <p className="text-secondary leading-relaxed">
                  We do not sell personal information to third parties.
                </p>
              </div>

              {/* Third-Party Services */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Third-party services
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  We use third-party services to improve our platform and enhance your experience:
                </p>
                <ul className="list-disc list-inside text-secondary leading-relaxed mb-4 ml-4">
                  <li>Vercel: Web and API hosting.</li>
                  <li>Vercel Analytics: Website analytics.</li>
                  <li>Google Cloud Platform and Firebase: Application database, authentication, and hosting.</li>
                  <li>Supabase: Reference-data store.</li>
                  <li>Anthropic: AI assistant conversation generation.</li>
                  <li>OpenAI: Content moderation checks and search matching.</li>
                  <li>Deepgram: Speech-to-text transcription.</li>
                  <li>Clever: Rostering and single sign-on.</li>
                  <li>Postmark: Transactional email.</li>
                  <li>Twilio: Opt-in text message notifications.</li>
                  <li>Sentry: Error monitoring, with identifying details removed at collection.</li>
                  <li>Google Maps Platform: Address autocomplete during account setup.</li>
                </ul>
                <p className="text-secondary leading-relaxed">
                  All subprocessors that handle student data are hosted in the United States. Willow will update this list within thirty (30) days of adding or removing a subprocessor.
                </p>
              </div>

              {/* Data Security */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Data security
                </h2>
                <p className="text-secondary leading-relaxed">
                  We take appropriate technical and organizational measures to safeguard the personal information we collect, protecting it from unauthorized access, disclosure, alteration, or destruction.
                </p>
              </div>

              {/* Age Restrictions */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Age restrictions
                </h2>
                <p className="text-secondary leading-relaxed">
                  Willow Education is designed for high school students, including those under the age of 18. By using our services, users confirm that they are at least 13 years old. We recommend that minors seek consent from a parent or guardian before using our services.
                </p>
              </div>

              {/* Sharing of User Information */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Sharing of user information
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  We only share user data with postsecondary programs that users have expressed interest in. This may include:
                </p>
                <ul className="list-disc list-inside text-secondary leading-relaxed mb-4 ml-4">
                  <li>First name, last name, and email address.</li>
                  <li>Academic interests, career goals, and other user preferences.</li>
                </ul>
                <p className="text-secondary leading-relaxed">
                  Users can opt-out of data sharing during registration or by contacting <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>. Opting out may limit certain personalized features of the platform.
                </p>
              </div>

              {/* FERPA Compliance */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  FERPA compliance
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  Willow Education complies with the Family Educational Rights and Privacy Act (FERPA) to ensure the privacy of student education records. Our practices include:
                </p>
                <ul className="list-disc list-inside text-secondary leading-relaxed ml-4">
                  <li>Allowing parents/guardians and eligible students to review and request changes to their records.</li>
                  <li>Only sharing data with third parties for permitted purposes, like postsecondary applications.</li>
                </ul>
              </div>

              {/* Access and Modification of Personal Information */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Access and modification of personal information
                </h2>
                <p className="text-secondary leading-relaxed">
                  Users can access, update, or delete their personal information by contacting us at <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>. We will respond to such requests promptly.
                </p>
              </div>

              {/* Opt-Out and Data Retention */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Opt-out and data retention
                </h2>
                <p className="text-secondary leading-relaxed">
                  Users may request to delete their account and data at any time. However, essential data required for account security and service provision cannot be removed unless the account is closed. If you no longer wish to receive communication, you may opt-out by contacting <a href="mailto:privacy@willowed.org" className="text-content-link underline hover:text-[#025f80]">privacy@willowed.org</a>.
                </p>
              </div>

              {/* Privacy Policy Changes */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-medium text-heading mb-4">
                  Privacy policy changes
                </h2>
                <p className="text-secondary leading-relaxed">
                  We may update this policy from time to time. If we make any significant changes, we will notify users by email or by posting an updated version on our website. Please review this policy periodically for updates.
                </p>
              </div>

              {/* Closing Statement */}
              <div className="mb-10">
                <p className="text-secondary leading-relaxed">
                  By using Willow Education, you acknowledge that you have read and understood this Privacy Policy. If you disagree with any aspect of this policy, please refrain from using our web app.
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
