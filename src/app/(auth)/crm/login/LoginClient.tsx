'use client'

/**
 * Public CRM login page.
 *
 * Premium CRM login page for Shivara Group.
 *
 * Credentials-only CRM login page.
 */

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2, AlertCircle, ShieldCheck, Mail, LockKeyhole } from 'lucide-react'

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
  email: string
  password: string
  loading: boolean
  error: string | null
}

function getAuthErrorMessage(error: string | null) {
  if (!error) return null

  const messages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password.',
    AccessDenied: 'This CRM account is not authorised.',
    Configuration: 'CRM sign-in is not configured yet.',
  }

  return messages[error] ?? 'Sign in failed. Please try again.'
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function CRMLoginClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Restore any server-side auth error surfaced via the URL
  const urlError = searchParams.get('error')

  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    loading: false,
    error: getAuthErrorMessage(urlError),
  })

  async function handleCredentialsSignIn(event: React.FormEvent) {
    event.preventDefault()
    setForm((prev) => ({ ...prev, loading: true, error: null }))

    const rawCallbackUrl = searchParams.get('callbackUrl') ?? '/crm/dashboard'
    const callbackUrl = (() => {
      try {
        const parsed = new URL(rawCallbackUrl, window.location.origin)
        return parsed.origin === window.location.origin
          ? `${parsed.pathname}${parsed.search}${parsed.hash}`
          : '/crm/dashboard'
      } catch {
        return '/crm/dashboard'
      }
    })()

    const result = await signIn('credentials', {
      email: form.email.trim(),
      password: form.password,
      redirect: false,
      callbackUrl,
    })

    if (result?.ok) {
      const safeResultUrl = (() => {
        try {
          if (!result.url) return callbackUrl
          const parsed = new URL(result.url, window.location.origin)
          return parsed.origin === window.location.origin
            ? `${parsed.pathname}${parsed.search}${parsed.hash}`
            : callbackUrl
        } catch {
          return callbackUrl
        }
      })()

      router.push(safeResultUrl)
      router.refresh()
      return
    }

    setForm((prev) => ({
      ...prev,
      loading: false,
      error: getAuthErrorMessage(result?.error ?? 'CredentialsSignin'),
    }))
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
    <div className="flex min-h-[100dvh] flex-col md:flex-row">
      {/* ── Left panel — dark navy brand area ─────────────────────────── */}
      <div
        className="relative flex min-h-[34dvh] flex-col items-center justify-center gap-5 overflow-hidden px-6 py-8 md:min-h-screen md:w-1/2 md:gap-8 md:px-8 md:py-12"
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
          <div className="mb-3 flex justify-center md:mb-4">
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
            Bespoke Real Estate
          </p>

          {/* Decorative divider */}
          <div className="mx-auto mt-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: '#C9A84C50' }} />
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#C9A84C' }} />
            <div className="h-px flex-1" style={{ backgroundColor: '#C9A84C50' }} />
          </div>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Managing luxury properties across prime locations. Your trusted
            partner in real estate excellence.
          </p>
        </div>

        {/* CSS art graphic */}
        <div className="relative z-10 hidden w-full max-w-[280px] md:block">
          <LuxuryGraphic />
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-slate-600 text-center">
          Powered by Shivara CRM · Built for Excellence
        </p>
      </div>

      {/* ── Right panel — login form ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 px-5 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] md:min-h-screen md:w-1/2 md:px-6 md:py-12">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Sign In to CRM</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Use the authorised admin email and password
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

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Email Address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={form.loading}
              className="flex w-full min-h-12 items-center justify-center gap-3 rounded-2xl bg-[#C9A84C] px-4 py-3.5 text-sm font-black text-slate-950 shadow-2xl shadow-[#C9A84C]/15 transition-all duration-150 hover:bg-[#F0D080] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {form.loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign In to CRM'
              )}
            </button>
          </form>

          {/* Authorised account note */}
          <div className="mt-8 rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C9A84C]" />
              Secure CRM Access
            </p>

            <p className="text-[11px] leading-relaxed text-slate-500">
              CRM access is password-based. Keep the admin email and password private,
              and update the password from the database seed or admin user record.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
