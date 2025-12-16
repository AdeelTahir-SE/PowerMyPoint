-- Database Schema for PowerMyPoint

-- 1. User Table
-- Stores user profile and subscription tier
create table public."User" (
  user_id uuid not null default gen_random_uuid (),
  email text not null,
  name text null,
  profile_image text null,
  tier_plan text null default 'free'::text, -- 'free' or 'pro'
  created_at timestamp with time zone not null default now(),
  constraint User_pkey primary key (user_id),
  constraint User_email_key unique (email)
);

-- 2. Presentation Table
-- Stores the generated presentation DSL and metadata
create table public."Presentation" (
  presentation_id uuid not null default gen_random_uuid (),
  owner_id uuid not null,
  prompts text[] null,
  presentation_data jsonb not null, -- Contains { dsl: string, is_public: boolean }
  is_public boolean not null default true, -- Extracted column for easier filtering
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint Presentation_pkey primary key (presentation_id),
  constraint Presentation_owner_id_fkey foreign key (owner_id) references public."User" (user_id)
);

-- 3. Presentation Stats Table
-- Stores analytics (likes, views)
create table public."PresentationStats" (
  stat_id uuid not null default gen_random_uuid (),
  presentation_id uuid not null,
  likes integer not null default 0,
  views integer not null default 0,
  constraint PresentationStats_pkey primary key (stat_id),
  constraint PresentationStats_presentation_id_fkey foreign key (presentation_id) references public."Presentation" (presentation_id) on delete cascade
);

-- Indexes for performance
create index idx_presentation_owner_id on public."Presentation" (owner_id);
create index idx_presentation_created_at on public."Presentation" (created_at);
