# Setup — Reguleran (Local Development)

This guide gets Reguleran running locally: web app (Vite), Hono API server, and the
Expo mobile app. It assumes Node 20+ and an active Clerk account + NeonDB project.

For architecture, deploy steps, and gotchas, see `../AGENTS.md` and `../README.md`.

## 0. Prerequisites

- **Node.js** 20+ (the server uses `--env-file`, native on Node 20.6+).
- **Clerk account** — create an app at https://clerk.com. You need:
  - Publishable key (`pk_test_...`) for the web client.
  - Secret key (`sk_test_...`) for the server.
- **NeonDB** project — https://neon.tech. Copy the connection string (`postgresql://...?sslmode=require`).
- **Cloudinary** account — for audio + band-logo uploads. You need cloud name, API key, API secret,
  and an **unsigned upload preset** (e.g. `reguleran_audio`) configured in the Cloudinary dashboard.
- **Git repo** cloned locally.

## 1. Environment files

Two env files are needed and are **not** committed to git.

### `reguleran/.env` (web client + server)

Copy the template and fill in real values:

```bash
cp .env.example .env
```

| Key | Used by | Notes |
|-----|---------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | web | Browser-exposed (`VITE_` prefix). |
| `VITE_API_URL` | web | `http://localhost:3001/api` in dev. |
| `VITE_CLOUDINARY_CLOUD_NAME` | web | Browser-exposed. |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | web | Unsigned preset name. |
| `PORT` | server | API port (default `3001`). |
| `CORS_ORIGIN` | server | `http://localhost:5173` for Vite dev. Comma-separated `CORS_ORIGINS` also accepted. |
| `DATABASE_URL` | server | NeonDB connection string. |
| `CLERK_SECRET_KEY` | server | Server-only. |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | server | Server-only (Admin API deletes). |

> Note: the server reads `../.env` via `--env-file` (see `server/package.json`). The web app reads
> the same `reguleran/.env` through Vite. Keep both halves in this one file.

### `reguleran/mobile/.env` (mobile client)

Create manually (not committed), in `mobile/.env`:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=reguleran_audio
```

Only `EXPO_PUBLIC_`-prefixed vars are exposed to the mobile bundle.

## 2. Database

Run the schema once in the NeonDB SQL Editor (or via `psql`):

```bash
# paste the contents of ./neon-migration.sql into the Neon SQL Editor and run
```

- `users.id` is `TEXT` (Clerk user ID), not UUID.
- No RLS / triggers — auth is enforced by the Clerk JWT middleware in the Hono API.
- Indexes on `user_id` (and `session_id` / `status` where noted) are created by the script.

Seed data is optional but needed for the portfolio screenshots (see `../AGENTS.md` → Portfolio).

## 3. Install dependencies

From the repo root (`REGULERAN/`), three separate installs:

```bash
# Web + server share the reguleran/ workspace
cd reguleran && npm install
cd reguleran/server && npm install

# Mobile (separate package.json)
cd reguleran/mobile && npm install
```

> `reguleran/` and `reguleran/mobile/` are independent npm projects. Install both.

## 4. Run the stack (web)

Three terminals:

```bash
# Terminal A — API server (Hono, :3001)
cd reguleran/server && npm run dev

# Terminal B — Web app (Vite, :5173)
cd reguleran && npm run dev

# Terminal C (optional) — preview a production build
cd reguleran && npm run build && npm run preview
```

Open http://localhost:5173. Auth requests proxy to `:3001` via the Vite dev proxy.

Verify the API is up:

```bash
curl http://localhost:3001/api/health
# → {"status":"ok"}
```

## 5. Run the mobile app

```bash
cd reguleran/mobile
npx expo start                 # QR for Expo Go
npx expo start --android       # Android emulator
npx expo start --ios           # iOS simulator
```

The mobile app talks to the same Hono API at `http://localhost:3001/api` (set
`EXPO_PUBLIC_API_URL`). On a physical device, replace `localhost` with your machine's LAN IP
(e.g. `http://192.168.x.x:3001/api`) — the CORS config allows `exp://` and `http://192.168.*`
origins automatically.

Type-check before committing:

```bash
cd reguleran/mobile && npx tsc --noEmit   # zero errors required
```

## 6. Clerk redirect URLs

In the Clerk Dashboard → **Redirect URLs**, add:

- `http://localhost:5173/oauth-callback` (web OAuth callback)
- `exp://localhost:8081/--/` and your `exp://` scheme for mobile (Expo handles deep links)

The web OAuth callback route is `/oauth-callback` and uses `<AuthenticateWithRedirectCallback />`.

## 7. Common first-run failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| All API calls 401 | Wrong `CLERK_SECRET_KEY` or `@clerk/backend` misuse | Verify `CLERK_SECRET_KEY` matches the Clerk instance serving the publishable key. |
| CORS blocked in browser | `CORS_ORIGIN` missing `http://localhost:5173` | Add it to `reguleran/.env`. |
| `Bearer` 401 from server | Env not loaded | Server must run with `--env-file=../.env` (the `npm run dev` script does this). |
| Tables empty after login | `neon-migration.sql` not run | Run it in NeonDB. |
| Mobile login loops | `EXPO_PUBLIC_API_URL` points at `localhost` on a real device | Use LAN IP or run on emulator. |
| `verifyToken` throws | Using `clerk.verifyToken()` instead of the standalone import | See `../AGENTS.md` Gotchas — use `import { verifyToken } from '@clerk/backend'`. |

## 8. Verify the build

```bash
# Web
cd reguleran && npm run build && npm run lint

# Mobile
cd reguleran/mobile && npx tsc --noEmit
```

Both should complete with zero errors before a deploy (see `../AGENTS.md` → Production Deploy).
