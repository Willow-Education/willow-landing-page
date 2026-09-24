import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getJob } from "@/lib/data/jobs";
import { jobApplicationSchema, validateResumeFile } from "@/lib/validations";

const RESUME_BUCKET = "resumes";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const job = getJob(String(formData.get("jobSlug") ?? ""));
    if (!job) {
      return NextResponse.json(
        { error: "This position is no longer open" },
        { status: 400 }
      );
    }

    const answers: Record<string, string> = {};
    for (const question of job.application.questions) {
      answers[question.id] = String(formData.get(`answers.${question.id}`) ?? "");
    }

    const parsed = jobApplicationSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      portfolioUrl: formData.get("portfolioUrl"),
      answers,
      videoUrl: formData.get("videoUrl"),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid application" },
        { status: 400 }
      );
    }
    const application = parsed.data;

    const resume = formData.get("resume");
    const resumeError = validateResumeFile(resume instanceof File ? resume : null);
    if (resumeError || !(resume instanceof File)) {
      return NextResponse.json({ error: resumeError }, { status: 400 });
    }

    // Check if Supabase client is available
    if (!supabase) {
      console.error("Supabase client not initialized");
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      );
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const safeFileName = resume.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const resumePath = `${job.slug}/${crypto.randomUUID()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(resumePath, resumeBuffer, {
        contentType: resume.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("Supabase storage error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload resume" },
        { status: 500 }
      );
    }

    const { error } = await supabase.from("job_applications").insert({
      job_slug: job.slug,
      first_name: application.firstName,
      last_name: application.lastName,
      email: application.email.toLowerCase(),
      portfolio_url: application.portfolioUrl,
      resume_path: resumePath,
      answers: job.application.questions.map((question) => ({
        question: question.label,
        answer: application.answers[question.id],
      })),
      video_url: application.videoUrl,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
