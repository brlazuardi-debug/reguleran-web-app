# PRD v6 — Reguleran: Arsitektur Bersih & Integrasi Penyelarasan Fitur

**Author:** Claude Code
**Date:** 2026-08-04
**Status:** Completed & Integrated
**Scope:** Penyelarasan endpoint eventDocuments, perbaikan row-level auth di backend server, integrasi endpoint mobile, pembersihan fitur tuner/metronome, serta update dokumentasi proyek.

---

## 1. Konteks & Tujuan

Project Reguleran saat ini telah bertransisi penuh menggunakan Clerk + NeonDB + Hono + Cloudinary. Namun terdapat beberapa inkonsistensi arsitektur dan fungsionalitas:
1. Koleksi `'event-documents'` di sisi client bentrok dengan penamaan tabel PostgreSQL `event_documents` yang ditransformasi via `toSnake()`.
2. Endpoint `GET /api/:collection/:id` di backend tidak memiliki hak otorisasi data tingkat baris (row-level authorization), sehingga memicu celah keamanan.
3. Deklarasi API endpoints di mobile belum mencakup proposals, bandProfiles, dan eventDocuments.
4. Fitur Tuner dan Metronome di mobile masih berupa placeholder dan dinilai mengotori arsitektur.

**Tujuan:** Memperbaiki seluruh bug integrasi, merapikan struktur navigasi, menghapus fitur yang tidak diperlukan, serta memastikan seluruh API teramankan.

---

## 2. Perubahan & Perbaikan yang Dilakukan

### 2.1 Perbaikan Penamaan Koleksi `eventDocuments`
- **Sebelum:** Client memanggil `db.subscribe('event-documents', ...)` dan memanggil API route `/api/event-documents/...`. Fungsi `toSnake` di server mengabaikan hyphen sehingga mencari tabel `"event-documents"` di Postgres yang mana tidak ada (tabel yang benar: `event_documents`).
- **Sesudah:** Mengubah nama koleksi di sisi client web store `useEventDocumentStore.js` dan page `EventDocumentPage.jsx` menjadi `eventDocuments`. Fungsi `toSnake('eventDocuments')` menghasilkan `event_documents` yang sesuai dengan nama tabel database. Route API mobile `rider.tsx` disesuaikan ke `/eventDocuments`.

### 2.2 Penambahan Row-Level Auth (Keamanan)
- **Sebelum:** Endpoint `GET /api/:collection/:id` mengembalikan data hanya dengan ID saja tanpa mengecek user pemilik. Begitu pula endpoint `PUT` dan `DELETE` by ID.
- **Sesudah:** Server `server/index.js` telah dimodifikasi untuk memfilter record berdasarkan kepemilikan `user_id = userId` untuk seluruh tabel non-publik pada method `GET`, `PUT`, dan `DELETE`.
  - `GET /api/:collection/:id`: Mengambil data jika record milik user tersebut (atau jika tabel bersifat publik).
  - `PUT /api/:collection/:id`: Melakukan update record jika `user_id` cocok dengan token sub/user id.
  - `DELETE /api/:collection/:id`: Melakukan penghapusan record jika `user_id` cocok dengan token sub/user id.

### 2.3 Pelengkapan Endpoint Mobile
- Menambahkan `proposals`, `bandProfiles`, dan `eventDocuments` ke dalam object global `ENDPOINTS` di `reguleran/mobile/constants/api.ts` agar pemanggilan API di sisi mobile konsisten dan menggunakan konstanta terpusat.

### 2.4 Pembersihan Fitur Tuner & Metronome
- Menghapus folder `reguleran/mobile/app/(app)/tools/` yang berisi screen placeholder metronome dan tuner.
- Menghapus tab/drawer menu "Alat Musik" (tools) di file navigasi `_layout.tsx` dan `DrawerContent.tsx` pada aplikasi mobile.
- Mengeluarkan izin `RECORD_AUDIO` dan plugin `expo-av` mic permission dari file konfigurasi Expo `app.json`.
- Memperbarui dokumentasi `SUMMARY.md` dengan menghapus referensi tools hub, tuner, dan metronome.

---

## 3. Struktur File yang Dimodifikasi

1. `reguleran/src/stores/useEventDocumentStore.js` - Update nama koleksi `'eventDocuments'`.
2. `reguleran/src/pages/EventDocumentPage.jsx` - Update endpoint PDF generation.
3. `reguleran/mobile/app/(app)/sessions/[id]/rider.tsx` - Menyesuaikan query parameter API ke `/eventDocuments`.
4. `reguleran/server/index.js` - Update row-level auth (GET, PUT, DELETE by ID) + endpoint eventDocuments PDF generator.
5. `reguleran/mobile/constants/api.ts` - Melengkapi endpoint API mobile.
6. `reguleran/mobile/app/(app)/_layout.tsx` - Menghapus tools route dari drawer.
7. `reguleran/mobile/components/navigation/DrawerContent.tsx` - Menghapus tools dari menu item.
8. `reguleran/mobile/app.json` - Menghapus permission mic dan plugin tuner.
9. `reguleran/SUMMARY.md` - Menghapus daftar endpoint dan tools.

---

## 4. Status Integrasi

| Fitur | Web | Mobile | Backend API | Status |
|---|---|---|---|---|
| Band Profile | ✅ Terkoneksi | ✅ Terkoneksi | ✅ Terproteksi Auth | OK |
| Proposals | ✅ Terkoneksi | ✅ Terkoneksi | ✅ Terproteksi Auth | OK |
| Event Docs / Rider & RAB | ✅ Terkoneksi (eventDocuments) | ✅ Terkoneksi (eventDocuments) | ✅ Terproteksi Auth | OK |
| Tuner & Metronome | ❌ Dihapus | ❌ Dihapus | ❌ N/A | Bersih |
| Single Item Auth (GET/PUT/DELETE) | ✅ N/A | ✅ N/A | ✅ Terproteksi Auth | Aman (Row-Level) |
