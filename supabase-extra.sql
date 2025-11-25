-- Additional schema updates for ClassMate
-- Run this in the Supabase SQL editor after supabase-schema.sql and supabase-queue-local.sql

-- 1) Dynamic prompt and context per assistant
alter table public.assistants
  add column if not exists system_prompt text,
  add column if not exists context text;

-- 2) (Optional) You can create a public storage bucket named `course-materials`
-- from the Supabase Storage UI. Tavus will fetch documents from this bucket.

