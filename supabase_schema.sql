-- AETHERIS Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up tables, enable RLS, and establish Row Level Security policies.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Profiles Table (Stores user demographics and primary focus settings)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    sleep_hours NUMERIC NOT NULL,
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality BETWEEN 1 AND 10),
    stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 10),
    activity_level TEXT NOT NULL,
    primary_goal TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow users to view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. Create Daily Actions Table (Stores checklist protocols)
CREATE TABLE IF NOT EXISTS public.daily_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, date)
);

-- Enable RLS for Daily Actions
ALTER TABLE public.daily_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_actions FORCE ROW LEVEL SECURITY;

-- Daily Actions Policies
CREATE POLICY "Allow users to view their own actions" 
    ON public.daily_actions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create their own actions" 
    ON public.daily_actions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own actions" 
    ON public.daily_actions FOR UPDATE 
    USING (auth.uid() = user_id);

-- 3. Create Weekly Audits Table (Stores weekly diagnostic summaries)
CREATE TABLE IF NOT EXISTS public.weekly_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_wellness_score INTEGER NOT NULL,
    sleep_audit JSONB NOT NULL DEFAULT '{}'::jsonb,
    stress_audit JSONB NOT NULL DEFAULT '{}'::jsonb,
    activity_audit JSONB NOT NULL DEFAULT '{}'::jsonb,
    energy_audit JSONB NOT NULL DEFAULT '{}'::jsonb,
    biggest_win TEXT NOT NULL,
    biggest_opportunity TEXT NOT NULL,
    focus_for_next_week JSONB NOT NULL DEFAULT '[]'::jsonb,
    progress_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS weekly_audits_user_id_idx
    ON public.weekly_audits (user_id);

-- Enable RLS for Weekly Audits
ALTER TABLE public.weekly_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_audits FORCE ROW LEVEL SECURITY;

-- Weekly Audits Policies
CREATE POLICY "Allow users to view their own audits" 
    ON public.weekly_audits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create their own audits" 
    ON public.weekly_audits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own audits" 
    ON public.weekly_audits FOR UPDATE 
    USING (auth.uid() = user_id);
