# AGENTS.md — Reguleran

## Commands
### Web App (run from `reguleran/`)
- `npm run dev` — Vite dev server at localhost:5173
- `npm run build` — production build via Vite 8 (rolldown)
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint (ignores `server/` + `mobile/` dir)
- **Server** (separate terminal): `cd server && npm run dev` — Hono API at localhost:3001

### Mobile App (run from `reguleran/mobile/`)
- `npx expo start` — Expo dev server (scan QR with Expo Go)
- `npx expo start --android` — langsung buka di Android emulator
- `npx expo export --platform web` — export web build
- `npx tsc --noEmit` — TypeScript check (zero errors required)
- **EAS Build**: `eas build --platform android --profile preview` (APK)
- **EAS Build production**: `eas build --platform android --profile production` (AAB)

## Architecture
### Web App (React 19 + Vite 8)
- **Zustand** stores call **service layer** (`services/db.js`, `services/storage.js`). Services talk to Hono API.
- Each store calls `subscribe()` in a `useEffect` and returns the unsubscribe.
- **Zustand persist** — `viewPreferencesStore.js` uses `zustand/middleware` persist (key: `reguleran-view-preferences`).
- **Auth** Email/Password + Google Sign-In via **Clerk** React hooks (`useSignIn`, `useSignUp`). `LoginForm.jsx` / `RegisterForm.jsx` use hooks directly — no wrapper service. `App.jsx` has `<ClerkSync>` that syncs `useAuth()` to Zustand store. `<ClerkProvider>` is in `main.jsx`.
- **All routes** under `/app/*` are wrapped in `ProtectedRoute` + `Layout`.
- **PWA** via `vite-plugin-pwa` (auto service worker generation).
- **Notifications**: `services/notification.js` — pure browser Notification API (no FCM).

### Mobile App (Expo SDK 57 + NativeWind)
- **Expo Router** file-based routing in `mobile/app/`. `_layout.tsx` files define navigators (Stack, Drawer).
- **ClerkProvider** in `app/_layout.tsx` with `tokenCache` (SecureStore). Auth guard redirects based on `isSignedIn`.
- **Drawer navigator** in `app/(app)/_layout.tsx`: Dashboard, Lagu, Setlist, Jadwal, Pengaturan, Tools (6 items).
- **Zustand** stores follow the same pattern as web — `useSongStore`, `useSetlistStore`, `useSessionStore`, `useProposalStore`, `useBandProfileStore`, `useEventDocumentStore`.
- **API calls** via `hooks/useApi.ts` → `services/api.ts` (fetch wrapper with Clerk JWT).
- **All mobile screens** use NativeWind `className` for styling (monochrome palette matching web).
- **Stack layouts** for nested routes: `songs/_layout.tsx`, `setlists/_layout.tsx`, `sessions/_layout.tsx`, `proposals/_layout.tsx`.

### Backend (Hono API — `server/index.js`)
- Single Hono server with generic CRUD endpoints + Clerk JWT verification + Cloudinary admin API
- `postgres.js` client for NeonDB — tagged template literal SQL
- `@clerk/backend` — verifies `Authorization: Bearer <token>` on every request
- camelCase ↔ snake_case conversion on all requests/responses
- Polling-based subscribe (10s interval) replaces Supabase Realtime
- In-memory rate limiter (120 req/min), Hono logger
- CORS: supports web + mobile (no-origin, `exp://`, LAN IPs) via `CORS_ORIGINS` env var
- **Band Profiles** (`/api/band-profiles/*`): Generic CRUD + Cloudinary logo/foto upload
- **Proposals** (`/api/proposals/*`): Booking proposal documents with PDF generation via `@react-pdf/renderer`
- **Event Documents** (`/api/event-documents/*`): Rider + RAB per session with PDF generation
- **PDF endpoints**: `POST /api/proposals/:id/generate-pdf`, `POST /api/event-documents/:id/generate-pdf` — server-side PDF render, upload to Cloudinary as `resource_type: 'raw'`

## NeonDB Migration
- `neon-migration.sql` — run in NeonDB SQL Editor or psql before app works
- `users.id` is TEXT (Clerk user ID), not UUID
- No RLS or triggers needed (auth done via Clerk JWT + server middleware)
- Indexes on `user_id` columns for performance

