---
tags:
  - cleanai
  - reference
  - glossary
---

# Glossary

| Term | Meaning |
|------|---------|
| **CleanAI** | This FYP waste-reporting + cleanup platform |
| **Citizen** | End user who submits and confirms reports |
| **Admin** | Operator who triages and assigns pickups |
| **Driver** | Field worker completing geotagged cleanups |
| **Report** | Photo + GPS waste incident record |
| **AI classification** | YOLO output: waste type, severity, confidence |
| **Cleanup task** | Row linking a report to an assigned driver |
| **Pickup confirm** | Citizen accept/reject after driver completion |
| **Severity** | `low` / `medium` / `high` from detection heuristics |
| **Haversine check** | ≤ 0.2 km proximity rule for driver completion |
| **Supabase** | Hosted PostgreSQL used via `DATABASE_URL` |
| **YOLO / YOLOv8** | Object detection model for waste classes |
| **JWT** | Bearer token for API auth |
| **FYP** | Final Year Project (BCS-7E) |

## Related

- [[Report Workflow]]
- [[Overview]]
