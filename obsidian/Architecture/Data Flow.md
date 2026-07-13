---
tags:
  - cleanai
  - architecture
  - data-flow
---

# Data Flow

## Citizen report submission

```mermaid
sequenceDiagram
  participant C as Citizen UI
  participant API as Express
  participant FS as uploads/
  participant AI as Flask YOLO
  participant DB as PostgreSQL

  C->>API: POST /api/reports (image + lat/lng + JWT)
  API->>FS: save report image
  API->>DB: insert reports (status=pending)
  API->>AI: POST /classify
  AI-->>API: waste_type, severity, confidence
  API->>DB: insert ai_classification
  API-->>C: report + classification (failure non-fatal)
```

## Admin schedule → driver complete → citizen confirm

```mermaid
sequenceDiagram
  participant A as Admin
  participant API as Express
  participant D as Driver
  participant C as Citizen
  participant DB as PostgreSQL

  A->>API: PATCH status scheduled_for_pickup + driver + due
  API->>DB: update report + create cleanup_tasks
  D->>API: GET assignments
  D->>API: POST complete (photo + lat/lng)
  Note over API: Haversine ≤ 0.2 km of report
  API->>DB: task COMPLETED, report completed, pickup waiting
  C->>API: POST pickup-report confirm|reject
  alt confirm
    API->>DB: pickup confirmed
  else reject
    API->>DB: clear assignment for reassign
  end
```

## Storage locations

| Artifact | Location |
|----------|----------|
| Report photos | `backend/uploads/reports/` → `/uploads/reports/...` |
| Completion photos | `backend/uploads/completions/` |
| Structured data | Tables in [[Database]] |
| Model weights | `model/best.pt` (or `MODEL_URL` download) |

## Related

- [[System Architecture]]
- [[Report Workflow]]
- [[Reports API]]
- [[Drivers API]]
