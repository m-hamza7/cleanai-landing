---
tags:
  - cleanai
  - reference
---

# Directory Structure

```
cleanai-landing/
├── app/                      # Next.js pages (App Router)
├── components/               # Landing + dashboard + maps + ui
├── lib/                      # api-client, utils
├── hooks/
├── public/                   # Static assets
├── styles/
├── model/
│   └── best.pt               # YOLOv8 weights
├── backend/
│   ├── server.js
│   ├── config/database.js
│   ├── routes/
│   ├── ai-service/
│   └── uploads/reports|completions/
├── clean_ai_postgres.sql     # Canonical schema
├── clean_ai.sql              # Legacy MySQL
├── render.yaml
├── package.json              # Frontend
└── obsidian/                 # ← this vault
```

## Related

- [[00 Home]]
- [[Tech Stack]]
- [[Legacy Docs]]
