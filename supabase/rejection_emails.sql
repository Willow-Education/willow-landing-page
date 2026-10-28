-- Tracks which staff member sent a rejected candidate their rejection email,
-- shown on the Rejected tab of /careers-management. Run once in the Supabase
-- SQL editor. Row-level security already lets staff update job_applications
-- ("Willow staff can move candidates between stages"), but updates are also
-- limited by column, so the new columns need their own grant.

alter table public.job_applications
  add column if not exists rejection_email_sent_by text
    check (rejection_email_sent_by in ('Ryan', 'Jessica')),
  add column if not exists rejection_email_sent_at timestamptz;

grant update (rejection_email_sent_by, rejection_email_sent_at)
  on public.job_applications to authenticated;

notify pgrst, 'reload schema';
