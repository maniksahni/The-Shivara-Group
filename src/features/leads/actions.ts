/**
 * src/features/leads/actions.ts
 *
 * Next.js Server Actions for Shivara CRM lead management.
 *
 * All actions follow the pattern:
 *   { success: true,  data: <T> }       — on success
 *   { success: false, error: string }   — on failure
 *
 * Every mutating action also creates a LeadActivity entry to provide a
 * full audit trail of everything that happened to a lead.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { LeadSource, LeadStatus, Priority, PropertyType, Prisma } from '@prisma/client'

// ---------------------------------------------------------------------------
// Zod schemas for validation
// ---------------------------------------------------------------------------

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  budget: z.string().max(50).optional(),
  preferredLocation: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  source: z.nativeEnum(LeadSource),
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assignedToId: z.string().optional(),
  followUpDate: z.string().datetime().optional(),
})

const updateLeadSchema = createLeadSchema.partial()

// ---------------------------------------------------------------------------
// TypeScript types
// ---------------------------------------------------------------------------

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>

export interface LeadFilters {
  status?: string
  source?: string
  priority?: string
  assignedToId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  activeLeads: number
  closedLeads: number
  siteVisitsScheduled: number
  leadsByStatus: Record<string, number>
  leadsBySource: Record<string, number>
  leadsByPriority: Record<string, number>
  recentLeads: Array<{
    id: string
    name: string
    phone: string
    status: string
    source: string
    createdAt: Date
  }>
  upcomingSiteVisits: Array<{
    id: string
    scheduledAt: Date
    location: string | null
    lead: { id: string; name: string; phone: string }
    assignedTo: { id: string; name: string | null } | null
  }>
}

export interface ExportLeadRow {
  id: string
  name: string
  phone: string
  whatsappNumber: string | null
  email: string | null
  budget: string | null
  preferredLocation: string | null
  propertyType: string | null
  source: string
  status: string
  priority: string
  assignedTo: string | null
  createdAt: string
  lastActivityAt: string | null
}

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }

// ---------------------------------------------------------------------------
// Helper — log a lead activity
// ---------------------------------------------------------------------------

async function logActivity(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  opts: {
    leadId: string
    action: string
    description?: string
    performedById?: string
    oldValue?: string
    newValue?: string
  },
) {
  await tx.leadActivity.create({
    data: {
      leadId: opts.leadId,
      action: opts.description ? `${opts.action}: ${opts.description}` : opts.action,
      userId: opts.performedById ?? null,
      oldValue: opts.oldValue ?? null,
      newValue: opts.newValue ?? null,
    },
  })
}

// ---------------------------------------------------------------------------
// createLead
// ---------------------------------------------------------------------------

/**
 * Creates a new lead and logs a creation activity.
 */
export async function createLead(
  data: CreateLeadInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = createLeadSchema.parse(data)

    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          name: validated.name,
          phone: validated.phone,
          whatsappNumber: validated.whatsappNumber ?? null,
          email: validated.email || null,
          budget: validated.budget ?? null,
          preferredLocation: validated.preferredLocation ?? null,
          propertyType: validated.propertyType ?? null,
          source: validated.source,
          priority: validated.priority ?? 'MEDIUM',
          assignedToId: validated.assignedToId ?? null,
          status: validated.status ?? 'NEW',
          followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
        },
        select: { id: true },
      })

      await logActivity(tx, {
        leadId: newLead.id,
        action: 'Lead created',
        description: `Lead created via CRM. Source: ${validated.source}`,
        performedById: validated.assignedToId,
      })

      return newLead
    })

    revalidatePath('/crm/leads')
    revalidatePath('/crm/dashboard')

    return { success: true, data: { id: lead.id } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Validation failed.' }
    }
    console.error('[createLead]', error)
    return { success: false, error: 'Failed to create lead.' }
  }
}

// ---------------------------------------------------------------------------
// updateLead
// ---------------------------------------------------------------------------

/**
 * Updates a lead's fields and logs each changed field as a separate activity.
 */
