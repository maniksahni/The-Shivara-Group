'use client'

/**
 * Public CRM login page.
 *
 * Premium CRM login page for Shivara Group.
 *
 * Layout:
 *  • Left half  — dark navy panel with brand logo, tagline, and a purely
 *                 CSS luxury art graphic (animated gold circles / lines).
 *  • Right half — white/slate card containing Google login.
 *
 * Behaviour:
 *  - Uses `signIn` from next-auth/react with the 'google' provider.
 *  - On success: redirects to /crm/dashboard via NextAuth callbackUrl.
 *  - On failure: displays the error message from NextAuth.
 *  - Google sign-in is available for the configured authorised CRM email.
 *  - Fully responsive: panels stack vertically on mobile.
 */

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// CSS luxury art graphic — pure CSS gold circles and lines
// ─────────────────────────────────────────────────────────────────────────────

function LuxuryGraphic() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-64 select-none" aria-hidden="true">
      {/* Large outer ring */}
      <div
        className="absolute inset-0 rounded-full border-2 opacity-20 animate-spin"
        style={{
          borderColor: '#C9A84C',
          animationDuration: '20s',
          animationTimingFunction: 'linear',
        }}
      />

      {/* Medium ring */}
      <div
        className="absolute rounded-full border opacity-30"
        style={{
          inset: '16px',
          borderColor: '#C9A84C',
          animationDuration: '15s',
        }}
      />

      {/* Inner filled circle */}
      <div
        className="absolute rounded-full opacity-10"
        style={{
          inset: '48px',
          backgroundColor: '#C9A84C',
        }}
      />

      {/* Diagonal lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="128" x2="256" y2="128" stroke="#C9A84C" strokeWidth="1" />
        <line x1="128" y1="0" x2="128" y2="256" stroke="#C9A84C" strokeWidth="1" />
        <line x1="0" y1="0" x2="256" y2="256" stroke="#C9A84C" strokeWidth="0.5" />
        <line x1="256" y1="0" x2="0" y2="256" stroke="#C9A84C" strokeWidth="0.5" />
        <circle cx="128" cy="128" r="60" stroke="#C9A84C" strokeWidth="1" fill="none" />
        <circle cx="128" cy="128" r="90" stroke="#C9A84C" strokeWidth="0.5" fill="none" />
        <circle cx="128" cy="128" r="30" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Centre logo mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-slate-900 text-2xl font-black shadow-2xl"
          style={{ backgroundColor: '#C9A84C' }}
        >
          S
        </div>
      </div>

      {/* Corner accents */}
      {[
        'top-2 left-2',
        'top-2 right-2',
        'bottom-2 left-2',
        'bottom-2 right-2',
      ].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} h-3 w-3 rounded-full opacity-60`}
          style={{ backgroundColor: '#C9A84C' }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Login form
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  googleLoading: boolean
  error: string | null
}

function getAuthErrorMessage(error: string | null) {
  if (!error) return null

  const messages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password.',
    OAuthSignin: 'Google sign-in could not start. Please try again.',
    OAuthCallback: 'Google sign-in could not be completed. Please try again.',
    OAuthAccountNotLinked: 'This Google account is not linked to an active CRM user.',
    AccessDenied: 'This Google account is not authorised for CRM access.',
    Configuration: 'Google sign-in is not configured yet.',
  }

  return messages[error] ?? 'Sign in failed. Please try again.'
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function CRMLoginClient() {
  const searchParams = useSearchParams()

  // Restore any server-side auth error surfaced via the URL
  const urlError = searchParams.get('error')

  const [form, setForm] = useState<FormState>({
    googleLoading: false,
    error: getAuthErrorMessage(urlError),
  })

  async function handleGoogleSignIn() {
    setForm((prev) => ({ ...prev, googleLoading: true, error: null }))

    const callbackUrl = searchParams.get('callbackUrl') ?? '/crm/dashboard'
    await signIn('google', { callbackUrl })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    /*
     * Full-screen flex container.
     * On mobile: single column (form stacked below branding).
     * On md+: two equal columns side-by-side.
     */
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* ── Left panel — dark navy brand area ─────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-center gap-8 overflow-hidden px-8 py-12 md:w-1/2 md:min-h-screen"
        style={{
          background:
            'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1a1f35 100%)',
        }}
      >
        {/* Background decorative blobs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-5"
          style={{ backgroundColor: '#C9A84C', filter: 'blur(80px)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-5"
          style={{ backgroundColor: '#C9A84C', filter: 'blur(100px)' }}
          aria-hidden="true"
        />

        {/* Brand */}
        <div className="relative z-10 text-center">
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black text-slate-900 shadow-2xl"
              style={{ backgroundColor: '#C9A84C' }}
            >
              S
            </div>
          </div>

          <h2
            className="text-3xl font-black tracking-wide"
            style={{ color: '#C9A84C' }}
          >
            The Shivara Group
          </h2>

          <p className="mt-2 text-base text-slate-400 font-light tracking-wider uppercase">
            Premium Real Estate
          </p>

          {/* Decorative divider */}
          <div className="mx-auto mt-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: '#C9A84C50' }} />
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#C9A84C' }} />
            <div className="h-px flex-1" style={{ backgroundColor: '#C9A84C50' }} />
          </div>

          <p className="mt-4 max-w-xs text-sm text-slate-500 leading-relaxed">
            Managing luxury properties across prime locations. Your trusted
            partner in real estate excellence.
          </p>
        </div>

        {/* CSS art graphic */}
        <div className="relative z-10 w-full max-w-[280px]">
          <LuxuryGraphic />
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-slate-600 text-center">
          Powered by Shivara CRM · Built for Excellence
        </p>
      </div>

      {/* ── Right panel — login form ───────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center bg-slate-950 px-6 py-12 md:w-1/2 md:min-h-screen">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Sign In to CRM</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Continue with your authorised Google account
            </p>
          </div>

          {/* Error alert */}
          {form.error && (
            <div
              className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" aria-hidden="true" />
              <p className="text-sm text-rose-300">{form.error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={form.googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-3.5 text-sm font-bold text-slate-900 shadow-2xl shadow-black/20 transition-all duration-150 hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form.googleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Connecting Google…
              </>
            ) : (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-base font-black text-blue-600">
                  G
                </span>
                Continue with Google
              </>
            )}
          </button>

          {/* Authorised account note */}
          <div className="mt-8 rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C9A84C]" />
              Secure CRM Access
            </p>

            <p className="text-[11px] leading-relaxed text-slate-500">
              Google sign-in is restricted to the authorised admin email configured in Railway.
              No demo users are available on production.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
