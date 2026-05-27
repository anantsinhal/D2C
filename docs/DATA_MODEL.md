# AETHERIS — Data Model (v2)

This document defines the core tables for a SaaS-grade personalized health coaching platform.

Principles
- **Per-user isolation**: every user-owned table has `user_id` and is protected by RLS (`auth.uid() = user_id`).
- **Append-first logs**: water/food/sleep/activity are time-series; updates are allowed but inserts are the default.
- **Derived artifacts**: weekly audits and plans are computed and can be regenerated.
- **Timezone correctness**: store `timestamptz` for events; store `timezone` on profile.

## Existing tables (v1)
- `profiles` (id PK = auth.users.id)
- `daily_actions` (unique user_id+date)
- `weekly_audits` (should be unique per user or per week, depending on roadmap)

## New tables (v2)

### 1) `intake_assessments`
One row per intake submission.
- `id uuid` PK
- `user_id uuid` FK -> auth.users
- `answers jsonb` raw intake answers (the full wizard payload)
- `scores jsonb` derived domain scores and composite score
- `bmi numeric` computed at time of assessment
- `created_at timestamptz`

### 2) `water_logs`
- `id uuid` PK
- `user_id uuid` FK
- `logged_at timestamptz` when consumed
- `volume_ml integer` (e.g. 250)
- `source text` (manual/device)

### 3) `food_logs`
- `id uuid` PK
- `user_id uuid` FK
- `logged_at timestamptz`
- `meal_type text` (breakfast/lunch/dinner/snack)
- `items jsonb` (array of {name, quantity, unit, notes})
- `estimated_calories integer` optional
- `diet_quality_tags text[]` optional (e.g. ['whole_food','processed'])

### 4) `sleep_logs`
- `id uuid` PK
- `user_id uuid` FK
- `sleep_start timestamptz`
- `sleep_end timestamptz`
- `quality integer` (1-10)
- `notes text` optional
- `source text` (manual/device)

### 5) `activity_logs`
- `id uuid` PK
- `user_id uuid` FK
- `logged_at timestamptz`
- `activity_type text` (walk/strength/zone2/yoga/etc)
- `duration_min integer`
- `intensity text` (low/medium/high)

### 6) `plans`
Generated weekly plan, tied to subscription tier.
- `id uuid` PK
- `user_id uuid` FK
- `week_start date`
- `status text` (active/completed/archived)
- `plan_json jsonb` the full plan
- `created_at timestamptz`
- Unique: (`user_id`, `week_start`)

### 7) `plan_items`
Actionable items shown in UI (hydration, meals, bedtime alarms, workouts).
- `id uuid` PK
- `plan_id uuid` FK -> plans
- `user_id uuid` FK (denormalized for RLS simplicity)
- `scheduled_at timestamptz`
- `category text` (water/food/sleep/activity/stress)
- `title text`
- `details text`
- `completed_at timestamptz` nullable

### 8) `notification_jobs`
Represents scheduled reminders.
- `id uuid` PK
- `user_id uuid` FK
- `channel text` (email/sms/push/inapp)
- `scheduled_at timestamptz`
- `template text` (water_reminder, bedtime, etc)
- `payload jsonb`
- `status text` (scheduled/sent/failed/canceled)
- `last_error text` nullable

### 9) `subscriptions`
Server-side shadow of Stripe (or other billing provider).
- `id uuid` PK
- `user_id uuid` FK
- `provider text` default 'stripe'
- `provider_customer_id text`
- `provider_subscription_id text`
- `tier text` (free/basic/premium)
- `status text` (active/past_due/canceled)
- `current_period_end timestamptz` nullable

### 10) `vector_documents` (RAG)
A knowledge-base document (and optionally user-specific notes) indexed with embeddings.
- `id uuid` PK
- `owner_user_id uuid` nullable (null = global doc)
- `source text` (pubmed/url/manual)
- `title text`
- `content text`
- `metadata jsonb`
- `embedding vector(N)` (requires pgvector extension)
- `created_at timestamptz`

## Scoring outputs (shape)
In `intake_assessments.scores` store:
- `compositeScore`: 0-100
- `domains`: { bmi, hydration, diet, sleep, circadian, activity, stress } each with {score:0-100, label:'Poor'|'Fair'|'Good'|'Excellent', notes:string[] }

## Notes on weekly audits
- v2 should ideally be **unique per (user_id, week_start)** to allow historical trend lines.
- If you keep a single row per user for now, store timeline history in JSON, but plan to migrate later.
