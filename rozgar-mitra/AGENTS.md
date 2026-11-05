# AGENTS.md – RozgarMitra AI Development Continuity Guide

This file tracks the project state so work can continue across sessions.

## Project
**RozgarMitra AI** – AI Job Mentor for Informal Workers  
Monorepo: `rozgar-mitra/`  
Stack: React + Vite + TypeScript (frontend) | Node.js + Express + TypeScript (backend) | SQLite | IBM Granite via watsonx.ai

---

## Current Status

| Phase | Status | Notes |
|-------|--------|-------|
| 0 – Scaffold | ✅ Done | Monorepo, shared types |
| 1 – Database | ✅ Done | 13 tables, migrations, seed with 20 DEMO jobs, 5 schemes, 5 courses |
| 2 – Auth & Users | ✅ Done | Register/login, JWT, worker/employer profile APIs |
| 3 – Jobs API | ✅ Done | Search, filter, apply, save, employer CRUD, admin moderate |
| 4 – AI Mentor | ✅ Done | Granite client (IAM token, retry, timeout), RAG, prompts, fallback |
| 5 – Schemes & Training | ✅ Done | CRUD + eligibility check + training enrollment |
| 6 – Frontend scaffold | ✅ Done | Vite, Tailwind, i18n (en/hi), Zustand, Axios |
| 7 – Auth + Dashboard | ✅ Done | Login, Register, Onboarding, Worker Dashboard |
| 8 – Job pages | ✅ Done | JobDiscovery, JobDetail, EmployerDashboard |
| 9 – Mentor/Schemes/Training | ✅ Done | MentorChat, SchemesPage, TrainingPage, Settings |
| 10 – Admin + Landing | ✅ Done | AdminDashboard, LandingPage |
| 11 – Tests | ❌ Removed per user request |
| 12 – Docker/Docs | ❌ Removed per user request |
| 13 – Build verification | 🔄 In progress |

---

## Setup Commands (Windows PowerShell)

```powershell
cd rozgar-mitra

# Install all dependencies
npm install

# Run database migrations
npm run db:migrate --workspace=backend

# Run seed data
npm run db:seed --workspace=backend

# Start backend (port 4000)
npm run dev --workspace=backend

# Start frontend (port 5173) — in another terminal
npm run dev --workspace=frontend
```

---

## Demo Credentials (LOCAL DEVELOPMENT ONLY)
| Role | Email | Password |
|------|-------|----------|
| Worker | worker@demo.local | Worker@1234 |
| Employer | employer@demo.local | Employer@1234 |
| Admin | admin@demo.local | Admin@1234 |

---

## IBM Granite Integration Status
- **Live**: Requires `WATSONX_API_KEY` and `WATSONX_PROJECT_ID` in `.env`
- **Mock/fallback**: App works without credentials; AI mentor shows honest unavailable message
- **Model**: `ibm/granite-3-3-8b-instruct` (multitenant, Lite-plan compatible)
- **Lite plan includes**: 300,000 free inference tokens/month, 2 req/s rate limit

---

## Known Issues / Next Steps
- Frontend TypeScript `noUnusedLocals` may flag a few imports — fix before production build
- Vitest and Playwright tests removed per user request
- Docker files removed per user request
- Voice/speech features not implemented (marked as optional)
- Password reset flow not implemented (out of MVP scope)
