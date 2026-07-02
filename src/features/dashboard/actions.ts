/**
 * src/features/dashboard/actions.ts
 *
 * Server-side data-fetching functions (Next.js Server Actions / server utilities)
 * for the CRM dashboard page.
 *
 * All functions are async and talk directly to the database via Prisma so they
 * can be imported into Server Components without any HTTP round-trip.
 *
 * Exported:
 *  - getDashboardStats()   → DashboardStats
 *  - getTodayFollowUps()   → LeadWithAgent[]
 */

import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import type { DashboardStats, LeadWithAgent } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a Date set to midnight (00:00:00.000) today in the local timezone. */
function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Returns a Date set to 23:59:59.999 today. */
function endOfToday(): Date {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d
}

// ─────────────────────────────────────────────────────────────────────────────
// getDashboardStats
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all statistics required by the CRM dashboard in a single
 * function call (runs several Prisma queries in parallel via Promise.all).
 *
 * Agents see only their own leads; admins see all leads.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await getServerSession()

  // Build the optional "filter by assignedTo" clause for agents
  const agentFilter =
    session?.user?.role === 'ADMIN'
      ? undefined
      : { assignedToId: session?.user?.id }

  const todayStart = startOfToday()
  const todayEnd = endOfToday()

  // Run all queries concurrently
  const [
    totalLeads,
    todayLeads,
    pendingFollowUps,
    siteVisitsScheduled,
    closedDeals,
    leadsBySourceRaw,
    leadsByStatusRaw,
    recentActivities,
  ] = await Promise.all([
    // 1. Total leads
    prisma.lead.count({ where: agentFilter }),

    // 2. Leads created today
    prisma.lead.count({
      where: {
        ...agentFilter,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),

    // 3. Pending follow-ups (followUpDate ≤ today, not CLOSED or LOST)
    prisma.lead.count({
      where: {
        ...agentFilter,
        followUpDate: { lte: todayEnd },
        status: { notIn: ['CLOSED', 'LOST'] },
      },
    }),

    // 4. Site visits scheduled
    prisma.siteVisit.count({
      where: {
        status: 'SCHEDULED',
        ...(agentFilter ? { lead: agentFilter } : {}),
      },
    }),

    // 5. Closed deals
    prisma.lead.count({
      where: { ...agentFilter, status: 'CLOSED' },
    }),

    // 6. Leads by source (group by)
    prisma.lead.groupBy({
      by: ['source'],
      where: agentFilter,
      _count: { source: true },
      orderBy: { _count: { source: 'desc' } },
    }),

    // 7. Leads by status (group by)
    prisma.lead.groupBy({
      by: ['status'],
      where: agentFilter,
      _count: { status: true },
      orderBy: { _count: { status: 'desc' } },
    }),

    // 8. Recent activities — last 10
    prisma.leadActivity.findMany({
      where: agentFilter ? { lead: agentFilter } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        lead: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    }),
  ])

  return {
    totalLeads,
    todayLeads,
    pendingFollowUps,
    siteVisitsScheduled,
    closedDeals,

    leadsBySource: leadsBySourceRaw.map((row) => ({
      source: row.source,
      count: row._count.source,
    })),

    leadsByStatus: leadsByStatusRaw.map((row) => ({
      status: row.status,
      count: row._count.status,
    })),

    recentActivities: recentActivities.map((a) => ({
      id: a.id,
      action: a.action,
      oldValue: a.oldValue,
      newValue: a.newValue,
      createdAt: a.createdAt,
      lead: a.lead,
      user: a.user,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getTodayFollowUps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all leads whose followUpDate falls within today's date range
 * and whose status is not CLOSED or LOST.
 *
 * Agents see only their own leads; admins see all.
 */
export async function getTodayFollowUps(): Promise<LeadWithAgent[]> {
  const session = await getServerSession()

  const agentFilter =
    session?.user?.role === 'ADMIN'
      ? {}
      : { assignedToId: session?.user?.id }

  const todayStart = startOfToday()
  const todayEnd = endOfToday()

  const leads = await prisma.lead.findMany({
    where: {
      ...agentFilter,
      followUpDate: { gte: todayStart, lte: todayEnd },
      status: { notIn: ['CLOSED', 'LOST'] },
    },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
    orderBy: { followUpDate: 'asc' },
    take: 50,
  })

  return leads as LeadWithAgent[]
}
