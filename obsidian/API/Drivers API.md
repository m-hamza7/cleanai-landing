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
| `POST` | `/api/drivers/routes/single` | Driver | Plan route for one task (`task_id`, origin lat/lng) |
| `POST` | `/api/drivers/routes/multi` | Driver | Optimize all (or selected) active pickups |
| `GET` | `/api/drivers/routes/mine` | Driver | Own planned routes / trip logs |
| `GET` | `/api/drivers/routes` | Admin | All drivers’ routes |
| `POST` | `/api/drivers/routes/:routeId/start` | Driver | Trip log start |
| `POST` | `/api/drivers/routes/:routeId/complete` | Driver | Trip log complete |

## Routing

Uses configurable OSRM (`OSRM_BASE_URL`). See [[Driver Route Planning]].

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
