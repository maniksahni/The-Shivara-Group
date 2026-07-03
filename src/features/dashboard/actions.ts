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

function dayRange(offsetDays = 0) {
  const start = new Date()
  start.setDate(start.getDate() + offsetDays)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export interface DailyLeadItem {
  id: string
  name: string
  phone: string
  status: string
  priority: string
  source: string
  followUpDate: Date | null
  createdAt: Date
  assignedTo: { id: string; name: string; email: string } | null
}

export interface DailyVisitItem {
  id: string
  scheduledAt: Date
  location: string
  status: string
  notes: string | null
  customerFeedback: string | null
  completedAt: Date | null
  lead: {
    id: string
    name: string
    phone: string
    priority: string
    assignedTo: { id: string; name: string; email: string } | null
  }
}

export interface AgentWorkloadItem {
  id: string
  name: string
  email: string
  phone: string | null
  totalLeads: number
  newAssignedLeads: number
  pendingFollowUps: number
  todayVisits: number
  completedVisits: number
  closedDeals: number
  lostLeads: number
  conversionRate: number
}

export interface DailyOperationsData {
  todayLeads: DailyLeadItem[]
  newAssignedLeads: DailyLeadItem[]
  pendingFollowUps: DailyLeadItem[]
  missedFollowUps: DailyLeadItem[]
  overdueLeads: DailyLeadItem[]
  todaySiteVisits: DailyVisitItem[]
  tomorrowMeetings: DailyVisitItem[]
  upcomingSiteVisits: DailyVisitItem[]
  completedVisits: DailyVisitItem[]
  agentWorkload: AgentWorkloadItem[]
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

// ─────────────────────────────────────────────────────────────────────────────
// getDailyOperations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the lead-assignment, daily visit, calendar, reminder, and workload
 * data used by the CRM daily command center.
 *
 * Agents only see their assigned leads. Admins see all leads plus workload for
 * every active agent.
 */
export async function getDailyOperations(): Promise<DailyOperationsData> {
  const session = await getServerSession()

  const isAdmin = session?.user?.role === 'ADMIN'
  const agentFilter = isAdmin ? {} : { assignedToId: session?.user?.id }
  const visitFilter = isAdmin ? {} : { lead: { assignedToId: session?.user?.id } }

  const today = dayRange(0)
  const tomorrow = dayRange(1)
  const now = new Date()
  const nextThirtyDays = new Date()
  nextThirtyDays.setDate(nextThirtyDays.getDate() + 30)

  const leadSelect = {
    id: true,
    name: true,
    phone: true,
    status: true,
    priority: true,
    source: true,
    followUpDate: true,
    createdAt: true,
    assignedTo: { select: { id: true, name: true, email: true } },
  }

  const visitInclude = {
    lead: {
      select: {
        id: true,
        name: true,
        phone: true,
        priority: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    },
  }

  const [
    todayLeads,
    newAssignedLeads,
    pendingFollowUps,
    missedFollowUps,
    overdueLeads,
    todaySiteVisits,
    tomorrowMeetings,
    upcomingSiteVisits,
    completedVisits,
    agents,
  ] = await Promise.all([
    prisma.lead.findMany({
      where: {
        ...agentFilter,
        createdAt: { gte: today.start, lte: today.end },
      },
      select: leadSelect,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    }),
    prisma.lead.findMany({
      where: {
        ...agentFilter,
        assignedToId: { not: null },
        status: { in: ['ASSIGNED', 'NEW'] },
      },
      select: leadSelect,
      orderBy: { updatedAt: 'desc' },
      take: 12,
    }),
    prisma.lead.findMany({
      where: {
        ...agentFilter,
        followUpDate: { gte: today.start, lte: today.end },
        status: { notIn: ['CLOSED', 'LOST'] },
      },
      select: leadSelect,
      orderBy: [{ priority: 'desc' }, { followUpDate: 'asc' }],
      take: 20,
    }),
    prisma.lead.findMany({
      where: {
        ...agentFilter,
        followUpDate: { lt: today.start },
        status: { notIn: ['CLOSED', 'LOST'] },
      },
      select: leadSelect,
      orderBy: [{ priority: 'desc' }, { followUpDate: 'asc' }],
      take: 20,
    }),
    prisma.lead.findMany({
      where: {
        ...agentFilter,
        OR: [
          { followUpDate: { lt: now } },
          {
            siteVisit: {
              scheduledAt: { lt: now },
              status: 'SCHEDULED',
            },
          },
        ],
        status: { notIn: ['CLOSED', 'LOST'] },
      },
      select: leadSelect,
      orderBy: [{ priority: 'desc' }, { updatedAt: 'asc' }],
      take: 20,
    }),
    prisma.siteVisit.findMany({
      where: {
        ...visitFilter,
        scheduledAt: { gte: today.start, lte: today.end },
      },
      include: visitInclude,
      orderBy: { scheduledAt: 'asc' },
      take: 20,
    }),
    prisma.siteVisit.findMany({
      where: {
        ...visitFilter,
        scheduledAt: { gte: tomorrow.start, lte: tomorrow.end },
        status: 'SCHEDULED',
      },
      include: visitInclude,
      orderBy: { scheduledAt: 'asc' },
      take: 20,
    }),
    prisma.siteVisit.findMany({
      where: {
        ...visitFilter,
        scheduledAt: { gt: today.end, lte: nextThirtyDays },
        status: 'SCHEDULED',
      },
      include: visitInclude,
      orderBy: { scheduledAt: 'asc' },
      take: 30,
    }),
    prisma.siteVisit.findMany({
      where: {
        ...visitFilter,
        status: 'COMPLETED',
      },
      include: visitInclude,
      orderBy: { completedAt: 'desc' },
      take: 20,
    }),
    isAdmin
      ? prisma.user.findMany({
          where: { isActive: true },
          select: { id: true, name: true, email: true, phone: true },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
  ])

  const agentWorkload = await Promise.all(
    agents.map(async (agent) => {
      const [
        totalLeads,
        newAssignedLeadsCount,
        pendingFollowUpsCount,
        todayVisits,
        completedVisitsCount,
        closedDeals,
        lostLeads,
      ] = await Promise.all([
        prisma.lead.count({ where: { assignedToId: agent.id } }),
        prisma.lead.count({
          where: { assignedToId: agent.id, status: { in: ['ASSIGNED', 'NEW'] } },
        }),
        prisma.lead.count({
          where: {
            assignedToId: agent.id,
            followUpDate: { lte: today.end },
            status: { notIn: ['CLOSED', 'LOST'] },
          },
        }),
        prisma.siteVisit.count({
          where: {
            lead: { assignedToId: agent.id },
            scheduledAt: { gte: today.start, lte: today.end },
          },
        }),
        prisma.siteVisit.count({
          where: { lead: { assignedToId: agent.id }, status: 'COMPLETED' },
        }),
        prisma.lead.count({ where: { assignedToId: agent.id, status: 'CLOSED' } }),
        prisma.lead.count({ where: { assignedToId: agent.id, status: 'LOST' } }),
      ])

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        totalLeads,
        newAssignedLeads: newAssignedLeadsCount,
        pendingFollowUps: pendingFollowUpsCount,
        todayVisits,
        completedVisits: completedVisitsCount,
        closedDeals,
        lostLeads,
        conversionRate: totalLeads > 0 ? Number(((closedDeals / totalLeads) * 100).toFixed(1)) : 0,
      }
    }),
  )

  return {
    todayLeads,
    newAssignedLeads,
    pendingFollowUps,
    missedFollowUps,
    overdueLeads,
    todaySiteVisits,
    tomorrowMeetings,
    upcomingSiteVisits,
    completedVisits,
    agentWorkload,
  }
}