## Mobile Architecture Details
- **Auth flow**: Login → `signIn.create()` → `setActive()` → redirect `/(app)`. Register → `signUp.create()` → `setActive()` → redirect.
- **SecureStore** for Clerk session tokens (not AsyncStorage).
- **Cloudinary**: `uploadAudioToCloudinary()` uses unsigned preset from browser, delete via server API.
- **Audio playback**: `expo-av` `Audio.Sound` with play/pause/seek. Pitch shifting deferred (MVP only).
- **TypeScript types** in `mobile/types/index.ts` — shared shape with web data (no auto-sync, manual copy).
- **`useApi<T>()` hook** — generic fetch with loading/error states, auto-injects Clerk JWT.
- **Transpose utility** ported from web `src/utils/transpose.js` → `mobile/utils/transpose.ts`.
- **Drawer navigation** replaces tab navigator — `DrawerContent.tsx` + `HamburgerButton.tsx`.
- **Proposal screens**: List (`proposals/index.tsx`), Create (`proposals/new.tsx`), Detail (`proposals/[id]/index.tsx`), Edit (`proposals/[id]/edit.tsx`).
- **Band Profile screen**: View/edit band info directly in app (`band-profile.tsx`).
- **Rider screen**: Sound needs + instrument + budget, all in one scrollable view (`sessions/[id]/rider.tsx`).

## Production Deploy
- **Backend (Railway)**: Import GitHub repo → Root Directory: `reguleran/server` → Set env vars (CORS_ORIGINS, CLERK_SECRET_KEY, DATABASE_URL, CLOUDINARY_*) → Deploy
- **Web Frontend (Vercel)**: Import GitHub repo → Root Directory: `reguleran` → Set env vars (VITE_CLERK_PUBLISHABLE_KEY, VITE_CLOUDINARY_*) → Deploy
- **Mobile (EAS/Play Store)**: `cd mobile && eas build --platform android --profile production` → upload AAB to Play Console
- After deploy: update Clerk Dashboard → Redirect URLs → add production URL + switch to Production instance

## Known Gaps
### Web App
- **`db.queryItems()`**: Fetches all rows then filters client-side. OK for small datasets.
- **Polling subscribe**: 10s interval instead of realtime. Add WebSocket if latency matters.
- **Cloudinary cleanup**: `deleteAudio()` is best-effort. Orphaned files possible.

### Mobile App
- **Audio pitch shifting**: Not implemented natively. MVP shows "use web app for pitch shift" note.
- **Tuner**: Placeholder screen — needs `expo-av` microphone + autocorrelation algorithm.
- **Metronome**: Visual beat only (no audio click). Needs `expo-audio` for accurate scheduling.
- **No offline support**: All data fetched from API. Add `expo-sqlite` + local cache if needed.
- **No push notifications**: `expo-notifications` not installed.

## Gotchas
### Web
- ESLint config is in `eslint.config.js` (flat config, v10) — excludes `server/` + `mobile/`.
- Tailwind uses custom monochrome palette (no brand color).
- `.env` has `VITE_*` (client) and server-only keys — server reads from same file via `--env-file`.
- Server runs separately (`server/` dir, Hono on port 3001). Vite proxies `/api/*` to it in dev.
- Clerk user IDs are strings like `user_2abc123`, not UUIDs.
- Clerk OAuth callback page at `/oauth-callback` uses `<AuthenticateWithRedirectCallback />`.
- `ClerkProvider` is in `main.jsx` (set by `clerk init` CLI), not in `App.jsx`.
- Import from `@clerk/react` (not `@clerk/clerk-react`).
- `postgres.js` tagged template literal — use `sql\`QUERY\`` syntax, never string interpolation.
- `LoginForm`/`RegisterForm` use `useSignIn`/`useSignUp` hooks directly — `auth.js` only exports `mapUser`/`mapAuthError`.

### Mobile
- `lucide-react-native` types need manual `.d.ts` declaration (RN compatibility issue with React 19).
- NativeWind v4 requires `nativewind-env.d.ts` reference file and `global.css` import in root layout.
- `react-native-reanimated/plugin` must be **last** in `babel.config.js` plugins.
- Set `"main": "expo-router/entry"` in `package.json` — **not** `index.ts`.
- `.env` vars must use `EXPO_PUBLIC_` prefix to be exposed to client.
- Create `mobile/.env` manually — not committed to git (same as web `.env`).
