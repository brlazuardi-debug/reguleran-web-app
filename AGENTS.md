# AGENTS.md — Reguleran

## Commands (run from `reguleran/`)
- `npm run dev` — Vite dev server at localhost:5173
- `npm run build` — production build via Vite 8 (rolldown)
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint

## Architecture
- **React 19 + Vite 8** (rolldown, not rollup). `manualChunks` in vite.config must be a **function**, not an object.
- **Zustand** stores call **service layer** (`services/db.js`, `services/auth.js`, `services/storage.js`). Services abstract data access — currently Supabase SDK directly.
- Each store calls `subscribe()` in a `useEffect` and returns the unsubscribe.
- **Zustand persist** — `viewPreferencesStore.js` uses `zustand/middleware` persist (key: `reguleran-view-preferences`).
- **Auth** Email/Password + Google Sign-In via Supabase Auth (`services/auth.js`). Store calls `init()` in `App.jsx`.
- **All routes** under `/app/*` are wrapped in `ProtectedRoute` + `Layout`.
- **Tables** (PostgreSQL via Supabase): `users`, `songs`, `setlists`, `sessions`, `publicSongs`. RLS enabled.
- **Song sections**: Field `sections[]` on `songs` doc — each with `{ id, label, startLine, customLabel, notes, roleNotes }`. RoleNotes field per role (`guitar`, `bass`, `keyboard`, `drums`, `vocal`) with role-specific subfields.
- **User role**: `instrument_role` column on `users` table — values: `'guitar'|'bass'|'keyboard'|'drums'|'vocal'|null`. Read by `roleStore.fetchRole()` on auth state change.
- **View preferences**: `showAllRoles` toggle stored in localStorage via Zustand persist.
- **Storage**: `services/storage.js` — Supabase Storage (bucket: `audio`, public).
- **PWA** via `vite-plugin-pwa` (auto service worker generation).
- **Notifications**: `services/notification.js` — pure browser Notification API (no FCM).

## Supabase Integration (Complete)
- `services/auth.js` — Supabase Auth (signInWithPassword, signUp, signInWithOAuth Google, onAuthStateChange)
- `services/db.js` — Supabase client (insert, update, upsert, delete, select, realtime subscriptions via `postgres_changes`)
- `services/storage.js` — Supabase Storage (upload, getPublicUrl, remove)
- `handle_new_user()` trigger auto-creates `users` row on Auth signup
- RLS policies enforce per-user data isolation

## Known Gaps
- **snake_case mismatch**: Most stores send camelCase fields (e.g. `isPublic`) but PostgreSQL expects snake_case (`is_public`). Only `roleStore.js` has a `mapUser()` mapper. A helper in `db.js` or per-store mapper is needed.
- **`authStore.register()` double-write**: Calls `db.setItem('users', ...)` but `handle_new_user()` trigger already inserts the row. Works via upsert but needs cleanup.
- **`db.queryItems()`**: Uses client-side `.filter()` instead of Supabase `.eq()` filter for efficiency.
- **Supabase `setItem` uses `upsert`**: OK for now, but should use proper `update` for existing rows.

## Gotchas
- ESLint config is in `eslint.config.js` (flat config, v10).
- Tailwind uses custom monochrome palette (no brand color).
- `.env` has both `VITE_SUPABASE_*` (client) and `SUPABASE_*` (server-only) keys.
- Audio files stored in Supabase Storage (persistent, unlike previous Object URL approach).
- `supabase-migration.sql` must be run manually in Supabase SQL Editor before the app works.
- User row auto-created via trigger on `auth.users` insert — no need to create manually.
