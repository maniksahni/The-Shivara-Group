/**
 * src/lib/prisma.ts
 *
 * Prisma Client singleton for Next.js.
 *
 * In development, Next.js hot-reload creates new module instances on every
 * code change, which would exhaust the database connection pool if we simply
 * did `export const prisma = new PrismaClient()`.
 *
 * The fix is to stash the client on the `globalThis` object so that it
 * survives hot-reloads in development while still being a fresh instance
 * in production (where hot-reload never happens).
 */

import { PrismaClient } from '@prisma/client'

// Extend globalThis so TypeScript accepts our custom property.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

// In development, persist the client across hot-reloads.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
