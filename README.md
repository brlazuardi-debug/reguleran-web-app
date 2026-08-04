# Reguleran

Platform manajemen musik untuk tim ibadah — kelola lagu, setlist, sesi mingguan, jadwal kalender, proposal manggung, rider teknis, dan RAB. Web + Mobile.

> **Preview Build:** Platform Reguleran sedang dalam tahap pengembangan fitur aktif secara berkala. Live: https://portfolio-reguleran.vercel.app

## Portfolio
Showcase statis (screenshot app asli + fitur + tech stack) di `portfolio/`, deploy ke **https://portfolio-reguleran.vercel.app**. Screenshot di-capture via Playwright dengan impersonation ticket Clerk (lihat `AGENTS.md` → Portfolio untuk workflow lengkap).

## Local Setup
Lihat `reguleran/SETUP.md` untuk panduan lengkap menjalankan web + server + mobile secara lokal (env files, NeonDB migration, install, first-run troubleshooting).

## Tech Stack

| Layer | Web | Mobile |
|-------|-----|--------|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| **State** | Zustand 5 | Zustand 5 |
| **Auth** | Clerk (`@clerk/react` v6) — `useSignIn`/`useSignUp` hooks | Clerk (`@clerk/clerk-expo` v2) |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` | via Hono API (sama) |
| **API Server** | Hono 4 — `server/index.js` | via Hono API (sama) |
| **Storage** | Cloudinary (unsigned upload + Admin API delete) | via Hono API (sama) |
| **Audio** | Tone.js 15 (pitch shifting via Web Audio API) | expo-av (playback only) |
| **Routing** | React Router 7 | Expo Router (file-based) + Drawer |
| **PDF** | @react-pdf/renderer (server-side render, lazy-loaded client) | via API |
| **Icons** | Lucide React | lucide-react-native |

> **No Supabase.** Auth, database, and realtime were migrated to Clerk + NeonDB + Hono. Do not reintroduce `@supabase/*` or `firebase` (removed from the repo — see `AGENTS.md` → Gotchas).

## Architecture

```
reguleran/
├── server/                 # Hono API (Node.js) — shared backend
│   └── index.js            # Generic CRUD + Clerk JWT verify + Cloudinary admin + PDF
├── src/                    # Web App (React 19 + Vite 8)
│   ├── services/           # db.js (API client), storage.js (Cloudinary), notification.js
│   ├── stores/             # Zustand (auth, song, setlist, session, role, proposal, ...)
│   ├── components/         # UI + feature components (auth, proposals, riders, layout, audio)
│   ├── pages/              # 25+ route pages
│   ├── hooks/              # useAuth, useActiveRole
│   ├── utils/              # transpose.js, calendar.js, generateProposalPdf.js (lazy)
│   ├── types/              # TypeScript type definitions
│   ├── context/            # ThemeContext
│   ├── App.jsx             # Routes + ErrorBoundary + ClerkSync
│   └── main.jsx            # Entry + ClerkProvider
├── mobile/                 # Mobile App (React Native + Expo SDK 57)
│   ├── app/                # Expo Router (file-based routing)
│   │   ├── _layout.tsx     # ClerkProvider + auth guard
│   │   ├── (auth)/         # login, register
│   │   └── (app)/          # Drawer nav: Dashboard, Lagu, Setlist, Jadwal, ...
│   ├── components/         # UI + navigation + feature components
│   ├── stores/             # Zustand stores
│   ├── services/           # api.ts, auth.ts, cloudinary.ts, tokenCache.ts
│   ├── hooks/              # useApi.ts, useActiveRole.ts
│   ├── utils/              # transpose.ts
│   └── types/              # TypeScript types
├── neon-migration.sql      # PostgreSQL schema (NeonDB) — run once before first use
├── vite.config.js          # Vite + PWA + API proxy (/api → :3001)
├── railway.json            # Railway deploy config
├── vercel.json             # Vercel deploy config
└── package.json            # web app scripts + deps
```

### Data flow (web)
1. Clerk (`@clerk/react`) holds the session. `ClerkSync` in `App.jsx` syncs `useAuth()`/`useUser()` into the `authStore` (Zustand).
2. `services/db.js` reads the JWT via `window.Clerk.session.getToken()` and sends `Authorization: Bearer <token>` on every request.
3. The Hono API (`server/index.js`) verifies the token with `@clerk/backend`'s standalone `verifyToken`, then runs the SQL with `postgres.js`.
4. Zustand stores call `subscribe()` (10s polling) to keep lists fresh. All writes go through `addItem`/`updateItem`/`deleteItem`.

### Data flow (mobile)
1. `@clerk/clerk-expo` holds the session; `tokenCache` (SecureStore) persists it.
2. `hooks/useApi.ts` → `services/api.ts` fetches with `Authorization: Bearer <token>` from `getToken()`.
3. Same Hono API + NeonDB as the web app.

## Features

- **Songs** — Chord, lirik, section management, transpose, role-specific notes (drum, gitar, bas, keyboard, vokal)
- **Setlists** — Drag-reorder songs with transpose per song, sequential player
- **Sessions** — Recurring weekly schedules, location, setlist linking, ICS export
- **Band Profile** — Nama, genre, kontak, logo/foto upload (Cloudinary)
- **Booking Proposals** — Proposal manggung dengan venue, rate, testimonial, PDF generation
- **Rider + RAB** — Technical rider (sound system, instrument, stage layout) + budget breakdown per sesi
- **Audio Pitch Shifter** — Tone.js-powered pitch shifting with Cloudinary upload (web only; mobile shows playback-only)
- **Public Library** — Share songs publicly across users
- **Dashboard** — Upcoming sessions, quick stats, tools hub
- **Role Views** — Filter chord display by instrument role
- **PWA** — Auto service worker, installable, offline-ready via workbox

## Commands

### Web App (from `reguleran/`)
```bash
npm run dev          # Vite dev server at localhost:5173 (proxies /api → :3001)
npm run build        # Production build (PWA included)
npm run preview      # Preview production build
npm run lint         # ESLint (flat config, ignores server/ + mobile/)
```

### Server (from `reguleran/server`)
```bash
npm run dev          # Hono API at localhost:3001 (reads ../.env via --env-file)
npm start            # Production start
```

### Mobile App (from `reguleran/mobile/`)
```bash
npx expo start                # Expo dev server
npx expo start --android      # Open directly in Android emulator
npx tsc --noEmit              # TypeScript check (zero errors required)
eas build --platform android --profile preview   # APK
eas build --platform android --profile production # AAB (Play Store)
```

## Database

NeonDB (PostgreSQL). Run `neon-migration.sql` (located at `reguleran/neon-migration.sql`) in the NeonDB SQL Editor before first use.

| Table | Description |
|-------|-------------|
| `users`, `songs`, `setlists`, `sessions` | Core data |
| `public_songs` | Shared songs library |
| `band_profiles` | Band info + logo |
| `proposals` | Booking proposals |
| `event_documents` | Rider + RAB per session |

- `users.id` is `TEXT` (Clerk user ID), not UUID.
- No RLS — auth via Clerk JWT verification in Hono middleware.
- Indexes on `user_id` columns (and `session_id` / `status` where noted) for performance.

## Production Deploy (step-by-step)

1. **Clerk Dashboard** → switch from Development → Production instance → copy the production publishable + secret keys.
2. **NeonDB** → create a production project → run `neon-migration.sql` in its SQL Editor.
3. **Backend (Railway)** → import repo → Root Directory: `reguleran/server` → set env vars (`CORS_ORIGINS`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `CLOUDINARY_*`, `PORT`) → Deploy. Confirm `GET /api/health` returns `{"status":"ok"}`.
4. **Frontend (Vercel)** → import repo → Root Directory: `reguleran` → set `VITE_*` env vars (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL` = Railway URL `/api`, `VITE_CLOUDINARY_*`) → Deploy.
5. **Clerk Dashboard** → add production redirect URLs (Vercel domain `/oauth-callback`, and the Expo scheme for mobile).
6. **Mobile (EAS)** → `eas build --platform android --profile production` → upload AAB to Play Console. Set `EXPO_PUBLIC_API_URL` to the Railway URL.

See `AGENTS.md` → Production Deploy for the full runbook and env-var reference.
