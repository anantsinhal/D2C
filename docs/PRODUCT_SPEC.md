# AETHERIS — Product Specification (v2)

Goal
- Evolve the simple health-check into a SaaS-grade Personalized Health Coaching platform.
- Keep the existing UI look and color palette; expand features, data model, and backend automation.

Core capabilities
1. Deep intake and scoring
   - Collect: demographics, height/weight, medical flags, medications, sleep patterns, diet and meal frequency, water intake, activity, stress, goals, optional biomarkers (HRV, glucose).
   - Compute: BMI, hydration adequacy, diet quality proxy (frequency of whole foods/processed foods), sleep score (duration + quality + circadian alignment), activity score, stress score.
   - Produce: composite health score (0-100) and per-domain ratings (Poor / Fair / Good / Excellent).

2. Weekly planner + subscriptions
   - Generate personalized weekly plans: meals suggestions, hydration schedule (timed reminders), sleep window recommendations (bedtime and wake windows), micro exercises, breathing/meditation sessions.
   - Subscription tiers: free (basic score + static tips), monthly paid (full weekly planner + reminders + chat credits), premium (coach sessions, labs integrations).

3. Notifications & automation
   - Schedule reminders for water, meals, bedtime, medication, and habit nudges.
   - Channels: email (SMTP/SendGrid), SMS (Twilio optional), Web Push (service worker), in-app notifications.

4. Conversational assistant (Chatbot)
   - RAG-enabled assistant that answers queries about user data, explains scores, and provides evidence-backed recommendations with citations.
   - Option to escalate to human coach (premium) or provide referrals.

5. Analytics & admin
   - Aggregate metrics, cohort improvements, retention, plan adherence, and KPI dashboards.

Privacy & compliance
- Encrypt in transit (HTTPS) and at rest (DB encryption where available).
- Use RLS and strict access controls for per-user data (Supabase/Postgres RLS).
- Data export & deletion endpoints; explicit consent flows.
- If handling PHI/HIPAA, choose providers with BAA and hardened infra.

UI guidelines
- Preserve color palette and overall look — small progressive enhancements only.
- Interactive onboarding wizard (multi-step), clear CTA, accessible components, and helpful tooltips with evidence links.

Data model (summary)
- User identity: Supabase Auth (`auth.users`)
- `profiles` (existing): demographics + preferences (timezone)
- `intake_assessments`: raw intake answers + computed domain scores (+ BMI)
- Logs: `water_logs`, `food_logs`, `sleep_logs`, `activity_logs` (time-series)
- `weekly_audits`: aggregated weekly scores + audit summaries
- Planning: `plans` + `plan_items` for a structured weekly schedule
- Notifications: `notification_jobs` for scheduled reminders
- Billing: `subscriptions` (provider shadow, Stripe-ready)
- RAG: `vector_documents` (pgvector) for knowledge base and user notes

Scoring model (initial v1)
- Composite score is a weighted sum of domain scores (0-100).
- Domains and examples:
   - BMI: based on BMI bands (underweight/normal/overweight/obese) + age context.
   - Hydration: target ml/day from weight + activity; score from adherence.
   - Sleep: duration + self-reported quality + consistency.
   - Circadian: regular wake time + morning light exposure + evening screen/caffeine habits.
   - Diet: proxies from food frequency (whole-food vs ultra-processed) + protein/fiber check.
   - Activity: minutes/week + intensity mix.
   - Stress: self-report + recovery behaviors.

Note: This is coaching guidance, not medical diagnosis.

APIs (examples)
- POST /api/intake -> record intake, compute scores, return plan preview
- GET /api/dashboard/:id -> profile + latest weekly audit + daily actions
- POST /api/plans/:id/complete -> mark action complete
- POST /api/notifications/schedule -> schedule reminders
- POST /api/chat/:id -> chat endpoint (RAG)

AI stack (high level)
- Use embeddings + vector DB (pgvector) for retrieval.
- Use local open models (Llama/GPT4All) or hosted HF/Replicate for LLM.
- LangChain-style orchestration for prompts + context assembly.

Integrations (priority)
- Supabase (auth + Postgres) — keep as primary DB
- pgvector extension for vector search
- SendGrid/Mailgun for email
- Twilio (optional) for SMS
- Stripe for billing
- Redis + BullMQ for background scheduling

Next steps
- Implement DB schema and ingestion API (I can scaffold SQL + backend endpoints next).

Related docs
- docs/DELIVERY_PACKAGE.md — user-provided delivery/roadmap outline

Design notes
- Keep UI colors and theme.
- Start with email reminders first to reduce cost; add SMS later.
- Make chatbot optional behind subscription if LLM costs are significant.

References & reading
- Sleep and circadian: consensus articles (e.g., Czeisler et al.), American Academy of Sleep Medicine guidelines.
- Hydration: EFSA/Institute of Medicine recommendations.
- Nutrition proxies: NOVA food classification for processing levels; Mediterranean diet principles.
