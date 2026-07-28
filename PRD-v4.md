# Product Requirements Document — Reguleran
> **Versi:** 4.0
> **Status:** Ready for Execution
> **Updated:** 2026-07-28
> **Author:** Bagus Rizky Lazuardi
> **Repo:** https://github.com/brlazuardi-debug/reguleran-web-app

---

## ⚠️ INSTRUKSI UNTUK OPENCODE AGENT

```
Baca SELURUH dokumen ini sebelum menulis satu baris kode pun.
Kerjakan SATU FASE per sesi. Setelah selesai, jalankan perintah
verifikasi yang tertera di setiap fase — ZERO error sebelum lanjut.

JANGAN ubah arsitektur, struktur folder, atau naming convention
yang sudah berjalan (server/, src/, mobile/).

Backend sudah: Hono 4 + NeonDB (PostgreSQL) + Clerk Auth + Cloudinary.
JANGAN sentuh Firebase — itu sudah lama tidak dipakai, README lama
yang menyebutnya adalah dokumentasi basi yang akan diperbaiki di FASE 0.

Jika ada ambiguitas, TANYA — jangan asumsi.
```

---

## 1. Kondisi Project Saat Ini

### 1.1 Status Dokumentasi — PENTING

Repo ini punya 3 sumber dokumentasi dengan tingkat kebaruan berbeda:

| File | Status | Catatan |
|------|--------|---------|
| `AGENTS.md` | ✅ Akurat, paling baru | Sumber kebenaran teknis utama |
| `SUMMARY.md` | ✅ Akurat | Ringkasan fase & status |
| `README.md` | ❌ **BASI TOTAL** | Masih sebut Firebase/Firestore — harus diperbaiki di Fase 0 |

**Jangan pernah ikuti instruksi dari `README.md` yang menyebut Firebase.**
Backend production adalah NeonDB + Hono + Clerk + Cloudinary.

### 1.2 Stack yang Berjalan (Sumber: AGENTS.md + SUMMARY.md)

| Layer | Web | Mobile |
|-------|-----|--------|
| Frontend | React 19 + Vite 8 + Tailwind CSS 3 | React Native + Expo SDK 57 + NativeWind |
| State | Zustand 5 | Zustand 5 |
| Auth | Clerk (`@clerk/react` v6) | Clerk (`@clerk/clerk-expo` v2) |
| Database | NeonDB (PostgreSQL) via `postgres.js` | Sama, lewat Hono API |
| API Server | Hono 4 — `server/index.js` | Sama |
| Storage | Cloudinary (unsigned upload + Admin API delete) | Sama |
| Audio | Tone.js 15 (pitch shifting) | expo-av (playback only) |
| Routing | React Router 7 | Expo Router |
| PWA | vite-plugin-pwa | N/A (native) |

### 1.3 Fitur Selesai

**Web:** Auth, Song CRUD + sections + role notes + transpose, Setlist + SetlistPlayer, Session + Calendar + ICS export, Audio Pitch Shifter, Tab Viewer, Dashboard, Public Library, Production Hardening (ErrorBoundary, rate limiter, logging), PWA.

**Mobile (M0-M7):** Expo setup, API layer, Auth (Clerk Expo + SecureStore), 4 Zustand stores, 5-tab navigator, Song CRUD, Setlist/Session/Dashboard, Audio playback + Cloudinary upload.

### 1.4 Pending Sebelumnya (Belum Berubah)

```
WEB
[ ] Clerk: switch Development → Production
[ ] Deploy Hono API → Railway
[ ] Deploy Frontend → Vercel
[ ] Update Clerk redirect URLs

MOBILE
[ ] M8 — Build & Deploy Play Store (EAS)
[ ] M9 — iOS (Xcode, App Store Connect)
[ ] Tuner: pitch detection via mic
[ ] Metronome: audio click track
[ ] Native audio pitch shifting
```

> Kerjakan pending list ini SEBELUM fitur baru di dokumen ini kalau belum selesai —
> fitur baru dibangun di atas backend yang sama, jadi lebih aman kalau fondasi
> deployment sudah stabil dulu. Kalau sudah selesai, lanjut ke Fase 0 di bawah.

