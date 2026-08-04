# Reguleran — Project Summary

## Overview
Platform manajemen musik untuk tim ibadah: kelola lagu (chord/lirik/section/role notes),
setlist, sesi mingguan, jadwal kalender, proposal manggung, rider teknis + RAB,
audio pitch shifter, dan library publik. Web + Mobile.

> **No Supabase.** Auth = Clerk, DB = NeonDB (PostgreSQL), API = Hono, Storage = Cloudinary.
> The pre-Neon Supabase/Firebase dependencies were removed from the repo.

## Tech Stack
| Layer | Web | Mobile |
|-------|-----|--------|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| **State** | Zustand 5 | Zustand 5 |
| **Auth** | Clerk (`@clerk/react` v6) — `useSignIn`/`useSignUp` hooks | Clerk (`@clerk/clerk-expo` v2) |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` | Same (via Hono API) |
| **API Server** | Hono 4 (Node.js) — `server/index.js` | Same |
| **Storage** | Cloudinary — unsigned upload + Admin API delete | Same |
| **PDF Gen** | @react-pdf/renderer (server-side, lazy-loaded client) | Via API |
| **Audio** | Tone.js 15 — pitch shifting via Web Audio API | expo-av (playback only) |
| **Routing** | React Router 7 | Expo Router (file-based) + Drawer |
| **Icons** | Lucide React | lucide-react-native |
| **PWA** | vite-plugin-pwa (auto service worker) | N/A (native app) |

## Architecture
```
reguleran/
├── server/                 # Hono API (Node.js) — shared backend
│   └── index.js            # Generic CRUD + Clerk JWT verify + Cloudinary admin + PDF
├── src/                    # Web App (React 19 + Vite 8)
│   ├── services/           # db.js (API client), storage.js, notification.js
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
│   │   └── (app)/          # Drawer nav: Dashboard, Lagu, Setlist, Jadwal, Tools, ...
│   ├── components/         # UI + navigation + feature components
│   ├── stores/             # Zustand stores (song, setlist, session, proposal, ...)
│   ├── services/           # api.ts, auth.ts, cloudinary.ts, tokenCache.ts
│   ├── hooks/              # useApi.ts, useActiveRole.ts
│   ├── utils/              # transpose.ts
│   └── types/              # TypeScript types
├── neon-migration.sql      # PostgreSQL schema (NeonDB) — run once
├── vite.config.js          # Vite + PWA + API proxy (/api → :3001)
├── railway.json            # Railway deploy config
├── vercel.json             # Vercel deploy config
└── package.json            # web app scripts + deps
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

No RLS — auth via Clerk JWT verification in Hono middleware.

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
| `/(app)` | Drawer (Dashboard, Lagu, Setlist, Jadwal, Pengaturan) |
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
| 14 | Supabase → NeonDB | Clerk auth, Cloudinary storage, Hono API (Supabase removed) |

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
| M7 | Audio | Audio upload + playback (expo-av play/pause/seek), Cloudinary upload. **Pitch shifting NOT implemented natively** — MVP shows "use web app for pitch shift" note. |
| M8 | Proposal, Rider | List/new/detail/edit screens, rider form + PDF |

### Web + Mobile — Current Phase (PRD-v4: Proposal Builder, Rider/RAB)
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| 0 | Documentation | README, AGENTS.md, SUMMARY.md, SETUP.md, .env.example, neon-migration update |
| 1 | Types | `src/types/index.ts` (web) + `mobile/types/index.ts` — BandProfile, Proposal, EventDocument |
| 2 | Server PDF | `@react-pdf/renderer`, 2 POST endpoints: generate-pdf (proposal + event-document) |
| 3 | Web Band Profile | Page, form, Cloudinary upload store |
| 4 | Web Proposal | List, detail, editor, setlist picker, testimonial editor, store |
| 5 | Web PDF | ProposalPDFDocument, client generate (lazy) + download |
| 6 | Web Rider+RAB | EventDocumentPage, SoundNeedsForm, InstrumentNeedsForm, BudgetTable |
| 7 | Mobile Drawer | DrawerContent, HamburgerButton, layout rewrites, lucide icons |
| 8 | Mobile Proposal | List, new, detail + PDF, edit screens |
| 9 | Mobile Rider | Sound/instrument/budget form + PDF generation |
| 10 | Hardening | `npm run build` (web), `npx tsc --noEmit` (mobile), `npm run lint` clean |

