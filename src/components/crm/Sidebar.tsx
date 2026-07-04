'use client'

/**
 * src/components/crm/Sidebar.tsx
 *
 * CRM application sidebar.
 *
 * Features:
 *  - Shivara CRM logo / brand area at the top
 *  - Primary navigation links (with active-state highlighting)
 *  - Role-gated "Agents" link (ADMIN only)
 *  - Badge on the Leads link showing pending follow-up count
 *  - Bottom user-info card + logout button
 *  - Mobile: slides in/out via a state toggle driven by the
 *    sidebar context (shared with CRMTopbar via a simple context)
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  UserCircle,
  LogOut,
  X,
  ChevronRight,
  CalendarDays,
  Activity,
  Settings,
} from 'lucide-react'

import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar open/close context
// ─────────────────────────────────────────────────────────────────────────────
// Shared between CRMSidebar and CRMTopbar so the hamburger in the topbar
// can toggle the sidebar on mobile.

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  // Close sidebar on route change (mobile navigation)
  const pathname = usePathname()
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation item definition
// ─────────────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  /** If truthy, render a badge with this number next to the label. */
  badge?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// User-info avatar
// ─────────────────────────────────────────────────────────────────────────────

function UserAvatar({ name }: { name: string }) {
  // Generate two-letter initials from the name
  const initials = (() => {
    const parts = (name ?? '?').trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    )
  })()

  return (
    <div
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4B400] to-[#f59e0b] text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/15"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Pending follow-up count hook
// ─────────────────────────────────────────────────────────────────────────────
// In a real app this would hit an API endpoint; here we derive it from a
// simple fetch so the sidebar can work independently.

function usePendingFollowUps(): number {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    let cancelled = false

    async function fetchCount() {
      try {
        const res = await fetch('/api/leads?pendingFollowUps=1&pageSize=1', {
          cache: 'no-store',
        })
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled) {
          // The leads list endpoint returns { total } at the top level
          setCount(json?.total ?? 0)
        }
      } catch {
        // Silently ignore — badge simply won't show
      }
    }

    fetchCount()
    // Refresh every 5 minutes
    const interval = setInterval(fetchCount, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return count
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CRMSidebar component
// ─────────────────────────────────────────────────────────────────────────────

export default function CRMSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { close } = useSidebar()
  const pendingFollowUps = usePendingFollowUps()

  // ── Navigation items ─────────────────────────────────────────────────────
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/crm/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Leads',
      href: '/crm/leads',
      icon: Users,
      badge: pendingFollowUps > 0 ? pendingFollowUps : undefined,
    },
    {
      label: 'Properties',
      href: '/crm/properties',
      icon: Building2,
    },
    {
      label: 'Calendar',
      href: '/crm/calendar',
      icon: CalendarDays,
    },
    {
      label: 'Activities',
      href: '/crm/activities',
      icon: Activity,
    },
    {
      label: 'Reports',
      href: '/crm/reports',
      icon: BarChart3,
    },
    {
      label: 'Settings',
      href: '/crm/settings',
      icon: Settings,
    },
    { label: 'Profile', href: '/crm/profile', icon: UserCircle },
  ]

  // ── Sign out handler ──────────────────────────────────────────────────────
  async function handleSignOut() {
    await signOut({ redirect: false })
    router.push('/crm/login')
  }

  // ── Determine if a nav item is "active" ──────────────────────────────────
  function isActive(href: string): boolean {
    if (href === '/crm/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/*
       * Mobile overlay — tapping outside the sidebar closes it.
       * Only rendered when the sidebar is open on small screens.
       */}
      {/*
       * The sidebar panel itself.
       *
       * On lg+ screens it is always visible as a normal flex child (w-[260px]).
       * On smaller screens it slides in from the left using a CSS translate
       * transition, controlled by the `isOpen` state.
       */}
      <motion.aside
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn(
          // Base layout
          'fixed top-0 left-0 z-30 hidden h-full w-[280px] flex-col md:flex',
          // Background and border
          'border-r border-white/10 bg-[#0E1726]/85 shadow-2xl shadow-black/40 backdrop-blur-2xl',
          // On desktop: always visible, not fixed (use relative positioning
          // within the flex row — achieved by overriding fixed with static).
          'md:static md:z-auto',
          // Mobile slide animation
          'transition-transform duration-300 ease-in-out',
          'translate-x-0',
        )}
        aria-label="CRM navigation sidebar"
      >
        {/* ── Logo / brand ────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F4B400]/10 via-transparent to-transparent" />
          <Link
            href="/crm/dashboard"
            className="flex items-center gap-3 group"
            onClick={close}
          >
            {/* Gold "S" icon */}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4B400] to-[#f59e0b] text-lg font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 ring-1 ring-white/20">
              S
            </div>

            {/* Brand text */}
            <div className="flex flex-col leading-tight">
              <span
                className="text-[15px] font-bold tracking-wide text-[#F4B400]"
              >
                Shivara CRM
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.25em]">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Navigation links ─────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Primary navigation">
          <ul className="space-y-2" role="list">
            {navItems
              .map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={cn(
                        // Base styles
                        'group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200',
                        // Active state: gold background, dark text
                        active
                          ? 'bg-gradient-to-r from-[#F4B400] to-[#f59e0b] text-[#081120] shadow-lg shadow-[#F4B400]/20'
                          : // Inactive state: muted text, hover gold
                            'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {active && (
                        <span className="absolute inset-y-2 -left-1 w-1 rounded-full bg-white/80" />
                      )}
                      {/* Icon */}
                      <Icon
                        className={cn(
                          'h-4.5 w-4.5 flex-shrink-0 transition-colors',
                          active
                            ? 'text-[#081120]'
                            : 'text-gray-500 group-hover:text-[#F4B400]'
                        )}
                        aria-hidden="true"
                      />

                      {/* Label */}
                      <span className="flex-1 truncate">{item.label}</span>

                      {/* Optional badge */}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={cn(
                            'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none',
                            active
                              ? 'bg-[#081120]/20 text-[#081120]'
                              : 'bg-[#EF4444] text-white'
                          )}
                          aria-label={`${item.badge} pending follow-ups`}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}

                      {/* Active chevron hint */}
                      {active && (
                        <ChevronRight
                          className="h-3.5 w-3.5 flex-shrink-0 text-[#081120]/60"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                    </motion.div>
                  </li>
                )
              })}
          </ul>
        </nav>

        {/* ── Bottom: user info + logout ───────────────────────────────── */}
        <div className="border-t border-white/10 p-4">
          {session?.user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 shadow-inner shadow-white/5">
              <UserAvatar name={session.user.name ?? 'U'} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {session.user.name ?? 'User'}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {session.user.role === 'ADMIN' ? '👑 Admin' : '🧑‍💼 Agent'}
                </p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-gray-400 transition-all duration-150 hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="Sign out of CRM"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-40 rounded-[24px] border border-white/10 bg-[#0E1726]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden" aria-label="Mobile CRM navigation">
        <ul className="grid grid-cols-5 gap-1">
          {navItems
            .filter((item) =>
              ['/crm/dashboard', '/crm/leads', '/crm/properties', '/crm/calendar', '/crm/profile'].includes(item.href),
            )
            .map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition',
                      active
                        ? 'bg-[#F4B400] text-[#081120] shadow-lg shadow-[#F4B400]/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </nav>
    </>
  )
}
