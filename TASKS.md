# Autonomous CFO for SMBs — Project Tasks & Research

> **Mission:** Build an AI-powered financial strategy platform that replaces the $5K–$15K/mo fractional CFO for companies with 5–200 employees.
>
> **Tagline:** *"Digits does your books. We make your decisions."*

---

## 📌 Thesis

No product today bridges the gap between **accounting** (what happened) and **strategy** (what should I do). Ramp controls spend. Digits does books. Pilot uses humans at 60% margins. The Autonomous CFO is an **AI decision engine** that synthesizes banking, accounting, payroll, and billing data into proactive, prescriptive financial intelligence.

---

## 🏁 The "10x Moment"

Connect bank + QuickBooks + Stripe in 5 minutes. See instantly:

> *"Your burn rate is $287K/mo but you think it's $240K — you're missing $47K in accrued liabilities. At current burn, you run out of cash August 14th. Collect your 3 overdue invoices ($94K, avg 38 days late), cut 4 unused SaaS subscriptions ($2,800/mo), and you extend runway to November 2nd — enough to close your Series A. Here's the investor-ready financial package I drafted."*

---

## 🗺️ Competitive Landscape

| Player | What They Do | Revenue/Scale | Weakness |
|---|---|---|---|
| **Ramp** | Spend management + corporate cards | ~$1B ARR, 50K+ customers, $32B val | Backward-looking. Requires Ramp card. No forecasting or strategic advice. |
| **Digits** | AI-native bookkeeping (Agentic GL) | $65–$185/mo | Replaces accountant, not CFO. No scenario modeling or recommendations. |
| **Pilot** | Human bookkeepers + fractional CFOs | ~$43M ARR, ~2,500 customers, $1.2B val | 60% gross margins. Human labor doesn't scale. Growth slowed to 30%. |
| **Bench** | Human bookkeeping for micro-biz | **Shut down Dec 2024.** Acquired by Mainstreet. | Proved human-heavy model is fatal. |
| **Puzzle** | AI accounting for startups | $24M raised, 7K companies | Narrow — accounting only. |

**Gap:** Forward-looking, prescriptive financial intelligence. Nobody answers *"Should I hire? When do I run out of cash? What do I tell my board?"* without a human CFO.

---

## 🎯 Product — 15 Core CFO Use Cases

- [ ] 1. Cash flow forecasting & runway modeling (multi-scenario)
- [ ] 2. Budget vs. actuals with variance explanations
- [ ] 3. Scenario planning (base/bull/bear)
- [ ] 4. Fundraising support — investor-ready models & data rooms
- [ ] 5. Unit economics (CAC, LTV, payback, gross margin by segment)
- [ ] 6. Headcount planning & fully-loaded cost modeling
- [ ] 7. Expense optimization & vendor renegotiation
- [ ] 8. Revenue recognition & accrual accounting
- [ ] 9. Tax strategy & R&D credit identification
- [ ] 10. Board/investor reporting packages
- [ ] 11. AR/AP optimization (DSO/DPO management)
- [ ] 12. Pricing strategy & margin analysis
- [ ] 13. M&A / exit readiness
- [ ] 14. Debt/credit facility evaluation
- [ ] 15. Working capital & cash management

**MVP scope (Phase 1 — use cases 1, 2, 3, 7, 10):**
- Cash flow forecasting with multi-scenario modeling
- Budget vs. actuals dashboard
- Scenario planning (base/bull/bear)
- Expense optimization & SaaS audit
- Board/investor report generation

---

## 🔌 Technical Architecture

### Integration Layer

| Data Type | Provider | Notes |
|---|---|---|
| Banking | **Plaid** (12K+ FIs) | Industry standard, best coverage |
| Accounting | **QuickBooks Online API + Xero API** | ~80% US SMB market share combined |
| Payroll/HRIS | **Finch** (unified API, 200+ providers) | Covers Gusto, ADP, Rippling, Paychex, BambooHR in one integration |
| Billing | **Stripe API** + Chargebee | Dominant in SMB/startup billing |
| Expenses | **Ramp/Brex APIs** | Where the spend data lives |

### AI Architecture — Hybrid Agent-Based

```
┌─────────────────────────────────────────────────┐
│              ORCHESTRATOR AGENT                   │
│  Routes queries, decomposes multi-step analysis   │
├──────────────┬──────────────┬────────────────────┤
│  ANALYSIS    │  FORECASTING │  RECOMMENDATION    │
│  AGENT       │  AGENT       │  AGENT             │
│              │              │                    │
│  RAG over    │  Time series │  Action plans      │
│  financial   │  models +    │  Email drafts      │
│  data +      │  Monte Carlo │  Vendor lists      │
│  anomaly     │  simulation  │  Hiring models     │
│  detection   │  (determin.) │  Tax strategies    │
└──────────────┴──────────────┴────────────────────┘
                      ▲
          ┌───────────┴───────────┐
          │   FINANCIAL DATA      │
          │   WAREHOUSE           │
          │   Normalized from     │
          │   all integrations    │
          └───────────────────────┘
```

