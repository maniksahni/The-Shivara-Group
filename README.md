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

For custom domains, set all public URL variables to the custom domain:

```bash
NEXTAUTH_URL=https://your-custom-domain.com
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
SITE_URL=https://your-custom-domain.com
```

Do not keep these values pointed at the temporary Railway URL after connecting
a production domain.

Seed a new database once, when required:

```bash
pnpm seed
```

Reset the admin password from the project folder with Railway variables:

```bash
railway run pnpm admin:reset-password
```
