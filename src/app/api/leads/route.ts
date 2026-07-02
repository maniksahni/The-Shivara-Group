/**
 * src/app/api/leads/route.ts
 *
 * Public + authenticated REST API routes for leads.
 *
 * POST /api/leads  — Public endpoint consumed by website enquiry forms.
 *                    Creates a Lead + an initial LeadActivity entry.
 *
 * GET  /api/leads  — Authenticated endpoint (session required).
 *                    Returns a paginated, filterable list of leads.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { LeadSource, LeadStatus, Prisma, Priority } from '@prisma/client'

import prisma, { isDatabaseConfigured } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { enquirySchema } from '@/lib/validations'

// ---------------------------------------------------------------------------
// POST — public enquiry form submission
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // ── Parse request body ─────────────────────────────────────────────────
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload.' },
        { status: 400 },
      )
    }

    // ── Validate with Zod schema ───────────────────────────────────────────
    const validatedData = enquirySchema.parse(body)

    if (!isDatabaseConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: 'Enquiries are temporarily unavailable. Please contact us by phone.',
        },
        { status: 503 },
      )
    }

    // ── Persist lead + activity inside a transaction ───────────────────────
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          name: validatedData.name,
          phone: validatedData.phone,
          whatsappNumber: validatedData.whatsappNumber ?? null,
          email: validatedData.email ?? null,
          budget: validatedData.budget ?? null,
          preferredLocation: validatedData.preferredLocation ?? null,
          propertyType: validatedData.propertyType ?? null,
          source: validatedData.source,
          status: validatedData.status,
        },
        select: { id: true },
      })

      await tx.leadActivity.create({
        data: {
          leadId: newLead.id,
          action: 'Lead created from website',
          newValue: validatedData.message
            ? `Source: ${validatedData.source}. Message: ${validatedData.message}`
            : `Source: ${validatedData.source}`,
        },
      })

      if (
        validatedData.status === 'SITE_VISIT_SCHEDULED' &&
        validatedData.followUpDate
      ) {
        await tx.siteVisit.create({
          data: {
            leadId: newLead.id,
            scheduledAt: new Date(validatedData.followUpDate),
            location: validatedData.preferredLocation || 'To be confirmed',
            notes: validatedData.message ?? null,
          },
        })
      }

      return newLead
    })

    return NextResponse.json(
      { success: true, data: { id: lead.id } },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed.',
          details: error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    console.error('[POST /api/leads] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Prisma.PrismaClientInitializationError
            ? 'Enquiries are temporarily unavailable. Please contact us by phone.'
            : 'Internal server error.',
      },
      { status: error instanceof Prisma.PrismaClientInitializationError ? 503 : 500 },
    )
  }
}

// ---------------------------------------------------------------------------
// GET — authenticated, paginated, filterable lead listing
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    // ── Authentication check ───────────────────────────────────────────────
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorised. Please sign in.' },
        { status: 401 },
      )
    }

    // ── Parse query parameters ─────────────────────────────────────────────
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')))
    const skip = (page - 1) * limit

    const status = searchParams.get('status') ?? undefined
    const source = searchParams.get('source') ?? undefined
    const priority = searchParams.get('priority') ?? undefined
    const assignedToId = searchParams.get('assignedToId') ?? undefined
    const search = searchParams.get('search') ?? undefined
    const dateFrom = searchParams.get('dateFrom') ?? undefined
    const dateTo = searchParams.get('dateTo') ?? undefined

    // ── Build Prisma `where` clause ────────────────────────────────────────
    const where: Prisma.LeadWhereInput = {}

    if (status) where.status = status as LeadStatus
    if (source) where.source = source as LeadSource
    if (priority) where.priority = priority as Priority
    if (assignedToId) where.assignedToId = assignedToId

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ]
    }

    if (dateFrom || dateTo) {
      where.createdAt = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      }
    }

    // Non-admin users can only see leads assigned to themselves
    if (session.user.role !== 'ADMIN') {
      where.assignedToId = session.user.id
    }

    // ── Execute parallel count + data queries ──────────────────────────────
    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          _count: { select: { notes: true, activities: true } },
        },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json(
      {
        success: true,
        data: {
          leads,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[GET /api/leads] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
