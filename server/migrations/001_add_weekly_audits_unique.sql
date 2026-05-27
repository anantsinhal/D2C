-- Migration: ensure weekly_audits has unique constraint on user_id
ALTER TABLE IF EXISTS public.weekly_audits
ADD CONSTRAINT IF NOT EXISTS weekly_audits_user_id_unique UNIQUE (user_id);
