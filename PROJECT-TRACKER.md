# Autonomous CFO — Project Tracker

> **Status:** Phase 0 → Phase 1 Transition | **Start Date:** Feb 22, 2026

---

## Current Sprint: Foundation & MVP Setup

### 🔴 Critical Path (Blocking)

| # | Task | Status | Owner | Target | Notes |
|---|------|--------|-------|--------|-------|
| 1 | Domain registration & DNS setup | 🟡 In Progress | — | Feb 22 | Checking availability |
| 2 | Logo & brand identity | 🟡 In Progress | — | Feb 22 | Generating variations |
| 3 | Project infrastructure (repo, monorepo, CI/CD) | 🟡 In Progress | — | Feb 23 | Next.js + Python backend |
| 4 | Cloud environment setup (Vercel + AWS/GCP) | ⬜ Not Started | — | Feb 25 | — |
| 5 | Design canonical financial data model | ⬜ Not Started | — | Feb 28 | Core schema design |

---

## Phase 0 — Validation (Weeks 1–4)

| # | Task | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 0.1 | Interview 30+ SMB founders/CEOs | ⬜ Not Started | P0 | Need to validate "10x moment" |
| 0.2 | Validate instant cash flow diagnosis reaction | ⬜ Not Started | P0 | Core value prop test |
| 0.3 | Identify 5 design partners | ⬜ Not Started | P0 | Need data-sharing agreements |
| 0.4 | Map minimum integration set (QBO + Plaid + Stripe) | ⬜ Not Started | P1 | Verify API access & costs |
| 0.5 | Define MVP scope (5 use cases confirmed) | ✅ Done | P0 | Cash flow, budget vs actuals, scenarios, expense opt, board reports |

## Phase 1 — MVP Build (Weeks 5–16)

### Infrastructure & DevOps

| # | Task | Status | Priority | Depends On | Notes |
|---|------|--------|----------|------------|-------|
| 1.1 | Set up monorepo (Next.js frontend + Python backend) | 🟡 In Progress | P0 | — | Turborepo or Nx |
| 1.2 | CI/CD pipeline (GitHub Actions) | ⬜ Not Started | P0 | 1.1 | Lint, test, deploy |
| 1.3 | Cloud infrastructure (Vercel + AWS) | ⬜ Not Started | P0 | 1.1 | IaC with Terraform |
| 1.4 | Database setup (PostgreSQL + TimescaleDB) | ⬜ Not Started | P0 | 1.3 | Financial time-series data |
| 1.5 | Monitoring & alerting (Datadog/Sentry) | ⬜ Not Started | P1 | 1.3 | — |

### Data Ingestion Layer

| # | Task | Status | Priority | Depends On | Notes |
|---|------|--------|----------|------------|-------|
| 1.6 | Plaid integration (banking data) | ⬜ Not Started | P0 | 1.4 | 12K+ FIs supported |
| 1.7 | QuickBooks Online API integration | ⬜ Not Started | P0 | 1.4 | ~80% US SMB market |
| 1.8 | Stripe API integration (billing data) | ⬜ Not Started | P0 | 1.4 | Revenue & subscription data |
| 1.9 | Data normalization & canonical model | ⬜ Not Started | P0 | 1.6, 1.7, 1.8 | Chart-of-accounts mapping |
| 1.10 | Historical data bootstrapping (12-24 months) | ⬜ Not Started | P1 | 1.9 | Needed for meaningful forecasts |

### Financial Computation Engine

| # | Task | Status | Priority | Depends On | Notes |
|---|------|--------|----------|------------|-------|
| 1.11 | Cash flow forecasting engine | ⬜ Not Started | P0 | 1.9 | Integer arithmetic, no floats |
| 1.12 | Burn rate calculator | ⬜ Not Started | P0 | 1.9 | Real-time runway estimation |
| 1.13 | Budget vs. actuals engine | ⬜ Not Started | P0 | 1.9 | Variance detection & explanation |
| 1.14 | Scenario modeler (base/bull/bear) | ⬜ Not Started | P1 | 1.11 | Monte Carlo simulation |
| 1.15 | Expense analyzer & SaaS audit | ⬜ Not Started | P1 | 1.9 | Detect unused subscriptions |

### AI Agent System

| # | Task | Status | Priority | Depends On | Notes |
|---|------|--------|----------|------------|-------|
| 1.16 | Orchestrator agent | ⬜ Not Started | P0 | 1.11 | Routes queries, decomposes tasks |
| 1.17 | Analysis agent (RAG + anomaly detection) | ⬜ Not Started | P0 | 1.9, 1.16 | Financial data reasoning |
| 1.18 | Forecasting agent | ⬜ Not Started | P0 | 1.11, 1.16 | Time series + Monte Carlo |
| 1.19 | Recommendation agent | ⬜ Not Started | P1 | 1.16, 1.17 | Action plans, email drafts |
| 1.20 | Financial data warehouse & vector store | ⬜ Not Started | P0 | 1.4 | For RAG retrieval |

### Frontend

