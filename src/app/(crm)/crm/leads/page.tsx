/**
 * src/app/(crm)/crm/leads/page.tsx
 *
 * Lead List Page — Server Component
 *
 * Reads URL search params for filters and view mode, fetches leads and
 * agents server-side, then renders the filter bar, view-toggle, and either
 * the table or kanban view depending on the `view` param.
 */

import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, LayoutList, Kanban } from 'lucide-react'

import { getServerSession } from '@/lib/auth'
import { getLeads } from '@/features/leads/actions'
import prisma from '@/lib/prisma'

import LeadFilters from '@/components/crm/leads/LeadFilters'
import LeadTable from '@/components/crm/leads/LeadTable'
import LeadKanban from '@/components/crm/leads/LeadKanban'
import AddLeadModal from '@/components/crm/leads/AddLeadModal'
import ExportButton from '@/components/crm/leads/ExportButton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    status?: string
    source?: string
    priority?: string
    assignedToId?: string
    search?: string
    view?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }>
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function LeadsPage({ searchParams }: PageProps) {
  // Await searchParams (Next.js 15+ dynamic API)
  const params = await searchParams

  // ---- Auth check ----
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/crm/login')
  }

  const isAdmin = session.user.role === 'ADMIN'

  // ---- Parse filter params ----
  const filters = {
    status: params.status || undefined,
    source: params.source || undefined,
    priority: params.priority || undefined,
    assignedToId: params.assignedToId || undefined,
    search: params.search || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
  }

  // ---- View mode ----
  const view = params.view === 'kanban' ? 'kanban' : 'table'

  // ---- Fetch leads ----
  const leadsResult = await getLeads(filters)
  const leads = leadsResult.success ? (leadsResult.data ?? []) : []

  // ---- Fetch agents (for filter dropdown, admin only) ----
  const agents = isAdmin
    ? await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      })
    : []

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-5">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title + count */}
            <div>
              <h1 className="text-2xl font-bold text-white">Leads</h1>
              <p className="mt-0.5 text-sm text-slate-400">
                {leads.length}{' '}
                {leads.length === 1 ? 'lead' : 'leads'} found
                {Object.values(filters).some(Boolean) && (
                  <span className="ml-1 text-[#C9A84C]">
                    (filtered)
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Export button */}
              <ExportButton filters={filters} />

              {/* View toggle */}
              <ViewToggle currentView={view} />

              {/* Add lead — rendered as a client modal trigger */}
              <AddLeadModal
                agents={agents}
                trigger={
                  <button
                    className={[
                      'inline-flex items-center gap-2 rounded-lg px-4 py-2',
                      'bg-[#C9A84C] text-slate-900 font-semibold text-sm',
                      'hover:bg-[#b8963e] transition-colors duration-150',
                    ].join(' ')}
                  >
                    <Plus className="h-4 w-4" />
                    Add Lead
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-2xl px-6 py-6">
        {/* Filters */}
        <div className="mb-6">
          <LeadFilters
            agents={agents}
            isAdmin={isAdmin}
            currentFilters={filters}
          />
        </div>

        {/* Lead list */}
        {leadsResult.success ? (
          view === 'kanban' ? (
            <LeadKanban
              leads={leads}
              agents={agents}
              currentUserId={session.user.id}
            />
          ) : (
            <LeadTable
              leads={leads}
              isAdmin={isAdmin}
              currentUserId={session.user.id}
            />
          )
        ) : (
          /* Error state */
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 py-24 text-center">
            <p className="text-lg font-semibold text-red-400">
              Failed to load leads
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {(leadsResult as { success: false; error: string }).error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ViewToggle — small server-rendered toggle (navigates via Link)
// ---------------------------------------------------------------------------

function ViewToggle({ currentView }: { currentView: 'table' | 'kanban' }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 p-1">
      <Link
        href="?view=table"
        aria-label="Table view"
        className={[
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
          'transition-colors duration-150',
          currentView === 'table'
            ? 'bg-slate-700 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200',
        ].join(' ')}
      >
        <LayoutList className="h-3.5 w-3.5" />
        Table
      </Link>
      <Link
        href="?view=kanban"
        aria-label="Kanban view"
        className={[
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
          'transition-colors duration-150',
          currentView === 'kanban'
            ? 'bg-slate-700 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200',
        ].join(' ')}
      >
        <Kanban className="h-3.5 w-3.5" />
        Kanban
      </Link>
    </div>
  )
}
