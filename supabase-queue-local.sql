-- Temporary local queue table used before full Supabase auth integration.
-- Run this in the Supabase SQL editor in addition to supabase-schema.sql.

create table if not exists public.session_queue_local (
  id uuid primary key default gen_random_uuid(),
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  student_client_id text not null,
  status text not null check (status in ('waiting', 'active', 'completed', 'cancelled')),
  position integer not null,
  created_at timestamptz not null default now()
);

alter table public.session_queue_local enable row level security;

create policy "Queue local selectable"
  on public.session_queue_local for select
  using (true);
