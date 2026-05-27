-- AETHERIS Supabase Database Schema (v2 additions)
-- Run AFTER supabase_schema.sql.
-- Adds intake, logs, plans, notifications, subscriptions, and optional vector (RAG) tables.

-- Optional: pgvector for embeddings (RAG)
-- Note: In Supabase, vector extension availability depends on project settings.
CREATE EXTENSION IF NOT EXISTS vector;

-- 4. Intake Assessments
CREATE TABLE IF NOT EXISTS public.intake_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  bmi NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.intake_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_assessments FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own intake"
  ON public.intake_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own intake"
  ON public.intake_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Water Logs
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  volume_ml INTEGER NOT NULL CHECK (volume_ml > 0),
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS water_logs_user_time_idx ON public.water_logs(user_id, logged_at DESC);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own water logs"
  ON public.water_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own water logs"
  ON public.water_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own water logs"
  ON public.water_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Food Logs
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  meal_type TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  estimated_calories INTEGER,
  diet_quality_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS food_logs_user_time_idx ON public.food_logs(user_id, logged_at DESC);

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own food logs"
  ON public.food_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own food logs"
  ON public.food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own food logs"
  ON public.food_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. Sleep Logs
CREATE TABLE IF NOT EXISTS public.sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_start TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_end TIMESTAMP WITH TIME ZONE NOT NULL,
  quality INTEGER CHECK (quality BETWEEN 1 AND 10),
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CHECK (sleep_end > sleep_start)
);

CREATE INDEX IF NOT EXISTS sleep_logs_user_time_idx ON public.sleep_logs(user_id, sleep_start DESC);

ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own sleep logs"
  ON public.sleep_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own sleep logs"
  ON public.sleep_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own sleep logs"
  ON public.sleep_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 8. Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  activity_type TEXT NOT NULL,
  duration_min INTEGER NOT NULL CHECK (duration_min > 0),
  intensity TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS activity_logs_user_time_idx ON public.activity_logs(user_id, logged_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own activity logs"
  ON public.activity_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 9. Plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  plan_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS plans_user_week_idx ON public.plans(user_id, week_start DESC);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own plans"
  ON public.plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own plans"
  ON public.plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own plans"
  ON public.plans FOR UPDATE
  USING (auth.uid() = user_id);

-- 10. Plan Items
CREATE TABLE IF NOT EXISTS public.plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS plan_items_user_time_idx ON public.plan_items(user_id, scheduled_at);

ALTER TABLE public.plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_items FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own plan items"
  ON public.plan_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own plan items"
  ON public.plan_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own plan items"
  ON public.plan_items FOR UPDATE
  USING (auth.uid() = user_id);

-- 11. Notification Jobs
CREATE TABLE IF NOT EXISTS public.notification_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  template TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'scheduled',
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS notification_jobs_user_time_idx ON public.notification_jobs(user_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS notification_jobs_status_time_idx ON public.notification_jobs(status, scheduled_at);

ALTER TABLE public.notification_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_jobs FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own notifications"
  ON public.notification_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own notifications"
  ON public.notification_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own notifications"
  ON public.notification_jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- 12. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_idx ON public.subscriptions(user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow users to view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own subscription"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own subscription"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- 13. Vector Documents (RAG)
-- If you do not plan to use RAG yet, you can skip creating this table.
-- Choose a dimension matching your embedding model (e.g. 384, 768, 1536).
CREATE TABLE IF NOT EXISTS public.vector_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(384),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS vector_documents_owner_idx ON public.vector_documents(owner_user_id);

ALTER TABLE public.vector_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vector_documents FORCE ROW LEVEL SECURITY;

-- Global docs: owner_user_id IS NULL, visible to all authenticated users
-- User docs: only visible to owner
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read global docs"
  ON public.vector_documents FOR SELECT
  USING (auth.role() = 'authenticated' AND owner_user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Allow users to read their own docs"
  ON public.vector_documents FOR SELECT
  USING (auth.uid() = owner_user_id);

CREATE POLICY IF NOT EXISTS "Allow users to insert their own docs"
  ON public.vector_documents FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY IF NOT EXISTS "Allow users to update their own docs"
  ON public.vector_documents FOR UPDATE
  USING (auth.uid() = owner_user_id);
