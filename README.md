# Reguleran

Platform manajemen musik untuk tim ibadah — kelola lagu, setlist, sesi mingguan, jadwal kalender, proposal manggung, rider teknis, dan RAB. Web + Mobile.

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
| **PDF** | @react-pdf/renderer (server-side render) | via API |
| **Icons** | Lucide React | lucide-react-native |

## Architecture

```
reguleran/
├── server/                 # Hono API (Node.js) — shared backend
│   └── index.js            # CRUD endpoints + Clerk JWT + Cloudinary admin
├── src/                    # Web App (React 19 + Vite 8)
│   ├── services/           # db.js, storage.js, notification.js
│   ├── stores/             # Zustand stores (auth, song, setlist, session, proposal, ...)
│   ├── components/         # UI + feature components (auth/, proposals/, riders/, ...)
│   ├── pages/              # 20+ route pages
│   ├── hooks/              # useAuth, useActiveRole
│   ├── utils/              # transpose.js, calendar.js, generateProposalPdf.js
│   ├── types/              # TypeScript type definitions
│   ├── context/            # ThemeContext
│   ├── App.jsx             # Routes + ErrorBoundary + ClerkSync
│   └── main.jsx            # Entry + ClerkProvider
├── mobile/                 # Mobile App (React Native + Expo SDK 57)
│   ├── app/                # Expo Router (file-based routing)
│   │   ├── _layout.tsx     # ClerkProvider + auth guard
│   │   ├── (auth)/         # login, register
│   │   └── (app)/          # Drawer nav: Dashboard, Lagu, Setlist, Jadwal, Tools, ...
│   ├── components/         # UI + navigation components
│   ├── stores/             # Zustand stores
│   ├── services/           # api.ts, auth.ts, cloudinary.ts, tokenCache.ts
│   ├── hooks/              # useApi.ts, useActiveRole.ts
│   ├── utils/              # transpose.ts
│   └── types/              # TypeScript types
├── neon-migration.sql      # PostgreSQL schema (NeonDB)
├── vite.config.js          # Vite + PWA + API proxy
├── railway.json            # Railway deploy config
├── vercel.json             # Vercel deploy config
└── package.json
```

## Features

- **Songs** — Chord, lirik, section management, transpose, role-specific notes (drum, gitar, bas, keyboard, vokal)
- **Setlists** — Drag-reorder songs with transpose per song, sequential player
- **Sessions** — Recurring weekly schedules, location, setlist linking, ICS export
- **Band Profile** — Nama, genre, kontak, logo/foto upload (Cloudinary)
- **Booking Proposals** — Proposal manggung dengan venue, rate, testimonial, PDF generation
- **Rider + RAB** — Technical rider (sound system, instrument, stage layout) + budget breakdown per sesi
- **Audio Pitch Shifter** — Tone.js-powered pitch shifting with Cloudinary upload
- **Public Library** — Share songs publicly across users
- **Dashboard** — Upcoming sessions, quick stats, tools hub
- **Role Views** — Filter chord display by instrument role
- **PWA** — Auto service worker, installable, offline-ready via workbox

## Commands

### Web App (from `reguleran/`)
```bash
npm run dev          # Vite dev server at localhost:5173
npm run build        # Production build (PWA included)
npm run preview      # Preview production build
npm run lint         # ESLint (flat config, ignores server/ + mobile/)
```

### Server (from `reguleran/server`)
```bash
npm run dev          # Hono API at localhost:3001
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

NeonDB (PostgreSQL). Run `neon-migration.sql` in NeonDB SQL Editor before first use.

| Table | Description |
|-------|-------------|
| `users`, `songs`, `setlists`, `sessions` | Core data |
| `public_songs` | Shared songs library |
| `band_profiles` | Band info + logo |
| `proposals` | Booking proposals |
| `event_documents` | Rider + RAB per session |

No RLS — auth via Clerk JWT verification in Hono middleware.

## Production Deploy

1. **Clerk Dashboard** → Switch to Production instance → copy keys
2. **NeonDB** → Run `neon-migration.sql`
3. **Backend (Railway)** → Import repo → Root: `reguleran/server` → Set env vars → Deploy
4. **Frontend (Vercel)** → Import repo → Root: `reguleran` → Set VITE_* env vars → Deploy
5. **Mobile (EAS)** → `eas build --platform android --profile production` → Upload AAB to Play Console
