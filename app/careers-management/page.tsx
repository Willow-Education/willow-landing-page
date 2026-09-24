"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { JOBS, getJobMeta } from "@/lib/data/jobs";

export default function CareersManagementPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from("job_applications")
      .select("job_slug")
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error:", error);
          setError("Couldn't load application counts.");
          return;
        }
        const next: Record<string, number> = {};
        for (const row of data) {
          next[row.job_slug] = (next[row.job_slug] ?? 0) + 1;
        }
        setCounts(next);
      });
  }, []);

  return (
    <main className="max-w-3xl w-full mx-auto px-5 md:px-8 py-10 md:py-14">
      <h1 className="font-heading text-2xl md:text-3xl font-medium text-heading mb-8">Jobs</h1>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <ul className="border-t border-gray-200">
        {JOBS.map((job) => {
          const count = counts?.[job.slug] ?? 0;
          return (
            <li key={job.slug} className="border-b border-gray-200">
              <Link
                href={`/careers-management/${job.slug}`}
                className="group flex items-center justify-between gap-4 py-5"
              >
                <div>
                  <h2 className="font-heading text-lg font-medium text-heading group-hover:text-content-link transition-colors">
                    {job.title}
                  </h2>
                  <p className="text-secondary text-sm mt-1">
                    {getJobMeta(job)}
                    {!job.open && " · Closed"}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-secondary">
                  {counts === null ? "–" : `${count} ${count === 1 ? "applicant" : "applicants"}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
