-- LEOOSTORE.id Portfolio — initial Supabase schema
-- Run this in Supabase SQL Editor after creating your project.
-- Auth users are managed through Supabase Auth. This table stores portfolio content.

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

create index if not exists portfolio_projects_public_order
  on public.portfolio_projects (status, sort_order, created_at desc);

alter table public.portfolio_projects enable row level security;
alter table public.portfolio_testimonials enable row level security;

-- Public visitors can read only published portfolio projects and testimonials.
drop policy if exists "Public can read published projects" on public.portfolio_projects;
create policy "Public can read published projects"
  on public.portfolio_projects for select
  using (status = 'published');

drop policy if exists "Public can read published testimonials" on public.portfolio_testimonials;
create policy "Public can read published testimonials"
  on public.portfolio_testimonials for select
  using (is_published = true);

-- Authenticated users can manage content in this first-owner-only setup.
-- For production, restrict writes to a dedicated admin identity/role.
drop policy if exists "Authenticated admins can manage projects" on public.portfolio_projects;
create policy "Authenticated admins can manage projects"
  on public.portfolio_projects for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Authenticated admins can manage testimonials" on public.portfolio_testimonials;
create policy "Authenticated admins can manage testimonials"
  on public.portfolio_testimonials for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Create a public Storage bucket for portfolio thumbnails.
insert into storage.buckets (id, name, public)
values ('portfolio-thumbnails', 'portfolio-thumbnails', true)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio thumbnails" on storage.objects;
create policy "Public can view portfolio thumbnails"
  on storage.objects for select
  using (bucket_id = 'portfolio-thumbnails');

drop policy if exists "Authenticated users can upload portfolio thumbnails" on storage.objects;
create policy "Authenticated users can upload portfolio thumbnails"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-thumbnails' and auth.uid() is not null);

drop policy if exists "Authenticated users can update portfolio thumbnails" on storage.objects;
create policy "Authenticated users can update portfolio thumbnails"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-thumbnails' and auth.uid() is not null)
  with check (bucket_id = 'portfolio-thumbnails' and auth.uid() is not null);

drop policy if exists "Authenticated users can delete portfolio thumbnails" on storage.objects;
create policy "Authenticated users can delete portfolio thumbnails"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-thumbnails' and auth.uid() is not null);
