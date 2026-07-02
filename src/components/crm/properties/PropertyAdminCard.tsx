/**
 * src/components/crm/properties/PropertyAdminCard.tsx
 *
 * Admin card for a single property listing.
 *
 * Features:
 *  - Property image area (first image URL or gold-gradient placeholder)
 *  - Title, type badge, price (gold, large), and location
 *  - Beds / baths / area row when applicable
 *  - Active toggle switch (calls togglePropertyActive server action)
 *  - Featured star toggle (calls togglePropertyFeatured server action)
 *  - Edit button (opens AddPropertyModal pre-filled)
 *  - Delete button with confirmation dialog
 *
 * This is a Client Component because it manages toggle / modal / confirm state.
 */

'use client'

import { useState, useTransition } from 'react'
import {
  Star,
  StarOff,
  Pencil,
  Trash2,
  MapPin,
  Bed,
  Bath,
  SquareCode,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  togglePropertyActive,
  togglePropertyFeatured,
  deleteProperty,
} from '@/features/properties/actions'
import AddPropertyModal from './AddPropertyModal'
import type { PropertyRecord } from '@/app/(crm)/crm/properties/page'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Human-friendly labels and colours for the PropertyType enum */
const TYPE_CONFIG: Record<
  string,
  { label: string; bgClass: string; textClass: string }
> = {
  APARTMENT:  { label: 'Apartment',  bgClass: 'bg-blue-900/40',   textClass: 'text-blue-300'   },
  VILLA:      { label: 'Villa',      bgClass: 'bg-purple-900/40', textClass: 'text-purple-300' },
  PLOT:       { label: 'Plot',       bgClass: 'bg-green-900/40',  textClass: 'text-green-300'  },
  COMMERCIAL: { label: 'Commercial', bgClass: 'bg-orange-900/40', textClass: 'text-orange-300' },
  FARMHOUSE:  { label: 'Farmhouse',  bgClass: 'bg-teal-900/40',   textClass: 'text-teal-300'   },
}

/** Format a price value (number or string) for display. */
function displayPrice(raw: string | number): string {
  const value =
    typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/[^0-9.]/g, ''))

  if (isNaN(value)) return String(raw) // return the original string if not parseable

  const CRORE = 10_000_000
  const LAKH  = 100_000

  if (value >= CRORE) {
    const crores = (value / CRORE).toFixed(2).replace(/\.?0+$/, '')
    return `₹${crores} Cr`
  }

  if (value >= LAKH) {
    const lakhs = (value / LAKH).toFixed(2).replace(/\.?0+$/, '')
    return `₹${lakhs} Lakh`
  }

  return `₹${value.toLocaleString('en-IN')}`
}

// ---------------------------------------------------------------------------
// Toggle Switch sub-component
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  label: string
}

