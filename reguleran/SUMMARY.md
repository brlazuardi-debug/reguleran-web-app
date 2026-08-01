# Reguleran — Project Summary

## Overview
Platform manajemen musik untuk tim ibadah: kelola lagu (chord/lirik/section/role notes),
setlist, sesi mingguan, jadwal kalender, proposal manggung, rider teknis + RAB,
audio pitch shifter, dan library publik. Web + Mobile.

## Tech Stack
| Layer | Web | Mobile |
|-------|-----|--------|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| **State** | Zustand 5 | Zustand 5 |
| **Auth** | Clerk (`@clerk/react` v6) — `useSignIn`/`useSignUp` hooks | Clerk (`@clerk/clerk-expo` v2) |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` | Same (via Hono API) |
| **API Server** | Hono 4 (Node.js) — `server/index.js` | Same |
| **Storage** | Cloudinary — unsigned upload + Admin API delete | Same |
| **PDF Gen** | @react-pdf/renderer (server-side, uploaded to Cloudinary) | Same |
| **Audio** | Tone.js 15 — pitch shifting via Web Audio API | expo-av (playback only) |
| **Routing** | React Router 7 | Expo Router (file-based) + Drawer |
| **Icons** | Lucide React | lucide-react-native |
| **PWA** | vite-plugin-pwa (auto service worker) | N/A (native app) |
| **Maps** | React Leaflet / Leaflet | N/A |

## Architecture
```
reguleran/
├── server/                 # Hono API (Node.js) — shared backend
│   └── index.js            # CRUD endpoints + Clerk JWT + Cloudinary admin
├── src/                    # Web App (React 19 + Vite 8)
│   ├── services/           # db.js, storage.js, notification.js
│   ├── stores/             # Zustand (auth, song, setlist, session, role, proposal, ...)
│   ├── components/         # UI + feature components (auth, proposals, riders, layout)
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
│   ├── components/         # UI + navigation + feature components
│   ├── stores/             # Zustand stores (song, setlist, session, proposal, ...)
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

## Database Tables
| Table | Indexes | Notes |
|-------|---------|-------|
| `users` | — | `id TEXT` (Clerk user ID) |
| `songs` | `user_id` | Core song data |
| `setlists` | `user_id` | Setlist collections |
| `sessions` | `user_id` | Event sessions |
| `public_songs` | `user_id` | Public song library |
| `band_profiles` | `user_id` | Band info + logo |
| `proposals` | `user_id`, `status` | Booking proposals |
| `event_documents` | `user_id`, `session_id` | Rider & RAB |

## Routes (Web)
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
| `/app/sessions/:sessionId/rider` | Rider & RAB | Protected |
| `/app/proposals` | Proposal List | Protected |
| `/app/proposals/new` | Proposal Editor | Protected |
| `/app/proposals/:id` | Proposal Detail | Protected |
| `/app/proposals/:id/edit` | Proposal Editor | Protected |
| `/app/band-profile` | Band Profile | Protected |
| `/app/pitchlist` | Pitchlist | Protected |
| `/app/library` | Public Library | Protected |
| `/app/schedule` | Schedule | Protected |
| `/app/settings` | Settings | Protected |
| `*` | 404 | Public |

## Routes (Mobile — Expo Router)
| Path | Screen |
|------|--------|
| `/` | Auth gate (redirect to `(app)` or `(auth)/login`) |
| `/(auth)/login` | Login |
| `/(auth)/register` | Register |
| `/(app)` | Drawer (Dashboard, Lagu, Setlist, Jadwal, Pengaturan, Tools) |
| `/(app)/songs` | Song list |
| `/(app)/songs/new` | New song |
| `/(app)/songs/[id]` | Song detail |
| `/(app)/songs/[id]/edit` | Song editor |
| `/(app)/setlists` | Setlist list |
| `/(app)/setlists/[id]` | Setlist detail |
| `/(app)/sessions` | Session list |
| `/(app)/sessions/new` | New session |
| `/(app)/sessions/[id]` | Session detail |
| `/(app)/sessions/[id]/rider` | Rider & RAB |
| `/(app)/proposals` | Proposal list |
| `/(app)/proposals/new` | New proposal |
| `/(app)/proposals/[id]` | Proposal detail |
| `/(app)/proposals/[id]/edit` | Edit proposal |
| `/(app)/band-profile` | Band profile |
| `/(app)/settings` | Settings |
| `/(app)/tools` | Tools hub |
| `/(app)/tools/metronome` | Metronome |
| `/(app)/tools/tuner` | Tuner |

## Phases Completed

### Web App — Legacy Phases
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

### Mobile App — Legacy Phases
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| M0 | Expo Setup | Expo SDK 57, Expo Router, NativeWind, Tailwind config |
| M1 | API Layer | api.ts (fetch wrapper), auth.ts (Clerk token), cloudinary.ts |
| M2 | Auth | Login/Register screens, ClerkProvider, token cache (SecureStore) |
| M3 | Data Layer | TypeScript types, Zustand stores, useApi hook, transpose utility |
| M4 | Navigation | Tab navigator (later upgraded to Drawer), UI components |
| M5 | Songs | List, create, detail, edit, ChordDisplay, audio upload + playback |
| M6 | Setlist, Sessions, Dashboard | Setlist CRUD + song picker, session CRUD, dashboard stats |
| M7 | Audio | PitchShifterPanel (expo-av play/pause/seek), Cloudinary upload |

