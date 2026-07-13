---
tags:
  - cleanai
  - setup
  - deploy
---

# Deployment

Defined primarily by `render.yaml` at the repo root.

## Services

### `cleanai-backend` (Render · Node)

- **rootDir:** `backend`
- **build:** `npm install --production`
- **start:** `npm start`
- **Env to set in dashboard:** `DATABASE_URL`, `JWT_SECRET`, `AI_SERVICE_URL`, `FRONTEND_URL`

### `cleanai-ai` (Render · Python)

- **rootDir:** `backend/ai-service`
- **build:** `pip install -r requirements.txt`
- **start:** `gunicorn --workers=2 --threads=4 --bind=0.0.0.0:$PORT --timeout=120 classify:app`
- **Env:** `MODEL_PATH`, `MODEL_URL`, `YOLO_CONFIG_DIR`

### Frontend

Typically deployed to **Vercel**. Point `NEXT_PUBLIC_API_URL` at the Render backend `/api` URL.

## After deploy checklist

1. Deploy AI service → copy public URL
2. Deploy backend with `AI_SERVICE_URL` set
3. Set `FRONTEND_URL` for CORS
4. Deploy frontend with `NEXT_PUBLIC_API_URL`
5. Verify `/api/health` and AI `/health`

## Related

- [[System Architecture]]
- [[Environment Variables]]
- [[AI Service]]