---

## 2. Tujuan PRD Ini — 2 Fitur Baru

### 2.1 Booking Proposal ("Invoice")

**Bukan invoice keuangan/billing.** Ini adalah **dokumen proposal pengajuan
manggung** yang dibuat band/Reguleran untuk dikirim ke cafe, venue, atau
tempat yang ingin dituju — supaya band terlihat profesional dan proposalnya
lebih mudah diterima.

Isi dokumen:
- Profil band/tim (nama, foto, deskripsi singkat)
- Contoh repertoar/setlist andalan
- Format penampilan yang ditawarkan (durasi, jumlah sesi, dsb)
- Rate/tarif yang diajukan
- Kontak person
- Testimoni atau riwayat tampil sebelumnya (opsional)

**Output:** PDF yang bisa didownload, dishare via link, atau dikirim langsung.

### 2.2 Rider + RAB per Event

**Satu dokumen gabungan**, dibuat per sesi/event, berisi:

**Bagian Rider (kebutuhan teknis panggung & soundcheck):**
- Kebutuhan sound system (jumlah channel, monitor, mic)
- Kebutuhan alat per instrumen (ampli gitar/bass, drum kit/electric pad, keyboard stand, dst)
- Layout panggung (posisi tiap player — bisa pakai diagram sederhana)
- Jadwal soundcheck
- Kebutuhan listrik/power

**Bagian RAB (rincian anggaran acara):**
- Daftar item biaya (transport, konsumsi, sewa alat, fee player, dll)
- Kuantitas dan harga satuan
- Total keseluruhan

**Output:** PDF per event, terhubung ke `sessions` yang sudah ada.

---

## 3. Prinsip Desain Fitur Baru

1. **Tidak ada sistem pembayaran** — ini dokumen presentasi, bukan invoice akuntansi. Tidak perlu payment gateway, tidak perlu nomor invoice berurutan untuk keperluan pajak.
2. **PDF generation dua arah** — web app generate PDF langsung di browser (client-side); mobile app request PDF dari server (server-side), karena render PDF kompleks di React Native tidak reliable.
3. **Template reusable** — satu profil band bisa dipakai berulang kali untuk banyak proposal, tinggal ganti venue tujuan dan tanggal.
4. **Terhubung ke data yang sudah ada** — Rider/RAB terhubung ke `sessions`, Proposal bisa mengambil contoh lagu dari `setlists` yang sudah ada.

---

## 4. Update Database Schema

Jalankan SQL ini di NeonDB SQL Editor. **Tidak mengubah tabel yang sudah ada**,
hanya menambah tabel baru.