**Critical rule:** LLMs reason about *what to calculate*. Actual math runs in verified deterministic code. Never let an LLM do arithmetic on financial data.

### Key Technical Challenges

- [ ] Data normalization across inconsistent chart-of-accounts structures
- [ ] Penny-accurate financial calculations (integer arithmetic, no floating point)
- [ ] Banking data 24–48hr latency via Plaid (compensating logic needed)
- [ ] Historical data bootstrapping (need 12–24 months for meaningful forecasts)
- [ ] Multi-entity consolidation with intercompany transactions
- [ ] Seasonality detection vs. one-time event misidentification

### Security Requirements (Non-Negotiable)

- [ ] SOC 2 Type II — achieve within 12 months of launch
- [ ] AES-256 encryption at rest, TLS 1.3 in transit
- [ ] Per-customer data isolation (no cross-tenant AI leakage)
- [ ] E&O insurance ($2M–$5M policy)
- [ ] Role-based access, MFA, audit logging
- [ ] Data portability — customers can export everything at any time

---

## 📣 GTM Playbook

### Buyer Persona

**Primary:** CEO/Founder at 10–100 employee company, $1M–$20M revenue. No CFO. Makes financial decisions by gut feel.

**Trigger events:**
1. Running low on cash / runway drops below 6 months
2. Preparing to fundraise — needs financial models & data rooms
3. Board meeting prep — recurring quarterly pain
4. Tax surprise reveals lack of financial planning
5. Got quoted $8K/mo for a fractional CFO and can't justify it
6. Rapid hiring — "Can we afford 5 more engineers?"

### Channel Strategy (Ranked by Expected ROI)

1. **VC portfolio distribution** — Partner with 10–20 seed/Series A funds. Free tier for portfolio companies.
2. **Accounting firm partnerships** — CPAs who don't offer CFO services refer clients who need strategic finance.
3. **Integration marketplace** — QuickBooks App Store, Xero App Store, Stripe Partner Directory.
4. **Content/SEO** — Own "fractional CFO," "startup financial model," "cash flow forecast" search terms.
5. **Product-led growth** — Free "Financial Health Score" → diagnose problems → convert to paid.

### Pricing

| Tier | Price | Target | Positioning |
|---|---|---|---|
| **Starter** | $299/mo | 5–20 employees | Dashboard + basic alerts. Competes with Digits. |
| **Growth** | $799/mo | 20–100 employees | Full autonomous CFO. Replaces $5–10K/mo fractional. |
| **Scale** | $1,499/mo | 100–200 employees | Multi-entity, advanced modeling. Replaces $10–15K/mo fractional. |
| **Enterprise** | Custom | 200+ employees | AI + human CFO hybrid. |

### Positioning

- vs. Fractional CFO: *"Same intelligence. 24/7. 90% less cost."*
- vs. Digits: *"Digits does your books. We make your decisions."*
- vs. Pilot: *"Pilot gives you a meeting once a month. We give you a CFO that never sleeps."*

---

## 💰 Unit Economics

### Per-Customer Economics (Growth Tier)

| Component | Cost |
|---|---|
| AI inference | $30–90/mo |
| Data integrations (Plaid, Finch) | $10–25/mo |
| Infrastructure | $8–20/mo |
| Support | $20–50/mo |
| **Total COGS** | **$68–185/mo** |
| **Revenue** | **$799/mo** |
| **Gross margin** | **77–91%** |

### Expansion Revenue Vectors

- [ ] Embedded lending (referral to lending partners): $500–$5K per loan originated
- [ ] Insurance referrals: 10–15% of first-year premium
- [ ] Tax optimization / R&D credits: $2K–$50K per engagement
- [ ] 401(k)/benefits optimization referrals
- [ ] AI-generated data rooms for fundraising: $500 one-time
- [ ] Anonymized benchmarking data sold to VCs/analysts

### Path to $100M ARR

| Year | Customers | Blended ARPU | ARR | Milestone |
|---|---|---|---|---|
| 1 | 200 | $6K | $1.2M | PMF validated. Series A. |
| 2 | 800 | $7.5K | $6M | Repeatable GTM. SOC 2. Series B. |
| 3 | 2,500 | $8.4K | $21M | Embedded finance launches. NRR >130%. |
| 4 | 6,000 | $9.5K | $57M | Move upmarket. International. |
| 5 | 12,000 | $10K | **$120M** | Category leader. |

---

## ⚖️ Regulatory & Risk

### Regulatory Status

- **RIA registration:** NOT required for operational financial intelligence (cash flow, hiring, expenses). Only required if recommending specific securities.
- **Tax advice:** Providing tax *information* is legal. Tax *advice* (specific recommendations) may require CPA/EA licensure. Use disclaimers.
- **Precedent:** Pilot states: *"Pilot is not a public accounting firm and does not provide services that would require a license to practice public accountancy."*

### Required Disclaimers