export async function updateLead(
  id: string,
  data: UpdateLeadInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = updateLeadSchema.parse(data)

    const existing = await prisma.lead.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'Lead not found.' }
    }

    const lead = await prisma.$transaction(async (tx) => {
      const updated = await tx.lead.update({
        where: { id },
        data: {
          name: validated.name,
          phone: validated.phone,
          whatsappNumber: validated.whatsappNumber,
          email: validated.email || undefined,
          budget: validated.budget,
          preferredLocation: validated.preferredLocation,
          propertyType: validated.propertyType,
          source: validated.source,
          priority: validated.priority,
          assignedToId: validated.assignedToId,
          status: validated.status,
          followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : undefined,
          updatedAt: new Date(),
        },
        select: { id: true },
      })

      // Log a change summary activity
      const changedFields = (Object.keys(validated) as Array<keyof UpdateLeadInput>).filter(
        (key) => validated[key] !== undefined && (existing as Record<string, unknown>)[key] !== validated[key],
      )

      if (changedFields.length > 0) {
        await logActivity(tx, {
          leadId: id,
          action: 'Lead updated',
          description: `Updated fields: ${changedFields.join(', ')}`,
        })
      }

      return updated
    })

    revalidatePath('/crm/leads')
    revalidatePath(`/crm/leads/${id}`)

    return { success: true, data: { id: lead.id } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Validation failed.' }
    }
    console.error('[updateLead]', error)
    return { success: false, error: 'Failed to update lead.' }
  }
}

// ---------------------------------------------------------------------------
// updateLeadStatus
// ---------------------------------------------------------------------------

/**
 * Changes the status of a lead and creates an activity recording the
 * old and new status values.
 */
export async function updateLeadStatus(
  id: string,
  status: string,
  userId?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validStatus = z.nativeEnum(LeadStatus).parse(status)
    const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true, status: true } })
    if (!existing) {
      return { success: false, error: 'Lead not found.' }
    }

    const lead = await prisma.$transaction(async (tx) => {
      const updated = await tx.lead.update({
        where: { id },
        data: { status: validStatus },
        select: { id: true },
      })

      await logActivity(tx, {
        leadId: id,
        action: 'Status changed',
        description: `Status updated from ${existing.status} to ${validStatus}`,
        performedById: userId,
        oldValue: existing.status,
        newValue: validStatus,
      })

      return updated
    })

    revalidatePath('/crm/leads')
    revalidatePath(`/crm/leads/${id}`)
    revalidatePath('/crm/dashboard')

    return { success: true, data: { id: lead.id } }
  } catch (error) {
    console.error('[updateLeadStatus]', error)
    return { success: false, error: 'Failed to update lead status.' }
  }
}

// ---------------------------------------------------------------------------
// assignLead
// ---------------------------------------------------------------------------

/**
 * Assigns a lead to an agent and logs the reassignment activity.
 */
export async function assignLead(
  leadId: string,
  agentId: string,
  currentUserId?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    // Verify the target agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
      select: { id: true, name: true },
    })
    if (!agent) {
      return { success: false, error: 'Agent not found.' }
    }

    const existing = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { assignedTo: { select: { name: true } } },
    })
    if (!existing) {
      return { success: false, error: 'Lead not found.' }
    }

    const lead = await prisma.$transaction(async (tx) => {
      const updated = await tx.lead.update({
        where: { id: leadId },
        data: { assignedToId: agentId, updatedAt: new Date() },
        select: { id: true },
      })

      const previousAgent = existing.assignedTo?.name ?? 'Unassigned'

      await logActivity(tx, {
        leadId,
        action: 'Lead assigned',
        description: `Lead reassigned from ${previousAgent} to ${agent.name ?? agentId}`,
        performedById: currentUserId,
        oldValue: existing.assignedToId ?? undefined,
        newValue: agentId,
      })

      return updated
    })

    revalidatePath('/crm/leads')
    revalidatePath(`/crm/leads/${leadId}`)

    return { success: true, data: { id: lead.id } }
  } catch (error) {
    console.error('[assignLead]', error)
    return { success: false, error: 'Failed to assign lead.' }
  }
}

// ---------------------------------------------------------------------------
// deleteLead
// ---------------------------------------------------------------------------

/**
 * Permanently deletes a lead and all associated records.
 * For a soft-delete approach, add an `isDeleted` / `deletedAt` field to the
 * schema and update the `where` clauses in other queries accordingly.
 */
export async function deleteLead(id: string): Promise<ActionResult<undefined>> {
  try {
    const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return { success: false, error: 'Lead not found.' }
    }

    // Cascade deletion is handled at the DB level via Prisma schema relations.
    // If cascades are not configured, delete child records first.
    await prisma.lead.delete({ where: { id } })

    revalidatePath('/crm/leads')
    revalidatePath('/crm/dashboard')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('[deleteLead]', error)
    return { success: false, error: 'Failed to delete lead.' }
  }
}

