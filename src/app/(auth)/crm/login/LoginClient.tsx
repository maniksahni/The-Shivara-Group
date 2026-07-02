'use client'

/**
 * Public CRM login page.
 *
 * Premium CRM login page for Shivara Group.
 *
 * Layout:
 *  • Left half  — dark navy panel with brand logo, tagline, and a purely
 *                 CSS luxury art graphic (animated gold circles / lines).
 *  • Right half — white/slate card containing the login form.
 *
 * Behaviour:
 *  - Uses `signIn` from next-auth/react with the 'credentials' provider.
 *  - On success: redirects to /crm/dashboard.
 *  - On failure: displays the error message from NextAuth.
 *  - Password field has show/hide toggle.
 *  - Demo credentials are shown below the form for convenience.
 *  - Fully responsive: panels stack vertically on mobile.
 */

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2, AlertCircle, Lock, Mail } from 'lucide-react'

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
  showPassword: boolean
  loading: boolean
  error: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function CRMLoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Restore any server-side auth error surfaced via the URL
  const urlError = searchParams.get('error')

  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    showPassword: false,
    loading: false,
    error: urlError ? 'Invalid credentials. Please try again.' : null,
  })

  // ── Field update helper ────────────────────────────────────────────────
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value, error: null }))
  }

  // ── Form submission ────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.email.trim() || !form.password) {
      setForm((prev) => ({
        ...prev,
        error: 'Please enter your email and password.',
      }))
      return
    }

    setForm((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        setForm((prev) => ({
          ...prev,
          loading: false,
          error:
            result.error === 'CredentialsSignin'
              ? 'Invalid email or password.'
              : result.error ?? 'Sign in failed. Please try again.',
        }))
        return
      }

      // Success — navigate to dashboard (or callbackUrl if present)
      const callbackUrl = searchParams.get('callbackUrl') ?? '/crm/dashboard'
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setForm((prev) => ({
        ...prev,
        loading: false,
        error: 'An unexpected error occurred. Please try again.',
      }))
    }
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
              Enter your credentials to access your account
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

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@shivaragroup.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  disabled={form.loading}
                  required
                  className={`
                    w-full rounded-lg border border-slate-700 bg-slate-800
                    pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                  `}
                  style={
                    form.email
                      ? { boxShadow: '0 0 0 2px #C9A84C40' }
                      : undefined
                  }
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={form.showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  disabled={form.loading}
                  required
                  className={`
                    w-full rounded-lg border border-slate-700 bg-slate-800
                    pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                  `}
                  style={
                    form.password
                      ? { boxShadow: '0 0 0 2px #C9A84C40' }
                      : undefined
                  }
                  aria-required="true"
                />
                {/* Show / hide toggle */}
                <button
                  type="button"
                  onClick={() => update('showPassword', !form.showPassword)}
                  disabled={form.loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                  aria-label={form.showPassword ? 'Hide password' : 'Show password'}
                >
                  {form.showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={form.loading || !form.email || !form.password}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-slate-900 transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {form.loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing In…
                </>
              ) : (
                'Sign In to CRM'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Demo Credentials
            </p>

            <div className="space-y-2">
              {/* Admin */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-300">Admin</p>
                  <p className="text-xs text-slate-500">admin@shivaragroup.com</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      email: 'admin@shivaragroup.com',
                      password: 'admin123',
                      error: null,
                    }))
                  }
                  className="text-xs rounded-md px-2.5 py-1 font-medium text-slate-900 hover:brightness-110 transition-all"
                  style={{ backgroundColor: '#C9A84C' }}
                >
                  Use
                </button>
              </div>

              <div className="h-px bg-slate-800" />

              {/* Agent */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-300">Agent</p>
                  <p className="text-xs text-slate-500">agent1@shivaragroup.com</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      email: 'agent1@shivaragroup.com',
                      password: 'agent123',
                      error: null,
                    }))
                  }
                  className="text-xs rounded-md px-2.5 py-1 font-medium text-slate-500 border border-slate-600 hover:border-slate-400 hover:text-slate-300 transition-all"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
