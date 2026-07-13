---
tags:
  - cleanai
  - setup
---

# Local Development

## Prerequisites

- Node.js ≥ 18
- PostgreSQL or Supabase project (run `clean_ai_postgres.sql`)
- Python 3.12+ (for local YOLO)
- Optional: Google Maps API key (reverse geocoding)

## 1. Database

1. Create a Supabase/Postgres database
2. Run `clean_ai_postgres.sql` in the SQL editor
3. Copy the connection URI → `DATABASE_URL` ([[Environment Variables]])

## 2. Backend

```bash
cd backend
npm install
# create backend/.env
npm start
# or: npm run dev
```

Listens on **http://localhost:5000**.

## 3. AI service

```bash
cd backend/ai-service
pip install -r requirements.txt
python classify.py
```

Listens on **http://localhost:5001**. Ensure `AI_SERVICE_URL=http://localhost:5001` on the backend.

## 4. Frontend

```bash
# repo root
npm install
# create .env.local
npm run dev
```

Open **http://localhost:3000**.

## Sanity checks

| Check | Expect |
|-------|--------|
| `GET http://localhost:5000/api/health` | OK |
| `GET http://localhost:5001/health` | OK |
| Login with [[Demo Accounts]] | JWT + redirect |

## Related

- [[Deployment]]
- [[Tech Stack]]
- [[Directory Structure]]
