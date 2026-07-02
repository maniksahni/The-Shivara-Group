/**
 * src/components/crm/dashboard/StatsCard.tsx
 *
 * Reusable statistics card for the CRM dashboard.
 *
 * Props:
 *  - title    : string        — Card heading (e.g. "Total Leads")
 *  - value    : number|string — The primary metric to display prominently
 *  - subtitle : string?       — Optional supporting text below the value
 *  - icon     : ElementType   — Any Lucide icon component
 *  - color    : ColorVariant  — Controls the icon circle background tint
 *  - trend?   : TrendData     — Optional { value: number, isUp: boolean }
 *
 * Design:
 *  - Dark bg-slate-800, border-slate-700
 *  - Icon sits in a small circle whose bg is 10 % opacity of the accent colour
 *  - Large numeric value
 *  - Trend indicator with an up/down arrow and a percentage delta
 */

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ColorVariant =
  | 'gold'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'purple'

export interface TrendData {
  /** Percentage change value (absolute, e.g. 12.5 for 12.5 %). */
  value: number
  /** true = upward trend (positive), false = downward trend (negative). */
  isUp: boolean
}

export interface StatsCardProps {
  /** Card heading label. */
  title: string
  /** Primary displayed metric. Accepts a pre-formatted string or a number. */
  value: number | string
  /** Optional descriptive subtitle rendered below the value. */
  subtitle?: string
  /** Lucide icon component to render inside the coloured circle. */
  icon: React.ElementType
  /** Controls the tint colour of the icon background circle. */
  color: ColorVariant
  /** Optional trend delta shown with an up/down arrow. */
  trend?: TrendData
  /** Additional className forwarded to the card root element. */
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Colour maps
// ─────────────────────────────────────────────────────────────────────────────

/** Maps each ColorVariant to its full-opacity hex and 10 % opacity Tailwind bg. */
const COLOR_CONFIG: Record<
  ColorVariant,
  { hex: string; bgClass: string; textClass: string }
> = {
  gold:    { hex: '#C9A84C', bgClass: 'bg-yellow-500/10',  textClass: 'text-yellow-400' },
  blue:    { hex: '#3B82F6', bgClass: 'bg-blue-500/10',    textClass: 'text-blue-400'   },
  emerald: { hex: '#10B981', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400'},
  amber:   { hex: '#F59E0B', bgClass: 'bg-amber-500/10',   textClass: 'text-amber-400'  },
  rose:    { hex: '#F43F5E', bgClass: 'bg-rose-500/10',    textClass: 'text-rose-400'   },
  purple:  { hex: '#A855F7', bgClass: 'bg-purple-500/10',  textClass: 'text-purple-400' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  className,
}: StatsCardProps) {
  const { hex, bgClass, textClass } = COLOR_CONFIG[color]

  return (
    <article
      className={cn(
        // Shape & spacing
        'relative flex flex-col gap-4 overflow-hidden rounded-xl p-5',
        // Background & border
        'bg-slate-800 border border-slate-700',
        // Subtle lift on hover
        'transition-shadow duration-200 hover:shadow-lg hover:shadow-black/20',
        className
      )}
      aria-label={`${title}: ${value}`}
    >
      {/* ── Decorative background glow ─────────────────────────────────── */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-5"
        style={{ backgroundColor: hex, filter: 'blur(20px)' }}
        aria-hidden="true"
      />

      {/* ── Top row: label + icon ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-400 leading-tight">
          {title}
        </p>

        {/* Icon circle */}
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
            bgClass
          )}
          aria-hidden="true"
        >
          <Icon
            className={cn('h-5 w-5', textClass)}
            style={{ color: hex }}
          />
        </div>
      </div>

      {/* ── Middle: value ─────────────────────────────────────────────── */}
      <div>
        <p className="text-3xl font-black text-white tabular-nums leading-none">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </p>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Bottom: trend indicator ────────────────────────────────────── */}
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {trend.isUp ? (
            <TrendingUp
              className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <TrendingDown
              className="h-3.5 w-3.5 flex-shrink-0 text-rose-400"
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              'text-xs font-semibold',
              trend.isUp ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {trend.isUp ? '+' : '-'}
            {Math.abs(trend.value).toFixed(1)}%
          </span>
          <span className="text-xs text-slate-500">vs last week</span>
        </div>
      )}
    </article>
  )
}
