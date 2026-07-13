---
tags:
  - cleanai
  - api
---

# Users & Alerts API

## Users — `backend/routes/users.js`

| Method | Path | Who | Notes |
|--------|------|-----|-------|
| `GET` | `/api/users` | Admin | List users |
| `GET` | `/api/users/:id/stats` | Authenticated | Per-user stats |

## Alerts — `backend/routes/alerts.js`

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/api/alerts` | List alerts |
| `POST` | `/api/alerts` | Create alert row |

Schema: `alerts` table on [[Database]] (`alert_type`, `message`, `delivery_method`, links to `user_id` + `report_id`).

## Health

`GET /api/health` — backend liveness (mounted in `server.js`).

## Related

- [[Auth API]]
- [[Admin Dashboard]]
- [[Backend]]
