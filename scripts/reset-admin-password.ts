/**
 * Non-destructive production helper to create/update the CRM admin password.
 *
 * Required env:
 * - CRM_ADMIN_EMAIL
 * - SEED_ADMIN_PASSWORD
 *
 * This script does NOT delete leads, properties, notes, visits, or agents.
 */

import bcryptjs from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

async function main() {
  const email = process.env.CRM_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email) {
    throw new Error('CRM_ADMIN_EMAIL is required.')
  }

  if (!password || password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD is required and must be at least 8 characters.')
  }

  const passwordHash = await bcryptjs.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Shivam Sahani',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      name: 'Shivam Sahani',
      email,
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  })

  console.log(`✅ Admin password reset for ${user.name} <${user.email}> (${user.role})`)
}

main()
  .catch((error) => {
    console.error('❌ Admin password reset failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
