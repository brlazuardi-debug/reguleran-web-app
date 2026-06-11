# Reguleran Musik

> Platform manajemen musik 

Reguleran membantu tim musik mengelola lagu, setlist, dan jadwal latihan dalam satu platform yang modern, cepat, dan mudah digunakan.

## Fitur

- **Manajemen Lagu** — Simpan chord, lirik, dan nada dasar. Transpose otomatis dengan slider.
- **Setlist Cerdas** — Buat setlist untuk setiap ibadah. Urutkan, edit, dan atur nada dasar per lagu.
- **Sesi & Jadwal** — Atur jadwal latihan dan pelayanan mingguan dengan kalender interaktif.
- **Pitch Shifter** — Ubah nada audio langsung dari browser (Web Audio API).
- **Lokasi** — Tandai lokasi venue dengan peta interaktif (Leaflet).
- **Autentikasi** — Login/register dengan Firebase Auth.
- **Monochrome Theme** — Tampilan elegan dengan dark mode dan light mode.
- **Responsif** — Mobile-first, berfungsi sempurna di semua perangkat.

## Tech Stack

| Teknologi | Kegunaan |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool |
| **Tailwind CSS 3** | Styling |
| **Firebase** | Auth, Firestore (backend) |
| **Zustand** | State management |
| **React Router 7** | Routing |
| **React Leaflet** | Peta interaktif |
| **Tone.js** | Audio / Pitch Shifter |
| **Lucide React** | Ikon |

## Struktur Proyek

```
reguleran/
├── public/               # Aset statis (favicon, icons)
├── src/
│   ├── components/
│   │   ├── auth/         # Login & Register form
│   │   ├── audio/        # Pitch Shifter
│   │   ├── layout/       # Navbar, Layout
│   │   ├── location/     # Map Picker
│   │   ├── schedule/     # Calendar View
│   │   ├── sessions/     # Session Card & Form
│   │   ├── setlists/     # Setlist Card, Form, SongPicker
│   │   ├── songs/        # Song Card, Form, ChordDisplay, TransposeSlider
│   │   └── ui/           # Button, Card, Badge, Modal, Toast, dll
│   ├── pages/            # Landing, Dashboard, Songs, Setlists, Sessions, dll
│   ├── stores/           # Zustand stores (auth, song, setlist, session)
│   ├── services/         # Firebase init, notification
│   ├── utils/            # Chord transpose utility
│   ├── App.jsx           # Route definitions
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles, utility classes
├── .env                  # Firebase credentials (VITE_*)
├── tailwind.config.js    # Monochrome palette, animations, fonts
├── vite.config.js        # Vite configuration
├── index.html            # HTML entry
└── package.json
```

## Memulai

### Prasyarat

- Node.js 20+
- npm 10+
- Firebase project (Auth + Firestore)

### Instalasi

```bash
# Clone repo
git clone <repo-url>
cd reguleran

# Install dependencies
npm install

# Konfigurasi Firebase
cp .env.example .env   # atau edit .env langsung
# Isi dengan kredensial Firebase project kamu
```

### Firebase Setup

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru atau pilih yang sudah ada
3. Enable **Authentication** → Sign-in method → Email/Password
4. Buat **Cloud Firestore** database
5. Register **Web App** untuk mendapatkan konfigurasi
6. Copy konfigurasi ke `.env` dengan prefix `VITE_FIREBASE_*`

Contoh `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Development

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### Production Build

```bash
npm run build
npm run preview
```

## Scripts

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview build |
| `npm run lint` | Lint semua file |

## Firestore Collection Structure

```
songs/           → { title, artist, key, lyrics, createdAt, updatedAt }
setlists/        → { name, description, songs: [{songId, transpose, order}], createdAt }
sessions/        → { name, day, time, setlistId, location: {venue, address, lat, lng}, active }
```

## Izin

```
firebase.rules  → Deny all by default — perlu diupdate untuk production
```

## Deployment

1. Build project: `npm run build`
2. Deploy ke Firebase Hosting (atau static host lain):

```bash
firebase deploy --only hosting
```

## Lisensi

MIT
