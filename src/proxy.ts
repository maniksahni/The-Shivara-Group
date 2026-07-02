/**
 * src/proxy.ts
 *
 * Next.js Edge Middleware for Shivara CRM route protection.
 *
 * Rules:
 *  1. All /crm/* routes require an authenticated session.
 *     Unauthenticated users are redirected to /crm/login.
 *  2. /crm/agents/* routes are restricted to users with role === 'ADMIN'.
 *     Non-admin users are redirected to /crm/dashboard.
 *  3. The /crm/login page itself is always accessible (explicitly excluded
 *     from protection so we don't create an infinite redirect loop).
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** The login page — always publicly accessible. */
const LOGIN_PATH = '/crm/login'

/** Fallback for authenticated users who lack the required role. */
const DASHBOARD_PATH = '/crm/dashboard'

/** Routes that only ADMIN users may access. */
const ADMIN_ONLY_PREFIX = '/crm/agents'

// ---------------------------------------------------------------------------
// Middleware function
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Always allow the login page through ──────────────────────────────
  // This check is technically redundant given the matcher below, but it is a
  // useful safety net in case the matcher is ever widened.
  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return NextResponse.next()
  }

  // ── 2. Retrieve the JWT token from the request ──────────────────────────
  // `getToken` reads the cookie that NextAuth sets after a successful sign-in.
  // When running on the Edge runtime the secret must be set via NEXTAUTH_SECRET.
  const token = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET ||
      (process.env.NODE_ENV === 'development'
        ? 'shivara-development-only-secret-change-in-production'
        : undefined),
  })

  // ── 3. Redirect unauthenticated users to login ──────────────────────────
  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // ── 4. Role-based access control for /crm/agents/* ──────────────────────
  if (pathname.startsWith(ADMIN_ONLY_PREFIX)) {
    const userRole = token.role as string | undefined

    if (userRole !== 'ADMIN') {
      // Authenticated but insufficient privileges — send to dashboard
      const dashboardUrl = new URL(DASHBOARD_PATH, request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // ── 5. All checks passed — continue to the requested route ───────────────
  return NextResponse.next()
}

// ---------------------------------------------------------------------------
// Route matcher configuration
// ---------------------------------------------------------------------------

export const config = {
  /**
   * Run this middleware for every request whose path starts with /crm/,
   * EXCEPT for the login page so we never loop on redirect.
   *
   * The negative lookahead `(?!login)` excludes /crm/login and any
   * sub-paths under it (e.g. /crm/login?callbackUrl=...).
   */
  matcher: ['/crm/((?!login(?:/|$)).*)'],
}