## Bugs Fixed (Audit — this cycle)
- **Web API 401 (CRITICAL)**: `services/db.js` sent `Authorization: *** <token>` — the `Bearer` scheme was missing/garbled, so the server rejected every call. Fixed to `Authorization: \`Bearer ${token}\``.
- **Login/Register blank screen (CRITICAL)**: Forms guarded on `isLoaded`/`signInLoaded` which **do not exist** in `@clerk/react` v6 (hooks return `{ signIn }`/`{ signUp }`, resource is `null` until ready). Fixed to `if (!signIn) return null` / `if (!signUp) return null`. Login now completes on `result.status === 'complete'`.
- **Login stuck on "Verifikasi diperlukan" (CRITICAL)**: Clerk v6 (`@clerk/react` 6.12.6) uses a signal-based API. `signIn.create()` returns `{ result: undefined, error: null }` (NOT a `SignInResource`), and `signIn.setActive()` does not exist. The form checked `result.status === 'complete'` → always falsy → showed the error even though FAPI returned `complete` with a `createdSessionId`. Fixed: read `signIn.status` / `signIn.createdSessionId` off the `signIn` resource, and call `clerk.setActive({ session })` via `useClerk()` (see AGENTS.md → Gotchas). Verified with Playwright: `demo@reguleran.app` lands on `/app` with dashboard data.
- **Supabase/Firebase cruft removed**: root `package.json` depended on `@supabase/server`, `@supabase/supabase-js`, `firebase` — none imported anywhere. Replaced with a clean monorepo placeholder; removed stale root `package-lock.json`.
- **Bundle size**: main chunk was 1.75 MB (Tone.js + @react-pdf statically imported). Lazy-loaded `PitchShifter` (Tone.js) and dynamically imported `generateProposalPdf` (@react-pdf). Main chunk now 320 KB (gzip 71 KB).
- **Server verified live**: `GET /api/health` → 200, unauthenticated `/api/songs` → 401, CORS allows `http://localhost:5173`.

## Portfolio & Public Demo (Aug 2026)
- **Portfolio static page** di `portfolio/` (index.html + assets/screenshots/) → **https://portfolio-reguleran.vercel.app** (project Vercel `portfolio`).
- Banner preview build: "Platform Reguleran sedang dalam tahap pengembangan fitur aktif secara berkala."
- Screenshot dari app lokal via **Playwright + Clerk impersonation ticket** (login form sempat rusak di Clerk v6 — sudah diperbaiki, lihat Bugs Fixed + Gotchas di AGENTS.md).
- Demo user Clerk: `user_3HIbWKbenMS7howSWCIJF3AHFpp` (`demo@reguleran.app`) di instance `ins_3Grd66yUUIZRSHQ7nyLc5Js629b`.

## Auth Architecture (Refactored — Simplified)
- **No wrapper service**: `LoginForm`/`RegisterForm` use Clerk's `useSignIn`/`useSignUp` hooks directly.
- **`auth.js`**: Only contains `mapUser` + `mapAuthError` helpers.
- **`authStore.js`**: Only stores `user`, `loading`, `error` + `logout` function.
- **`ClerkSync`** in `App.jsx`: Syncs `useAuth()`/`useUser()` → Zustand store for non-auth components.
- **`ProtectedRoute`**: Reads from Zustand store.
- **`useAuth()` hook**: Shorthand for store selectors.
- **No polling** for auth: Clerk React hooks handle state.

## Production Deploy Sequence (see AGENTS.md for full runbook)
1. **Clerk Dashboard**: Switch from Development → Production instance → copy keys (`pk_live_`, `sk_live_`).
2. **NeonDB**: Run `neon-migration.sql` in Neon SQL Editor.
3. **Railway** (server): Import repo → Root `reguleran/server` → Set env vars → Deploy → confirm `/api/health` 200.
4. **Vercel** (web): Import repo → Root `reguleran` → Set `VITE_*` env vars → Deploy.
5. **Clerk**: Add production redirect URLs (Vercel `/oauth-callback` + Expo scheme).
6. **EAS** (mobile): `eas build --platform android --profile production` → upload AAB.

## Remaining Work
### Before Production
- [ ] Clerk: switch from Development → Production instance
- [ ] Update `.env` + `mobile/.env` with Clerk production keys + Railway API URL + CORS
- [ ] Deploy Hono API → Railway (set `CLERK_SECRET_KEY`, `DATABASE_URL`, `CLOUDINARY_*`, `CORS_ORIGINS`)
- [ ] Run `neon-migration.sql` on NeonDB
- [ ] Deploy Frontend → Vercel (set `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`, `VITE_CLOUDINARY_*`)
- [ ] Update Clerk Dashboard redirect URLs with production domain
- [ ] Smoke test: register → song → audio upload → pitch shift → setlist → session → proposal → PDF

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
- No automated tests (no CI/CD pipeline yet)