```sql
-- ============================================
-- TABLE: band_profiles
-- Profil band/tim yang dipakai berulang di proposal
-- ============================================

CREATE TABLE IF NOT EXISTS band_profiles (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id         TEXT NOT NULL,  -- Clerk user ID (TEXT, bukan UUID)
  band_name       TEXT NOT NULL,
  tagline         TEXT,
  description     TEXT,
  logo_url        TEXT,           -- Cloudinary image URL
  photo_urls      JSONB DEFAULT '[]'::JSONB,  -- array of Cloudinary URLs
  genres          JSONB DEFAULT '[]'::JSONB,  -- ["Pop", "Jazz", "Worship"]
  member_count    INTEGER,
  contact_name    TEXT,
  contact_phone   TEXT,
  contact_email   TEXT,
  social_links    JSONB DEFAULT '{}'::JSONB,  -- {instagram, youtube, tiktok}
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_band_profiles_user_id ON band_profiles(user_id);

-- ============================================
-- TABLE: proposals
-- Proposal booking ke venue/cafe tertentu
-- ============================================

CREATE TABLE IF NOT EXISTS proposals (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id           TEXT NOT NULL,
  band_profile_id   TEXT REFERENCES band_profiles(id) ON DELETE SET NULL,
  venue_name        TEXT NOT NULL,
  venue_contact     TEXT,
  proposed_date     DATE,
  proposed_time     TEXT,
  performance_format TEXT,   -- deskripsi format (misal "2 sesi x 45 menit")
  rate_offered      NUMERIC(12,2),
  rate_notes        TEXT,    -- catatan tambahan soal tarif (nego, termasuk apa, dll)
  featured_setlist_id TEXT,  -- referensi ke setlists yang sudah ada, opsional
  testimonials      JSONB DEFAULT '[]'::JSONB, -- [{ name, quote }]
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected')),
  pdf_url           TEXT,    -- Cloudinary URL hasil generate terakhir
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

-- ============================================
-- TABLE: event_documents (Rider + RAB per sesi)
-- ============================================

CREATE TABLE IF NOT EXISTS event_documents (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id         TEXT NOT NULL,
  session_id      TEXT REFERENCES sessions(id) ON DELETE CASCADE,

  -- RIDER
  sound_needs     JSONB DEFAULT '{}'::JSONB,
  -- { channels: 8, monitors: 4, mics: [{type, qty}], notes }
  instrument_needs JSONB DEFAULT '[]'::JSONB,
  -- [{ role: 'guitar', items: ['ampli 50W', 'DI box'], notes }]
  stage_layout_notes TEXT,
  stage_layout_image TEXT,  -- Cloudinary URL untuk diagram, opsional
  soundcheck_time TEXT,
  power_needs     TEXT,

  -- RAB
  budget_items    JSONB DEFAULT '[]'::JSONB,
  -- [{ id, category, description, qty, unitPrice, subtotal }]
  budget_total    NUMERIC(12,2) DEFAULT 0,
  budget_notes    TEXT,

  pdf_url         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_documents_user_id ON event_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_event_documents_session_id ON event_documents(session_id);
```

> Catatan konsisten dengan pola yang sudah ada di `AGENTS.md`:
> `id` bertipe TEXT (bukan UUID) mengikuti konvensi Clerk user ID di project ini,
> tidak ada RLS karena auth ditangani di middleware Hono, bukan di Postgres.

---

## 5. Update TypeScript Types

Tambahkan ke `src/types/index.ts` (web) DAN `mobile/types/index.ts` (mobile) — tetap manual copy sesuai pola yang sudah berjalan (lihat gotcha "no auto-sync" di AGENTS.md).

```typescript
// ============================================
// BAND PROFILE
// ============================================

export interface SocialLinks {
  instagram?: string
  youtube?: string
  tiktok?: string
}

export interface BandProfile {
  id: string
  userId: string
  bandName: string
  tagline: string | null
  description: string | null
  logoUrl: string | null
  photoUrls: string[]
  genres: string[]
  memberCount: number | null
  contactName: string | null
  contactPhone: string | null
  contactEmail: string | null
  socialLinks: SocialLinks
  createdAt: string
  updatedAt: string
}

// ============================================
// PROPOSAL
// ============================================

export interface Testimonial {
  name: string
  quote: string
}

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface Proposal {
  id: string
  userId: string
  bandProfileId: string | null
  venueName: string
  venueContact: string | null
  proposedDate: string | null
  proposedTime: string | null
  performanceFormat: string | null
  rateOffered: number | null
  rateNotes: string | null
  featuredSetlistId: string | null
  testimonials: Testimonial[]
  status: ProposalStatus
  pdfUrl: string | null
  createdAt: string
  updatedAt: string
}

// ============================================
// EVENT DOCUMENT (RIDER + RAB)
// ============================================

export interface MicRequirement {
  type: string     // 'Dynamic SM58', 'Condenser', dll
  qty: number
}

export interface SoundNeeds {
  channels?: number
  monitors?: number
  mics?: MicRequirement[]
  notes?: string
}

export interface InstrumentNeed {
  role: InstrumentRole   // reuse dari types yang sudah ada
  items: string[]
  notes?: string
}

export interface BudgetItem {
  id: string
  category: string       // 'Transport', 'Konsumsi', 'Sewa Alat', 'Fee Player', dll
  description: string
  qty: number
  unitPrice: number
  subtotal: number
}

export interface EventDocument {
  id: string
  userId: string
  sessionId: string | null
  soundNeeds: SoundNeeds
  instrumentNeeds: InstrumentNeed[]
  stageLayoutNotes: string | null
  stageLayoutImage: string | null
  soundcheckTime: string | null
  powerNeeds: string | null
  budgetItems: BudgetItem[]
  budgetTotal: number
  budgetNotes: string | null
  pdfUrl: string | null
  createdAt: string
  updatedAt: string
}
```

