"use client";

import { useMemo, useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, FileText, UploadSimple } from "phosphor-react";
import { buildJobApplicationSchema, validateResumeFile } from "@/lib/validations";
import { cn } from "@/lib/utils";
import {
  getApplicationQuestions,
  isQuestionShown,
  type ApplicationQuestion,
  type JobApplication,
} from "@/lib/data/jobs";

function buildFormSchema(application: JobApplication) {
  return buildJobApplicationSchema(application).extend({
    resume: z.custom<FileList>().superRefine((files, ctx) => {
      const message = validateResumeFile(files?.[0]);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
  });
}

type FormSchema = ReturnType<typeof buildFormSchema>;
type FormInput = z.input<FormSchema>;
type FormValues = z.output<FormSchema>;

function countWords(text: string | null | undefined) {
  return text?.trim() ? text.trim().split(/\s+/).length : 0;
}

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

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-gray-200 pt-8 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3 mb-6" aria-hidden="true">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ACF7B2] text-sm font-semibold text-[#062F29]">
          {number}
        </span>
        <span className="font-heading text-lg md:text-xl font-medium text-heading">{title}</span>
      </div>
      <div className="space-y-6">{children}</div>
    </fieldset>
  );
}

function QuestionField({
  question,
  register,
  answer,
  error,
}: {
  question: ApplicationQuestion;
  register: UseFormRegister<FormInput>;
  answer: string | null | undefined;
  error?: string;
}) {
  const id = `answers-${question.id}`;
  const label = `${question.label}${question.required ? " *" : ""}`;
  const hints = question.hints?.map((hint) => (
    <p key={hint} className={hintClass}>
      {hint}
    </p>
  ));

  if (question.kind === "choice") {
    return (
      <fieldset>
        <legend className={labelClass}>{label}</legend>
        {hints}
        <div className="space-y-2">
          {question.options.map((option) => (
            <label
              key={option}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors text-base text-primary",
                answer === option
                  ? "border-[#062F29] bg-[#ACF7B2]/25"
                  : error
                    ? "border-red-400 hover:bg-gray-50"
                    : "border-gray-300 hover:bg-gray-50",
              )}
            >
              <input
                {...register(`answers.${question.id}`)}
                type="radio"
                value={option}
                className="mt-1 h-4 w-4 shrink-0 accent-[#062F29]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <FieldError message={error} />
      </fieldset>
    );
  }

  const words = countWords(answer);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {hints}
      <textarea
        {...register(`answers.${question.id}`)}
        id={id}
        rows={question.rows ?? 6}
        className={cn(textareaClass, error ? "border-red-400" : "border-gray-300")}
      />
      {question.words && (
        <p className="mt-1.5 text-sm text-secondary">
          Aim for {question.words.min}–{question.words.max} words
          {words > 0 && ` · ${words} ${words === 1 ? "word" : "words"}`}
        </p>
      )}
      <FieldError message={error} />
    </div>
  );
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

  const formSchema = useMemo(() => buildFormSchema(application), [application]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });

  const resumeName = watch("resume")?.[0]?.name;
  const answers = watch("answers") ?? {};

  // The installed resolver types submitted values as the form's input, but
  // they are the schema's parsed output (trimmed answers, normalized links).
  const onSubmit = async (input: FormInput) => {
    const data = input as unknown as FormValues;
    setIsSubmitting(true);
    setError(null);

    const body = new FormData();
    body.append("jobSlug", jobSlug);
    body.append("firstName", data.firstName);
    body.append("lastName", data.lastName);
    body.append("email", data.email);
    body.append("portfolioUrl", data.portfolioUrl);
    for (const question of getApplicationQuestions(application)) {
      if (isQuestionShown(question, data.answers)) {
        body.append(`answers.${question.id}`, data.answers[question.id] ?? "");
      }
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
          We&apos;ve received your application for the {jobTitle} role. We review every application
          and will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <Step number={1} title="About you">
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
          <p className={labelClass}>Resume *</p>
          <p className={hintClass}>Upload a PDF or Word document (maximum 4 MB).</p>
          <input
            {...register("resume")}
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="peer sr-only"
          />
          <label
            htmlFor="resume"
            className={cn(
              "flex items-center gap-4 rounded-xl border-2 border-dashed p-5 cursor-pointer transition-colors hover:bg-gray-50 peer-focus-visible:ring-2 peer-focus-visible:ring-[#062F29]",
              errors.resume
                ? "border-red-400"
                : resumeName
                  ? "border-[#062F29]/40"
                  : "border-gray-300",
            )}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ACF7B2]">
              {resumeName ? (
                <FileText size={22} className="text-[#062F29]" />
              ) : (
                <UploadSimple size={22} className="text-[#062F29]" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-heading truncate">
                {resumeName ?? "Upload your resume"}
              </span>
              <span className="block text-sm text-secondary">
                {resumeName
                  ? "Click to choose a different file"
                  : "PDF or Word document, up to 4MB"}
              </span>
            </span>
          </label>
          <FieldError message={errors.resume?.message as string | undefined} />
        </div>
        <div>
          <label htmlFor="portfolioUrl" className={labelClass}>
            {application.portfolio.label}
            {application.portfolio.required && " *"}
          </label>
          <p className={hintClass}>{application.portfolio.hint}</p>
          <input
            {...register("portfolioUrl")}
            type="url"
            id="portfolioUrl"
            placeholder="https://"
            className={cn(inputClass, errors.portfolioUrl ? "border-red-400" : "border-gray-300")}
          />
          <FieldError message={errors.portfolioUrl?.message} />
        </div>

      </Step>

      {application.steps.map((step, i) => (
        <Step key={step.title} number={i + 2} title={step.title}>
          {step.questions
            .filter((question) => isQuestionShown(question, answers))
            .map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                register={register}
                answer={answers[question.id]}
                error={errors.answers?.[question.id]?.message}
              />
            ))}
        </Step>
      ))}

      {application.video && (
        <Step number={application.steps.length + 2} title="A short video">
          <div>
            <label htmlFor="videoUrl" className={labelClass}>
              Video link *
            </label>
            <p className={hintClass}>{application.video.prompt}</p>
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
        </Step>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto h-12 px-8 bg-[#062F29] text-white rounded-lg text-base font-semibold transition-all duration-300 hover:rounded-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
