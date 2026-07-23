---
tags:
  - cleanai
  - setup
  - env
---

# Environment Variables

> Do **not** commit real secrets. `.env*` is gitignored at repo root.

## Frontend — `.env.local`

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | API base (default fallback `http://localhost:5000/api`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional reverse geocoding |

## Backend — `backend/.env`

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Supabase/Postgres URI |
| `JWT_SECRET` | Yes | Sign JWTs |
| `PORT` | No | Default `5000` |
| `AI_SERVICE_URL` | No | Default `http://localhost:5001` |
| `FRONTEND_URL` | Prod | CORS allowlist (Vercel URL) |
| `NODE_ENV` | Prod | `production` on Render |
| `OSRM_BASE_URL` | No | OSRM server for driver routing (default `https://router.project-osrm.org`) |

Older MySQL-style keys (`DB_HOST`, `DB_USER`, …) may appear in historical docs — current code uses **`DATABASE_URL`**.

## AI service

| Variable | Purpose |
|----------|---------|
| `MODEL_PATH` | Local path to `best.pt` |
| `MODEL_URL` | Download URL if weights missing |
| `YOLO_CONFIG_DIR` | Ultralytics writable dir (Render: `/tmp/Ultralytics`) |
| `PORT` / `$PORT` | Bind port (Render injects `$PORT`) |

## Related

- [[Deployment]]
- [[Local Development]]
- [[Backend]]