| # | Task | Status | Priority | Depends On | Notes |
|---|------|--------|----------|------------|-------|
| 1.21 | Dashboard — overview & KPIs | ⬜ Not Started | P0 | 1.11 | Burn rate, runway, cash position |
| 1.22 | Cash flow visualization | ⬜ Not Started | P0 | 1.11 | Interactive charts |
| 1.23 | Chat interface (CFO conversation) | ⬜ Not Started | P0 | 1.16 | Natural language financial Q&A |
| 1.24 | Budget vs. actuals view | ⬜ Not Started | P1 | 1.13 | Variance highlighting |
| 1.25 | Report generation UI | ⬜ Not Started | P1 | 1.19 | Board/investor packages |
| 1.26 | Integration connection flow (onboarding) | ⬜ Not Started | P0 | 1.6, 1.7, 1.8 | "Connect in 5 min" experience |

### Security & Compliance

| # | Task | Status | Priority | Depends On | Notes |
|---|------|--------|----------|------------|-------|
| 1.27 | AES-256 encryption at rest | ⬜ Not Started | P0 | 1.4 | Non-negotiable |
| 1.28 | TLS 1.3 in transit | ⬜ Not Started | P0 | 1.3 | Non-negotiable |
| 1.29 | Per-customer tenant isolation | ⬜ Not Started | P0 | 1.4 | No cross-tenant AI leakage |
| 1.30 | Auth system (MFA, RBAC) | ⬜ Not Started | P0 | 1.3 | Auth0 or Clerk |
| 1.31 | Audit logging | ⬜ Not Started | P1 | 1.3 | All financial data access |
| 1.32 | Data export / portability | ⬜ Not Started | P1 | 1.9 | Customer-facing export |

---

## Phase 2 — Beta & PMF (Weeks 17–30)

| # | Task | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 2.1 | Design partner feedback iteration | ⬜ Not Started | P0 | 5 partners |
| 2.2 | Expand to 50 beta customers | ⬜ Not Started | P0 | — |
| 2.3 | Finch integration (payroll/HRIS) | ⬜ Not Started | P1 | Headcount planning |
| 2.4 | Board/investor report generation | ⬜ Not Started | P1 | — |
| 2.5 | Scenario planning (base/bull/bear) | ⬜ Not Started | P1 | — |
| 2.6 | SOC 2 Type II preparation | ⬜ Not Started | P0 | 12-month target |
| 2.7 | Measure activation/retention/NPS | ⬜ Not Started | P0 | PMF signals |
| 2.8 | Pricing page & self-serve onboarding | ⬜ Not Started | P1 | — |

## Phase 3 — Launch & Series A (Weeks 31–52)

| # | Task | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1 | Public launch | ⬜ Not Started | P0 | — |
| 3.2 | VC portfolio distribution (10-20 funds) | ⬜ Not Started | P0 | — |
| 3.3 | Accounting firm partner program | ⬜ Not Started | P1 | — |
| 3.4 | QuickBooks App Store listing | ⬜ Not Started | P1 | — |
| 3.5 | Stripe Partner Directory listing | ⬜ Not Started | P1 | — |
| 3.6 | Content marketing engine | ⬜ Not Started | P1 | Blog, benchmarks, templates |
| 3.7 | Scale to 200 paying customers | ⬜ Not Started | P0 | — |
| 3.8 | SOC 2 Type II certification | ⬜ Not Started | P0 | — |
| 3.9 | Raise Series A ($8-15M) | ⬜ Not Started | P0 | Target $40-60M valuation |

---

## Metrics Dashboard

| Metric | Current | Target (Phase 1) | Target (Phase 2) | Target (Phase 3) |
|--------|---------|-------------------|-------------------|-------------------|
| Design Partners | 0 | 5 | 50 | 200 |
| MRR | $0 | — | $15K | $100K+ |
| Integrations Live | 0 | 3 (Plaid+QBO+Stripe) | 4 (+Finch) | 6+ |
| Uptime | — | 99.5% | 99.9% | 99.95% |
| Avg Onboarding Time | — | <10 min | <5 min | <5 min |
| NPS | — | — | 50+ | 60+ |

---

## Tech Stack Decision Log

| Decision | Choice | Rationale | Date |
|----------|--------|-----------|------|
| Frontend | Next.js 15 + React 19 | SSR, App Router, Vercel deploy | Feb 22, 2026 |
| Backend | Python (FastAPI) | Best AI/ML ecosystem, financial libs | Feb 22, 2026 |
| Database | PostgreSQL + TimescaleDB | ACID compliance, time-series financial data | Feb 22, 2026 |
| Auth | Clerk | Best DX, MFA built-in, RBAC | Feb 22, 2026 |
| AI Framework | LangGraph + OpenAI/Anthropic | Multi-agent orchestration | Feb 22, 2026 |
| Deployment | Vercel (frontend) + AWS (backend) | Best-in-class for each | Feb 22, 2026 |
| Monorepo | Turborepo | Fast builds, Next.js native | Feb 22, 2026 |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development | Feb 22, 2026 |
| Charts | Recharts or Tremor | Financial data visualization | Feb 22, 2026 |
| Financial Math | Python Decimal / integer cents | Penny-accurate, no floating point | Feb 22, 2026 |

---

*Last updated: February 22, 2026*
