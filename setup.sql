-- ============================================================
-- setup.sql — Supabase Database Schema for Pixel Diary
-- Run this entire file in your Supabase SQL Editor:
--   Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- ── Profiles table ───────────────────────────────────────────
-- One row per user. id matches the auth.users UUID.
create table if not exists profiles (
  id          uuid references auth.users(id) primary key,
  username    text not null default '',
  email       text not null default '',
  bio         text default '',
  "avatarURL" text default '',
  "bannerURL" text default '',
  "createdAt" timestamp with time zone default now()
);

-- ── Games table ───────────────────────────────────────────────
create table if not exists games (
  id            uuid default gen_random_uuid() primary key,
  "userId"      uuid references auth.users(id) not null,
  title         text not null default '',
  genre         text default '',
  platform      text default '',
  status        text default 'plan-to-play',
  "hoursPlayed" float default 0,
  "coverURL"    text default '',
  favorite      boolean default false,
  rating        int default 0,
  "reviewText"  text default '',
  "reviewedAt"  timestamp with time zone,
  "mediaFiles"  jsonb default '[]',
  "createdAt"   timestamp with time zone default now(),
  "updatedAt"   timestamp with time zone default now()
);

-- ── Row Level Security ────────────────────────────────────────
-- Ensures users can only read/write their own data.
alter table profiles enable row level security;
alter table games    enable row level security;

-- Profiles: full access to own row only
create policy "profiles_own" on profiles
  for all using (auth.uid() = id);

-- Games: full access to own rows only
create policy "games_own" on games
  for all using (auth.uid() = "userId");

-- ── Storage Buckets ───────────────────────────────────────────
-- Create these two buckets manually in Supabase Dashboard:
--   Storage → New Bucket
--
-- Bucket 1: game-media  (public)  — screenshots & clips
-- Bucket 2: avatars     (public)  — profile avatars & banners
--
-- For each bucket, set the following Storage Policy in the
-- Supabase Dashboard under Storage → [bucket] → Policies:
--
--   Policy name : users_own_files
--   Allowed operation : SELECT, INSERT, UPDATE, DELETE
--   Policy definition:
--     (auth.uid()::text = (storage.foldername(name))[1])