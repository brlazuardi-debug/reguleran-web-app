# AGENTS.md — Reguleran

## Commands (run from `reguleran/`)
- `npm run dev` — Vite dev server at localhost:5173
- `npm run build` — production build via Vite 8 (rolldown)
- `npm run lint` — ESLint
- `firebase deploy --only hosting` — deploy frontend only (no Blaze required)
- `firebase deploy` — full deploy (requires Blaze for functions)

## Architecture
- **React 19 + Vite 8** (rolldown, not rollup). `manualChunks` in vite.config must be a **function**, not an object.
- **Zustand** stores + Firestore real-time listeners (`onSnapshot`). Each store calls `subscribe()` in a `useEffect` and returns the unsubscribe.
- **Firebase** config is **hardcoded** in `src/services/firebase.js` (lazy singleton pattern). `.env` mirrors it for build-time use but is secondary.
- **Auth** only Email/Password. Store uses `onAuthStateChanged` in `init()`, called once in `App.jsx`.
- **All routes** under `/app/*` are wrapped in `ProtectedRoute` + `Layout`.
- **Firestore collections**: `songs`, `setlists`, `sessions`, `publicSongs` — all filtered by `userId`.
- **Storage**: audio files at `audio/{songId}.{mp3|wav|ogg}`.
- **Functions**: `syncSongToPublic` (Firestore trigger) + `cleanupSessions` (weekly cron). Require **Blaze** plan to deploy.
- **PWA** via `vite-plugin-pwa` (auto service worker generation).
- **Sentry** configured in `App.jsx`. Requires `VITE_SENTRY_DSN` in `.env`.

## Gotchas
- Firestore & Storage must be **manually initialized** in Firebase Console before any data ops work.
- Functions **cannot deploy on Spark** (free) plan — skip `--only functions` until Blaze upgraded.
- VAPID key in `.env` is **currently empty**. Must be obtained from Firebase Console > Cloud Messaging > Web Configuration for FCM.
- ESLint config is in `eslint.config.js` (flat config, v10).
- Tailwind uses custom monochrome palette (no brand color).
