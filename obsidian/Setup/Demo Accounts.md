---
tags:
  - cleanai
  - setup
  - demo
---

# Demo Accounts

Seeded in `clean_ai_postgres.sql`. Login is **email + password** (not username alone).

| Email | Password | Role |
|-------|----------|------|
| `hamza@cleanai.com` | `hamza` | citizen |
| `admin@cleanai.com` | `admin123` | admin |
| `saad@cleanai.com` | `saad` | citizen |
| `omer@cleanai.com` | `omer` | citizen |
| `twellic@cleanai.com` | `tyrell` | citizen |
| `ali@cleanai.com` | `ali` | citizen |

## Portal mapping

| Account | Open |
|---------|------|
| Citizens | `/login` → `/user-dashboard` |
| Admin | `/login` → `/dashboard` |
| Drivers | `/driver-portal` (register separately by phone + area) |

## Related

- [[Auth API]]
- [[Local Development]]
- [[Citizen Portal]]
- [[Admin Dashboard]]
