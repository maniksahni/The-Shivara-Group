/**
 * src/proxy.ts
 *
 * Next.js Edge Middleware for Shivara CRM route protection.
 *
 * Rules:
 *  1. If SITE_URL / NEXT_PUBLIC_SITE_URL is configured, non-canonical hosts
 *     are redirected to the custom production domain.
 *  2. All /crm/* routes require an authenticated session.
 *     Unauthenticated users are redirected to /crm/login.
 *  3. /crm/agents/* routes are restricted to users with role === 'ADMIN'.
 *     Non-admin users are redirected to /crm/dashboard.
 *  4. The /crm/login page itself is always accessible (explicitly excluded
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

function normalizeOrigin(value: string | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.origin
  } catch {
    return null
  }
}

function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return request.nextUrl.origin
}

function getCanonicalOrigin() {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeOrigin(process.env.SITE_URL) ||
    normalizeOrigin(process.env.APP_URL) ||
    null
  )
}

function getPublicOrigin(request: NextRequest) {
  const requestOrigin = getRequestOrigin(request)
  const canonicalOrigin = getCanonicalOrigin()

  if (!canonicalOrigin) {
    return requestOrigin
  }

  const requestHost = new URL(requestOrigin).host
  const canonicalHost = new URL(canonicalOrigin).host

  // Local development should keep working on localhost/127.0.0.1.
  if (requestHost.includes('localhost') || requestHost.startsWith('127.0.0.1')) {
    return requestOrigin
  }

  // Railway fallback domains should generate redirects/callbacks on the
  // configured custom domain once SITE_URL/NEXT_PUBLIC_SITE_URL is set.
  if (requestHost.endsWith('.up.railway.app') || requestHost.endsWith('.railway.app')) {
    return canonicalOrigin
  }

  // For any already-custom domain, preserve the incoming host so CRM login
  // never jumps to a different domain because of an old NEXTAUTH_URL value.
  if (requestHost !== canonicalHost) {
    return requestOrigin
  }

  return canonicalOrigin
}

function getPublicUrl(request: NextRequest, pathname: string) {
  const url = new URL(pathname, getPublicOrigin(request))
  return url
}

// ---------------------------------------------------------------------------
// Middleware function
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const canonicalOrigin = getCanonicalOrigin()
  const requestOrigin = getRequestOrigin(request)

  if (canonicalOrigin) {
    const requestHost = new URL(requestOrigin).host
    const canonicalHost = new URL(canonicalOrigin).host
    const isLocal =
      requestHost.includes('localhost') || requestHost.startsWith('127.0.0.1')

    if (!isLocal && requestHost !== canonicalHost) {
      const canonicalUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalOrigin)
      return NextResponse.redirect(canonicalUrl, 308)
    }
  }

  // Public website routes do not require auth. Keep the proxy active for
  // canonical-domain enforcement above, but only protect CRM routes below.
  if (!pathname.startsWith('/crm')) {
    return NextResponse.next()
  }

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
    const loginUrl = getPublicUrl(request, LOGIN_PATH)
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set(
      'callbackUrl',
      `${getPublicOrigin(request)}${request.nextUrl.pathname}${request.nextUrl.search}`
    )
    return NextResponse.redirect(loginUrl)
  }

  // ── 4. Role-based access control for /crm/agents/* ──────────────────────
  if (pathname.startsWith(ADMIN_ONLY_PREFIX)) {
    const userRole = token.role as string | undefined

    if (userRole !== 'ADMIN') {
      // Authenticated but insufficient privileges — send to dashboard
      const dashboardUrl = getPublicUrl(request, DASHBOARD_PATH)
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
   * Run the proxy for page requests so canonical custom-domain redirects work
   * across the public website and CRM. Static assets and API routes are
   * excluded. Auth protection itself is still limited to /crm routes above.
   *
   * The login page is handled in code instead of the matcher so the same proxy
   * can also redirect old Railway-hosted login URLs to the custom domain.
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
