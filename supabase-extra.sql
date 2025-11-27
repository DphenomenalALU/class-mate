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

-- 1c) Facilitator BYOK (Tavus + Resend)
create table if not exists public.facilitator_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tavus_api_key text,
  resend_api_key text,
  resend_from_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.facilitator_settings enable row level security;

drop policy if exists "Settings are manageable by owner" on public.facilitator_settings;

create policy "Settings are manageable by owner"
  on public.facilitator_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Facilitators can manage assistants" on public.assistants;

-- Any authenticated user can view assistants
create policy "Assistants viewable to authenticated users"
  on public.assistants for select
  using (auth.uid() is not null);

-- Only facilitators can manage assistants (all ops)
create policy "Facilitators can manage assistants"
  on public.assistants for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'facilitator'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'facilitator'
    )
  );

-- 2) Allow students to insert their own sessions
drop policy if exists "Students can insert their sessions" on public.sessions;

create policy "Students can insert their sessions"
  on public.sessions for insert
  with check (auth.uid() = student_id);

-- 3) Allow students to update their own sessions (e.g., rating)
drop policy if exists "Students can update their sessions" on public.sessions;

create policy "Students can update their sessions"
  on public.sessions for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);
