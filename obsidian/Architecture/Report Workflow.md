---
tags:
  - cleanai
  - architecture
  - workflow
---

# Report Workflow

Canonical status machine for waste reports.

## Statuses

| Status | Meaning |
|--------|---------|
| `pending` | New citizen submission |
| `received` | Admin acknowledged |
| `rejected` | Admin rejected (optional `rejection_reason`) |
| `scheduled_for_pickup` | Driver assigned via `cleanup_tasks` |
| `completed` | Driver finished; awaiting / done citizen pickup action |

## Pickup confirmation (post-completion)

Stored on `cleanup_tasks.pickup_report_status`:

| Value | Meaning |
|-------|---------|
| `waiting` | Driver done; citizen should respond |
| `confirmed` | Citizen accepts cleanup |
| `rejected` | Citizen disputes → reassignment path |

## Happy path

```
pending → received → scheduled_for_pickup → completed → pickup confirmed
```

## Rejection / rework paths

```
pending → received → rejected
completed → citizen reject → admin reassigns driver
```

## Runtime schema helpers

On backend startup, `ensureReportWorkflowSchema()` may add missing columns such as:

- `rejection_reason`
- `pickup_scheduled_at`
- `status_updated_at`
- `location`

## Related APIs

- Create / list / patch: [[Reports API]]
- Driver completion: [[Drivers API]]
- Visual portals: [[Citizen Portal]] · [[Admin Dashboard]] · [[Driver Portal]]
