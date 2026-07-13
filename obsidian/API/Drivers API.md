---
tags:
  - cleanai
  - api
  - drivers
---

# Drivers API

**Router:** `backend/routes/drivers.js` · **Base:** `/api/drivers`

## Endpoints

| Method | Path | Who | Notes |
|--------|------|-----|-------|
| `POST` | `/api/drivers/register` | Public | `name`, `phone`, `area`, `password` |
| `POST` | `/api/drivers/login` | Public | `phone`, `password` |
| `GET` | `/api/drivers` | Admin | List drivers |
| `GET` | `/api/drivers/assignments` | Driver | Area / assigned tasks |
| `POST` | `/api/drivers/assignments/:taskId/complete` | Driver | multipart image + lat/lng |

## Completion rules

- Must be within **0.2 km** (haversine) of the report’s coordinates
- Saves proof under `backend/uploads/completions/`
- Marks task completed, sets report `completed`, pickup status `waiting`

## Areas

Documented on [[Driver Portal]].

## Related

- [[Report Workflow]]
- [[Admin Dashboard]]
- [[Data Flow]]
