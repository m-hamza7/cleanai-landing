---
tags:
  - cleanai
  - stack
---

# Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js **14.2.35**, React 18, TypeScript | App Router under `app/` |
| UI | Tailwind CSS 4, shadcn/ui, Radix, Lucide, Geist | `components/ui/` |
| Maps | Leaflet / react-leaflet | Optional Google reverse-geocode key |
| Backend | Node.js, Express 4 | Port **5000** default |
| Auth | JWT (`jsonwebtoken`), bcryptjs | Bearer tokens |
| Uploads | Multer | 10 MB images |
| Database | PostgreSQL via `pg` | Supabase `DATABASE_URL` |
| AI | Flask, Ultralytics YOLOv8, Torch CPU, Pillow | Port **5001** |
| Deploy | Vercel + Render | See [[Deployment]] |
| Analytics | Vercel Analytics | Frontend |

## Deep dives

- [[Frontend]]
- [[Backend]]
- [[AI Service]]
- [[Database]]
- [[Environment Variables]]
