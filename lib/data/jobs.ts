// Job postings shown on /careers.
//
// To post a job: add an entry to JOBS below. It appears in "Open positions" and
// gets its own page at /careers/<slug>. To take a job down, delete its entry
// (or set `open: false` to hide it while keeping the copy around).
//
// Each section's `blocks` render in order: a string is a paragraph, and an
// array of strings is a bulleted list.
//
// Every application asks for name, email, a portfolio link, a resume, and a
// video link. `application` sets the job-specific open-response questions and
// what the video should cover.
//
// `interviews` sets the questions shown in /careers-management for each
// interview. Notes are saved against each question's `id`, so keep ids stable
// when rewording a question.

export interface JobSection {
  heading: string;
  blocks: (string | string[])[];
}

export interface ApplicationQuestion {
  id: string;
  label: string;
}

export interface JobApplication {
  questions: ApplicationQuestion[];
  videoPrompt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
}

export interface JobInterviews {
  phone: InterviewQuestion[];
  video: InterviewQuestion[];
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
  // Used for the page's search/share description.
  summary: string;
  sections: JobSection[];
  application: JobApplication;
  interviews: JobInterviews;
}

export const CAREERS_EMAIL = "careers@willowed.org";

export const JOBS: Job[] = [
  {
    slug: "product-manager",
    title: "Product Manager",
    team: "Product",
    type: "Full-time",
    salary: "$80K – $130K",
    open: true,
    summary:
      "We're looking for a Product Manager with a design background who can own a problem from the first conversation with a user through a finished product experience.",
    sections: [
      {
        heading: "About Willow",
        blocks: [
          "Willow Education is building the career and postsecondary readiness platform that helps schools and CBOs drive economic mobility. We combine quality coherent curriculum, AI-powered guidance, career exploration, labor market data, and data on hundreds of thousands of college and professional programs to help students understand who they are, discover what is possible, and make better decisions about what comes after high school.",
          "Willow currently has four full-time team members: our CEO, Chief Product and Technology Officer, Chief Academic Officer, and this role, alongside a small number of part-time and contract contributors. You will make up the product team alongside our CPTO and work closely with our CAO, who leads curriculum and customer success. There are very few layers between understanding a problem, making a decision, and building something better.",
        ],
      },
      {
        heading: "The role",
        blocks: [
          "We're looking for a Product Manager with a design background who can own a problem from the first conversation with a user through a finished product experience.",
          "The core of the job is understanding users, identifying the right problems to solve, developing and testing solutions, and designing the experience that gets built.",
          "This is not a traditional PM role where you write requirements and hand them to a designer. You will be responsible for the design work yourself and have full responsibility for the overall UI/UX and aesthetic quality of Willow.",
        ],
      },
      {
        heading: "What you'll do",
        blocks: [
          [
            "Conduct research with students, educators, counselors, and school leaders.",
            "Identify opportunities to improve existing experiences and build new ones.",
            "Turn ambiguous problems into clear product solutions.",
            "Explore, prototype, and test multiple approaches with real users.",
            "Design polished, production-ready product experiences.",
            "Make decisions about workflows, interaction patterns, information architecture, hierarchy, and usability.",
            "Run product-based experiments to identify opportunities and strengthen outcomes.",
            "Work closely with engineering from early exploration through implementation.",
            "Maintain and improve the consistency, usability, and visual quality of Willow across the product.",
          ],
        ],
      },
      {
        heading: "AI-first means building",
        blocks: [
          "AI is core to how we work at Willow.",
          "You will be expected to use AI every day to research problems, explore ideas, analyze feedback, design solutions, and build coded prototypes.",
          "We believe product ideas should be experienced, not just described in documents or static mockups. You should be comfortable using modern AI development tools to turn ideas into working prototypes that users and teammates can interact with.",
          "You do not need to be a software engineer, but working and coding with AI is a requirement for this role.",
        ],
      },
      {
        heading: "This is a startup",
        blocks: [
          "You will have a lot of autonomy here. You will also have a lot of responsibility.",
          "We care far more about the quality and impact of your work than whether you were online for a particular number of hours. This is not a clock-in, clock-out role where completing assigned tasks means the work is done.",
          "If you own something, you own the outcome, and usually the process to drive it.",
          "We expect you to notice when something is not good enough, figure out why, and keep working the problem until it is. In return, you will have substantial freedom to make decisions, challenge assumptions, and shape the product.",
        ],
      },
      {
        heading: "What we're looking for",
        blocks: [
          "You are exceptional at:",
          [
            "User research and customer discovery",
            "Product thinking and problem definition",
            "UX and interaction design",
            "Prototyping and usability testing",
            "Turning complex workflows into simple experiences",
            "Creating polished product interfaces",
            "Making good product decisions with incomplete information",
            "Working directly with engineers",
            "Taking a product from an ambiguous problem through a shipped solution",
          ],
          "We are not looking for a PM who creates rough concepts and expects a designer to take over. You should have a strong design eye and be comfortable owning the quality of the experience yourself.",
          "You should also be comfortable setting your own direction, making big decisions without waiting for permission, and operating in an environment where priorities and plans will change. If you need highly predictable work, tightly defined responsibilities, or daily direction from a manager, this is probably not the right role.",
        ],
      },
      {
        heading: "Experience with schools is a major plus",
        blocks: [
          "Experience working in or closely with schools is a significant advantage.",
          "Students, educators, counselors, administrators, districts, and families all operate under different constraints, and many of those constraints are difficult to understand from the outside.",
          "We are especially interested in candidates who have worked as educators, counselors, school leaders, education researchers, edtech product builders, or in other roles that involved meaningful time inside schools.",
        ],
      },
      {
        heading: "You'll probably thrive here if",
        blocks: [
          [
            "You like talking directly to users.",
            "You are comfortable starting with a messy problem rather than a detailed specification.",
            "You want ownership of both what gets built and how it works.",
            "You have strong product and design opinions but change your mind when the evidence says you should.",
            "You care deeply about quality.",
            "You are comfortable moving quickly in ambiguity without layers of approval.",
            "You want your work to visibly shape the direction of an entire product.",
          ],
        ],
      },
      {
        heading: "Compensation",
        blocks: [
          "Salary range: $80,000 - $130,000, depending on experience and fit. Meaningful equity and benefits in a fast-growing mission-driven public benefit corporation.",
        ],
      },
    ],
    application: {
      questions: [
        {
          id: "schools",
          label:
            "Tell us about your experience working in or with schools. What was your role, and what did that time teach you about how schools actually work?",
        },
        {
          id: "limited-information",
          label:
            "Describe a time you had to make a difficult decision with limited information. What did you decide, how did you get there, and how did it turn out?",
        },
        {
          id: "complaint-to-feature",
          label:
            "Tell us about a user complaint or pain point you turned into a shipped feature. Walk us through how you got from the problem to the solution, and what happened after it launched.",
        },
      ],
      videoPrompt:
        "Record a short video telling us how you use AI in your day-to-day work. Include one example of something you accomplished with AI that would have been much harder, or impossible, without it.",
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
      video: [],
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
