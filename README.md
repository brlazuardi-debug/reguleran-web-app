# Reguleran — Live Band OS

Platform manajemen live musik modern untuk musisi, band, dan session player — kelola katalog lagu, setlist cerdas, sesi mingguan, jadwal manggung, technical rider & RAB, proposal booking ber-PDF, audio pitch shifter, dan sinkronisasi instrumen secara real-time. Web + Mobile.

> **UI Aesthetic:** Dual Mode — Monochrome Studio (Linear-style obsidian `#08090A` / charcoal `#13161B`) & Clean Daylight Light Mode.  
> **Dwibahasa:** Dukungan penuh Bahasa Indonesia (ID) & English (EN).

---

## ⚡ Akses Cepat Demo & Testing

Untuk pengujian tanpa verifikasi email / OAuth:
- **URL Login:** `http://localhost:5173/login` atau via production web
- **Tombol Cepat:** Klik tombol **"1-Klik Masuk sebagai Demo Admin"**
- **Manual Akun Demo:**
  - **Email:** `demo@reguleran.app`
  - **Password:** `Reguleran2026!`

---

## 🚀 Fitur Utama

- **Katalog Lagu & Chord Sheet:** Chord & lirik realtime, transpose instan, section management (`[INTRO]`, `[VERSE]`, `[CHORUS]`), dan catatan spesifik per role instrumen (Gitar, Bass, Keys, Drum, Vokal).
- **Setlist Cerdas & Live Stage Player:** Urutkan lagu untuk manggung, transpose per lagu, live autoscroll, dan mode kontras tinggi panggung.
- **Sesi & Kalender Manggung:** Jadwal latihan dan gig berkala, lokasi venue, maps picker, status konfirmasi personil, dan ekspor ICS kalender.
- **Technical Rider & RAB:** Format kebutuhan sound system (channel list matrix), kebutuhan instrumen, dan rincian anggaran biaya manggung per sesi.
- **Booking Proposal & PDF:** Buat dokumen penawaran manggung ke venue/cafe lengkap dengan profile band, rate card, testimoni, dan export PDF server-side.
- **Audio Pitch Shifter Workstation (Web):** Pengubah nada audio backing track berbasis Web Audio API (Tone.js) dengan slider pitch -6 s/d +6 semitones dan cloud storage Cloudinary.
- **Band Profile & EPK:** Profil band, susunan personil, foto/logo band, dan kontak booking.
- **Public Library:** Berbagi dan temukan chord lagu dari komunitas.
- **Dual Theme (Light & Dark):** Studio dark obsidian & Daylight light mode dengan kontras tinggi.
- **Dwibahasa (ID & EN):** Beralih instan antara Bahasa Indonesia dan English di semua menu dan halaman.

---

## 🛠️ Tech Stack

| Layer | Web App | Mobile App |
|---|---|---|
| **Frontend** | React 19 + Vite 8 (rolldown) + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| **State Management** | Zustand 5 | Zustand 5 |
| **Internationalization (i18n)** | Custom Translation Engine (ID / EN) | Custom Translation Engine |
| **Authentication** | Clerk (`@clerk/react` v6) | Clerk (`@clerk/clerk-expo` v2) |
| **Database** | NeonDB (PostgreSQL) via `postgres.js` | via Hono API |
| **API Backend** | Hono 4 (Node.js) — `server/index.js` | via Hono API |
| **Media Storage** | Cloudinary (unsigned upload + Admin API delete) | via Hono API |
| **Audio Processing**| Tone.js 15 (pitch shifting Web Audio API) | expo-av (playback) |
| **Routing** | React Router 7 | Expo Router (file-based) |
| **PDF Generation** | @react-pdf/renderer | via Backend API |
| **Deployment / Container** | Docker + Docker Compose + Nginx Reverse Proxy | Native APK / AAB |

---

## 📁 Struktur Repositori

```
REGULERAN/
├── design.md                  # Master Design System (Monochrome Studio & Dual Mode)
├── AGENTS.md                  # Instruksi teknis dan checklist AI agent
├── README.md                  # Dokumentasi umum proyek
├── Dockerfile.server          # Container backend Hono API
├── Dockerfile.web             # Container frontend Vite + Nginx
├── docker-compose.yml         # Konfigurasi deploy multi-container lokal/server
├── nginx.conf                 # Nginx reverse proxy & SPA router
├── reguleran/
│   ├── SETUP.md               # Panduan setup lokal step-by-step
│   ├── SUMMARY.md             # Status ringkasan modul & database
│   ├── neon-migration.sql     # Skema PostgreSQL NeonDB
│   ├── server/                # Hono API Backend (Node.js)
│   │   └── index.js           # Generic CRUD + JSONB sanitizer + Clerk JWT + PDF render
│   ├── src/                   # Web App (React 19)
│   │   ├── components/        # UI primitives, layout, dialogs, media
│   │   ├── i18n/              # Kamus dan hook dwibahasa ID / EN
│   │   ├── pages/             # 25+ Route pages
│   │   ├── stores/            # Zustand stores
│   │   ├── services/          # db.js (API client), storage.js
│   │   └── index.css          # Studio tokens, glassmorphism, scrollbars
│   └── mobile/                # Mobile App (Expo SDK 57 + NativeWind)
```

---

## 💻 Cara Menjalankan

### Opsi 1: Menjalankan dengan Docker (Rekomendasi)
```bash
docker compose up --build
```
Aplikasi web dapat diakses di `http://localhost`, dan backend API di `http://localhost:3001`.

### Opsi 2: Menjalankan Secara Lokal (Node.js)

1. **Install Dependencies:**
   ```bash
   # Root
   npm install
   # Web & Server
   cd reguleran && npm install
   cd server && npm install
   ```

2. **Jalankan Aplikasi:**
   ```bash
   # Jalankan Server (Port 3001)
   cd reguleran/server && npm run dev

   # Jalankan Web App (Port 5173)
   cd reguleran && npm run dev
   ```

3. **Build Verifikasi:**
   ```bash
   cd reguleran && npm run build
   ```
