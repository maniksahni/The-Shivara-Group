/**
 * src/app/(crm)/crm/properties/page.tsx
 *
 * Properties Management — CRM admin page.
 *
 * Responsibilities:
 *  1. Fetch all properties from Prisma via the properties server action.
 *  2. Compute stat counts: Total, Active, Featured, and per-type breakdown.
 *  3. Render a responsive grid of <PropertyAdminCard> components.
 *  4. Show an empty state with an add button when no properties exist.
 *
 * This is a React Server Component — no "use client" directive.
 */

import Link from 'next/link'
import { Plus, Building2, Star, CheckCircle2, LayoutGrid } from 'lucide-react'

import { getProperties } from '@/features/properties/actions'
import PropertyAdminCard from '@/components/crm/properties/PropertyAdminCard'
import AddPropertyModal from '@/components/crm/properties/AddPropertyModal'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The shape Prisma returns for a Property record. */
export interface PropertyRecord {
  id: string
  title: string
  description: string | null
  price: string | number
  location: string
  type: string
  bedrooms: number | null
  bathrooms: number | null
  area: string | null
  amenities: string[]
  images: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// Stat Card sub-component (server-rendered, no state)
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  accent?: boolean
}

function StatCard({ label, value, icon, accent = false }: StatCardProps) {
  return (
    <div
      className={[
        'flex items-center gap-4 rounded-xl border p-5 transition-shadow',
        accent
          ? 'border-[#C9A84C]/30 bg-[#C9A84C]/5'
          : 'border-slate-700 bg-slate-900',
      ].join(' ')}
    >
      {/* Icon */}
      <div
        className={[
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg',
          accent ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-slate-800 text-slate-400',
        ].join(' ')}
      >
        {icon}
      </div>

      {/* Label + Value */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p
          className={[
            'mt-0.5 text-2xl font-bold',
            accent ? 'text-[#C9A84C]' : 'text-white',
          ].join(' ')}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export const dynamic = 'force-dynamic' // always fetch fresh data

export default async function PropertiesPage() {
  // ── Data fetching ────────────────────────────────────────────────────────
  const result = await getProperties()

  // If the action returned an error, surface a friendly message
  if (!result.success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Building2 className="h-12 w-12 text-red-400" />
        <p className="text-lg font-semibold text-red-400">
          Failed to load properties
        </p>
        <p className="text-sm text-slate-500">{result.error}</p>
      </div>
    )
  }

  const properties = result.data as PropertyRecord[]

  // ── Compute stats ────────────────────────────────────────────────────────
  const totalCount     = properties.length
  const activeCount    = properties.filter((p) => p.isActive).length
  const featuredCount  = properties.filter((p) => p.isFeatured).length

  // Count by property type
  const byType = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1
    return acc
  }, {})

  // Friendly display labels for types
  const typeLabelMap: Record<string, string> = {
    APARTMENT:  'Apartments',
    VILLA:      'Villas',
    PLOT:       'Plots',
    COMMERCIAL: 'Commercial',
    FARMHOUSE:  'Farmhouses',
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Properties
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your real-estate inventory listings.
          </p>
        </div>

        {/* Add Property button — opens the modal (client component) */}
        <AddPropertyModal
          trigger={
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/60">
              <Plus className="h-4 w-4" />
              Add Property
            </button>
          }
        />
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Properties"
          value={totalCount}
          icon={<LayoutGrid className="h-5 w-5" />}
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent
        />
        <StatCard
          label="Featured"
          value={featuredCount}
          icon={<Star className="h-5 w-5" />}
          accent
        />
        <StatCard
          label="Types"
          value={Object.keys(byType).length}
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>

      {/* ── Type breakdown pills ──────────────────────────────────────────── */}
      {totalCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(byType).map(([type, count]) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
            >
              {typeLabelMap[type] ?? type}
              <span className="rounded-full bg-[#C9A84C]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#C9A84C]">
                {count}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* ── Properties grid / empty state ─────────────────────────────────── */}
      {totalCount === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <Building2 className="h-8 w-8 text-slate-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">
              No properties yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Get started by adding your first property listing.
            </p>
          </div>
          <AddPropertyModal
            trigger={
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/60">
                <Plus className="h-4 w-4" />
                Add Your First Property
              </button>
            }
          />
        </div>
      ) : (
        /* ── Properties grid ──────────────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyAdminCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