---

## 6. Update Hono API Server

Tambahkan endpoint baru mengikuti pola CRUD generic yang sudah ada di `server/index.js`. **Jangan buat file terpisah** — ikuti struktur endpoint yang sudah berjalan untuk `songs`, `setlists`, `sessions`.

```javascript
// server/index.js — tambahkan routes berikut, ikuti pola CRUD yang sudah ada

// Band Profiles
app.get('/band-profiles', authMiddleware, async (c) => { /* list milik user */ })
app.get('/band-profiles/:id', authMiddleware, async (c) => { /* detail */ })
app.post('/band-profiles', authMiddleware, async (c) => { /* create */ })
app.put('/band-profiles/:id', authMiddleware, async (c) => { /* update */ })
app.delete('/band-profiles/:id', authMiddleware, async (c) => { /* delete */ })

// Proposals
app.get('/proposals', authMiddleware, async (c) => { /* list, filter by status opsional */ })
app.get('/proposals/:id', authMiddleware, async (c) => { /* detail */ })
app.post('/proposals', authMiddleware, async (c) => { /* create */ })
app.put('/proposals/:id', authMiddleware, async (c) => { /* update */ })
app.delete('/proposals/:id', authMiddleware, async (c) => { /* delete */ })

// Event Documents (Rider + RAB)
app.get('/event-documents', authMiddleware, async (c) => { /* list */ })
app.get('/event-documents/session/:sessionId', authMiddleware, async (c) => { /* by session */ })
app.post('/event-documents', authMiddleware, async (c) => { /* create */ })
app.put('/event-documents/:id', authMiddleware, async (c) => { /* update */ })
app.delete('/event-documents/:id', authMiddleware, async (c) => { /* delete */ })

// PDF Generation (server-side, dipakai mobile app)
app.post('/proposals/:id/generate-pdf', authMiddleware, async (c) => {
  // 1. Fetch data proposal + band profile terkait
  // 2. Render PDF via @react-pdf/renderer (server-side render, bukan browser)
  // 3. Upload hasil PDF ke Cloudinary (resource_type: 'raw', bukan 'video')
  // 4. Update proposals.pdf_url
  // 5. Return { pdfUrl }
})

app.post('/event-documents/:id/generate-pdf', authMiddleware, async (c) => {
  // Sama pola dengan di atas, untuk rider + RAB
})
```

**Penting soal Cloudinary untuk dokumen (bukan audio):**

```javascript
// Upload PDF ke Cloudinary — resource_type WAJIB 'raw', bukan 'video'
// (audio pakai 'video', gambar pakai 'image', dokumen non-media pakai 'raw')

const uploadResult = await cloudinary.uploader.upload(pdfBuffer, {
  resource_type: 'raw',
  folder: `reguleran/documents/${userId}`,
  public_id: `proposal-${proposalId}-${Date.now()}`,
})
```

**Install dependency baru di server:**
```bash
cd server
npm install @react-pdf/renderer
```

> Catatan: `@react-pdf/renderer` bisa jalan di server-side Node.js untuk generate
> buffer PDF tanpa browser — ini penting karena Hono server tidak punya DOM/browser.

---

## 7. Rencana Eksekusi — Per Fase

### FASE 0 — Bersihkan Dokumentasi (WAJIB PERTAMA)

```
[ ] Update README.md — hapus semua referensi Firebase/Firestore
[ ] README.md baru harus mencerminkan stack sebenarnya:
    React 19 + Vite 8 + Tailwind + Zustand + Clerk + NeonDB + Hono + Cloudinary
[ ] Tambahkan section Mobile App di README (saat ini tidak disebut sama sekali)
[ ] Update .env.example (jika masih ada VITE_FIREBASE_* di dalamnya, ganti)
[ ] Commit terpisah: "docs: update README to reflect current stack"
```

