// Stages a job application moves through in /careers-management, in order.
// The ids must match the check constraint on job_applications.stage.

export const HIRING_STAGES = [
  { id: "screening", label: "Screening", dot: "bg-gray-400" },
  { id: "phone", label: "Phone", dot: "bg-sky-500" },
  { id: "video", label: "Video", dot: "bg-indigo-500" },
  { id: "work_sample", label: "Work Sample", dot: "bg-amber-500" },
  { id: "final", label: "Final", dot: "bg-purple-500" },
  { id: "hired", label: "Hired", dot: "bg-green-600" },
] as const;

export const REJECTED_STAGE = { id: "rejected", label: "Rejected", dot: "bg-red-500" } as const;

export const ALL_STAGES = [...HIRING_STAGES, REJECTED_STAGE];

export type StageId = (typeof ALL_STAGES)[number]["id"];

export function getStage(id: StageId) {
  return ALL_STAGES.find((stage) => stage.id === id) ?? HIRING_STAGES[0];
}

// The stage after `id`, or null for Hired and Rejected.
export function getNextStage(id: StageId) {
  const index = HIRING_STAGES.findIndex((stage) => stage.id === id);
  if (index === -1 || index === HIRING_STAGES.length - 1) return null;
  return HIRING_STAGES[index + 1];
}
