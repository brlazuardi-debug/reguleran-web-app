# Reguleran Musik

> Platform manajemen musik untuk tim ibadah

Kelola lagu (chord, lirik, section, role notes), setlist, sesi mingguan, jadwal kalender, audio pitch shifter, dan library publik — dalam satu platform modern, cepat, PWA-ready.

## Fitur

- **Manajemen Lagu** — Simpan chord, lirik, nada dasar, section, dan catatan per role. Transpose otomatis dengan slider.
- **Role-Specific View** — Pilih peran (Gitaris, Bassist, Keyboardist, Drummer, Vokalis). Tampilan dan catatan disesuaikan otomatis.
- **Setlist + Player** — Buat setlist, urutkan lagu, atur transpose per lagu. Mode player untuk tampilan sekuensial.
- **Sesi & Jadwal** — Atur jadwal latihan dan pelayanan mingguan. Kalender interaktif + export ICS.
- **Pitch Shifter** — Upload audio, ubah nada real-time dengan Tone.js.
- **Library Publik** — Bagikan dan jelajahi lagu dari player lain.
- **PWA** — Install sebagai aplikasi, akses offline.

## Tech Stack

| Teknologi | Kegunaan |
|---|---|
| **React 19** | UI framework |
| **Vite 8** (rolldown) | Build tool |
| **Supabase** | Auth, PostgreSQL, Storage, Realtime |
| **Zustand 5** | State management |
| **Tailwind CSS 3** | Styling (monochrome palette, dark mode) |
| **React Router 7** | Routing |
| **Tone.js 15** | Audio / Pitch Shifter |
| **Lucide React** | Ikon |
| **React Leaflet** | Peta interaktif |
| **vite-plugin-pwa** | PWA + service worker |

## Struktur Proyek

```
reguleran/
├── public/                  # Favicon, PWA icons
├── src/
│   ├── components/
│   │   ├── auth/            # LoginForm, RegisterForm, ProtectedRoute
│   │   ├── audio/           # PitchShifter (Tone.js)
│   │   ├── layout/          # Navbar, Sidebar, Layout
│   │   ├── location/        # MapPicker (Leaflet)
│   │   ├── pitchlist/       # PitchCard
│   │   ├── role/            # RoleOnboardingModal, RoleBadge
│   │   ├── schedule/        # CalendarView
│   │   ├── sessions/        # SessionCard, SessionForm
│   │   ├── setlists/        # SetlistCard, SetlistForm, SongPicker, SetlistPlayer
│   │   ├── songs/           # SongCard, SongForm, ChordDisplay, TransposeSlider,
│   │   │                    # SongSectionBadge, SongSectionEditor, RoleSpecificPanel
│   │   ├── tabs/            # TabViewer (ASCII guitar/bass tabs)
│   │   └── ui/              # Button, Card, Badge, Modal, Tabs, Toast, Spinner,
│   │                        # Skeleton, EmptyState, Input, Select, Textarea, Toggle,
│   │                        # ConfirmDialog, ErrorBoundary
│   ├── hooks/               # useActiveRole
│   ├── pages/               # 17 route pages (lihat Routes)
│   ├── services/            # supabase.js, auth.js, db.js, storage.js, notification.js
│   ├── stores/              # Zustand stores (auth, song, setlist, session, role,
│   │                        # library, pitchlist, viewPreferences)
│   ├── utils/               # transpose.js, calendar.js
│   ├── App.jsx              # Routes + ErrorBoundary
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Supabase credentials
├── supabase-migration.sql   # PostgreSQL schema + RLS + triggers
├── tailwind.config.js       # Monochrome palette, animations, fonts
├── vite.config.js           # Vite + PWA config
└── package.json
```

## Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Landing | Publik |
| `/login` | Login | Publik |
| `/register` | Register | Publik |
| `/app` | Dashboard | Protected |
| `/app/songs` | Katalog Lagu | Protected |
| `/app/songs/new` | Tambah Lagu | Protected |
| `/app/songs/:id` | Detail Lagu | Protected |
| `/app/songs/:id/edit` | Edit Lagu | Protected |
| `/app/setlists` | Setlist | Protected |
| `/app/setlists/:id` | Detail Setlist | Protected |
| `/app/setlists/:id/edit` | Edit Setlist | Protected |
| `/app/sessions` | Sesi | Protected |
| `/app/sessions/:id` | Detail Sesi | Protected |
| `/app/sessions/:id/edit` | Edit Sesi | Protected |
| `/app/pitchlist` | Pitchlist | Protected |
| `/app/library` | Library Publik | Protected |
| `/app/schedule` | Jadwal | Protected |
| `/app/settings` | Pengaturan | Protected |
| `*` | 404 | Publik |

## Memulai

### Prasyarat

- Node.js 20+
- npm 10+
- Supabase project ([dashboard](https://supabase.com/dashboard))

### Instalasi

```bash
cd reguleran
npm install
```

### Supabase Setup

1. Buka [Supabase Dashboard](https://supabase.com/dashboard/project/ynsgcrctpamllntcrbjj) → Project Settings → API
2. Copy `Project URL` dan `anon public key` ke `.env`
3. SQL Editor → buka `supabase-migration.sql` → Execute
4. **Authentication** → Providers → enable **Email** + **Google** (isi Client ID & Secret)
5. **Authentication** → Settings → set **Site URL** ke `http://localhost:5173`
6. **Storage** → Create bucket → nama: `audio`, Public bucket: ON
7. Storage → `audio` bucket → Policies → tambah:
   - `SELECT` → `true` (public read)
   - `INSERT/UPDATE/DELETE` → `auth.role() = 'authenticated'`

### Development

```bash
npm run dev
# Buka http://localhost:5173
```

### Build

```bash
npm run build
npm run preview
```

## Scripts

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |

## Database (PostgreSQL via Supabase)

Lihat `supabase-migration.sql` untuk schema lengkap.

**Tables**: `users`, `songs`, `setlists`, `sessions`, `public_songs`

**Key points**:
- `users.id` = FK ke `auth.users(id)` dengan trigger `handle_new_user()` auto-create baris saat signup
- RLS diaktifkan di semua tabel — kebijakan berbasis `auth.uid()`
- `songs.sections` JSONB — array section dengan roleNotes per role
- `setlists.songs` JSONB — array `{ songId, transpose, order }`
- `sessions.location` JSONB — `{ venue, address, contactPerson, phone, locationNotes }`

### Song Section Schema

```js
{
  id: string,
  label: 'intro' | 'verse' | 'chorus' | 'bridge' | 'ending' | 'outro' | 'interlude',
  startLine: number,        // baris lirik (0-indexed)
  customLabel?: string,
  notes?: string,
  roleNotes?: {
    guitar?:  { chordVoicing, notes, tabReference },
    bass?:    { notes, tabReference },
    keyboard?:{ chordVoicing, notes },
    drums?:   { pattern, notes, dynamics: 'soft'|'medium'|'loud' },
    vocal?:   { harmony, notes, breathMarks: number[] }
  }
}
```

## Catatan

- Semua interaksi database via service layer (`services/db.js`) — siap untuk diganti implementasinya tanpa sentuh store
- `viewPreferencesStore` persist ke localStorage via Zustand persist middleware
- PWA auto-update (service worker regenerate tiap build)
- Audio file disimpan di Supabase Storage bucket `audio`
- Notifikasi browser via `services/notification.js` (Notification API, tanpa FCM)

## Lisensi

MIT
