# Willow Education Landing Page

A high-performing, mobile-first landing page for Willow Education built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Mobile-First Responsive Design** - Fully responsive across all devices
- **Smooth Animations** - Subtle scroll animations and count-up statistics using Framer Motion
- **SEO Optimized** - Comprehensive metadata and OpenGraph tags
- **Greyscale Color Scheme** - Clean, professional design with light-mode focus
- **Interactive Components**:
  - Sticky navigation with mobile menu
  - Animated hero section
  - Continuous scrolling logo carousel
  - Count-up statistics with viewport detection
  - Feature showcase with alternating layouts
  - Animated process steps with Phosphor icons
  - Testimonials grid (3x3)
  - FAQ accordion
  - Proposal request form with validation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3
- **Package Manager**: pnpm
- **Fonts**: Poppins (headings) and Inter (body) via next/font/google
- **Icons**: Phosphor Icons (regular weight)
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Supabase (for proposal submissions)
- **Analytics**: PostHog (optional)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account (for form submissions)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Then fill in your Supabase credentials in `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Create a Supabase table for proposal requests:
   ```sql
   CREATE TABLE proposal_requests (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT NOT NULL,
     job_title TEXT NOT NULL,
     school_name TEXT NOT NULL,
     school_size TEXT NOT NULL,
     state TEXT NOT NULL,
     interests TEXT,
     message TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── header.tsx          # Navigation header
│   ├── hero.tsx            # Hero section
│   ├── logo-carousel.tsx   # Logo carousel
│   ├── stats-section.tsx   # Statistics with count-up
│   ├── features-section.tsx # Feature blocks
│   ├── how-it-works.tsx    # Process steps
│   ├── testimonials-section.tsx # Testimonials grid
│   ├── faq-section.tsx     # FAQ accordion
│   ├── final-cta.tsx       # Final CTA section
│   ├── footer.tsx          # Footer
│   ├── proposal-form.tsx   # Proposal request form
│   └── grey-placeholder.tsx # Reusable placeholder component
├── lib/
│   ├── utils.ts            # Utility functions (cn)
│   ├── validations.ts      # Zod schemas
│   ├── supabase.ts         # Supabase client
│   └── proposal-modal-context.tsx # Modal state management
└── types/                  # TypeScript type definitions
```

## Building for Production

```bash
pnpm build
pnpm start
```

## Color Scheme

The landing page uses a greyscale color palette:
- Background: White and gray-50
- Text: gray-900, gray-700, gray-600
- Accents: gray-900 (buttons), gray-200 (borders)
- Placeholders: gray-200, gray-300

All visual assets (images, videos, logos) are currently grey placeholders ready to be replaced with actual assets.

## Next Steps

1. **Add Real Assets**: Replace grey placeholders with actual images, videos, and logos
2. **Color Customization**: Apply warm, fun color scheme as specified in the design brief
3. **PostHog Integration**: Add PostHog analytics tracking
4. **Content Review**: Review and customize all copy/text content
5. **Performance Optimization**: Run Lighthouse audits and optimize
6. **Accessibility**: Test and improve accessibility features

## License

All rights reserved - Willow Education

## Partnership FAQ

`/one-goal-planning/faq` is the Willow × OneGoal partnership FAQ. Everything
else under `/one-goal-planning` is forwarded to the partnership workspace app
(see `next.config.ts`); this one page is served from here. It is behind the
workspace passcode: the page checks the visitor's workspace sign-in with the
workspace itself, so there is nothing to configure.

- **Content** is `content/one-goal-faq.md`. Edit it on GitHub; merging to
  `main` publishes it. The notes at the top of the file explain the format.
- **Weekly updates** come from `.github/workflows/update-one-goal-faq.yml`.
  Every Monday morning (Eastern) it reads the workspace for new meeting notes,
  documents, and workstream changes, asks the model which answers they change,
  and opens a pull request, "FAQ updates, week of ...", with the revised FAQ,
  the update log the page shows, and a description of every change and its
  source. Merging it publishes the changes. An unmerged pull request is
  refreshed the next Monday rather than duplicated. A week whose records change
  no answers only records that they were reviewed. It needs two repository
  secrets, `WORKSPACE_PASSCODE` and `OPENAI_API_KEY`, and does nothing until
  both are set; it can also be run any time from the Actions tab.
