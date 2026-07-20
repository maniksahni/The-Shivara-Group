/**
 * src/features/agents/actions.ts
 *
 * Next.js Server Actions for Shivara CRM agent (user) management.
 *
 * All actions follow the pattern:
 *   { success: true,  data: <T> }       — on success
 *   { success: false, error: string }   — on failure
 *
 * Passwords are hashed with bcryptjs before storage.
 * No plaintext passwords are ever returned in query results.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import type { Prisma } from '@prisma/client'
import {
  getPrimarySalesAgentWhere,
  isPrimarySalesAgent,
  PRIMARY_SALES_AGENT_DISPLAY_NAME,
} from '@/lib/crm-agent-policy'

// ---------------------------------------------------------------------------
// Zod validation schemas
// ---------------------------------------------------------------------------

const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'AGENT']).optional().default('AGENT'),
  isActive: z.boolean().optional().default(true),
})

const updateAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'AGENT']).optional(),
  // Password update is optional; if provided it will be re-hashed
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
})

// ---------------------------------------------------------------------------
// TypeScript types
// ---------------------------------------------------------------------------

export type CreateAgentInput = z.infer<typeof createAgentSchema>
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>

/** Safe user shape — never includes password hash */
export interface SafeAgent {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AgentWithStats extends SafeAgent {
  totalLeads: number
  openLeads: number
  closedLeads: number
  siteVisitsScheduled: number
}

export interface AgentPerformanceStat {
  id: string
  name: string | null
  email: string
  phone: string | null
  totalLeads: number
  closedLeads: number
  pendingFollowUps: number
  siteVisitsScheduled: number
  conversionRate: number // percentage string for display
}

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }

async function requireAdmin() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return { success: false as const, error: 'Unauthorized. Please sign in again.' }
  }

  if (session.user.role !== 'ADMIN') {
    return { success: false as const, error: 'Only admins can manage agents.' }
  }

  return { success: true as const, user: session.user }
}

// ---------------------------------------------------------------------------
// getAgents
// ---------------------------------------------------------------------------

/**
 * Returns all users (agents) in the system, sorted by name.
 * Password hashes are excluded.
 */
export async function getAgents(): Promise<ActionResult<SafeAgent[]>> {
  try {
    const agents = await prisma.user.findMany({
      where: {
        isActive: true,
        ...getPrimarySalesAgentWhere(),
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: agents }
  } catch (error) {
    console.error('[getAgents]', error)
    return { success: false, error: 'Failed to fetch agents.' }
  }
}

// ---------------------------------------------------------------------------
// getAgent
// ---------------------------------------------------------------------------

/**
 * Fetches a single agent by ID, including their lead statistics.
 */
export async function getAgent(id: string): Promise<ActionResult<AgentWithStats>> {
  try {
    const agent = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { leads: true },
        },
      },
    })

    if (!agent) {
      return { success: false, error: 'Agent not found.' }
    }

    // Fetch status-specific counts for this agent
    const [closedLeads, openLeads, siteVisits] = await Promise.all([
      prisma.lead.count({ where: { assignedToId: id, status: 'CLOSED' } }),
      prisma.lead.count({
        where: {
          assignedToId: id,
          status: { notIn: ['CLOSED', 'LOST'] },
        },
      }),
      prisma.lead.count({ where: { assignedToId: id, status: 'SITE_VISIT_SCHEDULED' } }),
    ])

    const result: AgentWithStats = {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      isActive: agent.isActive,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      totalLeads: agent._count.leads,
      openLeads,
      closedLeads,
      siteVisitsScheduled: siteVisits,
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('[getAgent]', error)
    return { success: false, error: 'Failed to fetch agent.' }
  }
}

// ---------------------------------------------------------------------------
// createAgent
// ---------------------------------------------------------------------------

/**
 * Creates a new user (agent).  The plaintext password is hashed with
 * bcryptjs before being stored.
 */
export async function createAgent(
  data: CreateAgentInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    if (!session.success) return session

    const validated = createAgentSchema.parse(data)
    if (validated.role === 'AGENT' && !isPrimarySalesAgent(validated)) {
      return {
        success: false,
        error: `Only ${PRIMARY_SALES_AGENT_DISPLAY_NAME} can be created as a sales agent.`,
      }
    }

    // Check for email uniqueness before attempting to insert
    const existing = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
      select: { id: true },
    })
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' }
    }

    // Hash the password
    const SALT_ROUNDS = 12
    const hashedPassword = await bcrypt.hash(validated.password, SALT_ROUNDS)

    const agent = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        phone: validated.phone ?? null,
        role: validated.role ?? 'AGENT',
        isActive: validated.isActive ?? true,
      },
      select: { id: true },
    })

    revalidatePath('/crm/agents')

    return { success: true, data: { id: agent.id } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Validation failed.' }
    }
    console.error('[createAgent]', error)
    return { success: false, error: 'Failed to create agent.' }
  }
}

// ---------------------------------------------------------------------------
// updateAgent
// ---------------------------------------------------------------------------

