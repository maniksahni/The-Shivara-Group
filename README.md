# The Shivara Group Real Estate CRM

Next.js real-estate website and authenticated CRM backed by Prisma and PostgreSQL.

## Current Deployment Target

- App hosting: Vercel free tier
- Database: Supabase Postgres free tier or Neon Postgres free tier
- Production domain: `https://shivara.site`

The public website can render fallback content when `DATABASE_URL` is not configured. CRM login, leads, properties, reports, admin actions, and enquiry persistence require a live PostgreSQL database.

## Local Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Required Environment Variables

Set these in Vercel Project Settings -> Environment Variables for Production:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXTAUTH_URL="https://shivara.site"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="https://shivara.site"
SITE_URL="https://shivara.site"
CRM_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="replace-with-a-strong-admin-password"
CRM_SALES_AGENT_EMAILS=""
```

Generate `NEXTAUTH_SECRET` locally:

```bash
openssl rand -base64 32
```

## Database Setup

Prisma is configured for PostgreSQL. For a fresh Supabase or Neon database:

```bash
pnpm db:push
pnpm seed
```

`pnpm db:push` creates the schema. `pnpm seed` removes demo CRM data, keeps only the configured Shivara admin user, and creates/updates that admin password from `CRM_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

For a non-destructive admin password reset:

```bash
pnpm admin:reset-password
```

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the GitHub repo into Vercel.
3. Framework preset: Next.js.
4. Install command: `pnpm install`.
5. Build command: `pnpm run build`.
6. Output directory: leave default.
7. Add all required environment variables above.
8. Deploy.

## Domain Setup

1. In Vercel, open Project Settings -> Domains.
2. Add `shivara.site`.
3. Follow the DNS instructions Vercel gives for your domain registrar.
4. After DNS verifies, keep all public URL variables set to `https://shivara.site`.
5. Redeploy after changing environment variables.

## Railway MySQL to PostgreSQL Migration

The old Railway setup used MySQL. The safest free long-term path is:

1. Create a new empty Supabase or Neon Postgres database.
2. Set `DATABASE_URL` to the Postgres pooled connection string.
3. Run `pnpm db:push` to create the PostgreSQL schema.
4. Run `pnpm seed` to create the production admin account.
5. If old production data is needed, export Railway MySQL tables first, transform enum/date/json values carefully, then import into PostgreSQL table-by-table.
6. Verify CRM login, leads, properties, reports, and public enquiry flows on `https://shivara.site`.

Because this repo does not contain historical migration files, `prisma db push` is the intended bootstrap command for a fresh free-tier database.
