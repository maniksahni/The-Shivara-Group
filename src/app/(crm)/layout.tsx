/**
 * src/app/(crm)/layout.tsx
 *
 * Root layout for all CRM pages.
 *
 * Responsibilities:
 *  1. Wraps all CRM children in NextAuth's <SessionProvider> so that
 *     client components can call useSession().
 *  2. Performs a server-side session check — redirects to /crm/login
 *     if there is no active session (belt-and-suspenders on top of
 *     the Edge Middleware in middleware.ts).
 *  3. Renders the persistent two-column shell:
 *       • Fixed 260 px left sidebar (<CRMSidebar>)
 *       • Right pane with a sticky topbar (<CRMTopbar>) + scrollable
 *         content area where {children} are rendered.
 */

import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/auth'
import CRMSidebar from '@/components/crm/Sidebar'
import CRMTopbar from '@/components/crm/Topbar'
import CRMProviders from '@/components/crm/CRMProviders'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CRMLayoutProps {
  children: React.ReactNode
}

// ---------------------------------------------------------------------------
// Layout — Server Component
// ---------------------------------------------------------------------------

export default async function CRMLayout({ children }: CRMLayoutProps) {
  // ── Session guard ────────────────────────────────────────────────────────
  // getServerSession() reads the JWT cookie on the server side.
  // If it is missing or expired the user is sent to the login page.
  // The login page itself lives inside this route group but does NOT use
  // this layout — it has its own root layout-less segment structure, so
  // this redirect never fires for /crm/login.
  const session = await getServerSession()

  if (!session) {
    redirect('/crm/login')
  }

  // ── Shell ────────────────────────────────────────────────────────────────
  // We pass the raw session to SessionProvider so that the initial client-side
  // state is already populated — avoids a loading flicker on first render.
  return (
    <CRMProviders session={session}>
      {/*
       * Full-viewport flex container.
       * Sidebar is fixed-width (260 px); the right pane takes remaining space.
       */}
      <div className="flex h-screen w-full overflow-hidden bg-slate-950">
        {/* ── Left sidebar ──────────────────────────────────────────────── */}
        {/*
         * The sidebar is rendered as a fixed-position column so that it
         * never scrolls with the content. On mobile it is hidden behind
         * a hamburger toggle managed by the Topbar component.
         */}
        <CRMSidebar />

        {/* ── Right pane ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Sticky top bar — stays visible while content scrolls */}
          <CRMTopbar />

          {/*
           * Scrollable content area.
           * `min-w-0` prevents flex children from overflowing their container.
           * `flex-1` ensures this area fills the remaining vertical space
           * below the topbar.
           */}
          <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
            {children}
          </main>
        </div>
      </div>
    </CRMProviders>
  )
}
