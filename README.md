# Eternally Yours

**Premium wedding invitation builder** — create animated, shareable digital invitations with RSVP tracking, guest check-in, and WhatsApp updates.

---

## Overview

Eternally Yours is a full-stack web application that lets couples and planners design beautiful wedding invitations, publish them as shareable microsites, and manage guests from a unified dashboard. Each invitation includes 3D card animations, customizable themes and fonts, multilingual content, RSVP forms, a guestbook, event schedules, and optional background music.

Authenticated users build invitations in a visual editor with live preview. Guests visit public URLs (`/invite/[slug]`) to view the invitation, RSVP, and leave messages. Organizers use the dashboard to track RSVPs, export data, run event-day check-in, and send WhatsApp updates through an external gateway.

---

## Features

### Invitation builder
- Create and edit invitations with template presets, themes, and fonts
- Live builder preview with auto-scaling layout
- Cover image, venue, date/time, Google Maps link, dress code, family names
- Love story, secondary language content, gallery, and multi-day event series
- Wedding day schedule builder
- Background music URL support (tier-gated)
- Publish / unpublish invitations with unique shareable slugs

### Public invitation experience
- Animated 3D card reveal, particle effects, and confetti
- Countdown timer to the event date
- Language toggle (English, Hindi, Urdu, Marathi, Gujarati)
- RSVP form with guest count, meal preference, and WhatsApp opt-in
- Guestbook / wishes wall
- Share via link, WhatsApp, email, or Twitter
- View analytics tracking

### Dashboard & organizer tools
- Invitation list with publish status and RSVP counts
- RSVP viewer with attendance filters and CSV export
- Event-day guest check-in (QR / code lookup)
- WhatsApp bulk updates to consented guests
- Account settings and tier-based feature limits (Free / Pro)

### Admin (role: `admin`)
- Platform overview and all-invitation management
- User tier management (free / pro)
- WhatsApp sender connection panel (QR-based gateway)

### Mobile API
- REST endpoints under `/api/mobile/*` for sign-in, invitations, RSVPs, check-in, and admin operations
- Bearer-token sessions for native mobile clients

