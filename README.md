# The Shivara Group Real Estate CRM

Next.js real-estate website and authenticated CRM backed by MySQL and Prisma.

## Local development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The public website remains available with fallback property data when
`DATABASE_URL` is not configured. Database-backed enquiries, authentication,
and CRM operations require MySQL.

## Railway deployment

1. Create a Railway project and add a MySQL service.
2. Deploy this repository as a Railway service.
3. Configure the variables listed in `.env.example`.
4. Use `pnpm build` as the build command.
5. Use `pnpm start` as the start command.

The start command synchronizes the Prisma schema with Railway MySQL before
starting Next.js. Railway supplies `PORT` automatically.

Seed a new database once, when required:

```bash
pnpm seed
```
