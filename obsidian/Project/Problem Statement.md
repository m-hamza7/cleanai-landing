---
tags:
  - cleanai
  - project
  - problem
---

# Problem Statement

## Context

In dense coastal cities such as **Karachi**, illegal dumping and unmanaged solid waste frequently **block storm drains**. During monsoon season this contributes to **urban flooding**, traffic disruption, and public-health risk.

## Gaps in traditional response

| Gap | Effect |
|-----|--------|
| No real-time citizen channel | Incidents stay invisible until floods |
| Manual classification only | Slow triage, inconsistent severity |
| Weak field coordination | Pickups delayed or unverified |
| Little citizen feedback | No confirmation that sites were cleaned |

## CleanAI response

CleanAI closes the loop:

1. **Detect** — photo + GPS citizen report
2. **Classify** — YOLOv8 waste type / severity ([[AI Service]])
3. **Dispatch** — admin schedules pickup + assigns driver ([[Admin Dashboard]])
4. **Verify** — driver geo-proof photo within ~200 m ([[Driver Portal]])
5. **Confirm** — citizen accept / reject pickup ([[Citizen Portal]])

## Scope

| In scope | Out of / future scope |
|----------|------------------------|
| Citizen–admin–driver workflow | Full city-scale GIS productization |
| Image-based waste classification | Production satellite verification |
| Area-based Karachi pilot areas | National multi-city ops |

## Related

- [[Overview]]
- [[Report Workflow]]
- [[Landing Page]]
