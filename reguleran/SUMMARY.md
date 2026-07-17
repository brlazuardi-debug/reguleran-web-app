# Reguleran — Project Summary

## Overview
Platform manajemen musik untuk tim ibadah: kelola lagu (chord/lirik/section/role notes),
setlist, sesi mingguan, jadwal kalender, audio pitch shifter, dan library publik.

## Tech Stack
- **React 19 + Vite 8** (rolldown bundler)
- **Supabase** — Auth, Database (PostgreSQL), Storage (audio files), Realtime subscriptions
- **Zustand 5** — state management
- **Tailwind CSS 3** — monochrome palette, dark mode default
- **Tone.js 15** — audio pitch shifting via Web Audio API
- **React Router 7** — routing
- **Lucide React** — icons
- **vite-plugin-pwa** — PWA + service worker

## Phases Completed
| Fase | Feature | Key Deliverables |
|------|---------|-----------------|
| 2 | Onboarding & Role | RoleBadge, icons (Guitar/Piano/Drum), onboarding_done flag, snake_case mapper |
| 3 | Song Management | Pagination 20/page, `/songs/new`, `/songs/:id/edit` routes, view-only SongDetail |
| 4 | Role-Specific View | filterByRole on ChordDisplay, section filtering by active role |
| 5 | Setlist Management | SetlistPlayer (sequential play), `/setlists/:id/edit` route |
| 6 | Session & Schedule | `/sessions/:id/edit` route, editor separated from view |
| 7 | Audio Pitch Shifter | Tone.js integration, Supabase Storage upload, semitone slider |
| 11 | Music Notation | TabViewer component, integrated in RoleSpecificPanel |
| 12 | Dashboard & Tools | Tools Hub section (Pitchlist/Library/Schedule), RoleBadge integration |
| 13 | Production Hardening | ErrorBoundary, ProtectedRoute for Settings, clean console.log |

## Architecture
```
src/
├── services/        # Supabase layer (auth.js, db.js, storage.js, supabase.js)
├── stores/          # Zustand (auth, song, setlist, session, role, library, pitchlist, viewPreferences)
├── components/      # UI + feature components (songs/, setlists/, sessions/, audio/, role/, tabs/, schedule/, layout/, auth/)
├── pages/           # 17 route pages
├── hooks/           # useActiveRole
├── utils/           # transpose.js, calendar.js
└── App.jsx          # Routes + ErrorBoundary
```

## Remaining Setup (Manual)
1. Run `supabase-migration.sql` in Supabase SQL Editor
2. Create `audio` storage bucket + RLS policies
3. Enable Google Auth provider in Supabase Dashboard
4. Configure Site URL + Redirect URLs for OAuth
5. Add missing columns: `onboarding_done`, `display_name` on `users`; `audio_file_name` on `public_songs`

## Remaining Code Fixes
- **snake_case mismatch**: stores send camelCase (`isPublic`) but DB expects snake_case (`is_public`). Only `roleStore.js` has a mapper. Need helper in `db.js` or per-store mapper.
- **`authStore.register()` double-write**: calls `db.setItem('users', ...)` but trigger `handle_new_user()` already inserts row.
- **`db.queryItems()`**: uses client-side `.filter()` instead of Supabase `.eq()`.