// ---------------------------------------------------------------------------
// addNote
// ---------------------------------------------------------------------------

/**
 * Adds a free-text note to a lead and creates a corresponding activity entry.
 */
export async function addNote(
  leadId: string,
  content: string,
  userId: string,
) {
  try {
    if (!content.trim()) {
      return { success: false, error: 'Note content cannot be empty.' }
    }

    const existing = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true } })
    if (!existing) {
      return { success: false, error: 'Lead not found.' }
    }

    const note = await prisma.$transaction(async (tx) => {
      const newNote = await tx.leadNote.create({
        data: {
          leadId,
          content: content.trim(),
          authorId: userId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { id: true, name: true } },
        },
      })

      await logActivity(tx, {
        leadId,
        action: 'Note added',
        description: content.trim().substring(0, 200),
        performedById: userId,
      })

      return newNote
    })

    revalidatePath(`/crm/leads/${leadId}`)

    return { success: true as const, data: note }
  } catch (error) {
    console.error('[addNote]', error)
    return { success: false, error: 'Failed to add note.' }
  }
}

// ---------------------------------------------------------------------------
// scheduleSiteVisit
// ---------------------------------------------------------------------------

/**
 * Creates (or updates) a SiteVisit for a lead and advances the lead status
 * to SITE_VISIT_SCHEDULED.
 */
export async function scheduleSiteVisit(
  leadId: string,
  scheduledAt: Date | string,
  location: string,
  notes?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const visitDate = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt)
    if (isNaN(visitDate.getTime())) {
      return { success: false, error: 'A valid scheduled date is required.' }
    }
    if (!location.trim()) {
      return { success: false, error: 'Location is required for a site visit.' }
    }

    const existing = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true, status: true } })
    if (!existing) {
      return { success: false, error: 'Lead not found.' }
    }

    const siteVisit = await prisma.$transaction(async (tx) => {
      // Upsert: update the most recent pending visit, or create a new one
      const visit = await tx.siteVisit.upsert({
        where: { leadId },
        create: {
          leadId,
          scheduledAt: visitDate,
          location: location.trim(),
          notes: notes?.trim() ?? null,
          status: 'SCHEDULED',
        },
        update: {
          scheduledAt: visitDate,
          location: location.trim(),
          notes: notes?.trim() ?? null,
          status: 'SCHEDULED',
        },
        select: { id: true },
      })

      // Update lead status
      await tx.lead.update({
        where: { id: leadId },
        data: { status: 'SITE_VISIT_SCHEDULED' },
      })

      await logActivity(tx, {
        leadId,
        action: 'Site visit scheduled',
        description: `Site visit scheduled at ${location} on ${visitDate.toISOString()}`,
        oldValue: existing.status,
        newValue: 'SITE_VISIT_SCHEDULED',
      })

      return visit
    })

    revalidatePath(`/crm/leads/${leadId}`)
    revalidatePath('/crm/dashboard')

    return { success: true, data: { id: siteVisit.id } }
  } catch (error) {
    console.error('[scheduleSiteVisit]', error)
    return { success: false, error: 'Failed to schedule site visit.' }
  }
}

// ---------------------------------------------------------------------------
// getLeads
// ---------------------------------------------------------------------------

/**
 * Fetches leads with optional filtering. Returns leads with key relations
 * pre-loaded for list and kanban views.
 */
export async function getLeads(filters: LeadFilters = {}) {
  try {
    const where: Prisma.LeadWhereInput = {}

    if (filters.status) where.status = filters.status as LeadStatus
    if (filters.source) where.source = filters.source as LeadSource
    if (filters.priority) where.priority = filters.priority as Priority
    if (filters.assignedToId) where.assignedToId = filters.assignedToId

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
        ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { notes: true, activities: true } },
      },
    })

    return { success: true, data: leads }
  } catch (error) {
    console.error('[getLeads]', error)
    return { success: false, error: 'Failed to fetch leads.' }
  }
}

// ---------------------------------------------------------------------------
// getLeadById
// ---------------------------------------------------------------------------

/**
 * Fetches a single lead with all its related data: activities, notes,
 * site visits, and assigned agent.
 */
