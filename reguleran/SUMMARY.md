# Reguleran — Project Summary

## Overview
Platform manajemen musik untuk tim ibadah: kelola lagu (chord/lirik/section/role notes),
setlist, sesi mingguan, jadwal kalender, audio pitch shifter, dan library publik.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 |
| **State** | Zustand 5 |
| **Auth** | Clerk (`@clerk/react` v6) — Email/Password + Google OAuth |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` |
| **API Server** | Hono 4 (Node.js) — `server/index.js` |
| **Storage** | Cloudinary — unsigned upload + Admin API delete |
| **Audio** | Tone.js 15 — pitch shifting via Web Audio API |
| **Routing** | React Router 7 |
| **Icons** | Lucide React |
| **PWA** | vite-plugin-pwa (auto service worker) |
| **Maps** | React Leaflet / Leaflet |

## Architecture
```
reguleran/
├── server/                 # Hono API (Node.js)
│   └── index.js            # CRUD endpoints + Clerk JWT + Cloudinary admin
├── src/
│   ├── services/
│   │   ├── db.js           # fetch-based DB client (polling 10s)
│   │   ├── auth.js         # Clerk (window.Clerk) wrapper
│   │   ├── storage.js      # Cloudinary upload/delete
│   │   └── notification.js # Browser Notification API
│   ├── stores/             # Zustand (auth, song, setlist, session, role, library, pitchlist, viewPreferences)
│   ├── components/         # UI + feature components
│   ├── pages/              # 18 route pages (+ OAuthCallback)
│   ├── hooks/              # useActiveRole
│   ├── utils/              # transpose.js, calendar.js
│   ├── App.jsx             # Routes + ErrorBoundary + ClerkSync
│   └── main.jsx            # Entry + ClerkProvider
├── neon-migration.sql      # PostgreSQL schema (NeonDB)
├── vite.config.js          # Vite + PWA + API proxy
└── package.json
```

## Migrasi Supabase → NeonDB (Juli 2026)

### Yang Berubah
| Komponen | Sebelum | Sesudah |
|----------|---------|---------|
| **Database** | Supabase PostgreSQL | NeonDB (PostgreSQL) |
| **Auth** | Supabase Auth | Clerk (`@clerk/react`) |
| **Storage** | Supabase Storage | Cloudinary |
| **Realtime** | Supabase `postgres_changes` | Polling 10s interval |
| **API Layer** | `@supabase/supabase-js` langsung | Hono server (fetch-based) |
| **SDK** | `@supabase/supabase-js` | `@clerk/react` + `postgres` |

### Files Baru
- `server/index.js` — Hono API (CRUD generic + Clerk JWT verify + Cloudinary delete)
- `server/package.json` — server dependencies
- `neon-migration.sql` — schema PostgreSQL untuk NeonDB
- `src/pages/OAuthCallback.jsx` — Clerk Google OAuth callback
- `railway.json` — Railway deploy config
- `vercel.json` — Vercel deploy config

### Files Dihapus
- `src/services/supabase.js`
- `supabase-migration.sql`

### Files Diubah
- `src/services/db.js` — Supabase SDK → fetch ke server API
- `src/services/auth.js` — Supabase Auth → Clerk window.Clerk API
- `src/services/storage.js` — Supabase Storage → Cloudinary
- `src/App.jsx` — ClerkProvider + ClerkSync
- `src/stores/roleStore.js` — direct supabase → db service
- `.env` — Supabase vars → Clerk + Cloudinary + NeonDB

## Phases Completed
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| 2 | Onboarding & Role | RoleBadge, icons, onboarding_done flag |
| 3 | Song Management | CRUD, detail, editor, pagination |
| 4 | Role-Specific View | filterByRole on ChordDisplay |
| 5 | Setlist Management | SetlistPlayer, sequential play |
| 6 | Session & Schedule | Calendar, ICS export |
| 7 | Audio Pitch Shifter | Tone.js + Cloudinary upload |
| 11 | Music Notation | TabViewer |
| 12 | Dashboard & Tools | Tools Hub, RoleBadge |
| 13 | Production Hardening | ErrorBoundary, rate limiter, logging |
| 14 | Supabase → NeonDB | Clerk auth, Cloudinary storage, Hono API |

## Routes
| Path | Page | Auth |
|------|------|------|
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/oauth-callback` | OAuth Callback | Public |
| `/app` | Dashboard | Protected |
| `/app/songs` | Songs | Protected |
| `/app/songs/new` | New Song | Protected |
| `/app/songs/:id` | Song Detail | Protected |
| `/app/songs/:id/edit` | Song Editor | Protected |
| `/app/setlists` | Setlists | Protected |
| `/app/setlists/:id` | Setlist Detail | Protected |
| `/app/setlists/:id/edit` | Setlist Editor | Protected |
| `/app/sessions` | Sessions | Protected |
| `/app/sessions/:id` | Session Detail | Protected |
| `/app/sessions/:id/edit` | Session Editor | Protected |
| `/app/pitchlist` | Pitchlist | Protected |
| `/app/library` | Public Library | Protected |
| `/app/schedule` | Schedule | Protected |
| `/app/settings` | Settings | Protected |
| `*` | 404 | Public |

## Remaining Work
- Clerk Production instance (switch from Development to Production in dashboard)
- Deploy Hono API to Railway
- Deploy frontend to Vercel
- Update Clerk redirect URLs with production domain
