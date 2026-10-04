-- Suggestions for the partnership FAQ (willowed.org/one-goal-planning/faq).
-- Run once in the Supabase SQL editor.
--
-- People with the workspace passcode submit suggestions through the site,
-- which can only add rows. Only the GitHub Action that turns suggestions into
-- pull requests can read or update them, using the service role key, which
-- bypasses row level security. Nothing here is readable with the public key.

create table if not exists public.faq_suggestions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  item_id text not null check (char_length(item_id) between 1 and 200),
  question text not null check (char_length(question) between 1 and 300),
  current_answer text not null check (char_length(current_answer) <= 12000),
  suggested_answer text not null check (char_length(suggested_answer) between 1 and 12000),
  reason text not null check (char_length(reason) between 5 and 2000),
  suggested_by text not null check (char_length(suggested_by) between 2 and 100),
  -- new: waiting for the Action; opened: has a pull request; unmatched: the
  -- question no longer exists in the FAQ.
  status text not null default 'new' check (status in ('new', 'opened', 'unmatched')),
  pull_request_url text
);

alter table public.faq_suggestions enable row level security;

drop policy if exists "Partnership members can submit FAQ suggestions" on public.faq_suggestions;
create policy "Partnership members can submit FAQ suggestions"
  on public.faq_suggestions
  for insert
  to anon, authenticated
  with check (status = 'new' and pull_request_url is null);
