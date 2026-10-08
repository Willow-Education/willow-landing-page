// Service providers named in the Privacy Policy and Terms of Service. Keep this
// list in step with willow-app's docs/compliance/subprocessors.md.
export const serviceProviders: { provider: string; purpose: string }[] = [
  { provider: "Vercel", purpose: "Web and API hosting" },
  {
    provider: "Google Cloud Platform and Firebase",
    purpose: "Application database, authentication and hosting",
  },
  {
    provider: "Supabase",
    purpose: "Reference-data store and AI assistant conversation storage",
  },
  {
    provider: "Anthropic",
    purpose:
      "Generative AI for Alma and the Platform's other AI features; Willow's only generative AI provider",
  },
  {
    provider: "OpenAI",
    purpose:
      "Embeddings (numerical search data) for career and school search; generates no content and receives no student identifiers",
  },
  {
    provider: "Deepgram",
    purpose: "Speech-to-text transcription of optional voice input",
  },
  { provider: "Clever", purpose: "Rostering and single sign-on" },
  { provider: "Postmark", purpose: "Transactional email" },
  { provider: "Twilio", purpose: "Opt-in text-message reminders" },
  {
    provider: "Sentry",
    purpose: "Error monitoring, with identifying details removed at collection",
  },
  {
    provider: "Google Maps Platform",
    purpose: "Address autocomplete during account setup",
  },
  { provider: "Vercel Analytics", purpose: "Website analytics" },
  {
    provider: "Common App",
    purpose:
      "School-directed college applications, once a School turns on its Common App integration",
  },
  {
    provider: "CampusReel",
    purpose:
      "College tour videos on college pages; sees the viewer's IP address and the college page being viewed",
  },
  {
    provider: "GitHub",
    purpose:
      "Engineering issue tracking; receives feedback IDs and privacy-scrubbed error reports only, never student names or messages",
  },
];
