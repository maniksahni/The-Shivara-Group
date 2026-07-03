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
import { Plus, LayoutList, Kanban, AlertTriangle } from 'lucide-react'

import { getServerSession } from '@/lib/auth'
import { getLeads } from '@/features/leads/actions'
import prisma, { isDatabaseConfigured } from '@/lib/prisma'

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
  const agents = isAdmin && isDatabaseConfigured
    ? await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      }).catch(() => [])
    : []

  return (
    <div className="min-h-screen">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="rounded-[28px] border border-white/10 bg-[#162032]/80 px-5 py-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-7">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title + count */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F4B400]">Pipeline command center</p>
              <h1 className="mt-1 text-3xl font-black text-white">Leads</h1>
              <p className="mt-1 text-sm text-gray-400">
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
            <div className="flex flex-wrap items-center gap-2">
              {/* Export button */}
              <ExportButton filters={filters} />

              {/* View toggle */}
              <ViewToggle currentView={view} />

              {/* Add lead — rendered as a client modal trigger */}
              <AddLeadModal
                agents={agents}
                trigger={
                  <button
                    className="hidden items-center gap-2 rounded-2xl bg-[#F4B400] px-4 py-3 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] md:inline-flex"
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
      <div className="mx-auto max-w-screen-2xl py-6">
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
              agents={agents}
              isAdmin={isAdmin}
              currentUserId={session.user.id}
            />
          )
        ) : (
          /* Error state */
          <div className="relative overflow-hidden rounded-[28px] border border-red-500/20 bg-[#162032]/80 px-6 py-20 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.16),transparent_38%)]" />
            <div className="relative mx-auto max-w-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-300">
                <AlertTriangle className="h-8 w-8" />
              </div>
            <p className="text-xl font-black text-white">
              Failed to load leads
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {(leadsResult as { success: false; error: string }).error}
            </p>
            <Link
              href="/crm/leads"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white transition hover:bg-white/10"
            >
              Retry lead pipeline
            </Link>
            </div>
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
