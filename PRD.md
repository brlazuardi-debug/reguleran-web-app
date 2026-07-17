# Product Requirements Document — Reguleran

> **Versi:** 1.0
> **Status:** Draft
> **Last Updated:** 2026-07-17

---

## 1. Product Overview

**Reguleran** adalah platform manajemen musik untuk tim ibadah/gereja yang membantu musisi mengelola lagu, setlist, jadwal latihan, dan komunikasi peran instrumen dalam satu aplikasi web modern.

**Visi:** Menjadi pusat kendali digital untuk setiap pelayanan musik — dari manajemen repertoar, koordinasi jadwal, hingga eksekusi saat ibadah.

**Misi:** Menyederhanakan workflow tim musik dengan antarmuka yang cepat, responsif, dan fokus pada peran masing-masing musisi.

---

## 2. Problem Statement

Tim musik ibadah/gereja menghadapi masalah:

| Problem | Dampak |
|---------|--------|
| Lagu tersebar di WA, Google Docs, foto, dan file audio | Tidak ada source of truth, versi kacau |
| Setlist berubah-ubah tanpa dokumentasi | Kekacauan saat ibadah |
| Catatan per instrumen tidak terstruktur | Bassist tidak bisa lihat catatan khusus bass |
| Jadwal latihan/manggung tidak terpusat | Bentrok jadwal, lupa jam |
| Transpose lagu harus manual di buku | Lambat, rawan salah |
| Audio tidak terintegrasi dengan chord/lyrics | Harus buka app terpisah |

---

## 3. Target Users

### Primary: Tim Musik Gereja/Ibadah
- **Music Director / Leader** — Mengelola repertoar, membagi peran, mengatur jadwal
- **Instrument Players** — Gitaris, Bassist, Keyboardist, Drummer, Vokalis — butuh akses chord + catatan sesuai peran masing-masing

### Secondary
- **Band umum** — Latihan mingguan, manajemen setlist
- **Solo musisi** — Katalog pribadi + transposer + pitch shifter

---

## 4. Feature Requirements (Epics & User Stories)

### Epic 1: Authentication & User Management

| ID | User Story | Prio |
|----|-----------|------|
| AUTH-1 | Sebagai pengguna, saya bisa mendaftar dengan email/password | P0 |
| AUTH-2 | Sebagai pengguna, saya bisa masuk dengan Google OAuth | P0 |
| AUTH-3 | Sebagai pengguna, saya bisa logout | P0 |
| AUTH-4 | Sebagai pengguna, route yang dilindungi redirect ke login jika belum auth | P0 |
| AUTH-5 | Sebagai pengguna, saya bisa mengatur peran instrumen (gitar/bass/keyboard/drums/vokal) | P0 |
| AUTH-6 | Sebagai pengguna baru, saya melihat onboarding untuk memilih peran | P1 |
| AUTH-7 | Sebagai pengguna, saya bisa toggle dark/light mode | P1 |

### Epic 2: Song Management

| ID | User Story | Prio |
|----|-----------|------|
| SONG-1 | Sebagai pengguna, saya bisa membuat lagu baru dengan judul, artis, nada dasar, BPM | P0 |
| SONG-2 | Sebagai pengguna, saya bisa menulis lirik + chord dengan notasi `[Chord]` | P0 |
| SONG-3 | Sebagai pengguna, saya bisa mengedit dan menghapus lagu | P0 |
| SONG-4 | Sebagai pengguna, saya bisa mencari lagu berdasarkan judul/artis | P0 |
| SONG-5 | Sebagai pengguna, saya bisa filter lagu berdasarkan nada dasar | P0 |
| SONG-6 | Sebagai pengguna, saya bisa sort lagu (terbaru/judul/artis/BPM) | P0 |
| SONG-7 | Sebagai pengguna, saya bisa mengatur bagian lagu (Intro, Verse, Chorus, dll) | P0 |
| SONG-8 | Sebagai pengguna, saya bisa transpose chord secara real-time (-5 s/d +5 semitone) | P0 |
| SONG-9 | Sebagai pemain instrumen, saya bisa menambahkan catatan spesifik per peran di setiap bagian lagu | P0 |
| SONG-10 | Sebagai pemain, saya hanya melihat catatan sesuai peran saya (kecuali toggle all roles aktif) | P0 |
| SONG-11 | Sebagai pengguna, saya bisa membagikan lagu ke library publik | P1 |
| SONG-12 | Sebagai pengguna, saya bisa upload file audio (mp3/wav/ogg) per lagu | P1 |
| SONG-13 | Sebagai pengguna, saya bisa mendengarkan audio + pitch shift real-time | P1 |

### Epic 3: Setlist Management

| ID | User Story | Prio |
|----|-----------|------|
| SET-1 | Sebagai pengguna, saya bisa membuat setlist dengan nama dan deskripsi | P0 |
| SET-2 | Sebagai pengguna, saya bisa menambah/menghapus lagu ke setlist | P0 |
| SET-3 | Sebagai pengguna, saya bisa mengatur urutan lagu di setlist | P0 |
| SET-4 | Sebagai pengguna, saya bisa mengatur transpose per lagu di setlist | P1 |
| SET-5 | Sebagai pengguna, saya bisa mengedit dan menghapus setlist | P0 |

