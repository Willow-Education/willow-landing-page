import { z } from "zod";

export const proposalFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  jobTitle: z.string().min(2, "Job title is required"),
  schoolName: z.string().min(2, "School/District name is required"),
  schoolSize: z.enum(["1-500", "501-1000", "1001-5000", "5000+"], {
    required_error: "Please select a school size",
  }),
  state: z.string().min(2, "State is required"),
  interests: z.string().optional(),
  message: z.string().optional(),
});

export type ProposalFormData = z.infer<typeof proposalFormSchema>;

export const curriculumSampleSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

export type CurriculumSampleData = z.infer<typeof curriculumSampleSchema>;

// Accepts links typed without a protocol (e.g. "loom.com/share/abc").
const linkField = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
    .pipe(z.string().url(message));

export const jobApplicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  portfolioUrl: linkField("Please enter a valid link"),
  answers: z.record(
    z.string().trim().min(1, "Please answer this question").max(5000, "Please keep your answer under 5,000 characters")
  ),
  videoUrl: linkField("Please enter a valid video link"),
});

export type JobApplicationData = z.infer<typeof jobApplicationSchema>;

// Kept under Vercel's 4.5MB request body limit for serverless functions.
export const RESUME_MAX_BYTES = 4 * 1024 * 1024;
export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

export function validateResumeFile(file: { name: string; size: number } | null | undefined): string | null {
  if (!file || file.size === 0) return "Please upload your resume";
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Resume must be a PDF or Word document";
  }
  if (file.size > RESUME_MAX_BYTES) return "Resume must be smaller than 4MB";
  return null;
}
