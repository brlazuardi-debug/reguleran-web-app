# Reguleran — Project Summary

## Overview
Platform manajemen musik untuk musisi dan tim live performance: kelola katalog lagu (chord sheet, lirik, section markers, role notes), setlist pintar, sesi mingguan, kalender manggung, technical rider + RAB, booking proposal berformat PDF, audio pitch shifter, dan sinkronisasi instrumen realtime. Web + Mobile.

> **Backend Stack:** Clerk Auth, NeonDB (PostgreSQL), Hono API Server, Cloudinary Storage.  
> **Frontend Stack:** React 19, Tailwind CSS 3 (Dual Mode Studio), Zustand 5, i18n Engine, Vite 8.  
> **Deployment:** Docker Multi-Container + Nginx Reverse Proxy.

---

## 🎨 Visual Design Standard: Monochrome Studio & Dual Mode

- **Dark Mode:** Obsidian `#08090A`, Charcoal `#13161B`, Surface High `#272a2f`.
- **Light Mode:** Daylight White `#FFFFFF`, Neutral `#F8F9FA`, Border `#E5E7EB`.
- **Borders:** Hairline `rgba(255, 255, 255, 0.08)` (Dark) / `rgba(0, 0, 0, 0.08)` (Light).
- **Primary Highlights:** High-contrast Pure White / Slate 900.
- **Typography:** `Plus Jakarta Sans` (Display), `Inter` (Sans), `JetBrains Mono` (Data/Chords/Badges).
- **Spesifikasi Lengkap:** `design.md` di root workspace.

---

## 📊 Status Modul & Fitur

| Modul | Web App | Mobile App | Backend API | Status |
|---|---|---|---|---|
| **Auth & Quick Demo** | ✅ Lengkap (Bypass OTP Ready) | ✅ Terhubung Clerk Expo | ✅ Standalone JWT verify | Aktif |
| **Katalog Lagu & Chord** | ✅ Transpose + Section Notes | ✅ Chord View + Transpose | ✅ CRUD + JSONB sanitized | Aktif |
| **Setlist & Stage Player**| ✅ Live Stage Mode | ✅ Setlist Viewer | ✅ CRUD Terproteksi | Aktif |
| **Sesi & Kalender** | ✅ Weekly Recurrence + ICS | ✅ Session Timeline | ✅ CRUD Terproteksi | Aktif |
| **Rider & RAB** | ✅ Sound/Inst Matrix + Budget | ✅ Rider Viewer | ✅ PDF Generator Route | Aktif |
| **Booking Proposal** | ✅ Multi-step Wizard + PDF | ✅ Proposal List/Detail | ✅ PDF Generator Route | Aktif |
| **Band Profile & EPK** | ✅ EPK Form + Logo Upload | ✅ Profile Viewer/Edit | ✅ CRUD + Cloudinary | Aktif |
| **Audio Pitch Shifter** | ✅ Tone.js (-6 s/d +6 semi) | ℹ️ Playback Only | ✅ Cloudinary Admin API | Aktif |
| **Dual Theme Mode** | ✅ Dark & Light Mode | ℹ️ Dark Canvas | N/A | Aktif |
| **Dwibahasa (ID & EN)** | ✅ Switcher di Navbar & Settings | ℹ️ Standard | N/A | Aktif |
| **Docker & Nginx** | ✅ Multi-stage Docker Compose | N/A | ✅ Proxy Port 3001 | Aktif |

---

## 🗄️ Skema Database (NeonDB PostgreSQL)

| Tabel | Index Utama | Deskripsi |
|---|---|---|
| `users` | `id` | Profil pengguna & peran instrumen (ID = Clerk User ID `TEXT`) |
| `songs` | `user_id` | Database lagu, chord, lirik, dan JSONB `sections` |
| `setlists` | `user_id` | Koleksi setlist dan JSONB `songs` |
| `sessions` | `user_id` | Jadwal latihan dan JSONB `location` |
| `event_documents` | `user_id`, `session_id` | Technical rider (JSONB `sound_needs`, `instrument_needs`) & RAB (JSONB `budget_items`) |
| `proposals` | `user_id`, `status` | Dokumen booking proposal & JSONB `testimonials` |
| `band_profiles` | `user_id` | Data profil band, JSONB `genres`, `social_links`, `photo_urls` |
| `public_songs` | `user_id` | Katalog chord publik untuk komunitas |

---

## 🧪 Akun Demo Admin untuk Pengujian

- **Email:** `demo@reguleran.app`
- **Password:** `Reguleran2026!`
- **Akses Cepat:** Tombol *"1-Klik Masuk sebagai Demo Admin"* di halaman login (`/login`).