### Marketing & SEO
- Landing page, templates gallery, pricing, about, contact, terms, and privacy pages
- Sitemap, robots.txt, Open Graph metadata, and JSON-LD structured data

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, `output: 'standalone'`) |
| UI | [React 19](https://react.dev/), [TypeScript 5.7](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/), `@tailwindcss/typography` |
| Animation | [Framer Motion 11](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Auth | [NextAuth.js 4](https://next-auth.js.org/) (Credentials provider, JWT sessions) |
| Database | [Prisma 5](https://www.prisma.io/) + **MySQL 8** |
| Password hashing | bcryptjs |
| QR codes | qrcode |
| Testing (dev) | Playwright |
| Containerization | Docker + Docker Compose |

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | **20.x or 22.x** (18.18+ minimum for Next.js 15; Docker image uses Node 22) |
| **npm** | **10+** (ships with Node 20+) |
| **MySQL** | **8.x** (local install or Docker) |

Verify your environment:

```bash
node -v    # v20.x.x or v22.x.x
npm -v     # 10.x.x or higher
```

Optional for WhatsApp features:
- A compatible WhatsApp gateway service (default: `http://127.0.0.1:3020`)

---

## Installation

```bash
git clone <repo-url>
cd invitation-web-app
npm install
```

### 1. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at minimum `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`. See [Environment Variables](#environment-variables).

Generate a secure secret:

```bash
openssl rand -base64 32
```

### 2. Start MySQL

**Option A — Docker Compose (recommended)**

```bash
docker compose up -d mysql
```

This starts MySQL on port `3306` with the credentials shown in `docker-compose.yml`. Align `DATABASE_URL` in `.env.local` accordingly.

**Option B — existing MySQL server**

Create a database and user, then set `DATABASE_URL` in `.env.local`.

### 3. Initialize the database

```bash
npm run db:generate
npm run db:push
```

Optional — seed an admin account:

```bash
npm run db:seed
```

> The seed script creates `admin@sikanderkumbhar.com` if it does not exist. Change the password immediately after first login in any non-local environment. See `prisma/seed.ts`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. **Never commit `.env` or `.env.local`.**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string for Prisma (`mysql://user:pass@host:3306/db`) |
| `NEXTAUTH_SECRET` | Yes | Secret for signing NextAuth JWT sessions. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Canonical app URL for auth callbacks (e.g. `http://localhost:3000`) |
| `MOBILE_SESSION_SECRET` | Recommended | Secret for mobile API bearer tokens. Falls back to `NEXTAUTH_SECRET` in dev |
| `APP_URL` | Recommended | Public site URL for SEO metadata, share links, and absolute URLs |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Browser-visible base URL; used by mobile API helpers |
| `WHATSAPP_GATEWAY_URL` | No | WhatsApp gateway base URL (default: `http://127.0.0.1:3020`) |
| `WHATSAPP_GATEWAY_INTERNAL_TOKEN` | No | Internal auth token sent as `X-Internal-Token` to the gateway |
| `WHATSAPP_SESSION_ID` | No | Gateway session identifier (default: `eternally-yours-main`) |
| `INTERNAL_TOKEN` | No | Legacy alias for `WHATSAPP_GATEWAY_INTERNAL_TOKEN` |
| `VERCEL_URL` | Auto | Set by Vercel at deploy time; used as fallback base URL |
| `NODE_ENV` | Auto | `development` or `production`; set by Next.js / host |

---

## Running Locally

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| [http://localhost:3000](http://localhost:3000) | Marketing home |
| [http://localhost:3000/sign-up](http://localhost:3000/sign-up) | Create account |
| [http://localhost:3000/dashboard](http://localhost:3000/dashboard) | User dashboard (auth required) |
| [http://localhost:3000/dashboard/invitations/new](http://localhost:3000/dashboard/invitations/new) | Invitation builder |

Useful during development:

```bash
npm run db:studio    # Prisma visual database browser
npm run lint         # ESLint (requires eslint devDependency — see Troubleshooting)
```

---

## Production Build

```bash
npm run build
npm start
```

The app listens on port **3000** by default (`PORT` env var overrides).

`next.config.js` sets `output: 'standalone'` for optimized Docker deployments.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server with hot reload |
| `npm run build` | Production build (type-check, compile, static generation) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint via `next lint` |
| `npm run db:generate` | Generate Prisma Client from `prisma/schema.prisma` |
| `npm run db:push` | Push schema changes to the database (no migration files) |
| `npm run db:migrate` | Create and apply Prisma migrations (`prisma migrate dev`) |
| `npm run db:studio` | Open Prisma Studio database GUI |
| `npm run db:seed` | Seed default admin user (`prisma/seed.ts`) |
| `npm run db:migrate:mysql` | One-off SQLite → MySQL data migration utility |

---

## Project Structure

```
invitation-web-app/
├── .env.example              # Environment variable template
├── .eslintrc.json            # ESLint rules (hydration safeguards)
├── docker-compose.yml        # MySQL + app services for local/production Docker
├── Dockerfile                # Multi-stage production image (Node 22, standalone)
├── docs/                     # Additional guides (testing, SEO, hydration audit)
├── next.config.js            # Next.js config (standalone, security headers, images)
├── package.json
├── postcss.config.js
├── prisma/
│   ├── schema.prisma         # Database models (User, Invitation, Rsvp, …)
│   └── seed.ts               # Admin user seed script
├── public/
│   └── site.webmanifest      # PWA manifest
├── scripts/
│   └── migrate-sqlite-to-mysql.ts
├── src/
│   ├── app/                  # Next.js App Router pages & API routes
│   │   ├── api/              # REST API (invitations, auth, admin, mobile)
│   │   ├── dashboard/        # Authenticated dashboard & builder
│   │   ├── invite/[slug]/    # Public invitation microsites
│   │   ├── layout.tsx        # Root layout, SEO, global nav
│   │   └── globals.css       # Tailwind + typography tokens
│   ├── components/           # React components
│   │   ├── dashboard/        # Builder chrome, preview scaler, shell
│   │   ├── landing/          # Marketing nav, hero, footer
│   │   ├── marketing/        # About hero, auth shell, template cards
│   │   └── ui/               # Button, Input, Modal, Toast
│   ├── lib/                  # Shared logic
│   │   ├── hooks/            # useMounted, useClientValue, SSR helpers
│   │   ├── whatsapp/         # Gateway client
│   │   ├── auth-options.ts   # NextAuth configuration
│   │   ├── db.ts             # Prisma singleton
│   │   ├── ssr.ts            # SSR-safe date/format utilities
│   │   ├── themes.ts         # Invitation color themes
│   │   ├── typography.ts     # Static typography class tokens
│   │   └── validations.ts    # Zod schemas
│   └── middleware.ts         # Protects /dashboard routes
├── tailwind.config.js
└── tsconfig.json
```

---

## Troubleshooting

### Dependency issues

```bash
rm -rf node_modules package-lock.json   # last resort only
npm install
```

Prefer `npm ci` in CI/CD for reproducible installs from `package-lock.json`.

### Build issues

1. Run `npm run db:generate` before `npm run build` (Prisma Client must exist).
2. Ensure `DATABASE_URL` is set — Prisma may need it at build time.
3. **ESLint not installed:** `next build` may warn `ESLint must be installed`. Install it if you need lint during builds:
   ```bash
   npm install --save-dev eslint
   ```

### Hydration mismatches

If you see React hydration warnings in the browser console:

1. Hard refresh: `Ctrl + Shift + R` (clears stale client bundles).
2. Delete the Next.js cache and restart:
   ```bash
   rm -rf .next
   npm run dev
   ```
3. Nav components use server-rendered links with the `.type-nav` CSS class — avoid mixing dynamic Tailwind strings in client nav markup.
4. See `docs/HYDRATION-AUDIT-REPORT.md` for patterns and prevention checklist.
5. Disable browser extensions that modify DOM before React hydrates.

### Environment variable issues

| Symptom | Fix |
|---------|-----|
| Auth redirects fail | Set `NEXTAUTH_URL` to your exact origin (no trailing slash) |
| Wrong share / OG URLs | Set `APP_URL` and `NEXT_PUBLIC_SITE_URL` to your public domain |
| Database connection refused | Verify MySQL is running and `DATABASE_URL` host/port match |
| WhatsApp panel errors | Ensure gateway is running and `WHATSAPP_GATEWAY_URL` is reachable |

### Cache issues

```bash
rm -rf .next .turbo
npm run dev
```

### Port conflicts

If port 3000 is in use:

```bash
# Windows PowerShell
$env:PORT=3001; npm run dev

# macOS / Linux
PORT=3001 npm run dev
```

MySQL Docker default port is `3306`. Change the host mapping in `docker-compose.yml` if it conflicts.

---

## Deployment

### Docker (recommended for self-hosting)

1. Build the image:
   ```bash
   docker build -t eternally-yours:local .
   ```

2. Start MySQL and the app:
   ```bash
   docker compose up -d
   ```

3. Push schema on first deploy (from host or a one-off container):
   ```bash
   npm run db:push
   ```

4. Override secrets in `docker-compose.yml` or use an `.env` file referenced by Compose — **do not use default passwords in production**.

The Dockerfile uses Next.js `standalone` output and Node 22 on Debian Bookworm with OpenSSL 3.

### Vercel / Node hosting

1. Set all required environment variables in the hosting dashboard.
2. Use a managed MySQL instance (PlanetScale, Railway, AWS RDS, etc.).
3. Run `prisma generate` and `prisma db push` (or `migrate deploy`) as part of your deploy pipeline.
4. `VERCEL_URL` is injected automatically; still set `APP_URL` and `NEXTAUTH_URL` to your custom domain.

### Post-deploy checklist

- [ ] Rotate `NEXTAUTH_SECRET`, `MOBILE_SESSION_SECRET`, and database passwords
- [ ] Set `APP_URL` / `NEXTAUTH_URL` to production domain with HTTPS
- [ ] Run database migrations / `db:push`
- [ ] Change or remove default seed admin credentials
- [ ] Configure WhatsApp gateway if using sender features

---

## Contributing

1. **Fork / branch** from `main` (or your team's default branch).
2. **Install** dependencies and copy `.env.example` → `.env.local`.
3. **Run** `npm run db:push` and `npm run dev` before making changes.
4. **Follow existing patterns:**
   - Server Components by default; add `"use client"` only when needed.
   - Use `formatEventDate()` from `@/lib/ssr` for displayed dates.
   - Use `ButtonLink` instead of nesting `<Link>` inside `<Button>`.
   - Keep typography tokens static; prefer `.type-nav` for navigation styles.
5. **Test** locally: `npm run build` must pass before opening a PR.
6. **Do not commit** secrets, `.env*`, `node_modules/`, `.next/`, or `mysql-data/`.

Additional internal guides live in `docs/`:
- `IMPLEMENTATION-AND-TESTING-GUIDE.md` — feature walkthrough and E2E testing
- `HYDRATION-AUDIT-REPORT.md` — SSR / hydration conventions

---

## License

This project is marked `"private": true` in `package.json` and is **proprietary**. All rights reserved unless a separate `LICENSE` file is added by the repository owner.

For open-source licensing, add an appropriate `LICENSE` file (e.g. MIT) and update this section.

---

## Repository Handoff Checklist

Use this checklist before sharing the repo with another developer:

- [ ] `.env.example` is up to date; no real secrets in the repository
- [ ] `.env`, `.env.local`, and `mysql-data/` are gitignored and not tracked
- [ ] `package-lock.json` is committed for reproducible installs
- [ ] README installation steps verified on a clean machine
- [ ] MySQL is reachable and `DATABASE_URL` documented
- [ ] `NEXTAUTH_SECRET` generation instructions are clear
- [ ] Default seed admin password documented as **change immediately in non-local envs**
- [ ] `docker-compose.yml` production secrets rotated (file contains example credentials)
- [ ] `npm run build` succeeds
- [ ] Optional: install `eslint` devDependency if lint-in-build is required
- [ ] Large folders (`node_modules/`, `.next/`, agent skill mirrors) excluded via `.gitignore`
