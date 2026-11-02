-- LEOOSTORE.id Portfolio — Supabase schema
-- Run in Supabase SQL Editor. Create the owner account in Auth first,
-- then add its UUID to portfolio_admins using the SQL snippet in README.md.

create extension if not exists pgcrypto;

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'web'
    check (category in ('ecommerce', 'business', 'web')),
  short_description text not null default '',
  thumbnail_url text,
  live_url text,
  repository_url text,
  status text not null default 'published'
    check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  quote text not null,
  project_name text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Explicit allowlist: only user IDs added here are portfolio administrators.
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_projects_public_order
  on public.portfolio_projects (status, sort_order, created_at desc);

alter table public.portfolio_projects enable row level security;
alter table public.portfolio_testimonials enable row level security;
alter table public.portfolio_admins enable row level security;

drop policy if exists "Public can read published projects" on public.portfolio_projects;
create policy "Public can read published projects"
  on public.portfolio_projects for select
  using (status = 'published');

drop policy if exists "Public can read published testimonials" on public.portfolio_testimonials;
create policy "Public can read published testimonials"
  on public.portfolio_testimonials for select
  using (is_published = true);

drop policy if exists "Admins can manage projects" on public.portfolio_projects;
create policy "Admins can manage projects"
  on public.portfolio_projects for all
  to authenticated
  using (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can manage testimonials" on public.portfolio_testimonials;
create policy "Admins can manage testimonials"
  on public.portfolio_testimonials for all
  to authenticated
  using (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));

-- Admins can read only their own membership row. No client policy permits
-- inserting, updating, or deleting admin memberships.
drop policy if exists "Admins can read own membership" on public.portfolio_admins;
create policy "Admins can read own membership"
  on public.portfolio_admins for select
  to authenticated
  using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('portfolio-thumbnails', 'portfolio-thumbnails', true)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio thumbnails" on storage.objects;
create policy "Public can view portfolio thumbnails"
  on storage.objects for select
  using (bucket_id = 'portfolio-thumbnails');

drop policy if exists "Admins can upload portfolio thumbnails" on storage.objects;
create policy "Admins can upload portfolio thumbnails"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-thumbnails'
    and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid())
  );

drop policy if exists "Admins can update portfolio thumbnails" on storage.objects;
create policy "Admins can update portfolio thumbnails"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio-thumbnails'
    and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid())
  )
  with check (
    bucket_id = 'portfolio-thumbnails'
    and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid())
  );

drop policy if exists "Admins can delete portfolio thumbnails" on storage.objects;
create policy "Admins can delete portfolio thumbnails"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio-thumbnails'
    and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid())
  );
