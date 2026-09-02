# AGENTS.md — Reguleran

Instruksi teknis dan panduan operasional AI Agent untuk repositori **Reguleran**.

---

## ⚡ Testing & Demo Credentials

- **Demo Admin Email:** `demo@reguleran.app`
- **Demo Admin Password:** `Reguleran2026!`
- **Clerk User ID:** `user_3HIbWKbenMS7howSWCIJF3AHFpp`
- **Clerk Instance:** `ins_3Grd66yUUIZRSHQ7nyLc5Js629b`
- **Quick Login:** Form login `/login` telah dilengkapi tombol *"1-Klik Masuk sebagai Demo Admin"*.

---

## 🛠️ Perintah CLI & Development

### Web App (`reguleran/`)
- `npm run dev` — Menjalankan Vite dev server di `localhost:5173` (proxy `/api` ➔ `localhost:3001`).
- `npm run build` — Build production Vite 8 (rolldown). Wajib `0 error`.
- `npm run preview` — Meninjau hasil build lokal.
- `npm run lint` — ESLint flat config v10.

### Server API (`reguleran/server/`)
- `npm run dev` — Menjalankan Hono API di `localhost:3001` (membaca `../.env` via `--env-file`).
- `npm start` — Production start.

### Mobile App (`reguleran/mobile/`)
- `npx expo start` — Expo dev server.
- `npx tsc --noEmit` — TypeScript typecheck (wajib 0 error).
- `eas build --platform android --profile preview` — Build APK Android.

### Docker Container
- `docker compose up --build` — Menjalankan full stack (API + Web Nginx proxy).

---

## 🎨 Design System: Monochrome Studio & Dual Theme

Desain aplikasi mengadopsi standar **Monochrome Studio**:
- **Warna Dasar Gelap:** Obsidian `#08090A` (Darkest Canvas), Charcoal `#13161B` (Surface/Cards), `#191c21` (Container low), `#272a2f` (Container high).
- **Warna Dasar Terang:** Pure White `#FFFFFF`, Neutral `#F8F9FA`, Border `#E5E7EB`.
- **Hairline Borders:** `rgba(255, 255, 255, 0.08)` (Dark) / `rgba(0, 0, 0, 0.08)` (Light).
- **Tipografi:**
  - `display`: `Plus Jakarta Sans` (Display/Headings).
  - `sans`: `Inter` (Body).
  - `mono` / `label-mono`: `JetBrains Mono` (Chords, Badges, Timestamps, Role tags).
- **Dokumentasi Desain Lengkap:** Lihat `design.md` di root repositori.

---

## 🏗️ Arsitektur Data & Aliran Autentikasi

1. **Clerk Authentication (React 19 / v6 Signal API):**
   - Resource `signIn` menggunakan guard `if (!signIn) return null`.
   - Mengaktifkan session via instance `useClerk()`: `await clerk.setActive({ session: signIn.createdSessionId })`.
2. **Klien Database & API Token:**
   - Klien frontend `services/db.js` mengambil JWT dari Clerk via `window.Clerk.session.getToken()`.
   - Header request wajib menyertakan `Authorization: Bearer <token>`.
   - Server Hono memverifikasi JWT dengan `@clerk/backend` standalone `verifyToken`.
3. **Database NeonDB (PostgreSQL):**
   - Query dijalankan menggunakan `postgres.js` tagged template literals `sql\`...\``.
   - Kolom `user_id` bertipe `TEXT` (Clerk User ID). Row-level authorization diterapkan di server layer (`WHERE user_id = userId`).
   - Khusus tabel `users`: primary key adalah `id` (Clerk User ID), bukan `user_id`.
   - Kolom bertipe `JSONB` (`sections`, `location`, `sound_needs`, `instrument_needs`, `budget_items`, `photo_urls`, `genres`, `social_links`, `testimonials`) wajib disanitasi menggunakan helper `sql.json()`.
4. **Cloudinary Media Storage:**
   - Upload audio backing track dan foto band menggunakan unsigned upload preset (`reguleran_audio`).
   - Penghapusan file dilakukan melalui endpoint admin di server Hono.

---

## 🌐 Sistem Dwibahasa (i18n)

- Dikelola melalui `src/i18n/useTranslation.js` dengan state management Zustand terhubung ke `localStorage` (`reguleran-lang`).
- Tersedia dua bahasa: `id` (Bahasa Indonesia) & `en` (English US).
- Panggil dengan hook `const { t, language, toggleLanguage } = useTranslation()`.

---

## ⚠️ Gotchas & Aturan Penting

- **No Supabase / Firebase:** Jangan menambahkan kembali dependency `@supabase/*` atau `firebase`.
- **JSONB Serialization:** Selalu pastikan nilai array/object di-wrap dengan `sql.json()` sebelum di-insert/update ke NeonDB.
- **Koleksi API:** Gunakan nama koleksi `eventDocuments` dan `bandProfiles` (camelCase) agar cocok dengan tabel PostgreSQL `event_documents` dan `band_profiles`.
- **Code-Splitting:** Komponen berat seperti `PitchShifter` (Tone.js) dan `@react-pdf/renderer` wajib di-load secara dinamis / lazy load.
- **Form Placeholders:** Hindari placeholder dengan nama fiktif/dummy yang membingungkan. Gunakan label yang jelas.
