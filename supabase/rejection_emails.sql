-- Tracks which staff member sent a rejected candidate their rejection email,
-- shown on the Rejected tab of /careers-management. Run once in the Supabase
-- SQL editor. Staff already update job_applications through the existing
-- "Willow staff can move candidates between stages" policy.

alter table public.job_applications
  add column if not exists rejection_email_sent_by text
    check (rejection_email_sent_by in ('Ryan', 'Jessica')),
  add column if not exists rejection_email_sent_at timestamptz;

notify pgrst, 'reload schema';