export async function getLeadById(id: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true } },
          },
        },
        siteVisit: true,
      },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found.' }
    }

    return { success: true as const, data: lead }
  } catch (error) {
    console.error('[getLeadById]', error)
    return { success: false, error: 'Failed to fetch lead.' }
  }
}

// ---------------------------------------------------------------------------
// getDashboardStats
// ---------------------------------------------------------------------------

/**
 * Returns aggregated statistics used on the CRM dashboard.
 */
export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  try {
    const [
      totalLeads,
      leadsByStatusRaw,
      leadsBySourceRaw,
      leadsByPriorityRaw,
      recentLeads,
      upcomingSiteVisits,
    ] = await Promise.all([
      // Total leads
      prisma.lead.count(),

      // Breakdown by status
      prisma.lead.groupBy({
        by: ['status'],
        _count: { status: true },
      }),

      // Breakdown by source
      prisma.lead.groupBy({
        by: ['source'],
        _count: { source: true },
      }),

      // Breakdown by priority
      prisma.lead.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),

      // 10 most recent leads
      prisma.lead.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          status: true,
          source: true,
          createdAt: true,
        },
      }),

      // Upcoming site visits (next 7 days)
      prisma.siteVisit.findMany({
        where: {
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED',
        },
        take: 10,
        orderBy: { scheduledAt: 'asc' },
        include: {
          lead: {
            select: { id: true, name: true, phone: true, assignedTo: { select: { id: true, name: true } } },
          },
        },
      }),
    ])

    // Reshape grouped results into plain objects
    const leadsByStatus = Object.fromEntries(
      leadsByStatusRaw.map((row) => [row.status, row._count.status]),
    )

    const leadsBySource = Object.fromEntries(
      leadsBySourceRaw.map((row) => [row.source, row._count.source]),
    )

    const leadsByPriority = Object.fromEntries(
      leadsByPriorityRaw.map((row) => [row.priority, row._count.priority]),
    )

    const stats: DashboardStats = {
      totalLeads,
      newLeads: leadsByStatus['NEW'] ?? 0,
      activeLeads:
        (leadsByStatus['CONTACTED'] ?? 0) +
        (leadsByStatus['SITE_VISIT_SCHEDULED'] ?? 0) +
        (leadsByStatus['NEGOTIATION'] ?? 0),
      closedLeads: leadsByStatus['CLOSED'] ?? 0,
      siteVisitsScheduled: leadsByStatus['SITE_VISIT_SCHEDULED'] ?? 0,
      leadsByStatus,
      leadsBySource,
      leadsByPriority,
      recentLeads,
      upcomingSiteVisits: upcomingSiteVisits.map((v) => ({
        id: v.id,
        scheduledAt: v.scheduledAt,
        location: v.location,
        lead: v.lead,
        assignedTo: v.lead.assignedTo,
      })),
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('[getDashboardStats]', error)
    return { success: false, error: 'Failed to fetch dashboard statistics.' }
  }
}

// ---------------------------------------------------------------------------
// exportLeads
// ---------------------------------------------------------------------------

/**
 * Returns a flat array of rows suitable for Excel / CSV export.
 * Accepts the same filter set as `getLeads`.
 */
export async function exportLeads(
  filters: LeadFilters = {},
): Promise<ActionResult<ExportLeadRow[]>> {
  try {
    const where: Prisma.LeadWhereInput = {}

    if (filters.status) where.status = filters.status as LeadStatus
    if (filters.source) where.source = filters.source as LeadSource
    if (filters.priority) where.priority = filters.priority as Priority
    if (filters.assignedToId) where.assignedToId = filters.assignedToId

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
        ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { name: true } },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    })

    const rows: ExportLeadRow[] = leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      whatsappNumber: lead.whatsappNumber,
      email: lead.email,
      budget: lead.budget,
      preferredLocation: lead.preferredLocation,
      propertyType: lead.propertyType,
      source: lead.source,
      status: lead.status,
      priority: lead.priority,
      assignedTo: lead.assignedTo?.name ?? null,
      createdAt: lead.createdAt.toISOString(),
      lastActivityAt: lead.activities[0]?.createdAt.toISOString() ?? null,
    }))

    return { success: true, data: rows }
  } catch (error) {
    console.error('[exportLeads]', error)
    return { success: false, error: 'Failed to export leads.' }
  }
}
