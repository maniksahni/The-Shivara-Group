/**
 * prisma/seed.ts
 *
 * Production-safe seed for The Shivara Group CRM.
 *
 * Keeps the CRM clean:
 *  - removes all demo/fake leads and related records
 *  - removes all users except the single admin account below
 *  - ensures one active admin user exists for Shivam Sahani
 *
 * No sample leads, agents, notes, activities, site visits, or fake customers
 * are created by this seed.
 */

import bcryptjs from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

const SHIVAM_USER = {
  name: 'Shivam Sahani',
  email: 'shivam@shivaragroup.com',
  phone: null as string | null,
  role: 'ADMIN' as const,
  password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
}

async function main() {
  console.log('🌱  Starting production-safe Shivara CRM seed …')

  const passwordHash = await bcryptjs.hash(SHIVAM_USER.password, 12)

  const user = await prisma.$transaction(async (tx) => {
    await tx.siteVisit.deleteMany()
    await tx.leadNote.deleteMany()
    await tx.leadActivity.deleteMany()
    await tx.lead.deleteMany()

    const shivam = await tx.user.upsert({
      where: { email: SHIVAM_USER.email },
      update: {
        name: SHIVAM_USER.name,
        passwordHash,
        phone: SHIVAM_USER.phone,
        role: SHIVAM_USER.role,
        isActive: true,
      },
      create: {
        name: SHIVAM_USER.name,
        email: SHIVAM_USER.email,
        passwordHash,
        phone: SHIVAM_USER.phone,
        role: SHIVAM_USER.role,
        isActive: true,
      },
    })

    await tx.user.deleteMany({
      where: {
        email: { not: SHIVAM_USER.email },
      },
    })

    return shivam
  })

  const [users, leads, notes, activities, visits] = await Promise.all([
    prisma.user.count(),
    prisma.lead.count(),
    prisma.leadNote.count(),
    prisma.leadActivity.count(),
    prisma.siteVisit.count(),
  ])

  console.log('✅  CRM data cleaned.')
  console.log(`   User kept: ${user.name} <${user.email}>`)
  console.log(`   Users: ${users}`)
  console.log(`   Leads: ${leads}`)
  console.log(`   Notes: ${notes}`)
  console.log(`   Activities: ${activities}`)
  console.log(`   Site visits: ${visits}`)
}

main()
  .catch((error) => {
    console.error('❌  Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
