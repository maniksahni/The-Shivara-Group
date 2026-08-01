# The Shivara Group Real Estate CRM

Next.js real-estate website and authenticated CRM backed by Prisma and MySQL.

## Current Deployment Target

- App hosting: Railway
- Database: Railway MySQL
- Production domain: `https://shivara.site`

The public website can render fallback content when `DATABASE_URL` is not configured. CRM login, leads, properties, reports, admin actions, and enquiry persistence require the live MySQL database.

## Local Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Required Environment Variables

Set these on the Railway app service in the production environment:

```bash
DATABASE_URL="${{MySQL-2sfV.MYSQL_URL}}"
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

Prisma is configured for MySQL. The production start command synchronizes the Prisma schema before starting Next.js. For a fresh database, it can also be initialized manually from an environment that can reach MySQL:

```bash
pnpm db:push
pnpm seed
```

`pnpm db:push` creates the schema. `pnpm seed` removes demo CRM data, keeps only the configured Shivara admin user, and creates/updates that admin password from `CRM_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

For a non-destructive admin password reset:

```bash
pnpm admin:reset-password
```

## Railway Deployment

1. Push the repository to GitHub.
2. Connect the GitHub repo to a Railway app service.
3. Add one Railway MySQL service.
4. Set `DATABASE_URL` to the MySQL service reference shown above.
5. Add the remaining required environment variables.
6. Deploy the `main` branch. Railway detects Next.js and pnpm automatically.
7. Run `railway run pnpm admin:reset-password` locally if the admin password must be reset without deleting CRM data.

## Domain Setup

1. In the Railway app service, open Settings -> Networking.
2. Add `shivara.site`.
3. Follow the DNS target Railway gives for your domain registrar.
4. After DNS verifies, keep all public URL variables set to `https://shivara.site`.
5. Redeploy after changing environment variables.

## Production Database Notes

Use only one MySQL service as the CRM source of truth. Do not point the app at a second database service or a PostgreSQL URL while the Prisma datasource is configured for MySQL. Because this repo does not contain historical migration files, `prisma db push` is the intended bootstrap command for a fresh database.
