// Job postings shown on /careers.
//
// To post a job: add an entry to JOBS below. It appears in "Open positions" and
// gets its own page at /careers/<slug>. To take a job down, delete its entry
// (or set `open: false` to hide it while keeping the copy around).
//
// Each section's `blocks` render in order: a string is a paragraph, an array is
// a bulleted list, and `{ subheading }` is a small heading inside the section.
// A list item is a string, or `{ lead, text }` to start the item with a bold
// phrase. A section without a heading continues straight on from the hero.
//
// Every application asks for name, email, a resume, and a portfolio link
// (`application.portfolio` sets its wording and whether it's required).
// `application.steps` sets the job-specific questions, grouped into numbered
// steps after "About you". A question is free text or a single choice, and
// `showIf` shows it only after another question gets one of the listed
// answers. Answers are saved with each question's label, so rewording a
// question doesn't change answers already submitted. Add `application.video`
// to also ask for a video link.
//
// `interviews` sets the questions shown in /careers-management for each
// interview. Notes are saved against each question's `id`, so keep ids stable
// when rewording a question. A question's optional `notes` show under it as
// prompts for the interviewer. `phoneRubric` and `videoRubric` set the criteria
// scored from -5 to 5 on the phone and video interview tabs; scores are saved
// against each criterion's `id` the same way, and totals only count criteria
// still in the rubric.

export type JobListItem = string | { lead: string; text: string };

export type JobBlock = string | JobListItem[] | { subheading: string };

export interface JobSection {
  heading?: string;
  blocks: JobBlock[];
}

interface ApplicationQuestionBase {
  id: string;
  label: string;
  // Lines of guidance shown under the label.
  hints?: string[];
  required: boolean;
  // Show this question only when another question's answer is one of `answers`.
  showIf?: { questionId: string; answers: string[] };
}

export interface TextQuestion extends ApplicationQuestionBase {
  kind: "text";
  rows?: number;
  // Suggested length, shown as a live word count. Not enforced.
  words?: { min: number; max: number };
}

export interface ChoiceQuestion extends ApplicationQuestionBase {
  kind: "choice";
  options: string[];
}

export type ApplicationQuestion = TextQuestion | ChoiceQuestion;

export interface ApplicationStep {
  title: string;
  questions: ApplicationQuestion[];
}

export interface JobApplication {
  portfolio: { label: string; hint: string; required: boolean };
  steps: ApplicationStep[];
  video?: { prompt: string };
}

export interface InterviewQuestion {
  id: string;
  question: string;
  notes?: string[];
}

export interface RubricCriterion {
  id: string;
  label: string;
}

export interface JobInterviews {
  phone: InterviewQuestion[];
  phoneRubric: RubricCriterion[];
  video: InterviewQuestion[];
  videoRubric: RubricCriterion[];
  final: InterviewQuestion[];
}

export interface Job {
  slug: string;
  title: string;
  team: string;
  location?: string;
  type: string;
  // Short salary range shown in the job page's summary, e.g. "$80K – $130K".
  salary?: string;
  open: boolean;
  // Shown under the title and used for the page's search/share description.
  summary: string;
  sections: JobSection[];
  application: JobApplication;
  interviews: JobInterviews;
}

export const CAREERS_EMAIL = "careers@willowed.org";

// True when a question should be shown (and answered) given the other answers.
export function isQuestionShown(
  question: ApplicationQuestion,
  answers: Record<string, string | null | undefined>,
) {
  return !question.showIf || question.showIf.answers.includes(answers[question.showIf.questionId] ?? "");
}

export function getApplicationQuestions(application: JobApplication): ApplicationQuestion[] {
  return application.steps.flatMap((step) => step.questions);
}

const PUBLIC_SCHOOL_YES = [
  "Yes, as a teacher, counselor, administrator, or other school employee",
  "Yes, working directly with a public school in another capacity",
];