**Verifikasi:** `grep -ri "firebase" README.md` harus kosong.

---

### FASE 1 — Database & Types

```
[ ] Eksekusi SQL di Section 4 ini di NeonDB SQL Editor
[ ] Verifikasi tabel baru muncul:
    SELECT table_name FROM information_schema.tables
    WHERE table_name IN ('band_profiles','proposals','event_documents');
[ ] Tambahkan types baru ke src/types/index.ts (web)
[ ] Tambahkan types yang sama ke mobile/types/index.ts (mobile)
[ ] npm run build (web) — zero error
[ ] npx tsc --noEmit (mobile) — zero error
```

---

### FASE 2 — Backend: Band Profile & Proposal CRUD

```
[ ] Tambahkan endpoint band-profiles di server/index.js (ikuti pola CRUD existing)
[ ] Tambahkan endpoint proposals di server/index.js
[ ] Test manual dengan curl atau Postman:
    curl -X POST http://localhost:3001/band-profiles \
      -H "Authorization: Bearer <token>" \
      -H "Content-Type: application/json" \
      -d '{"bandName":"Test Band"}'
[ ] Pastikan camelCase <-> snake_case conversion konsisten (pola sudah ada di AGENTS.md)
```

---

### FASE 3 — Web: Band Profile Page

**File yang dibuat:**
- `src/pages/BandProfilePage.tsx`
- `src/components/proposals/BandProfileForm.tsx`
- `src/stores/useBandProfileStore.ts`
- `src/services/db.js` — tambah fungsi getBandProfile, upsertBandProfile

**Spesifikasi:**
```
- Route baru: /app/band-profile
- Form: nama band, tagline, deskripsi, upload logo (Cloudinary image),
  upload foto (max 5), genre (multi-select tag input), jumlah member,
  kontak (nama, telepon, email), social links
- Satu user = satu band profile (bukan banyak) — cek existing dulu
  sebelum create, kalau sudah ada langsung mode edit
- Preview card di atas form: tampilkan bagaimana proposal akan terlihat
```

---

### FASE 4 — Web: Proposal Builder

**File yang dibuat:**
- `src/pages/ProposalListPage.tsx`
- `src/pages/ProposalEditorPage.tsx`
- `src/components/proposals/ProposalForm.tsx`
- `src/components/proposals/SetlistPicker.tsx` — reuse pola dari SongPicker setlist
- `src/components/proposals/TestimonialEditor.tsx`
- `src/stores/useProposalStore.ts`

**Spesifikasi:**
```
Route baru:
/app/proposals          → list semua proposal, filter by status
/app/proposals/new      → buat proposal baru
/app/proposals/:id      → detail + preview PDF
/app/proposals/:id/edit → edit

Form Proposal:
- Pilih band profile (auto-load kalau sudah ada satu)
- Nama venue tujuan + kontak
- Tanggal & waktu yang diajukan
- Format penampilan (free text, contoh: "2 sesi x 45 menit dengan jeda 15 menit")
- Rate yang diajukan + catatan (Rupiah, format ribuan otomatis)
- Pilih setlist andalan dari setlist yang sudah ada (opsional)
- Tambah testimoni (nama + kutipan, bisa lebih dari satu)
- Status: draft (default) → sent → accepted/rejected

List Proposal:
- Card per proposal: nama venue, tanggal, status badge, rate
- Filter tab: Semua | Draft | Terkirim | Diterima | Ditolak
- Quick action: Generate PDF, Duplikat, Hapus
```

---

### FASE 5 — Web: PDF Generation untuk Proposal (Client-Side)

```
[ ] Install: npm install @react-pdf/renderer
[ ] Buat src/components/proposals/ProposalPDFDocument.tsx
    — komponen React yang define layout PDF (Document, Page, View, Text dari @react-pdf/renderer)
[ ] Buat src/utils/generateProposalPdf.ts
    — fungsi yang render ProposalPDFDocument jadi blob, trigger download
[ ] Tombol "Download PDF" di ProposalDetailPage
[ ] Tombol "Generate & Simpan ke Cloud" — panggil endpoint
    POST /proposals/:id/generate-pdf (biar mobile juga bisa akses versi sama)
```

