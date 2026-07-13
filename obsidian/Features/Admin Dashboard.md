---
tags:
  - cleanai
  - features
  - admin
---

# Admin Dashboard

**Route:** `/dashboard` · **File:** `app/dashboard/page.tsx`  
**Access:** `users.role === 'admin'`

## Capabilities

- Aggregate stats / operational panels
- Live map of reports (`components/maps/LiveMap.tsx`)
- Review citizen reports (`components/dashboard/`)
- Update status: received · rejected · scheduled_for_pickup · completed
- Assign driver + due date when scheduling pickup
- Fleet / flood / alerts-oriented widgets (maturity varies)

## APIs used

- [[Reports API]] — list all, patch status, delete
- [[Drivers API]] — list drivers
- [[Users & Alerts API]]

## Related

- [[Report Workflow]]
- [[Demo Accounts]] (`admin@cleanai.com`)