/**
 * Updates an agent's profile fields.  If a new password is provided it is
 * re-hashed before being stored.  Email changes are checked for uniqueness.
 */
export async function updateAgent(
  id: string,
  data: UpdateAgentInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    if (!session.success) return session

    const validated = updateAgentSchema.parse(data)

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    })
    if (!existing) {
      return { success: false, error: 'Agent not found.' }
    }

    if ((validated.role ?? existing.role) === 'AGENT') {
      const proposedAgent = {
        name: validated.name ?? existing.name,
        email: validated.email ?? existing.email,
      }

      if (!isPrimarySalesAgent(proposedAgent)) {
        return {
          success: false,
          error: `Only ${PRIMARY_SALES_AGENT_DISPLAY_NAME} can remain active as a sales agent.`,
        }
      }
    }

    // Email uniqueness check only when email is being changed
    if (validated.email && validated.email.toLowerCase().trim() !== existing.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: validated.email.toLowerCase().trim() },
        select: { id: true },
      })
      if (emailTaken) {
        return { success: false, error: 'This email address is already in use.' }
      }
    }

    // Build the update payload
    const updateData: Prisma.UserUpdateInput = {}

    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.email !== undefined) updateData.email = validated.email.toLowerCase().trim()
    if (validated.phone !== undefined) updateData.phone = validated.phone ?? null
    if (validated.role !== undefined) updateData.role = validated.role

    if (validated.password) {
      const SALT_ROUNDS = 12
      updateData.passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS)
    }

    const agent = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true },
    })

    revalidatePath('/crm/agents')
    revalidatePath(`/crm/agents/${id}`)

    return { success: true, data: { id: agent.id } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Validation failed.' }
    }
    console.error('[updateAgent]', error)
    return { success: false, error: 'Failed to update agent.' }
  }
}

// ---------------------------------------------------------------------------
// toggleAgentActive
// ---------------------------------------------------------------------------

/**
 * Flips the `isActive` flag on a user account — used to suspend / reinstate
 * an agent without deleting their history.
 */
export async function toggleAgentActive(
  id: string,
): Promise<ActionResult<{ id: string; isActive: boolean }>> {
  try {
    const session = await requireAdmin()
    if (!session.success) return session

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    })
    if (!existing) {
      return { success: false, error: 'Agent not found.' }
    }

    const agent = await prisma.user.update({
      where: { id },
      data: { isActive: !existing.isActive, updatedAt: new Date() },
      select: { id: true, isActive: true },
    })

    revalidatePath('/crm/agents')
    revalidatePath(`/crm/agents/${id}`)

    return { success: true, data: { id: agent.id, isActive: agent.isActive } }
  } catch (error) {
    console.error('[toggleAgentActive]', error)
    return { success: false, error: 'Failed to toggle agent active state.' }
  }
}

// ---------------------------------------------------------------------------
// getAgentStats
// ---------------------------------------------------------------------------

/**
 * Returns a performance summary for every agent:
 *  - Total leads assigned
 *  - Closed-Won leads
 *  - Pending follow-up leads (status = FOLLOW_UP)
 *  - Site visits scheduled
 *  - Conversion rate  (closed / total × 100, to 1 decimal place)
 *
 * Results are sorted by total leads descending.
 */
export async function getAgentStats(): Promise<ActionResult<AgentPerformanceStat[]>> {
  try {
    // Fetch all agents (active only for stats — adjust if needed)
    const agents = await prisma.user.findMany({
      where: {
        isActive: true,
        ...getPrimarySalesAgentWhere(),
      },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true, phone: true },
    })

    // Fetch all aggregated lead counts per agent in a single query each
    // to avoid N+1 issues.  For large datasets consider raw SQL instead.
    const stats = await Promise.all(
      agents.map(async (agent) => {
        const [totalLeads, closedLeads, pendingFollowUps, siteVisitsScheduled] =
          await Promise.all([
            prisma.lead.count({ where: { assignedToId: agent.id } }),
            prisma.lead.count({ where: { assignedToId: agent.id, status: 'CLOSED' } }),
            prisma.lead.count({ where: { assignedToId: agent.id, status: 'FOLLOW_UP' } }),
            prisma.lead.count({
              where: { assignedToId: agent.id, status: 'SITE_VISIT_SCHEDULED' },
            }),
          ])

        const conversionRate =
          totalLeads > 0 ? parseFloat(((closedLeads / totalLeads) * 100).toFixed(1)) : 0

        return {
          id: agent.id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          totalLeads,
          closedLeads,
          pendingFollowUps,
          siteVisitsScheduled,
          conversionRate,
        }
      }),
    )

    // Sort by totalLeads descending for a default leaderboard view
    stats.sort((a, b) => b.totalLeads - a.totalLeads)

    return { success: true, data: stats }
  } catch (error) {
    console.error('[getAgentStats]', error)
    return { success: false, error: 'Failed to fetch agent statistics.' }
  }
}