1. "This platform provides financial information and analysis, not investment, tax, or legal advice."
2. "Recommendations are AI-generated and should be reviewed by qualified professionals."
3. "Projections are estimates based on historical data. Actual results may vary."
4. "This product is not a registered investment advisor, broker-dealer, or accounting firm."

### Key Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| AI gives bad advice → company runs out of cash | CRITICAL | Always present scenarios (base/bull/bear), never single-point forecasts. Conservative defaults. Confidence scores. |
| Ramp Intelligence expands into CFO features | HIGH | Move fast. Build data moat (cross-customer benchmarks). Integrate with Ramp, don't compete. |
| Customer trust gap ("why trust AI?") | HIGH | SOC 2. Transparent methodology. Audit trail. Human escalation for high-stakes decisions. |
| Bench-style catastrophic failure | MEDIUM | Full data portability. Transparent runway. Achieve profitability early. |
| Apple/Stripe builds it | MEDIUM | Neither is positioned for strategic CFO intelligence. They're infrastructure, not advisory. |

---

## 📚 Lessons from Comparable Companies

| Company | Key Lesson |
|---|---|
| **Pilot** ($43M ARR, 60% margins) | Demand exists. But human-heavy model caps growth. Automate what they do with people. |
| **Bench** (shut down Dec 2024 after $113M raised) | Human-labor economics at software prices = death. Never build core product on human labor. |
| **Ramp** ($1B ARR in 6 years) | AI applied to financial operations is massive. "Save money" positioning + VC portfolio distribution = the playbook. |
| **Mercury** ($650M ARR, profitable) | Trust + beautiful UX + community wins in fintech. Deep integration opportunity with 200K customers. |

---

## ✅ Execution Tasks

### Phase 0 — Validation (Weeks 1–4)
- [ ] Interview 30+ SMB founders/CEOs who currently use fractional CFOs or manage finances themselves
- [ ] Validate the "10x moment" — does instant cash flow diagnosis + actionable recs generate "holy shit" reactions?
- [ ] Identify 5 design partners willing to share financial data for beta
- [ ] Map the minimum integration set (QBO + Plaid + Stripe = enough for MVP?)
- [ ] Define MVP scope: which 3–5 of the 15 use cases ship first?

### Phase 1 — MVP Build (Weeks 5–16)
- [ ] Set up project infrastructure (repo, CI/CD, cloud, monitoring)
- [ ] Build data ingestion layer (Plaid + QBO + Stripe integrations)
- [ ] Build canonical financial data model & normalization layer
- [ ] Build deterministic financial computation engine (cash flow forecast, burn rate, runway)
- [ ] Build AI orchestrator agent + analysis agent + recommendation agent
- [ ] Build frontend — dashboard + chat interface + report generation
- [ ] Security foundations (encryption, auth, audit logging, tenant isolation)
- [ ] Deploy to 5 design partners for feedback

### Phase 2 — Beta & PMF (Weeks 17–30)
- [ ] Iterate on product based on design partner feedback
- [ ] Expand to 50 beta customers
- [ ] Add payroll integration (Finch) for headcount planning
- [ ] Add board/investor report generation
- [ ] Add scenario planning (base/bull/bear)
- [ ] Begin SOC 2 Type II preparation
- [ ] Measure activation, retention, NPS — validate PMF signals
- [ ] Develop pricing page and self-serve onboarding

### Phase 3 — Launch & Series A (Weeks 31–52)
- [ ] Public launch
- [ ] Activate VC portfolio distribution channel (10–20 fund partnerships)
- [ ] Launch accounting firm partner program
- [ ] List on QuickBooks App Store & Stripe Partner Directory
- [ ] Content marketing engine (blog, benchmark reports, templates)
- [ ] Scale to 200 paying customers
- [ ] Achieve SOC 2 Type II certification
- [ ] Raise Series A ($8–15M at $40–60M valuation)

### Phase 4 — Growth & Expansion (Year 2+)
- [ ] Add expense optimization & vendor renegotiation features
- [ ] Launch embedded lending referral program
- [ ] Add Xero integration for international expansion
- [ ] Build anonymized benchmarking dataset across customers
- [ ] Tax optimization / R&D credit partnerships
- [ ] Scale to 800+ customers, $6M+ ARR
- [ ] Raise Series B

---

## 👥 Founding Team Profile (Ideal)

| Role | Background | Why |
|---|---|---|
| **CEO** | Former founder or operator who managed finances at a startup | Understands the pain firsthand. Can sell to other founders. |
| **CTO** | Full-stack engineer with fintech or data infrastructure experience | Needs to build integrations, data pipelines, and AI agents. |
| **Head of AI/ML** | ML engineer with experience in time series forecasting + LLM agents | Core technical differentiation lives in the AI layer. |
| **Early hire: GTM** | Former Ramp/Mercury/Pilot BD or growth person | Knows the playbook for VC portfolio distribution + SMB SaaS growth. |

---

*Last updated: February 6, 2026*
