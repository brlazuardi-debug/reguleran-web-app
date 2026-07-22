# Reguleran Musik

> Platform manajemen musik untuk tim ibadah — kelola lagu, setlist, sesi, dan jadwal dalam satu ekosistem modern.

## Fitur

- **Manajemen Lagu** — Chord, lirik, nada dasar, section, catatan per role. Transpose otomatis.
- **Role-Specific View** — Pilih peran (Gitar, Bass, Keyboard, Drum, Vokal). Tampilan menyesuaikan otomatis.
- **Setlist + Player** — Buat setlist, atur transpose per lagu, mode player sekuensial.
- **Sesi & Jadwal** — Atur jadwal latihan dan pelayanan mingguan + kalender interaktif.
- **Pitch Shifter** — Upload audio, ubah nada real-time dengan Tone.js.
- **Library Publik** — Bagikan dan jelajahi lagu dari player lain.
- **PWA** — Install sebagai aplikasi, akses offline-ready.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 |
| Auth | Clerk (Email/Password + Google OAuth) |
| Database | NeonDB (PostgreSQL) |
| Backend API | Hono 4 (Node.js) |
| File Storage | Cloudinary |
| State | Zustand 5 |
| Audio | Tone.js 15 |
| Routing | React Router 7 |

## Struktur Proyek

```
reguleran/
├── server/                   # Hono API (backend)
│   └── index.js              # CRUD endpoints + Clerk JWT + Cloudinary admin
├── src/
│   ├── components/
│   │   ├── auth/             # LoginForm, RegisterForm, ProtectedRoute
│   │   ├── audio/            # PitchShifter (Tone.js)
│   │   ├── layout/           # Navbar, Sidebar, Layout
│   │   ├── location/         # MapPicker (Leaflet)
│   │   ├── pitchlist/        # PitchCard
│   │   ├── role/             # RoleOnboardingModal, RoleBadge
│   │   ├── schedule/         # CalendarView
│   │   ├── sessions/         # SessionCard, SessionForm
│   │   ├── setlists/         # SetlistCard, SetlistForm, SongPicker, SetlistPlayer
│   │   ├── songs/            # SongCard, SongForm, ChordDisplay, TransposeSlider,
│   │   │                     # SongSectionBadge, SongSectionEditor, RoleSpecificPanel
│   │   ├── tabs/             # TabViewer (ASCII guitar/bass tabs)
│   │   └── ui/               # Button, Card, Badge, Modal, Tabs, Toast, Spinner,
│   │                         # Skeleton, EmptyState, Input, Select, Textarea, Toggle,
│   │                         # ConfirmDialog, ErrorBoundary
│   ├── hooks/                # useActiveRole
│   ├── pages/                # 18 route pages (termasuk OAuthCallback)
│   ├── services/             # db.js, auth.js, storage.js, notification.js
│   ├── stores/               # Zustand stores
│   ├── utils/                # transpose.js, calendar.js
│   ├── App.jsx               # Routes + ErrorBoundary + ClerkSync
│   ├── main.jsx              # Entry + ClerkProvider
│   └── index.css             # Global styles
├── neon-migration.sql        # PostgreSQL schema
├── .env                      # Credentials
├── railwal.json              # Railway deploy config
├── vercel.json               # Vercel deploy config
├── vite.config.js            # Vite + PWA + API proxy
└── package.json
```

## Prasyarat

- Node.js 20+
- npm 10+
- Akun [Clerk](https://dashboard.clerk.com)
- Project [NeonDB](https://console.neon.tech)
- Akun [Cloudinary](https://cloudinary.com/console)

## Instalasi

```bash
cd reguleran
npm install
```

### 1. Setup Database (NeonDB)

1. Buka [Neon Console](https://console.neon.tech) → Create project
2. Copy connection string ke `.env` → `DATABASE_URL`
3. Buka Neon SQL Editor → paste `neon-migration.sql` → Run

### 2. Setup Auth (Clerk)

```bash
npm install -g clerk
clerk auth login                 # Login ke Clerk
clerk init --app <app_id>        # Init project (set env vars)
clerk doctor                     # Verifikasi
```

Atau manual: copy `VITE_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY` dari [Clerk Dashboard](https://dashboard.clerk.com) ke `.env`.

### 3. Setup Storage (Cloudinary)

1. Buka [Cloudinary Console](https://console.cloudinary.com)
2. Dashboard → copy **Cloud Name** → `.env` `VITE_CLOUDINARY_CLOUD_NAME`
3. Settings → **Upload** → Add preset `reguleran_audio` (unsigned) → `.env` `VITE_CLOUDINARY_UPLOAD_PRESET`
4. Settings → **API Keys** → copy API Key + Secret → `.env`

### 4. Jalankan

**Terminal 1 — Backend API:**
```bash
cd server
npm install
npm run dev
# Hono API at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd reguleran
npm run dev
# Vite at http://localhost:5173
```

## Production Deploy

### Backend (Railway)

```bash
# Push ke GitHub, lalu di Railway:
# New Project → Deploy from GitHub
# Root Directory: reguleran/server
# Set env vars (CORS_ORIGIN, CLERK_SECRET_KEY, DATABASE_URL, CLOUDINARY_*)
```

### Frontend (Vercel)

```bash
# New Project → Import GitHub repo
# Root Directory: reguleran
# Build: npm run build
# Output: dist
# Set env vars (VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL, VITE_CLOUDINARY_*)
```

### Clerk Production

Di [Clerk Dashboard](https://dashboard.clerk.com):
1. Switch Development → **Production**
2. Copy `pk_live_*` dan `sk_live_*` ke env vars
3. Tambah redirect URL: `https://domain.com/oauth-callback`

## Database Schema

Lihat `neon-migration.sql` untuk schema lengkap.

**Tables**: `users`, `songs`, `setlists`, `sessions`, `public_songs`

**Key points**:
- `users.id` = TEXT (Clerk user ID)
- Auth via Clerk JWT + server middleware (no RLS)
- `songs.sections` JSONB — array section dengan roleNotes per role
- `setlists.songs` JSONB — array `{ songId, transpose, order }`
- Indexes on `user_id` columns untuk performa

## Scripts

| Perintah | Lokasi | Deskripsi |
|----------|--------|-----------|
| `npm run dev` | `reguleran/` | Vite dev server |
| `npm run build` | `reguleran/` | Build production |
| `npm run lint` | `reguleran/` | ESLint |
| `npm run dev` | `reguleran/server/` | Hono API (--watch) |
| `npm run start` | `reguleran/server/` | Hono API production |

## API Endpoints

Semua endpoint via `http://localhost:3001/api` (dev) atau production URL.

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/:collection` | List items (user-scoped) |
| GET | `/api/:collection/:id` | Get item by ID |
| POST | `/api/:collection` | Create/Upsert item |
| PUT | `/api/:collection/:id` | Update item |
| DELETE | `/api/:collection/:id` | Delete item |
| DELETE | `/api/audio/:publicId` | Delete Cloudinary audio |

Auth: `Authorization: Bearer <clerk_session_token>`

## Catatan

- Clerk user IDs format `user_2abc123` (string, bukan UUID)
- `.env` gitignored — jangan commit credentials
- Vite proxy `/api/*` → `localhost:3001` di dev
- Polling 10s untuk data updates (ganti WebSocket jika perlu latensi rendah)
- PWA auto-update via service worker

## Lisensi

MIT
