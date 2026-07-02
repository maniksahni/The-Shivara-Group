/**
 * src/types/index.ts
 *
 * Central TypeScript type definitions for the Shivara CRM.
 *
 * This file:
 *  1. Re-exports all Prisma-generated types so that consumers only need
 *     to import from "@/types" rather than "@prisma/client".
 *  2. Defines rich composite types (with relations) for query results.
 *  3. Defines view-model / DTO interfaces for dashboard, reports, and exports.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Re-export Prisma-generated types
// ─────────────────────────────────────────────────────────────────────────────

export type {
  User,
  Lead,
  LeadNote,
  LeadActivity,
  Property,
  SiteVisit,
} from '@prisma/client'

export {
  Role,
  LeadStatus,
  LeadSource,
  Priority,
  PropertyType,
  SiteVisitStatus,
} from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// 2. Composite / relational types (Prisma query results with includes)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Lead,
  User,
  LeadNote,
  LeadActivity,
  SiteVisit,
} from '@prisma/client'

/**
 * A Lead record with all its common relations pre-loaded.
 * Matches the result of a Prisma query with:
 * ```
 * include: {
 *   assignedTo: true,
 *   notes: { include: { author: true } },
 *   activities: { include: { user: true } },
 *   siteVisit: true,
 * }
 * ```
 */
export type LeadWithDetails = Lead & {
  /** The agent this lead is currently assigned to, or null if unassigned. */
  assignedTo: User | null

  /** All notes attached to this lead, each including their author. */
  notes: (LeadNote & {
    author: User
  })[]

  /** Full audit-trail of activity events for this lead. */
  activities: (LeadActivity & {
    /** The user who triggered the activity event, or null for system events. */
    user: User | null
  })[]

  /** The site visit booked for this lead, or null if none has been created. */
  siteVisit: SiteVisit | null
}

/**
 * A minimal lead card used in list / table views where we only need the
 * assigned agent's name — avoids over-fetching the full User object.
 */
export type LeadWithAgent = Lead & {
  assignedTo: Pick<User, 'id' | 'name' | 'email'> | null
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dashboard view-model
// ─────────────────────────────────────────────────────────────────────────────

/** A { source, count } pair returned by the leads-by-source aggregation. */
export interface LeadsBySourceItem {
  source: string
  count: number
}

/** A { status, count } pair returned by the leads-by-status aggregation. */
export interface LeadsByStatusItem {
  status: string
  count: number
}

/** A recent activity entry shown in the dashboard activity feed. */
export interface RecentActivityItem {
  id: string
  action: string
  oldValue: string | null
  newValue: string | null
  createdAt: Date

  /** Minimal lead info — enough to render a link. */
  lead: {
    id: string
    name: string
  }

  /** The user who performed the action, or null for system-generated events. */
  user: Pick<User, 'id' | 'name'> | null
}

/**
 * Aggregated statistics returned by the `/api/dashboard` endpoint and
 * consumed by the admin / agent dashboard page.
 */
export interface DashboardStats {
  /** Total number of leads in the system (all statuses). */
  totalLeads: number

  /** Leads created today (midnight → now). */
  todayLeads: number

  /**
   * Leads that have a followUpDate in the past or today that are not yet
   * CLOSED or LOST.
   */
  pendingFollowUps: number

  /** Site visits with status = SCHEDULED. */
  siteVisitsScheduled: number

  /** Leads with status = CLOSED. */
  closedDeals: number

  /** Per-source breakdown for the pie / donut chart. */
  leadsBySource: LeadsBySourceItem[]

  /** Per-status breakdown for the bar chart. */
  leadsByStatus: LeadsByStatusItem[]

  /** Latest N activity entries for the activity feed widget. */
  recentActivities: RecentActivityItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Agent performance report
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Performance summary for a single agent, used on the admin reports page.
 */
export interface AgentPerformance {
  /** The agent's unique identifier. */
  agentId: string

  /** Display name of the agent. */
  agentName: string

  /** Agent's email address. */
  agentEmail: string

  /** Total leads currently assigned to this agent. */
  totalAssigned: number

  /** Number of assigned leads that are in NEW status. */
  newLeads: number

  /** Number of assigned leads that are in CONTACTED status. */
  contactedLeads: number

  /** Number of assigned leads that are in FOLLOW_UP status. */
  followUpLeads: number

  /** Number of assigned leads that are in SITE_VISIT_SCHEDULED status. */
  siteVisitLeads: number

  /** Number of assigned leads that are in NEGOTIATION status. */
  negotiationLeads: number

  /** Number of assigned leads that reached CLOSED status. */
  closedLeads: number

  /** Number of assigned leads that reached LOST status. */
  lostLeads: number

  /**
   * Conversion rate as a percentage:
   *   (closedLeads / totalAssigned) * 100
   * Rounded to two decimal places.
   */
  conversionRate: number
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Excel / CSV export row
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Flat row structure used when exporting leads to Excel (xlsx) or CSV.
 * All date/time values are pre-formatted as locale strings.
 */
export interface ExportLeadRow {
  /** Serial number (1-based) for easier reference in the spreadsheet. */
  sNo: number

  /** Full name of the lead. */
  name: string

  /** Primary phone number. */
  phone: string

  /** WhatsApp number, or empty string if not provided. */
  whatsappNumber: string

  /** Email address, or empty string if not provided. */
  email: string

  /** Budget string, or empty string if not provided. */
  budget: string

  /** Preferred location / area, or empty string if not provided. */
  preferredLocation: string

  /** Property type label (APARTMENT, VILLA, …), or empty string. */
  propertyType: string

  /** Human-readable lead source label (e.g. "Instagram", "WhatsApp"). */
  source: string

  /** Human-readable pipeline status (e.g. "New", "Contacted"). */
  status: string

  /** Priority label (High / Medium / Low). */
  priority: string

  /** Name of the assigned agent, or "Unassigned". */
  assignedTo: string

  /**
   * Formatted follow-up date/time string, or empty string if not scheduled.
   */
  followUpDate: string

  /** Formatted creation date/time string. */
  createdAt: string

  /** Formatted last-updated date/time string. */
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. API response wrappers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard JSON structure for successful API responses.
 */
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

/**
 * Standard JSON structure for failed API responses.
 */
export interface ApiError {
  success: false
  error: string
  /** Optional field-level validation errors (from Zod). */
  fieldErrors?: Record<string, string[]>
}

/** Union type for any API response. */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// ─────────────────────────────────────────────────────────────────────────────
// 7. Pagination helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generic paginated list wrapper returned by list endpoints.
 */
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Query parameters accepted by paginated list endpoints.
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * Common filter parameters for the leads list endpoint.
 */
export interface LeadFilterParams extends PaginationParams {
  status?: string
  source?: string
  priority?: string
  assignedToId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}
