-- Additional schema updates for ClassMate
-- Run this in the Supabase SQL editor after supabase-schema.sql and supabase-queue-local.sql

-- 1) Dynamic prompt and context per assistant
alter table public.assistants
  add column if not exists system_prompt text,
  add column if not exists context text;

-- 1b) Store richer profile information for auth users
alter table public.profiles
  add column if not exists email text,
  add column if not exists first_name text,
  add column if not exists last_name text;

-- 2) Allow students to insert their own sessions
drop policy if exists "Students can insert their sessions" on public.sessions;

create policy "Students can insert their sessions"
  on public.sessions for insert
  with check (auth.uid() = student_id);

-- 2) (Optional) You can create a public storage bucket named `course-materials`
-- from the Supabase Storage UI. Tavus will fetch documents from this bucket.
