---
tags:
  - cleanai
  - features
  - citizen
---

# Citizen Portal

**Route:** `/user-dashboard` · **File:** `app/user-dashboard/page.tsx`  
**Login:** `/login` (email/password; role ≠ admin)

## Capabilities

1. Capture / upload waste photo
2. Attach GPS (browser geolocation / map)
3. Submit report → [[Reports API]]
4. View personal report history + AI labels when available
5. Confirm or reject driver pickup completion

## Auth

JWT required. Redirect to login when missing/expired. Signup available on login page for citizens.

## Related UX on landing

Public marketing CTAs point here via [[Landing Page]] and nav.

## Related

- [[Report Workflow]]
- [[Auth API]]
- [[Demo Accounts]]