### Epic 4: Session & Schedule Management

| ID | User Story | Prio |
|----|-----------|------|
| SES-1 | Sebagai pengguna, saya bisa membuat sesi rutin (nama, hari, jam, lokasi) | P0 |
| SES-2 | Sebagai pengguna, saya bisa mengaitkan setlist ke sesi | P0 |
| SES-3 | Sebagai pengguna, saya bisa toggle aktif/nonaktif sesi | P0 |
| SES-4 | Sebagai pengguna, saya bisa melihat jadwal dalam bentuk kalender mingguan | P1 |
| SES-5 | Sebagai pengguna, saya bisa export jadwal ke ICS (iCal/Google Calendar) | P2 |
| SES-6 | Sebagai pengguna, saya mendapat notifikasi browser 1 jam sebelum sesi | P1 |
| SES-7 | Sebagai pengguna, saya bisa menambahkan detail lokasi + kontak person | P1 |

### Epic 5: Public Library

| ID | User Story | Prio |
|----|-----------|------|
| LIB-1 | Sebagai pengguna, saya bisa melihat lagu yang dibagikan oleh pengguna lain | P1 |
| LIB-2 | Sebagai pengguna, saya bisa mencari lagu publik berdasarkan judul/artis/key | P1 |

### Epic 6: Dashboard

| ID | User Story | Prio |
|----|-----------|------|
| DASH-1 | Sebagai pengguna, saya melihat statistik (total lagu, setlist, sesi aktif) | P0 |
| DASH-2 | Sebagai pengguna, saya melihat sesi upcoming | P0 |
| DASH-3 | Sebagai pengguna, saya melihat status peran instrumen | P0 |
| DASH-4 | Sebagai pengguna, saya bisa akses quick actions (tambah lagu, buat setlist, atur jadwal) | P1 |

### Epic 7: Audio Processing

| ID | User Story | Prio |
|----|-----------|------|
| AUD-1 | Sebagai pengguna, saya bisa upload audio file (drag-drop atau klik) | P1 |
| AUD-2 | Sebagai pengguna, saya bisa preview audio sebelum upload | P1 |
| AUD-3 | Sebagai pengguna, saya bisa memutar audio dengan pitch shift (-5 s/d +5) | P1 |
| AUD-4 | Sebagai pengguna, audio terhapus otomatis saat lagu dihapus | P1 |

### Epic 8: Data Privacy & Security

| ID | User Story | Prio |
|----|-----------|------|
| SEC-1 | Sebagai pengguna, data saya hanya bisa diakses oleh saya (RLS) | P0 |
| SEC-2 | Sebagai pengguna, lagu publik hanya bisa dibaca, tidak bisa diedit oleh orang lain | P0 |
| SEC-3 | Sebagai pengguna, password saya tidak disimpan di client | P0 |

---

## 5. Technical Architecture

### 5.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                       │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ React 19│  │  Zustand │  │  PWA Service Worker   │  │
│  │  SPA    │  │  Stores  │  │  (offline cache)       │  │
│  └────┬────┘  └────┬─────┘  └───────────────────────┘  │
│       │            │                                     │
│  ┌────▼────────────▼─────┐                               │
│  │   Service Layer       │                               │
│  │  (db.js, auth.js,     │                               │
│  │   storage.js, notif.js)│                               │
│  └───────────┬───────────┘                               │
└──────────────┼───────────────────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │   Supabase Client   │
    │   (@supabase/js)    │
    └──────────┬──────────┘
               │
═══════════════╪════════════════════════════════════════════
               │ HTTPS
┌──────────────┴──────────────────────────────────────────┐
│                    Supabase Backend                       │
│  ┌──────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │  Auth    │  │  Postgres  │  │  Storage (S3)      │   │
│  │ (GoTrue) │  │  + RLS     │  │  bucket: audio     │   │
│  └──────────┘  └────────────┘  └────────────────────┘   │
│                                                            │
│  Realtime: postgres_changes → WebSocket                    │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.x |
| Build Tool | Vite (rolldown) | 8.x |
| Styling | Tailwind CSS | 3.x |
| State Management | Zustand | 5.x |
| Routing | React Router | 7.x |
| Backend | Supabase (Postgres + Auth + Storage) | - |
| Audio | Tone.js | 15.x |
| Maps | Leaflet + React-Leaflet | 1.x / 5.x |
| Icons | Lucide React | 1.x |
| PWA | vite-plugin-pwa | 1.x |
| Font | Inter (variable) | - |

### 5.3 Database Schema