export const JOBS: Job[] = [
  {
    slug: "product-manager",
    title: "Product Manager",
    team: "Product",
    location: "Remote (work from anywhere)",
    type: "Full-time",
    salary: "$80K – $130K + equity",
    open: true,
    summary:
      "We're looking for an exceptional Product Manager who can figure out which problems are worth solving and lead the work of turning those problems into products people love using.",
    sections: [
      {
        blocks: [
          "You'll work directly with our Chief Product and Technology Officer, have substantial ownership over product decisions, and help shape a platform used by students and educators to make some of the most important decisions of their lives.",
          "We're especially interested in people who combine strong product judgment, curiosity about users, and the ability to turn complicated problems into simple, effective experiences.",
        ],
      },
      {
        heading: "About Willow",
        blocks: [
          "Willow Education is building the career and postsecondary readiness platform that helps schools and community-based organizations drive economic mobility.",
          "We combine curriculum, AI-powered guidance, career exploration, labor market data, and information on hundreds of thousands of college and professional programs to help students understand who they are, discover what's possible, and make better decisions about what comes after high school.",
          "We're a small, growing company with an ambitious mission. Our full-time team consists of our CEO, Chief Product and Technology Officer, Chief Academic Officer, and this role, supported by a handful of part-time and contract contributors.",
          "You'll work closely with the CPTO on product strategy, discovery, and execution, and with our CAO, who leads curriculum and customer success. You'll have direct access to the people who use Willow and meaningful influence over the direction of the product.",
          "There are very few layers between discovering a problem, making a decision, and building something better.",
        ],
      },
      {
        heading: "The role",
        blocks: [
          "Your most important responsibility is making sure we're building the right things, for the right reasons, in the right way.",
          "That starts with understanding people. You'll spend time talking with students, educators, counselors, and school leaders to understand their goals, challenges, behaviors, and needs.",
          "You'll combine what you learn with Willow's larger goals to identify opportunities, evaluate tradeoffs, decide what matters most, and develop solutions that create measurable value.",
          "You'll own the process from discovery through launch and iteration. That includes defining problems, exploring possible solutions, testing assumptions, designing experiences, working with engineering, and learning from what happens after something ships.",
          "This isn't a role where leadership hands you a list of features to build. We expect you to help us figure out what belongs on that list in the first place.",
        ],
      },
      {
        heading: "What you'll do",
        blocks: [
          [
            {
              lead: "Understand our users.",
              text: "Conduct interviews, observe workflows, analyze feedback and product usage, and develop a deep understanding of the people we're building for.",
            },
            {
              lead: "Identify the right problems.",
              text: "Translate company goals, customer needs, and research findings into clear opportunities for the product.",
            },
            {
              lead: "Make thoughtful product decisions.",
              text: "Evaluate potential solutions, prioritize what matters, navigate tradeoffs, and make good decisions even when information is incomplete.",
            },
            {
              lead: "Design and test solutions.",
              text: "Develop user flows, prototypes, and product experiences. Test ideas early, learn quickly, and improve them before and after launch.",
            },
            {
              lead: "Own outcomes, not just deliverables.",
              text: "Work with engineering to ship solutions, understand whether they actually solved the problem, and keep improving them.",
            },
            {
              lead: "Shape the product experience.",
              text: "Help make Willow simpler, more intuitive, more coherent, and more useful across the platform.",
            },
          ],
        ],
      },
      {
        heading: "What we're looking for",
        blocks: [
          "Above everything else, we're looking for excellent product judgment.",
          "We care much more about how you think, what you've accomplished, and the quality of your decisions than your job titles or years of experience.",
          "The strongest candidates will demonstrate an ability to:",
          [
            {
              lead: "Understand users deeply.",
              text: "You know how to conduct meaningful research, ask good questions, uncover underlying needs, and distinguish what users ask for from what they actually need.",
            },
            {
              lead: "Find valuable problems to solve.",
              text: "You can connect company objectives with customer needs and recognize where solving a problem will make a meaningful difference.",
            },
            {
              lead: "Turn ambiguity into direction.",
              text: "You can take a broad goal or messy problem, explore the possibilities, identify tradeoffs, and develop a clear plan of action.",
            },
            {
              lead: "Think critically about products.",
              text: "You can look at an existing experience, recognize what's working and what isn't, and develop thoughtful hypotheses about how to improve it.",
            },
            {
              lead: "Create and evaluate solutions.",
              text: "You're comfortable prototyping ideas, testing them with users, and changing direction based on what you learn.",
            },
            {
              lead: "Take ownership.",
              text: "You can independently move a product from an identified problem to a shipped solution, working effectively with engineers and other collaborators along the way.",
            },
          ],
          "We're not looking for someone who simply organizes a backlog, writes requirements, and keeps projects moving. Those skills can be useful, but the real value of this role is figuring out what we should build, why it matters, and how to make it genuinely useful.",
        ],
      },
      {
        heading: "Experience we'd especially value",
        blocks: [
          { subheading: "U.S. public school experience" },
          "Understanding how schools actually operate is a major advantage. We're particularly interested in people who have worked directly in U.S. public schools, including teachers, counselors, administrators, and school leaders.",
          "Schools are complicated environments, and knowing how educators and students experience those environments can make you a much better product manager at Willow.",
          { subheading: "Education technology experience" },
          "We'd also love to meet candidates who have built products at education-focused technology companies or worked closely with schools and educators through technology.",
          "Experience in education isn't required, but a genuine interest in our mission and willingness to learn about the people we serve are essential.",
          { subheading: "Product and UX design experience" },
          "Strong design skills are another significant advantage. We value people who understand user experience, information architecture, interaction design, and how to make complicated workflows feel simple.",
          "Because we're a small team, you'll contribute directly to designing and prototyping the experiences you lead. You don't need to be an exceptional visual designer, but you should have strong instincts for usability, care about the quality of the finished experience, and be comfortable turning ideas into tangible designs.",
        ],
      },
      {
        heading: "How we work: AI-first",
        blocks: [
          "AI is fundamental to how we work at Willow.",
          "We use AI to accelerate research, analyze information, explore ideas, design solutions, and build software. We believe this allows a small team of talented people to accomplish things that previously required much larger teams.",
          "You'll be expected to use AI tools regularly and develop working, interactive prototypes with AI-assisted coding tools.",
          "You don't need to be a software engineer. You do need to be willing and able to use modern AI tools to turn your ideas into experiences people can actually interact with.",
          "We care about the quality of your thinking and what you accomplish, not whether you personally wrote every line of code.",
        ],
      },
      {
        heading: "What it's like to work here",
        blocks: [
          "You'll have a lot of autonomy, along with real responsibility for the results of your work.",
          "We believe talented people do their best work when they understand the goals, have access to the information they need, and have the freedom to figure out how to get there.",
          "You'll be encouraged to challenge assumptions, propose new directions, experiment, and make important decisions. We won't measure your contribution by hours online, meetings attended, or tickets completed.",
          "We will care deeply about the quality of your decisions, the experiences you create, and whether your work actually improves outcomes for our users.",
          "Priorities will evolve. You'll sometimes work with incomplete information. And because our team is small, you'll have opportunities to influence decisions well beyond a narrowly defined job description.",
          "If you love solving meaningful problems, taking ownership, and seeing the direct impact of your work, we think you'll enjoy working here.",
        ],
      },
      {
        heading: "Compensation and benefits",
        blocks: [
          [
            {
              lead: "Salary:",
              text: "$80,000–$130,000, based on the scope of the role and the capabilities you bring.",
            },
            {
              lead: "Equity:",
              text: "Meaningful equity in a growing, mission-driven public benefit corporation.",
            },
            { lead: "Benefits:", text: "Benefits package provided." },
            { lead: "Location:", text: "Fully remote. Work from anywhere." },
            { lead: "Employment:", text: "Full-time." },
          ],
        ],
      },
      {
        heading: "How to apply",
        blocks: [
          "We care about what you can do, not just what's on your resume.",
          "Our application asks about your experience and gives you an opportunity to share a product you've helped create. We're especially interested in understanding the problems you've solved, the decisions you've made, and your specific contributions.",
          "No cover letter or introductory video required.",
        ],
      },
    ],
    application: {
      portfolio: {
        label: "Portfolio, case study, or product link",
        hint: "Share a link to your portfolio, a product you've worked on, or an example of your work. If you don't have a public portfolio, that's okay. You can describe your work in the questions below.",
        required: false,
      },
      steps: [
        {
          title: "Your experience",
          questions: [
            {
              id: "public-school",
              kind: "choice",
              label:
                "Have you worked directly in a U.S. public school, including a district or public charter school?",
              required: true,
              options: [...PUBLIC_SCHOOL_YES, "No"],
            },
            {
              id: "public-school-role",
              kind: "text",
              label: "Briefly describe your role and the type of school or schools you worked with.",
              required: false,
              rows: 3,
              showIf: { questionId: "public-school", answers: PUBLIC_SCHOOL_YES },
            },
            {
              id: "edtech",
              kind: "choice",
              label: "Have you worked at an education-focused technology company?",
              required: true,
              options: ["Yes", "No"],
            },
            {
              id: "edtech-role",
              kind: "text",
              label: "What company or companies did you work for, and what was your role?",
              required: false,
              rows: 3,
              showIf: { questionId: "edtech", answers: ["Yes"] },
            },
          ],
        },
        {
          title: "Your product work",
          questions: [
            {
              id: "problem-to-launch",
              kind: "text",
              label:
                "Tell us about a product or significant feature you personally helped take from an identified problem to a launched solution.",
              hints: [
                "We're interested in understanding your actual contribution, not just the final product. Briefly walk us through:",
                "What problem were you trying to solve, and how did you know it mattered? How did you decide what to build? What decisions did you personally own? What happened after it launched?",
                "Specific examples are much more helpful than polished generalities.",
              ],
              required: true,
              rows: 10,
              words: { min: 200, max: 300 },
            },
            {
              id: "changed-mind",
              kind: "text",
              label:
                "Tell us about a time when user research or customer feedback caused you to change your mind about what a product needed.",
              hints: [
                "What did you originally believe, what did you learn, and how did it affect your decision?",
              ],
              required: true,
              rows: 6,
              words: { min: 100, max: 150 },
            },
          ],
        },
        {
          title: "Working at Willow",
          questions: [
            {
              id: "ai-prototyping",
              kind: "choice",
              label:
                "Are you comfortable using AI-assisted development tools to build interactive product prototypes, including writing or generating code with AI?",
              required: true,
              options: [
                "Yes, I already do this",
                "Yes, I'm learning and excited to develop this skill",
                "Not currently, but I'm willing to learn",
                "No",
              ],
            },
            {
              id: "salary",
              kind: "choice",
              label: "What are your salary expectations?",
              required: true,
              options: [
                "$80,000–$95,000",
                "$95,000–$110,000",
                "$110,000–$130,000",
                "I'd like to discuss",
              ],
            },
          ],
        },
      ],
    },
    interviews: {
      phone: [
        { id: "background", question: "Tell me about your background." },
        { id: "motivation", question: "What motivates you to work at a company like Willow?" },
        {
          id: "freedom",
          question:
            "Tell me about a job where you had a lot of freedom. What worked for you, and what didn't?",
        },
        { id: "schools", question: "Tell me more about your experience working in or with schools." },
        {
          id: "start-and-salary",
          question:
            "The role starts in early November, and the salary range is $80,000–$130,000. Does that work for you?",
        },
      ],
      phoneRubric: [
        { id: "willow", label: "Familiarity with what Willow is and why Willow's work matters" },
        { id: "agency", label: "Interest in working with a high degree of agency and accountability" },
        {
          id: "school-life",
          label: "Understands what the life of people who work in schools is like, beyond platitudes",
        },
        { id: "timeline-salary", label: "Fit with timeline and salary" },
      ],
      video: [
        { id: "education-experience", question: "Education experience" },
        {
          id: "product-approach",
          question: "Product management",
          notes: [
            "How does their judgement come into play when code is free?",
            "What stays the same about product management in the world of AI, and what changes?",
          ],
        },
        { id: "design", question: "Design" },
        { id: "live-walkthrough", question: "Live walkthrough" },
        { id: "ambiguity-freedom", question: "Comfort with ambiguity and freedom" },
      ],
      videoRubric: [
        { id: "education-experience", label: "Education experience" },
        { id: "product-approach", label: "Product management" },
        { id: "design", label: "Design" },
        { id: "live-walkthrough", label: "Live walkthrough" },
        { id: "ambiguity-freedom", label: "Comfort with ambiguity and freedom" },
        { id: "vibe", label: "Vibe" },
      ],
      final: [],
    },
  },
];

export function getOpenJobs(): Job[] {
  return JOBS.filter((job) => job.open);
}

export function getJob(slug: string): Job | undefined {
  return getOpenJobs().find((job) => job.slug === slug);
}

export function getJobMeta(job: Job): string {
  return getJobTags(job).join(" · ");
}

export function getJobTags(job: Job): string[] {
  return [job.team, job.location, job.type].filter((tag): tag is string => Boolean(tag));
}
