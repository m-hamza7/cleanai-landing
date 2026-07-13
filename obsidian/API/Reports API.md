---
tags:
  - cleanai
  - api
  - reports
---

# Reports API

**Router:** `backend/routes/reports.js` · **Base:** `/api/reports`

## Endpoints

| Method | Path | Who | Notes |
|--------|------|-----|-------|
| `POST` | `/api/reports` | Citizen | multipart: `image`, `latitude`, `longitude`, optional `gps_accuracy`, `location` → status `pending`; triggers AI |
| `GET` | `/api/reports` | Admin: all · Citizen: own | query `status`, `limit`, `offset` |
| `GET` | `/api/reports/:id` | Authenticated | Single report |
| `PATCH` | `/api/reports/:id/status` | Admin | `pending` \| `received` \| `rejected` \| `scheduled_for_pickup` \| `completed` |
| `POST` | `/api/reports/:id/pickup-report` | Citizen | `{ action: 'confirm' \| 'reject' }` |
| `POST` | `/api/reports/:id/classify` | — | Manual AI classify row |
| `DELETE` | `/api/reports/:id` | Admin | Delete report |

## Upload constraints

- Types: JPEG / PNG / GIF
- Max size: **10 MB**
- Storage: `backend/uploads/reports/{timestamp}-{rand}.ext`
- Public URL pattern: `/uploads/reports/...`

## AI side effect

On create, backend calls [[AI Service]] and may insert `ai_classification`. Failure is non-fatal.

## Related

- [[Report Workflow]]
- [[Data Flow]]
- [[Citizen Portal]]
- [[Admin Dashboard]]
