# Reguleran

Platform manajemen musik untuk tim ibadah — kelola lagu, setlist, sesi mingguan, jadwal kalender, dan dokumen manggung. Web + Mobile.

## Tech Stack

| Layer | Web | Mobile |
|-------|-----|--------|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| **State** | Zustand 5 | Zustand 5 |
| **Auth** | Clerk (`@clerk/react` v6) | Clerk (`@clerk/clerk-expo` v2) |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` | via Hono API (sama) |
| **API Server** | Hono 4 — `server/index.js` | via Hono API (sama) |
| **Storage** | Cloudinary (unsigned upload + Admin API delete) | via Hono API (sama) |
| **Audio** | Tone.js 15 (pitch shifting via Web Audio API) | expo-av (playback only) |
| **Routing** | React Router 7 | Expo Router (file-based) + Drawer |
| **Icons** | Lucide React | lucide-react-native |

## Architecture

```
reguleran/
├── server/                 # Hono API (Node.js) — shared backend
│   └── index.js            # CRUD endpoints + Clerk JWT + Cloudinary admin
├── src/                    # Web App (React 19 + Vite 8)
│   ├── services/           # db.js, auth.js, storage.js, notification.js
│   ├── stores/             # Zustand stores
│   ├── components/         # UI + feature components
│   ├── pages/              # All route pages
│   ├── hooks/              # Custom hooks
│   ├── utils/              # transpose.js, calendar.js, formatDate.js
│   ├── types/              # TypeScript type definitions
│   ├── App.jsx             # Routes + ErrorBoundary + ClerkSync
│   └── main.jsx            # Entry + ClerkProvider
├── mobile/                 # Mobile App (React Native + Expo SDK 57)
│   ├── app/                # Expo Router (file-based routing)
│   │   ├── _layout.tsx     # ClerkProvider + auth guard
│   │   ├── (auth)/         # login, register
│   │   └── (app)/          # Drawer nav: Dashboard, Lagu, Setlist, Jadwal, ...
│   ├── components/         # UI + feature components
│   ├── stores/             # Zustand stores
│   ├── services/           # api.ts, auth.ts, cloudinary.ts, tokenCache.ts
│   ├── hooks/              # useApi.ts, useActiveRole.ts
│   ├── utils/              # transpose.ts
│   └── types/              # TypeScript types
├── neon-migration.sql      # PostgreSQL schema (NeonDB)
├── vite.config.js          # Vite + PWA + API proxy
└── package.json
```

## Features

- **Songs** — Chord, lirik, section management, transpose, role-specific notes
- **Setlists** — Drag-reorder songs with transpose per song, sequential player
- **Sessions** — Recurring weekly schedules, location, setlist linking, ICS export
- **Audio Pitch Shifter** — Tone.js-powered pitch shifting with Cloudinary upload
- **Public Library** — Share songs publicly across users
- **Dashboard** — Upcoming sessions, quick stats, tools hub
- **Role Views** — Filter chord display by instrument role (guitar, bass, keyboard, drums, vocal)
- **Proposals** — Booking proposal documents (PDF) for venues
- **Rider + RAB** — Technical rider and budget breakdown per event session

## Commands

### Web App (from `reguleran/`)
```bash
npm run dev          # Vite dev server at localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint (flat config)
```

### Server (from `reguleran/server`)
```bash
npm run dev          # Hono API at localhost:3001
npm start            # Production start
```

### Mobile App (from `reguleran/mobile/`)
```bash
npx expo start       # Expo dev server (scan QR with Expo Go)
npx expo start --android  # Open directly in Android emulator
npx tsc --noEmit     # TypeScript check (zero errors required)
```

## Database

NeonDB (PostgreSQL). Run `neon-migration.sql` in NeonDB SQL Editor before first use.

No RLS — auth is handled via Clerk JWT verification in the Hono middleware.

## Production Deploy

- **Backend (Railway):** Import repo → Root: `reguleran/server` → Set env vars → Deploy
- **Frontend (Vercel):** Import repo → Root: `reguleran` → Set VITE_* env vars → Deploy
- **Mobile (EAS):** `eas build --platform android --profile production` → Upload AAB to Play Console
