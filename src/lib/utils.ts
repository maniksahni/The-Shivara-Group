/**
 * src/lib/utils.ts
 *
 * Shared utility functions used throughout the Shivara CRM application.
 *
 * Sections:
 *  1. Class name helper (cn)
 *  2. Currency & number formatting
 *  3. Date / time formatting
 *  4. Relative time (human-friendly "2 hours ago")
 *  5. Badge colour helpers (Tailwind class strings)
 *  6. String helpers
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Class name helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names intelligently.
 * Combines `clsx` (conditional class logic) with `tailwind-merge`
 * (deduplication / override resolution).
 *
 * @example
 *   cn('px-4 py-2', isActive && 'bg-blue-600', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Currency & number formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a numeric amount (in Indian Rupees) into a human-readable string.
 *
 * Rules:
 *   - ≥ 1 Crore  → "₹X.XX Cr"
 *   - ≥ 1 Lakh   → "₹X.XX Lakh"
 *   - Otherwise  → "₹X,XXX"
 *
 * Accepts both `number` and `string` inputs (strings are parsed as floats).
 *
 * @example
 *   formatCurrency(5000000)   // "₹50.00 Lakh"
 *   formatCurrency(10000000)  // "₹1.00 Cr"
 *   formatCurrency('750000')  // "₹7.50 Lakh"
 *   formatCurrency(45000)     // "₹45,000"
 */
export function formatCurrency(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount

  if (isNaN(value)) return '₹0'

  const CRORE = 10_000_000   // 1 Crore  = 10,000,000
  const LAKH  = 100_000      // 1 Lakh   =    100,000

  if (value >= CRORE) {
    const crores = value / CRORE
    // Show one decimal place if it's not a whole number, else show two
    const formatted = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2)
    return `₹${formatted} Cr`
  }

  if (value >= LAKH) {
    const lakhs = value / LAKH
    const formatted = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)
    return `₹${formatted} Lakh`
  }

  // For smaller amounts, use the Indian locale number format
  return `₹${value.toLocaleString('en-IN')}`
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Date / time formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a date into a readable string like "3 Jul 2026".
 *
 * @param date - A `Date` object or an ISO date string.
 * @returns Formatted date string, or "—" if the input is falsy.
 *
 * @example
 *   formatDate(new Date('2026-07-03'))  // "3 Jul 2026"
 *   formatDate('2026-12-25')            // "25 Dec 2026"
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  return d.toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

/**
 * Formats a date-time into a readable string like "3 Jul 2026, 2:30 PM".
 *
 * @param date - A `Date` object or an ISO date string.
 * @returns Formatted date+time string, or "—" if the input is falsy.
 *
 * @example
 *   formatDateTime(new Date('2026-07-03T14:30:00'))  // "3 Jul 2026, 2:30 PM"
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  return d.toLocaleString('en-IN', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Relative time
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a human-friendly relative time string from the given date to now.
 *
 * Examples: "just now", "5 minutes ago", "2 hours ago",
 *           "yesterday", "3 days ago", "2 weeks ago",
 *           "1 month ago", "2 years ago"
 *
 * @param date - A `Date` object or an ISO date string.
 */
export function getRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '—'

  const d    = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  const now        = new Date()
  const diffMs     = now.getTime() - d.getTime()
  const diffSecs   = Math.floor(diffMs / 1_000)
  const diffMins   = Math.floor(diffMs / 60_000)
  const diffHours  = Math.floor(diffMs / 3_600_000)
  const diffDays   = Math.floor(diffMs / 86_400_000)
  const diffWeeks  = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears  = Math.floor(diffDays / 365)

  if (diffSecs  <  60)  return 'just now'
  if (diffMins  <  60)  return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
  if (diffHours <  24)  return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays  ===  1) return 'yesterday'
  if (diffDays  <   7)  return `${diffDays} days ago`
  if (diffWeeks <   5)  return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`
  if (diffMonths < 12)  return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
  return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Badge colour helpers — return Tailwind CSS class strings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns Tailwind background + text colour classes for a given LeadStatus.
 *
 * The returned string is safe to use directly in `className`.
 */
export function getLeadStatusColor(status: string): string {
  const map: Record<string, string> = {
    NEW:                   'bg-blue-100 text-blue-800',
    ASSIGNED:              'bg-indigo-100 text-indigo-800',
    CONTACTED:             'bg-yellow-100 text-yellow-800',
    FOLLOW_UP:             'bg-orange-100 text-orange-800',
    MEETING_SCHEDULED:     'bg-amber-100 text-amber-800',
    SITE_VISIT_SCHEDULED:  'bg-purple-100 text-purple-800',
    SITE_VISIT:            'bg-teal-100 text-teal-800',
    NEGOTIATION:           'bg-indigo-100 text-indigo-800',
    BOOKING:               'bg-green-100 text-green-800',
    CLOSED:                'bg-green-100 text-green-800',
    LOST:                  'bg-red-100 text-red-800',
  }

  return map[status] ?? 'bg-gray-100 text-gray-800'
}

/**
 * Returns Tailwind background + text colour classes for a given LeadSource.
 */
export function getLeadSourceColor(source: string): string {
  const map: Record<string, string> = {
    INSTAGRAM: 'bg-pink-100 text-pink-800',
    WHATSAPP:  'bg-green-100 text-green-800',
    WEBSITE:   'bg-blue-100 text-blue-800',
    FACEBOOK:  'bg-indigo-100 text-indigo-800',
    GOOGLE:    'bg-red-100 text-red-800',
    REFERRAL:  'bg-amber-100 text-amber-800',
    OTHER:     'bg-gray-100 text-gray-800',
  }

  return map[source] ?? 'bg-gray-100 text-gray-800'
}

/**
 * Returns Tailwind background + text colour classes for a given Priority level.
 */
export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    HIGH:   'bg-red-100 text-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW:    'bg-green-100 text-green-800',
  }

  return map[priority] ?? 'bg-gray-100 text-gray-800'
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. String helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates an avatar-style two-letter initials string from a full name.
 *
 * Strategy:
 *  - Split the name by whitespace.
 *  - Take the first character of the first word and the first character of
 *    the last word (if more than one word exists).
 *  - Return the result in uppercase.
 *
 * @example
 *   getInitials('Rahul Sharma')   // "RS"
 *   getInitials('Priya')          // "P"
 *   getInitials('Amit Kumar Das') // "AD"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) return '?'

  const parts = name.trim().split(/\s+/)

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  const first = parts[0].charAt(0).toUpperCase()
  const last  = parts[parts.length - 1].charAt(0).toUpperCase()

  return `${first}${last}`
}
