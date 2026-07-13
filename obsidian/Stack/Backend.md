---
tags:
  - cleanai
  - stack
  - backend
---

# Backend

Express API under `backend/`.

## Entry & config

| File | Purpose |
|------|---------|
| `backend/server.js` | App bootstrap, CORS, `/uploads`, `/api` mounts, health |
| `backend/config/database.js` | `pg` Pool; `?` → `$n` mysql-compat shim |
| `backend/routes/*.js` | Feature routers |

## Route mounts

Default base: `http://localhost:5000`

- `/api/auth` → [[Auth API]]
- `/api/reports` → [[Reports API]]
- `/api/users`, `/api/alerts` → [[Users & Alerts API]]
- `/api/drivers` → [[Drivers API]]
- `GET /api/health`
- Static: `/uploads` → `backend/uploads/`

## Scripts

```bash
cd backend
npm install
npm start    # node server.js
npm run dev  # nodemon
```

## Cross-service calls

Uses `AI_SERVICE_URL` (default `http://localhost:5001`) to `POST /classify` when a report image is saved. Classification errors do **not** roll back the report.

## Related

- [[System Architecture]]
- [[Database]]
- [[Deployment]]
