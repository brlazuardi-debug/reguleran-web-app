# AGENTS.md — Reguleran

## Commands
### Web App (run from `reguleran/`)
- `npm run dev` — Vite dev server at localhost:5173 (proxies `/api` → localhost:3001)
- `npm run build` — production build via Vite 8 (rolldown)
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint (ignores `server/` + `mobile/` dirs)

### Server (run from `reguleran/server/`)
- `npm run dev` — Hono API at localhost:3001 (reads `../.env` via `--env-file`)
- `npm start` — production start (same)

### Mobile App (run from `reguleran/mobile/`)
- `npx expo start` — Expo dev server (scan QR with Expo Go)
- `npx expo start --android` — langsung buka di Android emulator
- `npx expo export --platform web` — export web build
- `npx tsc --noEmit` — TypeScript check (zero errors required)
- **EAS Build**: `eas build --platform android --profile preview` (APK)
- **EAS Build production**: `eas build --platform android --profile production` (AAB)

## Architecture
### Web App (React 19 + Vite 8)
- **Zustand** stores call **service layer** (`services/db.js`, `services/storage.js`). `db.js` is the API client: it reads the Clerk JWT via `window.Clerk.session.getToken()` and sends `Authorization: Bearer <token>`.
- Each store calls `subscribe()` (10s polling) in a `useEffect` and returns the unsubscribe.
- **Zustand persist** — `viewPreferencesStore.js` uses `zustand/middleware` persist (key: `reguleran-view-preferences`).
- **Auth** Email/Password + Google Sign-In via **Clerk** React hooks (`useSignIn`, `useSignUp`). `LoginForm.jsx` / `RegisterForm.jsx` use hooks directly — no wrapper service. `App.jsx` has `<ClerkSync>` that syncs `useAuth()`/`useUser()` to Zustand. `<ClerkProvider>` is in `main.jsx`.
  - **Clerk v6 hooks return `{ signIn }` / `{ signUp }` (no `isLoaded`).** Guard with `if (!signIn) return null` — the resource is `null` until loaded, then populated. Do NOT check `isLoaded` (removed in v6).
  - `signIn.create({ identifier, password })` → on `result.status === 'complete'` call `signIn.setActive({ session: result.createdSessionId })`. (`status` still exists on the resource; only the hook's `isLoaded` was removed.)
- **All routes** under `/app/*` are wrapped in `ProtectedRoute` + `Layout`.
- **PWA** via `vite-plugin-pwa` (auto service worker generation).
- **Notifications**: `services/notification.js` — pure browser Notification API (no FCM).
- **Code-splitting**: `PitchShifter` (Tone.js, `audio` chunk) is `React.lazy`; `generateProposalPdf` (@react-pdf/renderer) is dynamically imported. Keeps the main bundle small.

### Mobile App (Expo SDK 57 + NativeWind)
- **Expo Router** file-based routing in `mobile/app/`. `_layout.tsx` files define navigators (Stack, Drawer).
- **ClerkProvider** in `app/_layout.tsx` with `tokenCache` (SecureStore). Auth guard redirects based on `isSignedIn`.
- **Drawer navigator** in `app/(app)/_layout.tsx`: Dashboard, Lagu, Setlist, Jadwal, Pengaturan (5 items).
- **Zustand** stores follow the same pattern as web — `useSongStore`, `useSetlistStore`, `useSessionStore`, `useProposalStore`, `useBandProfileStore`, `useEventDocumentStore`.
- **API calls** via `hooks/useApi.ts` → `services/api.ts` (fetch wrapper with Clerk JWT, sends `Authorization: Bearer <token>`).
- **All mobile screens** use NativeWind `className` for styling (monochrome palette matching web).
- **Stack layouts** for nested routes: `songs/_layout.tsx`, `setlists/_layout.tsx`, `sessions/_layout.tsx`, `proposals/_layout.tsx`.

### Backend (Hono API — `server/index.js`)
- Single Hono server: generic CRUD endpoints + Clerk JWT verification + Cloudinary admin API.
- `postgres.js` client for NeonDB — tagged template literal SQL.
- `@clerk/backend` — verifies `Authorization: Bearer <token>` on every `/api/*` request via the **standalone** `verifyToken` import (NOT `clerk.verifyToken()`).
- camelCase ↔ snake_case conversion on all requests/responses.
- Polling-based subscribe (10s interval) replaces realtime (no Supabase/WebSocket).
- In-memory rate limiter (120 req/min), Hono logger.
- CORS: supports web + mobile (no-origin, `exp://`, LAN IPs) via `CORS_ORIGINS` / `CORS_ORIGIN` env var.
- **Band Profiles** (`/api/band-profiles/*`): Generic CRUD + Cloudinary logo/foto upload.
- **Proposals** (`/api/proposals/*`): Booking proposal documents with PDF generation via `@react-pdf/renderer`.
- **Event Documents** (`/api/eventDocuments/*`): Rider + RAB per session with PDF generation.
- **PDF endpoints**: `POST /api/proposals/:id/generate-pdf`, `POST /api/eventDocuments/:id/generate-pdf` — server-side PDF render, upload to Cloudinary as `resource_type: 'raw'`.

## NeonDB Migration
- `neon-migration.sql` (at `reguleran/neon-migration.sql`) — run in NeonDB SQL Editor or psql before the app works.
- `users.id` is `TEXT` (Clerk user ID), not UUID.
- No RLS or triggers needed (auth done via Clerk JWT + server middleware).
- Indexes on `user_id` columns for performance.

## Mobile Architecture Details
- **Auth flow**: Login → `signIn.create()` → `setActive()` → redirect `/(app)`. Register → `signUp.create()` → `setActive()` → redirect.
- **SecureStore** for Clerk session tokens (not AsyncStorage).
- **Cloudinary**: `uploadAudioToCloudinary()` uses unsigned preset from browser, delete via server API.
- **Audio playback**: `expo-av` `Audio.Sound` with play/pause/seek. Pitch shifting is web-only (Tone.js); mobile shows a "use web app for pitch shift" note.
- **TypeScript types** in `mobile/types/index.ts` — shared shape with web data (no auto-sync, manual copy).
- **`useApi<T>()` hook** — generic fetch with loading/error states, auto-injects Clerk JWT.
- **Transpose utility** ported from web `src/utils/transpose.js` → `mobile/utils/transpose.ts`.
- **Drawer navigation** replaces tab navigator — `DrawerContent.tsx` + `HamburgerButton.tsx`.
- **Proposal screens**: List (`proposals/index.tsx`), Create (`proposals/new.tsx`), Detail (`proposals/[id]/index.tsx`), Edit (`proposals/[id]/edit.tsx`).
- **Band Profile screen**: View/edit band info directly in app (`band-profile.tsx`).
- **Rider screen**: Sound needs + instrument + budget, all in one scrollable view (`sessions/[id]/rider.tsx`).

## Production Deploy — Step-by-Step Runbook (zero-error target)

Goal: a fully integrated system where web, mobile, and API all talk to the **same** Clerk Production instance, **same** NeonDB, **same** Cloudinary, with no 401s and no CORS errors.

### Phase 0 — Accounts & keys
1. Create a **Clerk Production instance** (Dashboard → "Create production instance" or switch the existing one to Production). Note: Dev and Prod are separate instances with separate keys.
2. In Clerk Dashboard → **API Keys**, copy:
   - Publishable key `pk_live_...`
   - Secret key `sk_live_...`
3. Create a **NeonDB production project**; copy the connection string (`postgresql://...?sslmode=require`).
4. In **Cloudinary**, create an **unsigned upload preset** (e.g. `reguleran_audio`) and note cloud name + API key/secret.

### Phase 1 — Database
5. Run `reguleran/neon-migration.sql` in the production NeonDB SQL Editor. Confirm tables exist (`users`, `songs`, …).

### Phase 2 — Backend on Railway
6. Railway → New Project → Deploy from GitHub repo. Set **Root Directory: `reguleran/server`**.
7. Add env vars (Settings → Variables):
   - `PORT=3001`
   - `CORS_ORIGINS=https://<vercel-domain>,https://<www-vercel-domain>,exp://localhost:8081,exp://<tunnel>` (comma-separated; the server also auto-allows `exp://` and `http://192.168.*`)
   - `DATABASE_URL=<neon prod url>`
   - `CLERK_SECRET_KEY=sk_live_...`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
8. Deploy. Railway gives a URL like `https://reguleran-api.up.railway.app`.
9. **Verify**: `curl https://<railway-url>/api/health` → `{"status":"ok"}`. (Unauthenticated `/api/...` must return 401, never 200.)

### Phase 3 — Frontend on Vercel
10. Vercel → New Project → import repo. Set **Root Directory: `reguleran`**.
11. Add env vars (Settings → Environment Variables):
    - `VITE_CLERK_PUBLISHABLE_KEY=pk_live_...`
    - `VITE_API_URL=https://<railway-url>/api`
    - `VITE_CLOUDINARY_CLOUD_NAME=<cloud>`
    - `VITE_CLOUDINARY_UPLOAD_PRESET=reguleran_audio`
12. Deploy. Vercel gives `https://reguleran.vercel.app` (or your custom domain).
13. **Verify**: open the site → register a new account via the form (must complete, not loop). Log in → `/app` dashboard loads with data.

### Phase 4 — Clerk redirect URLs (critical)
14. Clerk Dashboard → **Redirect URLs**, add:
    - `https://<vercel-domain>/oauth-callback` (web Google OAuth callback)
    - `exp://localhost:8081/--/` and your EAS `scheme`/`exp://` for mobile
    - Any custom domain you mapped.
15. If you have a custom domain, switch the Clerk instance + keys to it and re-paste the updated `pk_live_` / `sk_live_` into Vercel/Railway.

### Phase 5 — Mobile (EAS / Play Store)
16. In `reguleran/mobile/.env` set:
    - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`
    - `EXPO_PUBLIC_API_URL=https://<railway-url>/api`
    - `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud>`
    - `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=reguleran_audio`
17. `cd reguleran/mobile && npx tsc --noEmit` (must be zero errors) → `eas build --platform android --profile production`.
18. Upload the AAB to Play Console. For physical devices, `EXPO_PUBLIC_API_URL` must be the public Railway URL (not `localhost`).

### Phase 6 — Smoke test (integration proof)
19. Web: register → create a song → upload audio → open pitch shifter → create a setlist → create a session → create a proposal → generate PDF. All calls return 2xx in the browser Network tab.
20. Mobile: log in with the same Clerk account → pull songs → open a song detail → confirm audio plays.
21. CORS: confirm no `access-control` errors in browser console when calling the API.

## Portfolio (static showcase)
- Static page di `portfolio/` (index.html + assets/screenshots/), ter-deploy ke **https://portfolio-reguleran.vercel.app** (project Vercel `portfolio`).
- Banner atas: "Preview Build: Platform Reguleran sedang dalam tahap pengembangan fitur aktif secara berkala."
- Screenshot di-capture dari app yang jalan lokal (Vite :5173 + server :3001) via **Playwright** dengan login **impersonation ticket** Clerk — bukan login form (form rusak di Clerk v6, lihat Gotchas).
- Workflow screenshot:
  1. Jalankan server + Vite lokal dengan `.env` yang punya `CORS_ORIGIN` berisi `http://localhost:5173`.
  2. Buat ticket: `clerk impersonate --app app_3Grd69jUBqOl9WLklW70w7Kkp6Z --instance ins_3Grd66yUUIZRSHQ7nyLc5Js629b user_3HIbWKbenMS7howSWCIJF3AHFpp --yes` → ambil `ticket=` dari URL hasil.
  3. Script Playwright: `signIn.create({ strategy: 'ticket', ticket })` → `setActive()` → screenshot tiap route.
  4. Perlu **data seeded** di NeonDB (lagu/setlist/sesi/proposal) supaya screenshot berisi.
- Deploy: `cd portfolio && vercel --prod --yes` (CLI global, ter-login sebagai `brlazuardi-5555`).

## Known Gaps
### Web App
- **`db.queryItems()`**: Fetches all rows then filters client-side. OK for small datasets.
- **Polling subscribe**: 10s interval instead of realtime. Add WebSocket if latency matters.
- **Cloudinary cleanup**: `deleteAudio()` is best-effort. Orphaned files possible.

### Mobile App
- **Audio pitch shifting**: Not implemented natively. MVP shows "use web app for pitch shift" note.
- **No offline support**: All data fetched from API. Add `expo-sqlite` + local cache if needed.
- **No push notifications**: `expo-notifications` not installed.

## Gotchas
### Web
- ESLint config is in `eslint.config.js` (flat config, v10) — excludes `server/` + `mobile/`.
- Tailwind uses custom monochrome palette (no brand color).
- `.env` has `VITE_*` (client) and server-only keys — server reads from the same file via `--env-file`.
- Server runs separately (`server/` dir, Hono on port 3001). Vite proxies `/api/*` to it in dev.
- Clerk user IDs are strings like `user_2abc123`, not UUIDs.
- Clerk OAuth callback page at `/oauth-callback` uses `<AuthenticateWithRedirectCallback />`.
- `ClerkProvider` is in `main.jsx` (set by `clerk init` CLI), not in `App.jsx`.
- Import from `@clerk/react` (not `@clerk/clerk-react`).
- `postgres.js` tagged template literal — use `sql\`QUERY\`` syntax, never string interpolation.
- `LoginForm`/`RegisterForm` use `useSignIn`/`useSignUp` hooks directly — `auth.js` only exports `mapUser`/`mapAuthError`.
- **Clerk v6 hooks have NO `isLoaded`**: `useSignIn()` returns `{ signIn, errors, fetchStatus }`. Guard with `if (!signIn) return null`. The old `if (!isLoaded || !signInLoaded) return null` renders a **blank screen** (the bug we fixed).
- **`@clerk/backend` v1**: `verifyToken` is a standalone import, NOT a method on `createClerkClient()` result. `clerk.verifyToken()` throws → every authed request 401s. Use `import { verifyToken } from '@clerk/backend'` + pass `secretKey`.
- **`Authorization` header MUST be `Bearer <token>`** — `services/db.js` MUST send the literal word `Bearer`. A missing/garbled scheme (e.g. `*** <token>`) makes every call 401. (This was a real bug; fixed.)
- **JSONB columns come back as JSON-strings** if seed data was double-encoded (`"..."` string inside jsonb). Fix: `UPDATE t SET c = (c #>> '{}')::jsonb WHERE jsonb_typeof(c) = 'string'`.
- **CORS in dev**: `.env` must set `CORS_ORIGIN=http://localhost:5173` (or `CORS_ORIGINS` comma-separated) or API calls from Vite dev get blocked.
- **No Supabase / Firebase**: those deps were removed. Do not re-add `@supabase/*` or `firebase` to any `package.json`.

### Mobile
- `lucide-react-native` types need manual `.d.ts` declaration (RN compatibility issue with React 19).
- NativeWind v4 requires `nativewind-env.d.ts` reference file and `global.css` import in root layout.
- `react-native-reanimated/plugin` must be **last** in `babel.config.js` plugins.
- Set `"main": "expo-router/entry"` in `package.json` — **not** `index.ts`.
- `.env` vars must use `EXPO_PUBLIC_` prefix to be exposed to client.
- Create `mobile/.env` manually — not committed to git (same as web `.env`).
