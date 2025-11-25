-- Supabase schema for ClassMate v1.0

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('student', 'facilitator')) not null default 'student',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create table public.assistants (
  id uuid primary key default gen_random_uuid(),
  course_code text not null,
  name text not null,
  tavus_persona_id text not null,
  tavus_replica_id text not null,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.assistants enable row level security;

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

create table public.assistant_documents (
  id uuid primary key default gen_random_uuid(),
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  tavus_document_id text not null,
  document_name text not null,
  document_url text not null,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.assistant_documents enable row level security;

create policy "Facilitators can manage assistant documents"
  on public.assistant_documents for all
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

create table public.assistant_notes (
  id uuid primary key default gen_random_uuid(),
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  title text not null,
  body text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.assistant_notes enable row level security;

create policy "Facilitators can manage assistant notes"
  on public.assistant_notes for all
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

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  student_id uuid not null references public.profiles(id),
  status text not null check (status in ('queued', 'active', 'completed', 'escalated')),
  tavus_conversation_id text,
  conversation_url text,
  started_at timestamptz,
  ended_at timestamptz,
  rating integer check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Students can see their own sessions"
  on public.sessions for select
  using (auth.uid() = student_id);

create policy "Facilitators can see sessions for their assistants"
  on public.sessions for select
  using (
    exists (
      select 1
      from public.assistants a
      join public.profiles p on p.id = a.created_by
      where a.id = sessions.assistant_id
      and p.id = auth.uid()
      and p.role = 'facilitator'
    )
  );

create table public.session_queue (
  id uuid primary key default gen_random_uuid(),
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  student_id uuid not null references public.profiles(id),
  status text not null check (status in ('waiting', 'promoted', 'cancelled')),
  position integer not null,
  created_at timestamptz not null default now()
);

alter table public.session_queue enable row level security;

create policy "Students see their own queue entries"
  on public.session_queue for select
  using (auth.uid() = student_id);

create table public.escalations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  assistant_id uuid not null references public.assistants(id) on delete cascade,
  student_id uuid not null references public.profiles(id),
  source text not null check (source in ('student', 'llm')),
  reason text,
  status text not null check (status in ('open', 'resolved')) default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.escalations enable row level security;

create policy "Students can see their own escalations"
  on public.escalations for select
  using (auth.uid() = student_id);

create policy "Facilitators can manage escalations for their assistants"
  on public.escalations for all
  using (
    exists (
      select 1
      from public.assistants a
      join public.profiles p on p.id = a.created_by
      where a.id = escalations.assistant_id
      and p.id = auth.uid()
      and p.role = 'facilitator'
    )
  )
  with check (
    exists (
      select 1
      from public.assistants a
      join public.profiles p on p.id = a.created_by
      where a.id = escalations.assistant_id
      and p.id = auth.uid()
      and p.role = 'facilitator'
    )
  );

