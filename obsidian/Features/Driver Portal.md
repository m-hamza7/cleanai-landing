---
tags:
  - cleanai
  - features
  - driver
---

# Driver Portal

**Route:** `/driver-portal` · **File:** `app/driver-portal/page.tsx`

## Capabilities

1. Register with name, phone, **area**, password
2. Login with phone + password
3. View area-scoped assignments
4. Complete job with photo + current GPS
5. Proximity enforcement: must be within **0.2 km** of report coordinates
6. Plan per-task OSM route and optimize all pickups ([[Driver Route Planning]])
7. Start / complete trip log (distance + duration)

## Supported areas (registration)

- Scheme33
- Malir 15
- Quadabad
- Shahrae faisal
- Tariq Road
- North Nazimabad

## APIs

See [[Drivers API]].

## Related

- [[Report Workflow]]
- [[Data Flow]]
- [[Admin Dashboard]]
