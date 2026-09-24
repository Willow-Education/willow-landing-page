"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "phosphor-react";
import { jobApplicationSchema, validateResumeFile } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { JobApplication } from "@/lib/data/jobs";

const formSchema = jobApplicationSchema.extend({
  resume: z.custom<FileList>().superRefine((files, ctx) => {
    const message = validateResumeFile(files?.[0]);
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }),
});

type FormValues = z.infer<typeof formSchema>;

const inputClass =
  "w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#062F29] focus:border-transparent transition-colors text-base";
const textareaClass =
  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#062F29] focus:border-transparent transition-colors text-base";
const labelClass = "block text-sm font-medium text-primary mb-2";
const hintClass = "text-sm text-secondary mb-2";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export function ApplicationForm({
  jobSlug,
  jobTitle,
  application,
}: {
  jobSlug: string;
  jobTitle: string;
  application: JobApplication;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    const body = new FormData();
    body.append("jobSlug", jobSlug);
    body.append("firstName", data.firstName);
    body.append("lastName", data.lastName);
    body.append("email", data.email);
    body.append("portfolioUrl", data.portfolioUrl);
    for (const question of application.questions) {
      body.append(`answers.${question.id}`, data.answers[question.id] ?? "");
    }
    body.append("videoUrl", data.videoUrl);
    body.append("resume", data.resume[0]);

    try {
      const response = await fetch("/api/careers/apply", { method: "POST", body });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Application submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-gray-50 p-8 md:p-10">
        <CheckCircle size={40} weight="fill" className="text-[#062F29] mb-4" />
        <h3 className="font-heading text-xl md:text-2xl font-medium text-heading mb-2">
          Thanks for applying!
        </h3>
        <p className="text-secondary text-base leading-relaxed">
          We&apos;ve received your application for the {jobTitle} role. We review every
          application and will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name *
          </label>
          <input
            {...register("firstName")}
            type="text"
            id="firstName"
            autoComplete="given-name"
            className={cn(inputClass, errors.firstName ? "border-red-400" : "border-gray-300")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name *
          </label>
          <input
            {...register("lastName")}
            type="text"
            id="lastName"
            autoComplete="family-name"
            className={cn(inputClass, errors.lastName ? "border-red-400" : "border-gray-300")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email address *
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          autoComplete="email"
          className={cn(inputClass, errors.email ? "border-red-400" : "border-gray-300")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="portfolioUrl" className={labelClass}>
          Portfolio or prototype link *
        </label>
        <p className={hintClass}>
          A link to your portfolio or to something you&apos;ve designed or built.
        </p>
        <input
          {...register("portfolioUrl")}
          type="url"
          id="portfolioUrl"
          placeholder="https://"
          className={cn(inputClass, errors.portfolioUrl ? "border-red-400" : "border-gray-300")}
        />
        <FieldError message={errors.portfolioUrl?.message} />
      </div>

      <div>
        <label htmlFor="resume" className={labelClass}>
          Resume *
        </label>
        <p className={hintClass}>PDF or Word document, up to 4MB.</p>
        <input
          {...register("resume")}
          type="file"
          id="resume"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="block w-full text-sm text-secondary file:mr-4 file:h-10 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-sm file:font-semibold file:text-heading hover:file:bg-gray-200 file:cursor-pointer"
        />
        <FieldError message={errors.resume?.message as string | undefined} />
      </div>

      {application.questions.map((question) => {
        const id = `answers-${question.id}`;
        return (
          <div key={question.id}>
            <label htmlFor={id} className={labelClass}>
              {question.label} *
            </label>
            <textarea
              {...register(`answers.${question.id}`)}
              id={id}
              rows={6}
              className={cn(
                textareaClass,
                errors.answers?.[question.id] ? "border-red-400" : "border-gray-300"
              )}
            />
            <FieldError message={errors.answers?.[question.id]?.message} />
          </div>
        );
      })}

      <div>
        <label htmlFor="videoUrl" className={labelClass}>
          Video link *
        </label>
        <p className={hintClass}>{application.videoPrompt}</p>
        <p className={hintClass}>
          Share a link from Loom, Komodo, YouTube, or anywhere else we can watch it.{" "}
          <strong className="font-semibold text-primary">
            Please check your sharing settings so anyone with the link can view it.
          </strong>
        </p>
        <input
          {...register("videoUrl")}
          type="url"
          id="videoUrl"
          placeholder="https://"
          className={cn(inputClass, errors.videoUrl ? "border-red-400" : "border-gray-300")}
        />
        <FieldError message={errors.videoUrl?.message} />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto h-12 px-8 bg-[#062F29] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
