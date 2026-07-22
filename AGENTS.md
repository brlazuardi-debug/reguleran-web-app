# AGENTS.md — Reguleran

## Commands (run from `reguleran/`)
- `npm run dev` — Vite dev server at localhost:5173
- `npm run build` — production build via Vite 8 (rolldown)
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint (ignores `server/` dir)
- **Server** (separate terminal): `cd server && npm run dev` — Hono API at localhost:3001

## Architecture
- **React 19 + Vite 8** (rolldown). `manualChunks` in vite.config must be a **function**, not an object.
- **Zustand** stores call **service layer** (`services/db.js`, `services/auth.js`, `services/storage.js`). Services talk to our Hono API.
- Each store calls `subscribe()` in a `useEffect` and returns the unsubscribe.
- **Zustand persist** — `viewPreferencesStore.js` uses `zustand/middleware` persist (key: `reguleran-view-preferences`).
- **Auth** Email/Password + Google Sign-In via **Clerk** (React SDK). `services/auth.js` wraps Clerk JS SDK. `App.jsx` has `<ClerkSync>`. `<ClerkProvider>` is in `main.jsx`.
- **All routes** under `/app/*` are wrapped in `ProtectedRoute` + `Layout`.
- **Database**: NeonDB (PostgreSQL). Schema in `neon-migration.sql`.
- **Song sections**: Field `sections[]` on `songs` doc — each with `{ id, label, startLine, customLabel, notes, roleNotes }`. RoleNotes field per role (`guitar`, `bass`, `keyboard`, `drums`, `vocal`) with role-specific subfields.
- **User role**: `instrument_role` column on `users` table — values: `'guitar'|'bass'|'keyboard'|'drums'|'vocal'|null`. Read by `roleStore.fetchRole()` on auth state change.
- **View preferences**: `showAllRoles` toggle stored in localStorage via Zustand persist.
- **Storage**: Audio files in **Cloudinary** (upload via unsigned preset from browser, delete via server API).
- **PWA** via `vite-plugin-pwa` (auto service worker generation).
- **Notifications**: `services/notification.js` — pure browser Notification API (no FCM).

## Backend (Hono API — `server/`)
- `server/index.js` — single-file Hono server with generic CRUD endpoints + Clerk JWT verification + Cloudinary admin API
- `postgres.js` client for NeonDB — tagged template literal SQL
- `@clerk/backend` — verifies `Authorization: Bearer <token>` on every request
- `cloudinary` — Admin API for file deletion
- camelCase ↔ snake_case conversion on all requests/responses
- Polling-based subscribe (10s interval) replaces Supabase Realtime
- In-memory rate limiter (120 req/min), Hono logger, configurable CORS origin

## NeonDB Migration
- `neon-migration.sql` — run in NeonDB SQL Editor or psql before app works
- `users.id` is TEXT (Clerk user ID), not UUID
- No RLS or triggers needed (auth done via Clerk JWT + server middleware)
- Indexes on `user_id` columns for performance

## Production Deploy
- **Backend (Railway)**: Import GitHub repo → Root Directory: `reguleran/server` → Set env vars (CORS_ORIGIN, CLERK_SECRET_KEY, DATABASE_URL, CLOUDINARY_*) → Deploy
- **Frontend (Vercel)**: Import GitHub repo → Root Directory: `reguleran` → Set env vars (VITE_CLERK_PUBLISHABLE_KEY, VITE_CLOUDINARY_*) → Deploy
- After deploy: update Clerk Dashboard → Redirect URLs → add production URL + switch to Production instance for live keys

## Known Gaps
- **`authStore.register()` double-write**: Calls `db.setItem('users', ...)` after Clerk signup. Works via UPSERT in the server.
- **`db.queryItems()`**: Fetches all rows then filters client-side. OK for small datasets.
- **Polling subscribe**: 10s interval instead of realtime. Add WebSocket if latency matters.
- **Cloudinary cleanup**: `deleteAudio()` is best-effort. Orphaned files possible.

## Gotchas
- ESLint config is in `eslint.config.js` (flat config, v10) — excludes `server/` since it's a separate Node package.
- Tailwind uses custom monochrome palette (no brand color).
- `.env` has `VITE_*` (client) and server-only keys — server reads from same file via `--env-file`.
- Server runs separately (`server/` dir, Hono on port 3001). Vite proxies `/api/*` to it in dev.
- Clerk user IDs are strings like `user_2abc123`, not UUIDs.
- Clerk OAuth callback page at `/oauth-callback` uses `<AuthenticateWithRedirectCallback />`.
- `ClerkProvider` is in `main.jsx` (set by `clerk init` CLI), not in `App.jsx`.
- Import from `@clerk/react` (not `@clerk/clerk-react`).
- `postgres.js` tagged template literal — use `sql\`QUERY\`` syntax, never string interpolation.