**Layout PDF Proposal (desain minimal, profesional, monochrome):**
```
Halaman 1:
- Header: Logo band + nama band (besar) + tagline
- Foto band (1 foto utama)
- Deskripsi singkat band

Halaman 2:
- Genre yang dibawakan
- Contoh setlist andalan (daftar lagu dari setlist yang dipilih)
- Format penampilan yang ditawarkan

Halaman 3:
- Rate yang diajukan
- Testimoni (jika ada)
- Kontak person + social media

Footer setiap halaman: dibuat dengan Reguleran + tanggal generate
```

---

### FASE 6 — Web: Event Document (Rider + RAB) Builder

**File yang dibuat:**
- `src/pages/EventDocumentPage.tsx`
- `src/components/riders/SoundNeedsForm.tsx`
- `src/components/riders/InstrumentNeedsForm.tsx`
- `src/components/riders/BudgetTable.tsx`
- `src/stores/useEventDocumentStore.ts`

**Spesifikasi:**
```
Route baru:
/app/sessions/:sessionId/rider  → satu dokumen per sesi

Tab dalam halaman:
1. Tab "Rider" —
   - Sound needs: jumlah channel, monitor, daftar mic (tipe + qty, tombol tambah baris)
   - Instrument needs: per role (guitar/bass/keyboard/drums/vocal),
     checklist items yang biasa dibutuhkan + custom notes
   - Stage layout: text area notes + optional upload gambar diagram (Cloudinary)
   - Jadwal soundcheck
   - Kebutuhan power/listrik

2. Tab "RAB" —
   - BudgetTable: tabel editable (kategori, deskripsi, qty, harga satuan, subtotal auto-hitung)
   - Tombol tambah baris, hapus baris
   - Total otomatis dihitung dari semua subtotal
   - Format Rupiah dengan pemisah ribuan
   - Catatan tambahan (free text)

3. Tombol "Generate PDF" — gabungkan Rider + RAB jadi satu dokumen PDF
```

**Layout PDF Rider+RAB:**
```
Halaman 1 — Rider:
- Judul: nama sesi + tanggal + venue (dari sessions.location)
- Sound needs (tabel)
- Instrument needs per role (grouped by icon/label role)
- Stage layout (text + gambar jika ada)
- Jadwal soundcheck

Halaman 2 — RAB:
- Tabel budget items (kategori | deskripsi | qty | harga satuan | subtotal)
- Total di baris terakhir (bold, garis atas)
- Catatan tambahan
```

---

### FASE 7 — Mobile: Band Profile & Proposal (View + Basic Edit)

**Prinsip:** Mobile fokus untuk **lihat dan edit cepat**, bukan builder lengkap.
PDF generation di mobile selalu **request ke server** (Fase 6 di server), bukan render lokal.

```
mobile/app/(app)/proposals/
├── index.tsx        → list proposal (sama pola dengan songs/index.tsx)
├── new.tsx           → form singkat (venue, tanggal, rate)
├── [id]/
│   ├── index.tsx     → detail + tombol "Generate PDF" (panggil server endpoint)
│   └── edit.tsx       → edit field dasar

mobile/app/(app)/band-profile.tsx  → form profil band (mirip web tapi simplified)
```

**Spesifikasi generate PDF di mobile:**
```typescript
// mobile/app/(app)/proposals/[id]/index.tsx
// Tombol "Generate PDF":
// 1. POST ke /proposals/:id/generate-pdf via useApi hook (sudah ada)
// 2. Response berisi { pdfUrl } dari Cloudinary
// 3. Buka pdfUrl via Linking.openURL() atau WebBrowser.openBrowserAsync()
// 4. Opsional: expo-sharing untuk share langsung ke WhatsApp/Email
```

```bash
npx expo install expo-sharing expo-linking
```

---

### FASE 8 — Mobile: Event Document (View Only + Trigger Generate)

