---
tags:
  - cleanai
  - features
  - driver
  - routing
  - eld
---

# Driver Route Planning (ELD)

Drivers can generate OpenStreetMap routes from their current GPS position to pickup sites, with a basic trip log (start/end, distance, duration).

## Capabilities

| Action | Who | Notes |
|--------|-----|-------|
| Plan route (per task) | Driver | OSRM point-to-point → OSM polyline |
| Optimize all pickups | Driver | OSRM Trip (TSP-style stop order) |
| Start / complete trip | Driver | Trip log timestamps on `driver_routes` |
| View all planned routes | Admin | Fleet panel on [[Admin Dashboard]] |

## UI

- [[Driver Portal]] — Plan route / Optimize all / View route dialog with [[RouteMap]]
- [[Admin Dashboard]] — `FleetManagement` lists every driver’s routes and previews the selected polyline

## Backend

- Table: `driver_routes` (see [[Database]])
- Service: `backend/services/osrm.js`
- Endpoints under `/api/drivers/routes/*` (see [[Drivers API]])

## Config

| Env | Default | Purpose |
|-----|---------|---------|
| `OSRM_BASE_URL` | `https://router.project-osrm.org` | Swap to self-hosted OSRM without code changes |

## Related

- [[Driver Portal]]
- [[Admin Dashboard]]
- [[Data Flow]]
- [[Environment Variables]]
