/**
 * src/components/crm/leads/LeadFilters.tsx
 *
 * Filter Bar — Client Component
 *
 * Provides debounced search, status/source/priority dropdowns,
 * date range inputs, and a "Clear Filters" button. All filters update
 * URL search params using useRouter + useSearchParams without full page reload.
 */

'use client'

import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, SlidersHorizontal, CalendarDays } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Agent {
  id: string
  name: string
  email: string
}

interface LeadFiltersProps {
  agents: Agent[]
  isAdmin: boolean
  currentFilters: {
    status?: string
    source?: string
    priority?: string
    assignedToId?: string
    search?: string
    dateFrom?: string
    dateTo?: string
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'FOLLOW_UP', label: 'Follow-Up' },
  { value: 'MEETING_SCHEDULED', label: 'Meeting Scheduled' },
  { value: 'SITE_VISIT_SCHEDULED', label: 'Site Visit Scheduled' },
  { value: 'SITE_VISIT', label: 'Site Visit' },
  { value: 'NEGOTIATION', label: 'Negotiation' },
  { value: 'BOOKING', label: 'Booking' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'LOST', label: 'Lost' },
]

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'GOOGLE', label: 'Google' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'OTHER', label: 'Other' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shared style for filter select dropdowns */
const selectClass = [
  'h-11 w-full rounded-xl bg-slate-800 text-white text-sm md:h-9 md:rounded-lg',
  'border border-slate-700',
  'pl-3 pr-8 appearance-none cursor-pointer',
  'focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/40',
  'transition-colors duration-150',
].join(' ')

/** Chevron SVG for selects */
function Chevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 text-slate-400"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LeadFilters Component
// ---------------------------------------------------------------------------

export default function LeadFilters({
  currentFilters,
}: LeadFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // Local state mirrors URL params so inputs are controlled
  const [search, setSearch] = useState(currentFilters.search ?? '')
  const [status, setStatus] = useState(currentFilters.status ?? '')
  const [source, setSource] = useState(currentFilters.source ?? '')
  const [priority, setPriority] = useState(currentFilters.priority ?? '')
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom ?? '')
  const [dateTo, setDateTo] = useState(currentFilters.dateTo ?? '')

  // Debounce timer ref
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ---- Build updated URL params ----
  const buildParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Preserve view param
      const view = params.get('view')

      // Reset to page 1 on filter change
      params.delete('page')

      const merged = {
        search,
        status,
        source,
        priority,
        dateFrom,
        dateTo,
        ...overrides,
      }

      // Apply each param — remove if empty
      Object.entries(merged).forEach(([key, val]) => {
        if (val) {
          params.set(key, val)
        } else {
          params.delete(key)
        }
      })

      if (view) params.set('view', view)

      return params.toString()
    },
    [search, status, source, priority, dateFrom, dateTo, searchParams],
  )

  // ---- Push updated params to router ----
  const navigate = useCallback(
    (overrides: Record<string, string>) => {
      startTransition(() => {
        router.push(`?${buildParams(overrides)}`)
      })
    },
    [router, buildParams],
  )

  // ---- Search — debounced ----
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)

    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      navigate({ search: val })
    }, 400)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
    }
  }, [])

  // ---- Dropdown change handlers ----
  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value)
    navigate({ status: e.target.value })
  }

  const handleSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value)
    navigate({ source: e.target.value })
  }

  const handlePriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value)
    navigate({ priority: e.target.value })
  }

  const handleDateFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value)
    navigate({ dateFrom: e.target.value })
  }

  const handleDateTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value)
    navigate({ dateTo: e.target.value })
  }

  // ---- Clear all filters ----
  const hasFilters = Boolean(
    search || status || source || priority || dateFrom || dateTo,
  )

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setSource('')
    setPriority('')
    setDateFrom('')
    setDateTo('')

    const params = new URLSearchParams()
    const view = searchParams.get('view')
    if (view) params.set('view', view)

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="rounded-[22px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="flex flex-col gap-3">
        {/* ── Row 1: Search + Status + Source + Priority ── */}
        <div className="grid grid-cols-1 gap-3 md:flex md:flex-wrap md:items-center">
          {/* Search */}
          <div className="relative min-w-0 md:min-w-[240px] md:flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, phone, email…"
              className={[
                'h-11 w-full rounded-xl bg-slate-800 pl-9 pr-4 text-sm text-white md:h-9 md:rounded-lg',
                'border border-slate-700 placeholder:text-slate-500',
                'focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/40',
                'transition-colors duration-150',
              ].join(' ')}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  navigate({ search: '' })
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status */}
          <div className="relative md:w-auto">
            <select
              value={status}
              onChange={handleStatus}
              className={selectClass}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-800">
                  {opt.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          {/* Source */}
          <div className="relative md:w-auto">
            <select
              value={source}
              onChange={handleSource}
              className={selectClass}
              aria-label="Filter by source"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-800">
                  {opt.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          {/* Priority */}
          <div className="relative md:w-auto">
            <select
              value={priority}
              onChange={handlePriority}
              className={selectClass}
              aria-label="Filter by priority"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-800">
                  {opt.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

        </div>

        {/* ── Row 2: Date range + clear ── */}
        <div className="grid grid-cols-1 gap-3 md:flex md:flex-wrap md:items-center">
          {/* Date From */}
          <div className="relative grid grid-cols-[auto_1fr] items-center gap-2 md:flex">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <label className="text-xs text-slate-400 whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={handleDateFrom}
              className={[
                'h-11 w-full rounded-xl bg-slate-800 px-3 text-sm text-white md:h-9 md:w-auto md:rounded-lg',
                'border border-slate-700',
                'focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/40',
                'transition-colors duration-150',
                '[color-scheme:dark]',
              ].join(' ')}
              aria-label="Filter from date"
            />
          </div>

          {/* Date To */}
          <div className="relative grid grid-cols-[auto_1fr] items-center gap-2 md:flex">
            <label className="text-xs text-slate-400 whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={handleDateTo}
              className={[
                'h-11 w-full rounded-xl bg-slate-800 px-3 text-sm text-white md:h-9 md:w-auto md:rounded-lg',
                'border border-slate-700',
                'focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/40',
                'transition-colors duration-150',
                '[color-scheme:dark]',
              ].join(' ')}
              aria-label="Filter to date"
            />
          </div>

          {/* Filter indicator */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>
              {hasFilters ? 'Filters active' : 'No filters applied'}
            </span>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={[
                'flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-700 md:min-h-0 md:rounded-lg',
                'bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 md:py-1.5',
                'hover:border-slate-600 hover:text-white',
                'transition-colors duration-150',
              ].join(' ')}
            >
              <X className="h-3 w-3" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
