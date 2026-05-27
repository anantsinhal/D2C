# HealthOS SaaS Platform — Complete Setup & Deployment Guide

> Status note (this repo)
>
>- The **local dev setup** below is accurate for this repository today (`server/` + `client/`, API base `/api`).
>- Sections that mention **Redis/Bull, Twilio/SendGrid, Stripe, wearable APIs, Cypress/Jest** are **target/planned** and not fully implemented in this codebase yet.

## 🚀 Quick Start (Current Repo, ~10–20 minutes)

### Prerequisites
- Node.js 18+
- Git
- (Recommended) A Supabase project (free tier)

### 1) Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2) Configure environment variables

#### Server env (`server/.env`)
Copy from the example and fill in Supabase values:

```bash
cd server
cp .env.example .env
```

Required keys (match `server/.env.example`):
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
```

#### Client env (`client/.env`)

```bash
cd client
cp .env.example .env
```

Required keys (match `client/.env.example`):
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_BASE_URL=http://localhost:5000
```

Optional (useful for local demo output without auth/session friction):
```env
VITE_DEMO_MODE=true
```

### 3) Start dev servers

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

### 4) Test the setup

- API health: `http://localhost:5000/api/health`

PowerShell quick check:
```powershell
Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

---

## 🗄️ Database Setup

### Option A: Use Supabase (recommended)

1. Create a project at https://supabase.com
2. Open the SQL editor
3. Run the schema file(s) from the repo root:
   - `supabase_schema.sql` (v1)
   - `supabase_schema_v2.sql` (optional v2 additions)
4. Copy the project URL + keys into `server/.env` and `client/.env`.

### Option B: Local Postgres (advanced / target)

This repo currently assumes Supabase (Auth + DB) flows. If you want a fully local Postgres workflow, you’ll need to add migrations and swap Supabase calls for direct DB access.

---

# Target SaaS Guide (Planned / Expanded)

The remaining content is your “Setup Complete” package, lightly adapted so folder names and API bases match this repository (`server/` + `client/`, `/api`).

## Required API Keys (Free Tier Available)

- **Supabase** (PostgreSQL + Auth + Storage): https://supabase.com (free)
- **Gemini** (AI Coach - optional, current integration): Google AI Studio (API key)
- **OpenAI** (optional future): https://platform.openai.com (pay-as-you-go)
- **Groq** (optional future): https://groq.com (free fallback)
- **Twilio** (future SMS): https://twilio.com (trial)
- **SendGrid** (future Email): https://sendgrid.com (free tier)
- **Stripe** (future Payments): https://stripe.com

---

## 📦 Installation

### 1. Clone & Setup Repository

```bash
git clone <your-healthos-repo>
cd <repo-root>

# Server setup
cd server
cp .env.example .env
npm install

# Client setup
cd ../client
cp .env.example .env
npm install

cd ..
```

### 2. Environment Variables

#### Server `server/.env`

Minimum required for this repo today:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
```

Optional (current AI coach integration):
```env
GEMINI_API_KEY=your-key
GEMINI_MODEL=models/text-bison-001
```

Planned / future (not wired end-to-end in this repo yet):
```env
# Notifications
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@healthos.app

# Payments
STRIPE_SECRET_KEY=sk-xxx
STRIPE_PUBLISHABLE_KEY=pk-xxx
STRIPE_WEBHOOK_SECRET=whsec-xxx

# Redis / queues
REDIS_URL=redis://localhost:6379

# Frontend URL (used for CORS allowlist)
FRONTEND_URL=http://localhost:5173
```

#### Client `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_DEMO_MODE=true
```

---

## 3. Database Setup

### Option A: Use Supabase (Easiest)

1. Create account at https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Run `supabase_schema.sql` (and optionally `supabase_schema_v2.sql`)
5. Copy Supabase URL and keys to env files

---

## 4. Start Services

```bash
# Terminal 1: Server
cd server
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: Client
cd client
npm run dev
# Vite prints the local URL (typically http://localhost:5173 or 5174)
```

---

## 5. Test the Setup

```bash
# Check API health
curl http://localhost:5000/api/health
```

---

## 🔧 Core Features Implementation (Repo-aligned)

### Step 1: Assessment Flow

**Files (current repo)**:
- `client/src/components/Onboarding.tsx`
- `server/src/controllers/assessmentController.ts`

Flow (today):
1. User completes onboarding-style assessment
2. Backend builds daily actions + a weekly audit
3. Dashboard pulls data from `GET /api/dashboard/:id`

### Step 2: Health Score / Weekly Audit Logic

**Files (current repo)**:
- `server/src/lib/health.ts` (scoring + weekly audit payload generation)

### Step 3: AI Coach Integration

**Files (current repo)**:
- `server/src/controllers/coachingController.ts` (Gemini optional + rule-based fallback)
- API route: `POST /api/coaching/:id`

---

## 🌐 API Endpoints Summary (Current Repo)

### Health
```
GET    /api/health
```

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/reset-password
```

### Assessments / Dashboard
```
POST   /api/assessment
POST   /api/test/assessment-mock
GET    /api/dashboard/:id
```

### Daily actions
```
PUT    /api/daily-action/:id/toggle
```

### AI Coach
```
POST   /api/coaching/:id
```

---

## 🧪 Testing (Current Repo)

### Server

```bash
cd server
npm run test
```

Note: this runs `server/src/test-apis.ts` (a lightweight API smoke check), not a full unit test suite.

### Client

No dedicated unit test runner is configured in this repo currently.

---

## 🚀 Deployment (Target)

This repo does not include Docker/CI/CD/Stripe/Twilio wiring end-to-end yet; treat this section as a deployment blueprint:

- Frontend: Vercel
- Backend: Railway / Render
- DB/Auth: Supabase
- Jobs/Queue: Redis + Bull workers

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS blocked | Set `FRONTEND_URL` in `server/.env` to your Vite origin; restart server |
| Supabase not configured | Fill `SUPABASE_URL` + `SUPABASE_ANON_KEY` on server and `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` on client |
| No dashboard “output” locally | Enable `VITE_DEMO_MODE=true` in `client/.env` |

---

## 📞 Support

- Documentation: `docs/` folder
- Issues: GitHub Issues
