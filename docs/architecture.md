## Synapse LMS Architecture Sketch

- **Data model**
  - `User` with opinionated persona metadata, hashed passwords, `UserRole`, and `UserStatus`.
  - `Session` tokens persisted for cookie-based auth (prep for future Supabase handoff).
  - `Course`, `Chapter`, and `Enrollment` trimmed to essentials needed for storytelling dashboards.

- **Auth flow**
  - Server-only helpers under `src/lib/auth` handle bcrypt hashing, session tokens, and request guards.
  - `/api/auth/signin`, `/api/auth/signup`, and `/api/auth/signout` return JSON and set an HTTP-only cookie named `synapse_session`.
  - Client forms use these endpoints today; easy to swap for Supabase later by reusing the same interface.

- **Experience layers**
  - Landing experience references hyve.system and p5.js via layered gradients, animated grids, and cinematic typography.
  - Footer interaction model nods to trae.ai with split columns and micro-copy.
  - Dashboard + auth screens reuse shared “glass surface” primitives for consistent UI polish.

- **Protection**
  - `getCurrentUser()` and `requireUser()` utilities gate dashboard routes server-side.
  - Middleware can be introduced later; for now, individual server components redirect unauthenticated visitors.

- **Extensibility**
  - Server actions or Supabase client logic can drop into the `lib/auth` folder without touching UI.
  - Course data seeded with narrative copy to support future marketing demos or AI content modules.

