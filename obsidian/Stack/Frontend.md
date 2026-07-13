---
tags:
  - cleanai
  - stack
  - frontend
---

# Frontend

Next.js App Router marketing site + authenticated portals.

## Routes

| Route | File | Audience |
|-------|------|----------|
| `/` | `app/page.tsx` | Public [[Landing Page]] |
| `/login` | `app/login/page.tsx` | Citizen / admin login & signup |
| `/user-dashboard` | `app/user-dashboard/page.tsx` | [[Citizen Portal]] |
| `/dashboard` | `app/dashboard/page.tsx` | [[Admin Dashboard]] |
| `/driver-portal` | `app/driver-portal/page.tsx` | [[Driver Portal]] |
| `/research-papers` | `app/research-papers/page.tsx` | Academic references |

## Important modules

| Module | Role |
|--------|------|
| `lib/api-client.ts` | Typed REST client → `NEXT_PUBLIC_API_URL` |
| `components/navigation.tsx` | Top nav CTAs |
| `components/dashboard/` | Admin widgets + citizen report panels |
| `components/maps/LiveMap.tsx` | Live map UI |
| `components/about-team-section.tsx` | [[Team]] |

## Scripts

```bash
npm install
npm run dev      # next dev -H 0.0.0.0 → :3000
npm run build
npm start
npm run lint
```

## Auth storage

Client stores `authToken` and `user` in `localStorage`. Admin role redirects to `/dashboard`; others to `/user-dashboard`.

## Related

- [[Local Development]]
- [[Environment Variables]]
- [[Auth API]]