function ToggleSwitch({ checked, onChange, disabled, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={[
        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50',
        checked ? 'bg-[#C9A84C]' : 'bg-slate-700',
        disabled ? 'cursor-not-allowed opacity-50' : '',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Delete Confirm Dialog
// ---------------------------------------------------------------------------

interface DeleteConfirmProps {
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

function DeleteConfirmDialog({ onConfirm, onCancel, isPending }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-white">Delete Property</h3>
        <p className="mt-2 text-sm text-slate-400">
          Are you sure you want to permanently delete this property? This action
          cannot be undone.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PropertyAdminCard — main export
// ---------------------------------------------------------------------------

interface PropertyAdminCardProps {
  property: PropertyRecord
}

export default function PropertyAdminCard({ property }: PropertyAdminCardProps) {
  // ── State ─────────────────────────────────────────────────────────────────
  const [isActive,    setIsActive]    = useState(property.isActive)
  const [isFeatured,  setIsFeatured]  = useState(property.isFeatured)
  const [showDelete,  setShowDelete]  = useState(false)

  const [isPendingActive,   startActive]   = useTransition()
  const [isPendingFeatured, startFeatured] = useTransition()
  const [isPendingDelete,   startDelete]   = useTransition()

  // ── Derived display values ────────────────────────────────────────────────
  const typeConf = TYPE_CONFIG[property.type] ?? {
    label:     property.type,
    bgClass:   'bg-slate-800',
    textClass: 'text-slate-300',
  }

  const primaryImage =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : null

  const formattedPrice = displayPrice(property.price)

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleToggleActive() {
    startActive(async () => {
      const result = await togglePropertyActive(property.id)
      if (result.success) {
        setIsActive(result.data.isActive)
        toast.success(
          result.data.isActive ? 'Property activated' : 'Property deactivated',
        )
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleToggleFeatured() {
    startFeatured(async () => {
      const result = await togglePropertyFeatured(property.id)
      if (result.success) {
        setIsFeatured(result.data.isFeatured)
        toast.success(
          result.data.isFeatured
            ? 'Property marked as featured'
            : 'Property removed from featured',
        )
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteProperty(property.id)
      if (result.success) {
        toast.success('Property deleted successfully')
        setShowDelete(false)
      } else {
        toast.error(result.error)
        setShowDelete(false)
      }
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Delete confirmation overlay ──────────────────────────────────── */}
      {showDelete && (
        <DeleteConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isPending={isPendingDelete}
        />
      )}

      <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-md transition-shadow hover:shadow-lg hover:shadow-[#C9A84C]/5">
        {/* ── Image / Placeholder area ─────────────────────────────────── */}
        <div className="relative h-44 flex-shrink-0 overflow-hidden bg-slate-800">
          {primaryImage ? (
            /* Real image */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fall back to gradient if URL fails to load
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            /* Gold-gradient placeholder */
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, #1e293b 0%, #C9A84C22 50%, #0f172a 100%)',
              }}
            >
              <span className="text-4xl font-bold text-[#C9A84C]/30 select-none">
                {property.type.charAt(0)}
              </span>
            </div>
          )}

          {/* ── Featured star badge ──────────────────────────────────── */}
          {isFeatured && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#C9A84C] px-2 py-0.5 text-xs font-bold text-slate-950">
              <Star className="h-3 w-3 fill-slate-950" />
              Featured
            </div>
          )}

          {/* ── Active / Inactive badge ──────────────────────────────── */}
          <div
            className={[
              'absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              isActive
                ? 'bg-green-900/80 text-green-300'
                : 'bg-red-900/80 text-red-300',
            ].join(' ')}
          >
            {isActive ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* ── Card body ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* Type badge + Title */}
          <div className="space-y-1.5">
            <span
              className={[
                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                typeConf.bgClass,
                typeConf.textClass,
              ].join(' ')}
            >
              {typeConf.label}
            </span>

            <h2
              className="line-clamp-1 text-base font-semibold text-white"
              title={property.title}
            >
              {property.title}
            </h2>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-[#C9A84C]">{formattedPrice}</p>

          {/* Location */}
          <div className="flex items-start gap-1.5 text-sm text-slate-400">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C9A84C]/60" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Beds / Baths / Area */}
          {(property.bedrooms != null ||
            property.bathrooms != null ||
            property.area != null) && (
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5 text-slate-500" />
                  {property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5 text-slate-500" />
                  {property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}
                </span>
              )}
              {property.area != null && (
                <span className="flex items-center gap-1">
                  <SquareCode className="h-3.5 w-3.5 text-slate-500" />
                  {property.area}
                </span>
              )}
            </div>
          )}

          {/* ── Toggles ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2.5">
            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <ToggleSwitch
                checked={isActive}
                onChange={handleToggleActive}
                disabled={isPendingActive}
                label="Toggle active"
              />
              <span className="text-xs text-slate-400">Active</span>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFeatured}
                disabled={isPendingFeatured}
                aria-label={isFeatured ? 'Remove from featured' : 'Mark as featured'}
                className={[
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  isFeatured
                    ? 'bg-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600',
                  isPendingFeatured ? 'opacity-50' : '',
                ].join(' ')}
              >
                {isFeatured ? (
                  <Star className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <StarOff className="h-3.5 w-3.5" />
                )}
                {isFeatured ? 'Featured' : 'Feature'}
              </button>
            </div>
          </div>

          {/* ── Action buttons ───────────────────────────────────────────── */}
          <div className="flex gap-2 pt-1">
            {/* Edit */}
            <AddPropertyModal
              property={property}
              trigger={
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              }
            />

            {/* Delete */}
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-900/50 bg-red-900/20 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-700 hover:bg-red-900/40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </article>
    </>
  )
}
