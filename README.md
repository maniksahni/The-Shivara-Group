# The Shivara Group Real Estate & CRM Portal

Bespoke real estate website and client relationship management (CRM) portal built with Next.js, Tailwind CSS, and TypeScript, hosted on **Firebase Hosting**.

## Production Deployment Target

- **Hosting**: Firebase Hosting (Spark Plan)
- **Primary Live Domain**: `https://theshivaragroup.web.app`
- **Custom Domain**: `https://shivara.site`

## Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Run dev server
pnpm dev
```

## Static Build & Firebase Deployment

To build the static export and deploy to Firebase Hosting in one command:

```bash
pnpm deploy:firebase
# or
bash scripts/deploy-static.sh
```

## Admin CRM Portal Access

- **Login URL**: `https://theshivaragroup.web.app/crm/login` or `https://shivara.site/crm/login`
- **Admin ID**: `admin@shivaragroup.com`
- **Admin Password**: `SHIVAM@2112`

## Project Structure

- `src/app/(website)`: Public-facing luxury real estate website (Home, Properties, Services, About, Contact).
- `src/app/(crm)`: Real estate CRM management portal (Dashboard, Leads & Kanban, Properties, Reports, Calendar, Activities, Settings).
- `src/app/(auth)`: CRM Admin authentication page.
- `scripts/deploy-static.sh`: Static build & Firebase Hosting deployment script.
- `firebase.json`: Firebase Hosting clean URL configuration.