### Web + Mobile — Current Phase (PRD-v4: Proposal Builder, Rider/RAB)
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| 0 | Documentation | README, AGENTS.md, SUMMARY.md, .env.example, neno-migration update |
| 1 | Types | `src/types/index.ts` (web) + `mobile/types/index.ts` — BandProfile, Proposal, EventDocument |
| 2 | Server PDF | `@react-pdf/renderer`, 2 POST endpoints: generate-pdf (proposal + event-document) |
| 3 | Web Band Profile | Page, form, Cloudinary upload store |
| 4 | Web Proposal | List, detail, editor, setlist picker, testimonial editor, store |
| 5 | Web PDF | ProposalPDFDocument, client generate + download |
| 6 | Web Rider+RAB | EventDocumentPage, SoundNeedsForm, InstrumentNeedsForm, BudgetTable |
| 7 | Mobile Drawer | DrawerContent, HamburgerButton, layout rewrites, lucide icons |
| 8 | Mobile Proposal | List, new, detail + PDF, edit screens |
| 9 | Mobile Rider | Sound/instrument/budget form + PDF generation |
| 10 | Hardening | `npm run build` (web), `npx tsc --noEmit` (mobile), `npm run lint` clean |

## Portfolio & Public Demo (Aug 2026)
- **Portfolio static page** di `portfolio/` (index.html + assets/screenshots/) → **https://portfolio-reguleran.vercel.app** (project Vercel `portfolio`).
- Banner preview build: "Platform Reguleran sedang dalam tahap pengembangan fitur aktif secara berkala."
- Screenshot dari app lokal via **Playwright + Clerk impersonation ticket** (login form rusak di Clerk v6, lihat Gotchas di AGENTS.md).
- Demo user Clerk: `user_3HIbWKbenMS7howSWCIJF3AHFpp` (`demo@reguleran.app`) di instance `ins_3Grd66yUUIZRSHQ7nyLc5Js629b`.

## Bugs Fixed (Aug 2026)
- **Server auth 401 semua request**: `@clerk/backend` v1 — `verifyToken` adalah standalone import, bukan method `clerk.verifyToken()`. Fix di `server/index.js`.
- **Seed data tampil sebagai string**: data seed double-encoded (string JSON di dalam kolom jsonb). Fix di DB: `UPDATE t SET c = (c #>> '{}')::jsonb WHERE jsonb_typeof(c) = 'string'`.
- **Server listen port salah**: `PORT` env dibaca tapi tidak diteruskan ke `serve({ port })`.
- **CORS dev**: `.env` `CORS_ORIGINS` butuh `http://localhost:5173`.

## Auth Architecture (Refactored Jul 2026 — Simplified)
- **No wrapper service**: `LoginForm`/`RegisterForm` use Clerk's `useSignIn`/`useSignUp` hooks directly
- **`auth.js`**: Only contains `mapUser` + `mapAuthError` helpers (24 lines)
- **`authStore.js`**: Only stores `user`, `loading`, `error` + `logout` function (18 lines)
- **`ClerkSync`** in `App.jsx`: Syncs `useAuth()` → Zustand store for non-auth components
- **`ProtectedRoute`**: Reads from Zustand store
- **`useAuth()` hook**: Shorthand for store selectors
- **No polling**: Removed 2s `onAuthChange` interval + `waitForClerk()` — Clerk React hooks handle state

## Production Deploy Sequence
1. **Clerk Dashboard**: Switch from Development → Production instance → copy keys
2. **NeonDB**: Run `neon-migration.sql` in Neon SQL Editor
3. **Railway** (server): Import repo → Root `reguleran/server` → Set env vars → Deploy
4. **Vercel** (web): Import repo → Root `reguleran` → Set `VITE_*` env vars → Deploy
5. **EAS** (mobile): `eas build --platform android --profile production` → upload AAB

## Remaining Work
### Before Production
- [ ] Clerk: switch from Development → Production instance
- [ ] Update `.env` + `mobile/.env` with Clerk production keys + Railway API URL + CORS
- [ ] Deploy Hono API → Railway (set `CLERK_SECRET_KEY`, `DATABASE_URL`, `CLOUDINARY_*`, `CORS_ORIGINS`)
- [ ] Run `neon-migration.sql` on NeonDB
- [ ] Deploy Frontend → Vercel (set `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`, `VITE_CLOUDINARY_*`)
- [ ] Update Clerk Dashboard redirect URLs with production domain

### Mobile App (Post-MVP)
- [ ] EAS Build + Play Store release
- [ ] iOS (Xcode build, App Store Connect)
- [ ] Tuner: autocorrelation pitch detection via expo-av microphone
- [ ] Metronome: audio click track via expo-audio
- [ ] Native audio pitch shifting

### Known Accepted Gaps (MVP)
- Polling subscribe (10s) instead of realtime WebSocket
- Client-side filtering in `queryItems()` — OK for small datasets
- Cloudinary cleanup best-effort (orphaned files possible)
- Rate limiter in-memory (not per-endpoint, not shared across instances)
- No tests (no CI/CD pipeline)
