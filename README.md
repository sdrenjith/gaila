# Krew Marketing CMS

Full-stack Next.js CMS for the Krew Marketing digital agency website. Public pages are server-rendered from MongoDB, and content is managed through a protected admin panel.

## Requirements

- Node.js 20+
- MongoDB running locally or remotely

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Edit `.env.local` and set secure values for at least:

- `MONGODB_URI`
- `SESSION_SECRET` (32+ random characters in production)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `APP_URL`

MongoDB connection is configured in [`src/lib/db.ts`](src/lib/db.ts) via `MONGODB_URI`. Environment validation lives in [`src/lib/env.ts`](src/lib/env.ts).

4. Seed the database and create the admin user:

```bash
npm run seed
```

`npm run admin:create` can also upsert the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` without reseeding all content.

5. Start the development server:

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js in development |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Seed pages, menus, content, settings, and admin user |
| `npm run admin:create` | Create or update admin user from env vars |

## Architecture

- [`src/app/`](src/app/) — App Router pages, API routes, and server actions
- [`src/app/page.tsx`](src/app/page.tsx) — Homepage (CMS-driven sections)
- [`src/app/admin/`](src/app/admin/) — Protected admin CMS UI
- [`src/app/actions/`](src/app/actions/) — Server actions for admin and public forms
- [`src/components/sections/SectionRenderer.tsx`](src/components/sections/SectionRenderer.tsx) — Dynamic section rendering
- [`src/models/`](src/models/) — Mongoose models (pages, content, settings, leads, media)
- [`src/lib/cms.ts`](src/lib/cms.ts) — Data access helpers
- [`src/lib/auth.ts`](src/lib/auth.ts) — Session and admin authentication
- [`src/proxy.ts`](src/proxy.ts) — Admin route protection (Next.js 16 proxy convention)

## CMS features

- Dynamic pages with configurable section blocks
- Services, case studies, and blog content
- Header/footer menus
- Google reviews in site settings
- Media uploads
- Lead capture form with basic spam protection
- SEO metadata, sitemap, and robots output
