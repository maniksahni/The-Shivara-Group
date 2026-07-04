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

import { Plus, Building2 } from 'lucide-react'

import { getProperties } from '@/features/properties/actions'
import PropertyAdminCard from '@/components/crm/properties/PropertyAdminCard'
import AddPropertyModal from '@/components/crm/properties/AddPropertyModal'
import { CRMEmptyState, CRMHero, CRMMiniStat } from '@/components/crm/CRMPrimitives'

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

export const dynamic = 'force-dynamic' // always fetch fresh data

export default async function PropertiesPage() {
  // ── Data fetching ────────────────────────────────────────────────────────
  const result = await getProperties()

  // If the action returned an error, surface a friendly message
  if (!result.success) {
    return (
      <div className="space-y-5 md:space-y-8">
        <CRMHero
          eyebrow="Inventory studio"
          title="Properties"
          description="Manage luxury listings with fast controls, image-first cards, and premium visibility states."
        />
        <CRMEmptyState
          icon={<Building2 className="h-7 w-7 text-red-300" />}
          title="Properties could not load"
          description={result.error ?? 'Please refresh the page or try again after a moment.'}
        />
      </div>
    )
  }

  const properties: PropertyRecord[] = result.data ?? []

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
    <div className="space-y-5 md:space-y-8">
      <CRMHero
        eyebrow="Inventory studio"
        title="Properties"
        description="Manage luxury listings with fast controls, image-first cards, and premium visibility states."
        actions={
          <AddPropertyModal
            trigger={
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#F4B400] px-5 py-3 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition-all hover:-translate-y-0.5 hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#F4B400]/60 active:scale-[0.98]">
                <Plus className="h-4 w-4" />
                Add Property
              </button>
            }
          />
        }
      />

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <CRMMiniStat
          label="Total"
          value={totalCount}
          tone="blue"
        />
        <CRMMiniStat
          label="Active"
          value={activeCount}
          tone="green"
        />
        <CRMMiniStat
          label="Featured"
          value={featuredCount}
          tone="gold"
        />
        <CRMMiniStat
          label="Types"
          value={Object.keys(byType).length}
          tone="purple"
        />
      </div>

      {/* ── Type breakdown pills ──────────────────────────────────────────── */}
      {totalCount > 0 && (
        <div className="premium-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {Object.entries(byType).map(([type, count]) => (
            <span
              key={type}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-slate-300"
            >
              {typeLabelMap[type] ?? type}
              <span className="rounded-full bg-[#F4B400]/15 px-1.5 py-0.5 text-[10px] font-black text-[#F4B400]">
                {count}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* ── Properties grid / empty state ─────────────────────────────────── */}
      {totalCount === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="rounded-[28px] border border-white/10 bg-[#162032]/70 p-4 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-6">
          <CRMEmptyState
            icon={<Building2 className="h-7 w-7" />}
            title="No properties yet"
            description="Add your first verified property listing to start building the premium inventory experience."
          />
          <div className="mt-5 flex justify-center">
            <AddPropertyModal
              trigger={
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#F4B400] px-5 py-3 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition-all hover:-translate-y-0.5 hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#F4B400]/60 active:scale-[0.98]">
                  <Plus className="h-4 w-4" />
                  Add Your First Property
                </button>
              }
            />
          </div>
        </div>
      ) : (
        /* ── Properties grid ──────────────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyAdminCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
