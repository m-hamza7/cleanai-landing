---
tags:
  - cleanai
  - reference
  - legacy
---

# Legacy Docs

Root-level Markdown files in the git repo are **historical / uneven**. Prefer this Obsidian vault + source code for current truth.

## Still useful for context

| File | Topic |
|------|-------|
| `ARCHITECTURE.md` | Diagrams / roadmap (verify against code) |
| `DEMO_GUIDE.md` | Presentation walkthrough |
| `IMPLEMENTATION_SUMMARY.md` | What was built (era-dependent) |
| `USER_PORTAL_README.md` | Portal feature notes |
| `GOOGLE_MAPS_INTEGRATION.md` | Maps key setup |
| `MOBILE_TESTING_GUIDE.md` / `MOBILE_ACCESS_GUIDE.md` | Device testing |
| `TEST_CASES.md` | Test inventory |

## Likely outdated

| File | Why |
|------|-----|
| `README.md` | Still mentions early localStorage / “backend planned” era |
| `QUICK_START.md` | localStorage-era demo |
| `backend/README.md` | Describes XAMPP MySQL |
| `BACKEND_SETUP_COMPLETE.md` | Early MySQL notes |
| `*_FIXED.md`, `ALL_ISSUES_FIXED.md`, `LOGIN_FIXED.md` | Session scratchpads |

## Source of truth checklist

1. `clean_ai_postgres.sql`
2. `lib/api-client.ts`
3. `backend/routes/*.js`
4. `render.yaml`
5. Notes in this vault (linked from [[00 Home]])