```
mobile/app/(app)/sessions/[id]/rider.tsx
— Tampilkan ringkasan rider + RAB yang sudah diisi (read-friendly, bukan form kompleks)
— Tombol "Edit di Web" jika perlu ubah detail (form kompleks lebih baik di web)
— Tombol "Generate PDF" — sama pola dengan proposal
— Tombol "Share" via expo-sharing
```

> Alasan form kompleks (BudgetTable dengan banyak baris, drag reorder) tetap
> di web: input tabel banyak kolom di mobile screen kecil pengalaman UX-nya buruk.
> Mobile perannya di sini adalah akses cepat & share, bukan authoring penuh.

---

### FASE 9 — Testing & Hardening

```
[ ] Test generate PDF proposal — buka hasilnya, cek layout tidak berantakan
[ ] Test generate PDF rider+RAB — cek total budget kalkulasi benar
[ ] Test Cloudinary raw upload — pastikan resource_type: 'raw' (bukan accidentally 'video')
[ ] Test dari mobile — generate PDF, share ke WhatsApp berhasil
[ ] Error handling: kalau band profile belum diisi, proposal builder kasih
    prompt "Lengkapi profil band dulu" — bukan crash
[ ] Error handling: budget items kosong tapi generate PDF ditekan — kasih
    validasi minimal 1 item sebelum generate
[ ] npm run build (web) — zero error
[ ] npx tsc --noEmit (mobile) — zero error
```

---

## 8. Update Navigasi

**Web** — tambahkan menu di Sidebar/Navbar:
```
Proposal    → /app/proposals
Band Profil → /app/band-profile
```

Rider+RAB tidak perlu menu terpisah — diakses dari dalam Session detail
(`/app/sessions/:id` → tombol "Kelola Rider & RAB").

**Mobile** — tambahkan tab atau masuk ke halaman Settings sebagai sub-menu:
```
Opsi A: tambah tab ke-6 "Proposal" di tab navigator
Opsi B (direkomendasikan): masukkan sebagai menu di dalam Dashboard,
        supaya tab navigator tidak terlalu penuh (5 tab sudah pas untuk mobile)
```

---

## 9. Checklist Final

```
DATABASE
[ ] Tabel band_profiles, proposals, event_documents sudah ada di NeonDB
[ ] Types sudah sinkron di web + mobile

BACKEND
[ ] CRUD endpoints band-profiles, proposals, event-documents jalan
[ ] Endpoint generate-pdf berhasil upload ke Cloudinary (resource_type: raw)
[ ] @react-pdf/renderer terinstall di server/

WEB
[ ] Band Profile page — CRUD lengkap + upload logo/foto
[ ] Proposal builder — CRUD + pilih setlist + testimoni
[ ] PDF proposal — download client-side + generate & simpan ke cloud
[ ] Rider+RAB builder — 2 tab, budget table dengan auto-total
[ ] PDF rider+RAB — generate 2 halaman

MOBILE
[ ] Proposal list + detail + generate PDF + share
[ ] Band profile — form simplified
[ ] Rider+RAB — view + generate + share (bukan full builder)

DOKUMENTASI
[ ] README.md sudah tidak menyebut Firebase sama sekali
[ ] AGENTS.md diupdate dengan fitur baru (proposals, event_documents) di section Architecture
[ ] SUMMARY.md diupdate dengan Fase 15+ yang baru selesai
```

---

## 10. Estimasi Waktu

| Fase | Estimasi |
|------|----------|
| Fase 0 — Bersihkan dokumentasi | 1-2 jam |
| Fase 1 — Database & Types | 2-3 jam |
| Fase 2 — Backend CRUD | 1 hari |
| Fase 3 — Web Band Profile | 1 hari |
| Fase 4 — Web Proposal Builder | 1-2 hari |
| Fase 5 — Web PDF Proposal | 1 hari |
| Fase 6 — Web Rider+RAB | 1-2 hari |
| Fase 7 — Mobile Proposal | 1 hari |
| Fase 8 — Mobile Rider+RAB view | 1 hari |
| Fase 9 — Testing & Hardening | 1 hari |
| **Total** | **~8-10 hari kerja** |
