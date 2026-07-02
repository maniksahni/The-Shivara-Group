'use client'

/**
 * src/components/crm/Topbar.tsx
 *
 * Sticky top bar rendered to the right of the sidebar.
 *
 * Features:
 *  - Hamburger icon (mobile only) that opens the sidebar via SidebarContext
 *  - Dynamic page title derived from the current URL pathname
 *  - Global lead search input (visible on md+ screens)
 *  - Notification bell with overdue follow-ups badge (red)
 *  - User avatar with dropdown: My Profile + Logout
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  X,
} from 'lucide-react'

import { useSidebar } from './Sidebar'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Page-title mapping
// ─────────────────────────────────────────────────────────────────────────────

/** Maps pathname prefixes to human-readable page titles. */
const PAGE_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: '/crm/dashboard', title: 'Dashboard' },
  { prefix: '/crm/leads', title: 'Leads' },
  { prefix: '/crm/properties', title: 'Properties' },
  { prefix: '/crm/reports', title: 'Reports' },
  { prefix: '/crm/agents', title: 'Agents' },
  { prefix: '/crm/profile', title: 'My Profile' },
]

function getPageTitle(pathname: string): string {
  for (const { prefix, title } of PAGE_TITLES) {
    if (pathname.startsWith(prefix)) return title
  }
  return 'Shivara CRM'
}

// ─────────────────────────────────────────────────────────────────────────────
// Overdue follow-ups count hook
// ─────────────────────────────────────────────────────────────────────────────

function useOverdueCount(): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetch_() {
      try {
        const res = await fetch('/api/leads?pendingFollowUps=1&pageSize=1', {
          cache: 'no-store',
        })
        if (!res.ok || cancelled) return
        const json = await res.json()
        if (!cancelled) setCount(json?.total ?? 0)
      } catch {
        // Silently ignore
      }
    }

    fetch_()
    const id = setInterval(fetch_, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return count
}

// ─────────────────────────────────────────────────────────────────────────────
// User avatar
// ─────────────────────────────────────────────────────────────────────────────

function TopbarAvatar({ name }: { name: string }) {
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
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-slate-900"
      style={{ backgroundColor: '#C9A84C' }}
    >
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// User dropdown menu
// ─────────────────────────────────────────────────────────────────────────────

interface UserDropdownProps {
  name: string
  email: string
  onClose: () => void
}

function UserDropdown({ name, email, onClose }: UserDropdownProps) {
  const router = useRouter()

  async function handleSignOut() {
    onClose()
    await signOut({ redirect: false })
    router.push('/crm/login')
  }

  function handleProfile() {
    onClose()
    router.push('/crm/profile')
  }

  return (
    <div
      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-50 overflow-hidden"
      role="menu"
      aria-orientation="vertical"
    >
      {/* User info header */}
      <div className="border-b border-slate-700 px-4 py-3">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        <p className="text-xs text-slate-400 truncate">{email}</p>
      </div>

      {/* Actions */}
      <div className="py-1">
        <button
          onClick={handleProfile}
          role="menuitem"
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <User className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          My Profile
        </button>

        <button
          onClick={handleSignOut}
          role="menuitem"
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CRMTopbar component
// ─────────────────────────────────────────────────────────────────────────────

export default function CRMTopbar() {
  const { toggle: toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const overdueCount = useOverdueCount()

  const pageTitle = getPageTitle(pathname)

  // ── Search state ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ── User dropdown state ──────────────────────────────────────────────────
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  // ── Search submit ────────────────────────────────────────────────────────
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const query = searchQuery.trim()
      if (!query) return
      router.push(`/crm/leads?search=${encodeURIComponent(query)}`)
      setSearchQuery('')
    },
    [searchQuery, router]
  )

  // Clear search
  function clearSearch() {
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  // ── Notification bell click ──────────────────────────────────────────────
  function handleBellClick() {
    router.push('/crm/leads?pendingFollowUps=1')
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <header className="flex h-16 flex-shrink-0 items-center gap-4 border-b border-slate-700 bg-slate-900 px-4 md:px-6">
      {/* ── Hamburger (mobile only) ────────────────────────────────────── */}
      <button
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* ── Page title ─────────────────────────────────────────────────── */}
      <h1 className="flex-shrink-0 text-lg font-bold text-white tracking-tight">
        {pageTitle}
      </h1>

      {/* ── Spacer ─────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Global search (md+) ────────────────────────────────────────── */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex relative items-center"
        role="search"
        aria-label="Search leads"
      >
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500"
          aria-hidden="true"
        />
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search leads…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'h-9 w-56 rounded-lg border border-slate-700 bg-slate-800',
            'pl-9 pr-8 text-sm text-white placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:border-transparent transition-all',
            'hover:border-slate-600'
          )}
          style={
            searchQuery
              ? { outline: 'none', boxShadow: `0 0 0 2px #C9A84C40` }
              : undefined
          }
          aria-label="Search leads by name, phone, or email"
        />
        {/* Clear button */}
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* ── Right-side actions ─────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center gap-2">
        {/* Notification bell */}
        <button
          onClick={handleBellClick}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label={
            overdueCount > 0
              ? `${overdueCount} overdue follow-ups`
              : 'No overdue follow-ups'
          }
        >
          <Bell className="h-5 w-5" aria-hidden="true" />

          {/* Red badge */}
          {overdueCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white"
              aria-hidden="true"
            >
              {overdueCount > 9 ? '9+' : overdueCount}
            </span>
          )}
        </button>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-slate-700" aria-hidden="true" />

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-800 transition-colors"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <TopbarAvatar name={session?.user?.name ?? 'U'} />

            {/* Name (hidden on mobile) */}
            <span className="hidden text-sm font-medium text-white sm:block max-w-[120px] truncate">
              {session?.user?.name ?? 'User'}
            </span>

            <ChevronDown
              className={cn(
                'hidden h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition-transform duration-200 sm:block',
                dropdownOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && session?.user && (
            <UserDropdown
              name={session.user.name ?? 'User'}
              email={session.user.email ?? ''}
              onClose={() => setDropdownOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  )
}
