# Reguleran — Project Summary

## Overview
Platform manajemen musik untuk tim ibadah: kelola lagu (chord/lirik/section/role notes),
setlist, sesi mingguan, jadwal kalender, audio pitch shifter, dan library publik.
Tersedia sebagai **Web App** (React) dan **Mobile App** (React Native / Expo).

## Tech Stack
| Layer | Web | Mobile |
|-------|-----|--------|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| **State** | Zustand 5 | Zustand 5 |
| **Auth** | Clerk (`@clerk/react` v6) | Clerk (`@clerk/clerk-expo` v2) |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` | Same (via Hono API) |
| **API Server** | Hono 4 (Node.js) — `server/index.js` | Same |
| **Storage** | Cloudinary — unsigned upload + Admin API delete | Same |
| **Audio** | Tone.js 15 — pitch shifting via Web Audio API | expo-av (playback only) |
| **Routing** | React Router 7 | Expo Router (file-based) |
| **Icons** | Lucide React | lucide-react-native |
| **PWA** | vite-plugin-pwa (auto service worker) | N/A (native app) |
| **Maps** | React Leaflet / Leaflet | N/A |

## Architecture
```
reguleran/
├── server/                 # Hono API (Node.js) — shared backend
│   └── index.js            # CRUD endpoints + Clerk JWT + Cloudinary admin
├── src/                    # Web App (React 19 + Vite 8)
│   ├── services/           # db.js, auth.js, storage.js, notification.js
│   ├── stores/             # Zustand (auth, song, setlist, session, role, ...)
│   ├── components/         # UI + feature components
│   ├── pages/              # 18 route pages
│   ├── hooks/              # useActiveRole
│   ├── utils/              # transpose.js, calendar.js
│   ├── App.jsx             # Routes + ErrorBoundary + ClerkSync
│   └── main.jsx            # Entry + ClerkProvider
├── mobile/                 # Mobile App (React Native + Expo SDK 57) — BARU
│   ├── app/                # Expo Router (file-based routing)
│   │   ├── _layout.tsx     # ClerkProvider + auth guard
│   │   ├── (auth)/         # login, register
│   │   └── (app)/          # tabs: Dashboard, Lagu, Setlist, Jadwal, Pengaturan
│   ├── components/         # UI + feature components (Button, SongCard, PitchShifterPanel)
│   ├── stores/             # Zustand (song, setlist, session, role)
│   ├── services/           # api.ts (fetch), auth.ts (Clerk), cloudinary.ts, tokenCache.ts
│   ├── hooks/              # useApi.ts, useActiveRole.ts
│   ├── utils/              # transpose.ts (ported from web)
│   └── types/              # TypeScript types (shared schema)
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
### Web App (React)
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

### Mobile App (Expo) — BARU
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| M0 | Expo Setup | Expo SDK 57, Expo Router, NativeWind, Tailwind config |
| M1 | API Layer | api.ts (fetch wrapper), auth.ts (Clerk token), cloudinary.ts |
| M2 | Auth | Login/Register screens, ClerkProvider, token cache (SecureStore) |
| M3 | Data Layer | TypeScript types, Zustand stores (4), useApi hook, transpose utility |
| M4 | Navigation | 5-tab navigator, UI components (Button, Input, EmptyState, Toast) |
| M5 | Songs | List, create, detail, edit, ChordDisplay, audio upload + playback |
| M6 | Setlist, Sessions, Dashboard | Setlist CRUD + song picker, session CRUD, dashboard stats |
| M7 | Audio | PitchShifterPanel (expo-av play/pause/seek), Cloudinary upload via DocumentPicker |

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

## Phases In Progress / Baru
### Fase 15+ — Proposals, Band Profile, Event Documents (Rider+RAB)
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| 0 | Documentation Cleanup | README.md, AGENTS.md, SUMMARY.md update |
| 1 | Database & Types | Tabel + tipe TypeScript web + mobile |
| 2 | Server PDF Endpoints | @react-pdf/renderer + POST generate-pdf |
| 3 | Web Band Profile | Page, form, Cloudinary upload |
| 4 | Web Proposal Builder | CRUD, setlist picker, testimonial editor |
| 5 | Web PDF Proposal | Client-side PDF render |
| 6 | Web Rider + RAB | Sound needs, budget table, PDF |
| 7 | Mobile Drawer Nav | Drawer replaces tab navigator |
| 8 | Mobile Proposal | List, detail, generate PDF |
| 9 | Mobile Rider | View + generate |

## Remaining Work
### Web App
- [ ] Clerk: switch from Development → Production instance
- [ ] Deploy Hono API → Railway
- [ ] Deploy Frontend → Vercel
- [ ] Update Clerk redirect URLs dengan domain production

### Mobile App
- [ ] M8 — Build & Deploy ke Play Store (EAS Build, APK/AAB)
- [ ] M9 — iOS (Xcode, App Store Connect)
- [ ] Tuner: implementasi autocorrelation pitch detection via expo-av microphone
- [ ] Metronome: audio click track (scheduling via expo-audio)
- [ ] Native audio pitch shifting (react-native-audio-pitch-shift atau WebView + Tone.js)
