# ChiefCFO — Autonomous Financial Intelligence

> *"Digits does your books. We make your decisions."*

AI-powered CFO that replaces the $5K–$15K/mo fractional CFO for companies with 5–200 employees.

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.12+
- pnpm 8+
- PostgreSQL 16+ (for production; API runs without DB in demo mode)

### Install

```bash
pnpm install
```

### Run Frontend

```bash
cd apps/web && pnpm dev
# → http://localhost:3000
```

### Run API

```bash
cd apps/api
cp .env.example .env
python3 -m uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs
```

### Run Tests

```bash
cd apps/api && python3 -m pytest tests/ -v
```

## Architecture

```
autonomous-cfo/
├── apps/
│   ├── web/              # Next.js 15 + React 19 frontend
│   │   └── src/
│   │       ├── app/      # App Router pages
│   │       ├── components/  # UI components
│   │       └── lib/      # Utilities
│   └── api/              # Python FastAPI backend
│       └── app/
│           ├── api/      # Route handlers
│           ├── core/     # Config, database
│           ├── models/   # SQLAlchemy models
│           ├── schemas/  # Pydantic schemas
│           └── services/ # Business logic & financial engine
├── brand/                # Logo & brand assets
├── docs/                 # Documentation
├── TASKS.md              # Product strategy & research
└── PROJECT-TRACKER.md    # Development tracker
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, Recharts |
| Backend | Python, FastAPI, SQLAlchemy 2, Pydantic |
| Database | PostgreSQL + TimescaleDB |
| AI | LangGraph, OpenAI, Anthropic |
| Auth | Clerk |
| Deploy | Vercel (frontend), AWS (backend) |
| Monorepo | Turborepo + pnpm |

## License

Proprietary. All rights reserved.
