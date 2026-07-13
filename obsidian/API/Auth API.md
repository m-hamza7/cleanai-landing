---
tags:
  - cleanai
  - api
  - auth
---

# Auth API

**Router:** `backend/routes/auth.js` · **Base:** `/api/auth`

## Endpoints

### `POST /api/auth/register`

Body: `{ name, email, phone, password, role? }`

Creates a user (typically citizen). Password hashed with bcrypt (10 rounds).

### `POST /api/auth/login`

Body: `{ email, password }`

Returns JWT (~24h) + user object. Logs to `system_logs`.

### `GET /api/auth/me`

Header: `Authorization: Bearer <token>`

Returns current user profile.

## Roles

| Role | Portal |
|------|--------|
| `citizen` | [[Citizen Portal]] |
| `admin` | [[Admin Dashboard]] |
| `driver` | Usually via [[Drivers API]] / [[Driver Portal]] |

## Client notes

Frontend stores token as `authToken`. Default API base: `NEXT_PUBLIC_API_URL` or `http://localhost:5000/api`.

## Related

- [[Demo Accounts]]
- [[Backend]]
