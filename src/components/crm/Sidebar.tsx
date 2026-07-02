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
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  UserCheck,
  LogOut,
  X,
  ChevronRight,
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
  /** If provided, only render this item when the user's role matches. */
  requiredRole?: string
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
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-slate-900"
      style={{ backgroundColor: '#C9A84C' }}
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
  const { isOpen, close } = useSidebar()
  const pendingFollowUps = usePendingFollowUps()

  const userRole = session?.user?.role ?? ''

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
      label: 'Reports',
      href: '/crm/reports',
      icon: BarChart3,
    },
    {
      label: 'Agents',
      href: '/crm/agents',
      icon: UserCheck,
      requiredRole: 'ADMIN',
    },
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
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/*
       * The sidebar panel itself.
       *
       * On lg+ screens it is always visible as a normal flex child (w-[260px]).
       * On smaller screens it slides in from the left using a CSS translate
       * transition, controlled by the `isOpen` state.
       */}
      <aside
        className={cn(
          // Base layout
          'fixed top-0 left-0 z-30 flex h-full w-[260px] flex-col',
          // Background and border
          'bg-slate-900 border-r border-slate-700',
          // On desktop: always visible, not fixed (use relative positioning
          // within the flex row — achieved by overriding fixed with static).
          'lg:static lg:z-auto',
          // Mobile slide animation
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="CRM navigation sidebar"
      >
        {/* ── Logo / brand ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-5">
          <Link
            href="/crm/dashboard"
            className="flex items-center gap-3 group"
            onClick={close}
          >
            {/* Gold "S" icon */}
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-900 text-lg font-black shadow-md"
              style={{ backgroundColor: '#C9A84C' }}
            >
              S
            </div>

            {/* Brand text */}
            <div className="flex flex-col leading-tight">
              <span
                className="text-[15px] font-bold tracking-wide"
                style={{ color: '#C9A84C' }}
              >
                Shivara CRM
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Real Estate
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Navigation links ─────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
          <ul className="space-y-1" role="list">
            {navItems
              .filter(
                (item) =>
                  !item.requiredRole || item.requiredRole === userRole
              )
              .map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={cn(
                        // Base styles
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        // Active state: gold background, dark text
                        active
                          ? 'text-slate-900 shadow-sm'
                          : // Inactive state: muted text, hover gold
                            'text-slate-400 hover:text-white hover:bg-slate-800'
                      )}
                      style={
                        active
                          ? { backgroundColor: '#C9A84C', color: '#0f172a' }
                          : undefined
                      }
                      aria-current={active ? 'page' : undefined}
                    >
                      {/* Icon */}
                      <Icon
                        className={cn(
                          'h-4.5 w-4.5 flex-shrink-0 transition-colors',
                          active
                            ? 'text-slate-900'
                            : 'text-slate-500 group-hover:text-slate-300'
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
                              ? 'bg-slate-900/20 text-slate-900'
                              : 'bg-amber-500 text-white'
                          )}
                          aria-label={`${item.badge} pending follow-ups`}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}

                      {/* Active chevron hint */}
                      {active && (
                        <ChevronRight
                          className="h-3.5 w-3.5 flex-shrink-0 text-slate-900/60"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </nav>

        {/* ── Bottom: user info + logout ───────────────────────────────── */}
        <div className="border-t border-slate-700 p-4">
          {session?.user && (
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2.5">
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
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-150 hover:bg-rose-500/10 hover:text-rose-400"
            aria-label="Sign out of CRM"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
