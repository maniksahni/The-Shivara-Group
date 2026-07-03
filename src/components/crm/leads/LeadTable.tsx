/**
 * src/components/crm/leads/LeadTable.tsx
 *
 * Lead Table View — Client Component
 *
 * Renders leads in a sortable, paginated table with:
 *  - Column: Checkbox | Name+Phone | Source | Status | Priority | Agent | Budget | Follow-up | Created | Actions
 *  - Clickable rows that navigate to the lead detail page
 *  - Hover highlight
 *  - Per-row action dropdown (View, Edit, Change Status, Delete)
 *  - Bulk selection with checkboxes + Export Selected
 *  - Status badge color-coded
 *  - Follow-up date highlighted red if overdue, amber if today
 *  - Pagination at the bottom
 *  - Empty state with Add Lead prompt
 */

'use client'

import React, { Fragment, useCallback, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Phone,
  Mail,
  MessageCircle,
  UserCircle,
  Plus,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'

import { StatusBadge, SourceBadge, PriorityBadge } from '@/components/ui/badge'
import { bulkAssignLeads, deleteLead, updateLeadStatus } from '@/features/leads/actions'
import { formatDate, getInitials } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Agent {
  id: string
  name: string
  email: string
}

interface Lead {
  id: string
  name: string
  phone: string
  whatsappNumber?: string | null
  email: string | null
  budget: string | null
  source: string
  status: string
  priority: string | null
  followUpDate: Date | null
  createdAt: Date
  assignedTo: Agent | null
}

interface LeadTableProps {
  leads: Lead[]
  agents: Agent[]
  isAdmin: boolean
  currentUserId: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20

const ALL_STATUSES = [
  'NEW',
  'ASSIGNED',
  'CONTACTED',
  'FOLLOW_UP',
  'MEETING_SCHEDULED',
  'SITE_VISIT_SCHEDULED',
  'SITE_VISIT',
  'NEGOTIATION',
  'BOOKING',
  'CLOSED',
  'LOST',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Determine follow-up date cell colour class */
function followUpClass(date: Date | null | string | undefined): string {
  if (!date) return 'text-slate-400'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'text-slate-400'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateOnly = new Date(d)
  dateOnly.setHours(0, 0, 0, 0)

  if (dateOnly < today) return 'text-red-400 font-medium'
  if (dateOnly.getTime() === today.getTime()) return 'text-amber-400 font-medium'
  return 'text-slate-300'
}

// ---------------------------------------------------------------------------
// ActionMenu — per-row dropdown
// ---------------------------------------------------------------------------

interface ActionMenuProps {
  lead: Lead
  onEdit: () => void
  onStatusChange: (status: string) => void
  onDelete: () => void
}

function ActionMenu({ lead, onEdit, onStatusChange, onDelete }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const router = useRouter()

  const close = () => {
    setOpen(false)
    setStatusMenuOpen(false)
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={[
          'flex h-7 w-7 items-center justify-center rounded-md',
          'text-slate-400 hover:bg-slate-700 hover:text-white',
          'transition-colors duration-150',
        ].join(' ')}
        aria-label="Actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <>
          {/* Click-outside overlay */}
          <div className="fixed inset-0 z-10" onClick={close} />

          <div
            className={[
              'absolute right-0 top-8 z-20 min-w-[160px] rounded-lg',
              'border border-slate-700 bg-slate-800 shadow-xl',
              'overflow-hidden',
            ].join(' ')}
          >
            {/* View */}
            <button
              type="button"
              onClick={() => {
                close()
                router.push(`/crm/leads/${lead.id}`)
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700"
            >
              <Eye className="h-4 w-4 text-slate-400" />
              View Detail
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => {
                close()
                onEdit()
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4 text-slate-400" />
              Edit Lead
            </button>

            {/* Change Status */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusMenuOpen((p) => !p)}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 text-slate-400" />
                Change Status
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-500" />
              </button>

              {statusMenuOpen && (
                <div
                  className={[
                    'absolute left-full top-0 z-30 min-w-[180px] rounded-lg',
                    'border border-slate-700 bg-slate-800 shadow-xl',
                    'overflow-hidden',
                  ].join(' ')}
                >
                  {ALL_STATUSES.filter((s) => s !== lead.status).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        close()
                        onStatusChange(s)
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                    >
                      <StatusBadge
                        status={s as Parameters<typeof StatusBadge>[0]['status']}
                        size="sm"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="my-1 border-t border-slate-700" />

            {/* Delete */}
            <button
              type="button"
              onClick={() => {
                close()
                onDelete()
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete Lead
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DeleteConfirmModal
// ---------------------------------------------------------------------------

function DeleteConfirmModal({
  lead,
  onConfirm,
  onCancel,
  loading,
}: {
  lead: Lead
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Delete Lead?</h2>
        <p className="mt-2 text-sm text-slate-400">
          Are you sure you want to permanently delete{' '}
          <span className="font-medium text-white">{lead.name}</span>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={[
              'flex-1 rounded-lg border border-slate-600 px-4 py-2 text-sm',
              'text-slate-300 hover:bg-slate-800 transition-colors duration-150',
            ].join(' ')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              'flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold',
              'text-white hover:bg-red-500 transition-colors duration-150',
              'disabled:opacity-60',
            ].join(' ')}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LeadTable Component
// ---------------------------------------------------------------------------

export default function LeadTable({ leads, agents, isAdmin, currentUserId }: LeadTableProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  // ── Pagination ──
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE))
  const paginated = useMemo(
    () => leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [leads, page],
  )

  // ── Bulk selection ──
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkAgentId, setBulkAgentId] = useState('')
  const [bulkAssigning, setBulkAssigning] = useState(false)
  const allSelected = paginated.length > 0 && paginated.every((l) => selected.has(l.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        paginated.forEach((l) => next.delete(l.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        paginated.forEach((l) => next.add(l.id))
        return next
      })
    }
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Delete ──
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await deleteLead(deleteTarget.id)
    setDeleteLoading(false)
    if (result.success) {
      toast.success(`${deleteTarget.name} deleted.`)
      setDeleteTarget(null)
      startTransition(() => router.refresh())
    } else {
      toast.error(result.error)
    }
  }

  // ── Status change ──
  const handleStatusChange = useCallback(
    async (leadId: string, status: string) => {
      const result = await updateLeadStatus(leadId, status, currentUserId)
      if (result.success) {
        toast.success('Status updated.')
        startTransition(() => router.refresh())
      } else {
        toast.error(result.error)
      }
    },
    [router, currentUserId],
  )

  // ── Edit (open modal) ──
  // We dynamically import AddLeadModal to avoid circular issues; for
  // simplicity we navigate to the detail page for editing from here.
  const handleEdit = (lead: Lead) => {
    router.push(`/crm/leads/${lead.id}?edit=1`)
  }

  // ── Export selected ──
  const handleExportSelected = () => {
    toast.info('Export is handled from the ExportButton in the page header.')
  }

  const handleBulkAssign = async () => {
    if (!bulkAgentId) {
      toast.error('Select an agent first.')
      return
    }

    setBulkAssigning(true)
    const result = await bulkAssignLeads(Array.from(selected), bulkAgentId, currentUserId)
    setBulkAssigning(false)

    if (result.success) {
      const agentName = agents.find((agent) => agent.id === bulkAgentId)?.name ?? 'selected agent'
      toast.success(`${result.data.count} lead${result.data.count === 1 ? '' : 's'} assigned to ${agentName}.`)
      setSelected(new Set())
      setBulkAgentId('')
      startTransition(() => router.refresh())
    } else {
      toast.error(result.error)
    }
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 py-24 text-center">
        <UserCircle className="mb-4 h-16 w-16 text-slate-700" />
        <h3 className="text-lg font-semibold text-white">No leads found</h3>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your filters or add a new lead.
        </p>
        <button
          type="button"
          onClick={() => router.push('/crm/leads?addLead=1')}
          className={[
            'mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2',
            'bg-[#C9A84C] text-slate-900 font-semibold text-sm',
            'hover:bg-[#b8963e] transition-colors duration-150',
          ].join(' ')}
        >
          <Plus className="h-4 w-4" />
          Add First Lead
        </button>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Table
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div
          className={[
            'mb-3 flex items-center justify-between rounded-lg',
            'border border-[#F4B400]/30 bg-[#F4B400]/10 px-4 py-3 backdrop-blur-xl',
          ].join(' ')}
        >
          <span className="text-sm font-bold text-[#F4B400]">
            {selected.size} lead{selected.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isAdmin && (
              <>
                <select
                  value={bulkAgentId}
                  onChange={(event) => setBulkAgentId(event.target.value)}
                  className="min-w-[180px] rounded-lg border border-[#C9A84C]/40 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-[#C9A84C]"
                  aria-label="Assign selected leads to agent"
                >
                  <option value="">Assign/Reassign to...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleBulkAssign}
                  disabled={bulkAssigning || !bulkAgentId}
                  className={[
                    'flex items-center gap-2 rounded-lg border border-[#C9A84C]/50',
                    'bg-[#F4B400] px-3 py-1.5 text-xs font-bold text-slate-950',
                    'hover:bg-[#b8963e] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150',
                  ].join(' ')}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {bulkAssigning ? 'Assigning…' : 'Assign Leads'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleExportSelected}
              className={[
                'flex items-center gap-2 rounded-lg border border-[#C9A84C]/50',
                'bg-[#C9A84C]/20 px-3 py-1.5 text-xs font-medium text-[#C9A84C]',
                'hover:bg-[#C9A84C]/30 transition-colors duration-150',
              ].join(' ')}
            >
              <Download className="h-3.5 w-3.5" />
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* ── Table wrapper ── */}
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#162032]/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            {/* ── Head ── */}
            <thead>
              <tr className="bg-white/[0.03]">
                {/* Checkbox */}
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all leads on this page"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 accent-[#C9A84C] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Lead
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Follow-up
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Contact
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody className="divide-y divide-slate-800/60">
              {paginated.map((lead) => {
                const isChecked = selected.has(lead.id)
                const fupClass = followUpClass(lead.followUpDate)

                return (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/crm/leads/${lead.id}`)}
                    className={[
                      'group cursor-pointer transition-colors duration-100',
                      isChecked
                        ? 'bg-[#F4B400]/5'
                        : 'hover:bg-white/[0.04]',
                    ].join(' ')}
                  >
                    {/* Checkbox */}
                    <td
                      className="w-10 px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOne(lead.id)}
                        aria-label={`Select ${lead.name}`}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 accent-[#C9A84C] cursor-pointer"
                      />
                    </td>

                    {/* Name + Phone */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-white group-hover:text-[#C9A84C] transition-colors duration-150">
                        {lead.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <Phone className="h-3 w-3 text-[#F4B400]" />
                        {lead.phone}
                        {lead.email && (
                          <>
                            <span className="mx-1 text-slate-600">·</span>
                            <Mail className="h-3 w-3" />
                            <span className="max-w-[140px] truncate">{lead.email}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-3">
                      <SourceBadge
                        source={lead.source as Parameters<typeof SourceBadge>[0]['source']}
                      />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={lead.status as Parameters<typeof StatusBadge>[0]['status']}
                      />
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      {lead.priority ? (
                        <PriorityBadge
                          priority={lead.priority as Parameters<typeof PriorityBadge>[0]['priority']}
                        />
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>

                    {/* Assigned To */}
                    <td className="px-4 py-3">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={[
                              'flex h-7 w-7 shrink-0 items-center justify-center',
                              'rounded-full bg-[#C9A84C]/20 text-[10px] font-bold text-[#C9A84C]',
                            ].join(' ')}
                            title={lead.assignedTo.name}
                          >
                            {getInitials(lead.assignedTo.name)}
                          </div>
                          <span className="text-sm text-slate-300 max-w-[100px] truncate">
                            {lead.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">Unassigned</span>
                      )}
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {lead.budget ?? <span className="text-slate-600">—</span>}
                    </td>

                    {/* Follow-up */}
                    <td className={`px-4 py-3 text-xs ${fupClass}`}>
                      {lead.followUpDate ? formatDate(lead.followUpDate) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {formatDate(lead.createdAt)}
                    </td>

                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 transition hover:bg-blue-500/10"
                          aria-label={`Call ${lead.name}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.whatsappNumber || lead.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-emerald-300 transition hover:bg-emerald-500/10"
                          aria-label={`WhatsApp ${lead.name}`}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionMenu
                        lead={lead}
                        onEdit={() => handleEdit(lead)}
                        onStatusChange={(status) =>
                          handleStatusChange(lead.id, status)
                        }
                        onDelete={() => setDeleteTarget(lead)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] px-6 py-3">
            <p className="text-xs text-slate-400">
              Showing{' '}
              <span className="font-medium text-white">
                {(page - 1) * PAGE_SIZE + 1}
              </span>
              {' – '}
              <span className="font-medium text-white">
                {Math.min(page * PAGE_SIZE, leads.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-white">{leads.length}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  'border border-slate-700 text-slate-400',
                  'hover:border-slate-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed',
                  'transition-colors duration-150',
                ].join(' ')}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={[
                      'flex h-8 w-8 items-center justify-center rounded-lg text-sm',
                      'transition-colors duration-150',
                      p === page
                        ? 'bg-[#C9A84C] font-semibold text-slate-900'
                        : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white',
                    ].join(' ')}
                  >
                    {p}
                  </button>
                ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  'border border-slate-700 text-slate-400',
                  'hover:border-slate-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed',
                  'transition-colors duration-150',
                ].join(' ')}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <DeleteConfirmModal
          lead={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  )
}