```sql
users
├── id UUID PK (references auth.users)
├── email TEXT
├── instrument_role TEXT  -- 'guitar'|'bass'|'keyboard'|'drums'|'vocal'|null
└── created_at TIMESTAMPTZ

songs
├── id UUID PK
├── user_id UUID FK -> auth.users
├── title TEXT NOT NULL
├── artist TEXT
├── key TEXT
├── bpm INTEGER
├── lyrics TEXT           -- with [Chord] notation
├── is_public BOOLEAN
├── sections JSONB        -- [{ id, label, startLine, customLabel, notes, roleNotes: { guitar:{}, ... } }]
├── audio_file_name TEXT
└── created_at TIMESTAMPTZ

setlists
├── id UUID PK
├── user_id UUID FK -> auth.users
├── name TEXT NOT NULL
├── description TEXT
├── songs JSONB           -- [{ songId, transpose, order }]
└── created_at TIMESTAMPTZ

sessions
├── id UUID PK
├── user_id UUID FK -> auth.users
├── name TEXT NOT NULL
├── day TEXT
├── time TEXT
├── location JSONB        -- { venue, address, contactPerson, phone, locationNotes }
├── active BOOLEAN
├── setlist_id UUID
└── created_at TIMESTAMPTZ

public_songs
├── id UUID PK
├── user_id UUID FK -> auth.users
├── original_song_id UUID
├── title, artist, key, bpm, lyrics, sections
├── shared_by UUID
├── shared_by_name TEXT
└── created_at TIMESTAMPTZ
```

### 5.4 Route Design

```
/               -> Landing page (public)
/login          -> Login page (public)
/register       -> Register page (public)
/app            -> Dashboard (protected)
/app/songs      -> Song list (protected)
/app/songs/:id  -> Song detail + editor (protected)
/app/setlists   -> Setlist list (protected)
/app/setlists/:id -> Setlist detail + editor (protected)
/app/sessions   -> Session list (protected)
/app/sessions/:id -> Session detail + editor (protected)
/app/pitchlist  -> Pitch list with audio + transpose (protected)
/app/library    -> Public song library (protected)
/app/schedule   -> Calendar + list view (protected)
/app/settings   -> User settings (protected)
*               -> 404 Not Found
```

---

## 6. UI/UX Design Principles

- **Mobile-first responsive** — Berfungsi sempurna dari HP 360px sampai desktop 1920px
- **Monochrome palette** — Warna netral (stone/neutral), tidak ada brand color mencolok
- **Dark mode by default** — Toggle ke light mode via ikon di navbar
- **Keyboard accessible** — Semua interaksi bisa pakai keyboard
- **Loading states** — Skeleton cards untuk list, Spinner untuk detail, Button spinner untuk submit
- **Empty states** — Setiap list view punya EmptyState dengan icon + CTA
- **Error handling** — Toast notification untuk success/error, error banner untuk form
- **Real-time updates** — Data berubah otomatis via Supabase Realtime, tanpa refresh manual

---

## 7. Non-functional Requirements

| Kategori | Requirement |
|----------|------------|
| Performance | Build time < 2 detik. Bundle size < 400KB (JS) + 60KB (CSS) |
| Availability | 99.9% via Supabase SLA. PWA cache untuk akses offline-read |
| Security | RLS di semua tabel. Service role key tidak terekspos ke client |
| Scalability | Arsitektur serverless (Supabase auto-scale). Data di-Postgres |
| Compatibility | Chrome, Firefox, Safari, Edge (2 versi terakhir) |
| Accessibility | WCAG 2.1 Level A target |
| Data Retention | User data terhapus sesuai Supabase policies |

---

## 8. Success Metrics (3 bulan)

| Metric | Target |
|--------|--------|
| User registration | 50+ pengguna aktif |
| Songs created | 500+ lagu |
| Setlists created | 100+ setlist |
| Sessions scheduled | 200+ sesi |
| Public library | 50+ lagu publik |
| Page load time | < 2 detik (FCP) |
| User retention (30 hari) | > 60% |

---

## 9. Future Roadmap

### Phase 1 — Foundation (Current) ✅
- [x] Auth (email/password + Google)
- [x] Song CRUD + sections + role notes
- [x] Setlist CRUD + song picker
- [x] Session CRUD + schedule
- [x] Pitch list + transpose
- [x] Dashboard
- [x] Dark/light mode
- [x] Supabase integration
- [ ] Migration SQL executed
- [ ] Production deploy

### Phase 2 — Collaboration (Next)
- Multi-user band/team dengan invite
- Shared setlists antar member
- Comments/replies di setiap lagu
- Activity log
- Role-based permissions dalam team

### Phase 3 — Advanced Audio
- Record audio langsung dari browser
- Metronome/BPM click track
- Export chord chart ke PDF
- MIDI integration

### Phase 4 — Offline & Mobile
- Full offline support via PWA + IndexedDB
- Native mobile app (React Native / Tauri)
- Push notifications via Supabase Realtime

---

## 10. Glossary

| Term | Definisi |
|------|----------|
| Section | Bagian lagu (Intro, Verse, Chorus, Bridge, dll) |
| Role Notes | Catatan spesifik per instrumen di setiap section |
| Transpose | Mengubah nada dasar naik/turun dalam semitone |
| Pitch Shift | Mengubah frekuensi audio real-time tanpa mengubah tempo |
| Setlist | Daftar lagu untuk satu sesi ibadah/manggung |
| RLS | Row Level Security — isolasi data di Postgres |
