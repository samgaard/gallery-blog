# gallery-blog

A self-hosted portfolio and blog for artists. Simple admin UI for uploading artwork and writing posts. No CMS, no subscriptions — just a Next.js app you deploy to Vercel.

## Features

- Gallery with category filtering and lightbox
- Blog with rich text editor and image attachments
- Simple admin UI (single-user, password protected)
- Images stored on Cloudflare R2 (free egress)
- Postgres database via Supabase (free tier)

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (Postgres) via Drizzle ORM
- **Image storage:** Cloudflare R2
- **Auth:** iron-session (single admin user)
- **Hosting:** Vercel
- **Package manager:** pnpm

## Getting started

```bash
pnpm install
cp .env.local.example .env.local
# fill in .env.local values
pnpm db:migrate
pnpm dev
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_NAME` | Display name shown in the site header and page title |
| `DATABASE_URL` | Supabase connection string (use Transaction Pooler, port 6543) |
| `SESSION_SECRET` | 32-char random string — `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API key |
| `R2_SECRET_ACCESS_KEY` | R2 API secret |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public base URL for R2 images |

## Database commands

```bash
pnpm db:generate   # generate migration SQL from schema changes
pnpm db:migrate    # apply migrations to DB
pnpm db:studio     # open Drizzle Studio (visual DB browser)
```

## Project structure

```
src/
  app/
    (public)/         # public-facing routes
      page.tsx        # homepage — carousel + gallery preview + recent posts
      gallery/        # /gallery — artwork by category
      blog/           # /blog — post index
        [slug]/       # /blog/[slug] — individual post
    admin/
      login/          # /admin/login
      (protected)/    # auth-guarded admin pages
        artwork/      # manage artwork
        posts/        # manage blog posts
    api/
      auth/           # login / logout
      admin/          # artwork + post CRUD
  components/
    ui/               # shadcn components
    admin/            # admin-only form components
  db/
    schema.ts         # Drizzle schema
    index.ts          # DB client
  lib/
    auth.ts           # iron-session config
    r2.ts             # Cloudflare R2 upload helper
```
