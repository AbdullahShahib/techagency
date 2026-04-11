-- Run this in Supabase SQL Editor
-- Creates tables, RLS policies, and storage policies for the current admin UI.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.clients (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.team (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.blog (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.seo (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.case_studies (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.jobs (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

do $$
declare
  t text;
  tables text[] := array['projects','services','testimonials','clients','team','blog','seo','case_studies','jobs','settings'];
begin
  foreach t in array tables
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I;', t, t);
    execute format('create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;

-- Enable RLS and policies

do $$
declare
  t text;
  tables text[] := array['projects','services','testimonials','clients','team','blog','seo','case_studies','jobs','settings'];
begin
  foreach t in array tables
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "%s public read" on public.%I;', t, t);
    execute format('drop policy if exists "%s auth write" on public.%I;', t, t);
    execute format('create policy "%s public read" on public.%I for select using (true);', t, t);
    execute format('create policy "%s auth write" on public.%I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'');', t, t);
  end loop;
end $$;

-- Storage bucket + policies
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
drop policy if exists "media auth write" on storage.objects;

create policy "media public read"
on storage.objects
for select
using (bucket_id = 'media');

create policy "media auth write"
on storage.objects
for all
using (bucket_id = 'media' and auth.role() = 'authenticated')
with check (bucket_id = 'media' and auth.role() = 'authenticated');
