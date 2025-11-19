## Synapse LMS

A cinematic learning platform inspired by hyve.system, p5.js sketches, trae.ai choreography, and a splash of A24 mood. The repo now ships with:

- A clean Prisma schema featuring local email/password auth, session tokens, and minimal Course/Chapter/Enrollment models.
- Cookie-based authentication with `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`, plus a reusable `getCurrentUser()` helper.
- Landing, auth, and dashboard experiences redesigned with glassmorphism, gradient grids, and tactile typography.

### Getting started

```bash
npm install
npx prisma migrate dev --name init_synapse
npm run db:seed
npm run dev
```

The development server lives at http://localhost:3000.

### Local auth seeds

| Role    | Email               | Password           |
|---------|--------------------|--------------------|
| Admin   | nova@synapse.lms   | admin.supernova    |
| Instructor | atlas@studio.ai | teach.studio       |
| Student | kai@learners.space | learn.prototype    |

Update or add personas by editing `prisma/seed.ts`.

### Project layout

- `src/lib/auth` – password hashing, zod validators, and session helpers (future Supabase swap can hook here).
- `src/app/api/auth/*` – JSON endpoints responsible for issuing/clearing HTTP-only cookies.
- `src/components/landing/*` – hero, experience grid, curriculum showcase, and CTA inspired by hyve.system + p5.js.
- `src/app/dashboard/page.tsx` – protected area that redirects unauthenticated visitors server-side.
- `docs/architecture.md` – quick architectural notes.

### Tooling

- Next.js 14 App Router
- Prisma + PostgreSQL
- TailwindCSS with custom gradients
- bcryptjs for password hashing
