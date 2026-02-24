# HelmCFO — Design Partner Deploy Guide

Thank you for being an early design partner. This guide gets you a private HelmCFO instance running in under 10 minutes.

---

## Prerequisites

- A free [Vercel](https://vercel.com) account
- An [OpenAI](https://platform.openai.com) API key (GPT-4o access recommended)
- Node.js 20+ installed locally (for optional local testing)

---

## 1. One-Click Deploy

Click the button below to fork + deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/helmcfo/app)

Or clone and deploy manually:

```bash
git clone https://github.com/helmcfo/app
cd app
npx vercel --prod
```

---

## 2. Required Environment Variables

Set these in your Vercel project → Settings → Environment Variables:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI key — powers the AI Advisor |
| `ENCRYPTION_KEY` | ✅ Yes | 32-byte hex key for token encryption |
| `INTERNAL_API_KEY` | Recommended | Server-to-server auth secret |
| `PLAID_CLIENT_ID` | Optional | Connect your real bank account |
| `PLAID_SECRET` | Optional | Plaid sandbox or production secret |
| `PLAID_ENV` | Optional | `sandbox` \| `development` \| `production` |
| `STRIPE_SECRET_KEY` | Optional | Connect your Stripe account |
| `INTUIT_CLIENT_ID` | Optional | Connect QuickBooks |
| `INTUIT_CLIENT_SECRET` | Optional | QuickBooks OAuth secret |

### Generate required keys

```bash
# ENCRYPTION_KEY (64 hex chars = 32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# INTERNAL_API_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. Demo Mode (No Integrations Needed)

HelmCFO ships with 5 realistic demo company scenarios. To activate one, add this environment variable:

| Demo Company ID | Scenario |
|---|---|
| `acme-saas` | B2B SaaS with 11.5mo runway, Series A prep |
| `greenleaf-ecomm` | E-commerce, 8mo runway, margin pressure |
| `dataflow-ai` | Post-Series A AI infra, $4.2M cash, enterprise AR |
| `cliniq-health` | HealthTech seed, regulatory overhead |
| `logiqflow` | Logistics SaaS, 7.5mo runway, bridge needed |

The app works out-of-the-box with realistic mock data — no integrations required for your first session.

---

## 4. Local Development

```bash
cp .env.local.example .env.local
# Fill in at minimum: OPENAI_API_KEY and ENCRYPTION_KEY

npm install
npm run dev
# → http://localhost:3001
```

---

## 5. Verify Your Deployment

Visit `https://your-deployment.vercel.app/api/health` — you should see:

```json
{
  "status": "ok",
  "app": "helmcfo",
  "version": "abc1234",
  "timestamp": "2026-02-23T..."
}
```

---

## 6. What to Explore

| Page | What to test |
|---|---|
| **Dashboard** | Live runway counter + sensitivity table |
| **Cash Flow** | Forecast chart + scenario comparison |
| **Scenarios** | Model burn cuts and revenue acceleration |
| **Headcount** | Team cost breakdown |
| **AI Advisor** | Ask: *"How do I extend my runway by 3 months?"* |
| **Board Reports** | Auto-generated board pack summary |

---

## 7. Feedback

Please share your thoughts via the feedback form in Settings, or email **team@helmcfo.com**.

We're particularly interested in:
- Which insights were surprising / useful
- What your current CFO workflow looks like
- What would make you pay for this today

---

## Security

- All OAuth tokens are encrypted at rest (AES-256-GCM)
- All API routes have rate limiting
- Audit logs are written for every data access event
- Your data never leaves your Vercel deployment
