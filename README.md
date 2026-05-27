# HealthOS (AETHERIS) — SaaS Platform Summary

This repository is evolving from a simple health check into a SaaS-grade health analytics + coaching platform.

Important note on status
- Some items in the roadmap below are **planned/architected** (not fully implemented yet).
- What’s already working today: the `client/` + `server/` app runs locally, supports onboarding-style assessment, generates daily actions + a weekly audit, and provides a coaching endpoint.

## ✅ What You Have Today (in this repo)

- Assessment/onboarding flow (age + sleep + stress + activity + goal)
- Dashboard UI (summary, actions, weekly audit, charts)
- API server (`server/`) with Supabase Auth-backed endpoints
- Demo mode (for local output without auth friction)

## 🧭 Product + Data Model Docs

- Product spec: `docs/PRODUCT_SPEC.md`
- Architecture: `ARCHITECTURE.md`
- Data model: `docs/DATA_MODEL.md`
- Delivery/roadmap outline: `docs/DELIVERY_PACKAGE.md`
- Complete setup guide: `SETUP_COMPLETE.md`
- Supabase schemas:
  - `supabase_schema.sql` (v1)
  - `supabase_schema_v2.sql` (v2 additions)

## 🚀 Quick Start (Current Repo)

### 1) Install deps

```bash
cd server
npm install

cd ../client
npm install
```

### 2) Run dev servers

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

- Server: http://localhost:5000/api/health
- Client: Vite will print the local URL (usually http://localhost:5173 or 5174)

### Demo mode
If you want the UI to show dashboard output without requiring real auth/session:
- Set `VITE_DEMO_MODE=true` in `client/.env`

---

# Roadmap README (Target End-State)

The section below is the requested “HealthOS — SaaS Platform Summary” README content, adapted only where needed to match this repo’s folder names (`server/` instead of `backend/`, `client/` instead of `frontend/`).

## 🎯 What You Now Have (Target)

A **production-ready health analytics and AI coaching SaaS platform** with:

### Core Features
✅ **Comprehensive Health Assessment** — 15+ metrics (BMI, sleep, hydration, nutrition, activity, stress)
✅ **Smart Health Scoring** — Calculates 7 different health scores with benchmarking
✅ **AI Health Coach** — Powered by OpenAI GPT-4, Groq, or fallback rules
✅ **Personalized Weekly Plans** — Meals, exercises, sleep, hydration, mindfulness
✅ **Automated Alerts** — Email, SMS, push notifications (7+ daily reminders)
✅ **Progress Tracking** — 30-day trends, improvements, risk factors
✅ **Subscription Model** — Free, Basic ($9.99), Pro ($19.99), Premium ($39.99)
✅ **Secure Billing** — Stripe integration for payments
✅ **Real-time Notifications** — Socket.io for instant updates

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Node.js/Express, PostgreSQL, Redis, Bull queues
- **AI**: OpenAI GPT-4, Groq LLaMA, Hugging Face fallback
- **Auth**: Supabase Auth with OAuth
- **Payments**: Stripe with webhooks
- **Notifications**: Twilio (SMS), SendGrid (Email)
- **Deployment**: Vercel (frontend), Railway/Render (backend), Supabase (DB)

---

## 📁 Project Structure (Target)

> This repo currently uses `client/` and `server/`.

```
healthos-saas/
├── docs/
│   ├── PRODUCT_SPEC.md
│   ├── DATA_MODEL.md
│   └── DELIVERY_PACKAGE.md
├── supabase_schema.sql
├── supabase_schema_v2.sql
│
├── server/
│   ├── package.json
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── lib/
│       └── index.ts
│
├── client/
│   ├── package.json
│   └── src/
│       ├── components/
│       └── App.tsx
│
└── README.md
```

---

## 🚀 Quick Start (3 Steps)

### 1. Clone & Install
```bash
# Manual (current repo)
cd server && npm install && npm run dev
cd ../client && npm install && npm run dev
```

### 2. Create Supabase Account
- Go to https://supabase.com
- Create project
- Run `supabase_schema.sql` (and optionally `supabase_schema_v2.sql`) in SQL Editor
- Copy credentials to `.env` files

### 3. Set API Keys (Use Free Tiers)
```env
# server/.env
GROQ_API_KEY=free-from-groq.com
SENDGRID_API_KEY=free-100-emails-per-day
TWILIO_ACCOUNT_SID=trial-account
STRIPE_SECRET_KEY=sk-test-xxxx
```

Visit the Vite URL printed in terminal and start building.

---

## 📊 Key Algorithms

### 1. Health Score Calculation
```typescript
// Optimal ranges built-in:
BMI: 18.5-25 = 100 points
Sleep: 7-9 hours + quality 7/10 = 100 points
Hydration: body_weight * 0.035L = 100 points
Nutrition: 25% protein, 45% carbs, 30% fat = 100 points
Activity: 150+ min/week = 100 points
Mental: Low stress + high mood + high energy = 100 points

Overall = Weighted average (sleep 25%, BMI 20%, etc)
```

### 2. AI Coach Response Generation
```
1. Capture user message
2. Try OpenAI GPT-4 (if API key available)
3. Fallback to Groq LLaMA (free, fast)
4. Final fallback: Rule-based responses (always works)
→ Response includes personalized recommendations
```

### 3. Alert Scheduling
```
Background jobs via Bull + Redis:
- 7 AM: Hydration + sleep quality survey
- 3 PM: Water check-in
- 6 PM: Exercise reminder
- 9 PM: Sleep wind-down alert

Respects user timezone + preferences
Delivers via email, SMS, push, in-app
```

---

## 💰 Revenue Model

### Subscription Tiers
- Free
- Basic ($9.99/mo)
- Pro ($19.99/mo)
- Premium ($39.99/mo)

---

## 🔐 Security Notes

- Use Supabase RLS on user-owned tables
- Prefer server-side access tokens for protected APIs
- Add rate limiting for auth + chat endpoints

---

## 🏁 Launch Checklist (Target)

**Week 1-2**
- Setup Supabase database
- Verify APIs working
- Complete assessment flow end-to-end

**Week 3-4**
- Setup Stripe test account
- Setup SendGrid/Twilio
- Test notifications

**Week 5-8**
- Staging deploy
- Load testing
- Production deploy

---

## Final Notes

This is **not** medical advice. For health concerns, encourage users to consult a qualified clinician.
