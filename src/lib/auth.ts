/**
 * src/lib/auth.ts
 *
 * NextAuth v4 configuration for Shivara CRM.
 * Provides a CredentialsProvider backed by Prisma + bcryptjs,
 * JWT session strategy, and role / id forwarding to the session.
 */

import { NextAuthOptions, getServerSession as _getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

import prisma, { isDatabaseConfigured } from './prisma'

const authSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === 'development'
    ? 'shivara-development-only-secret-change-in-production'
    : undefined)

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const configuredAdminEmail = process.env.CRM_ADMIN_EMAIL?.toLowerCase().trim()
const allowedGoogleEmails = (
  process.env.CRM_GOOGLE_ALLOWED_EMAILS ||
  process.env.CRM_ADMIN_EMAIL ||
  ''
)
  .split(',')
  .map((email) => email.toLowerCase().trim())
  .filter(Boolean)

function isAllowedGoogleEmail(email: string | null | undefined) {
  if (!email) return false
  return allowedGoogleEmails.includes(email.toLowerCase().trim())
}

async function findActiveCrmUserByEmail(email: string | null | undefined) {
  if (!email || !isDatabaseConfigured) return null

  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  })
}

async function ensureGoogleCrmUser(email: string, name: string | null | undefined) {
  if (!isDatabaseConfigured || !isAllowedGoogleEmail(email)) return null

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await findActiveCrmUserByEmail(normalizedEmail)
  if (existing?.isActive) return existing

  const passwordHash = await bcrypt.hash(randomBytes(24).toString('hex'), 12)

  return prisma.$transaction(async (tx) => {
    const existingShivam = await tx.user.findFirst({
      where: { name: 'Shivam Sahani' },
      select: { id: true },
    })

    if (existingShivam) {
      return tx.user.update({
        where: { id: existingShivam.id },
        data: {
          name: name || 'Shivam Sahani',
          email: normalizedEmail,
          passwordHash,
          role: 'ADMIN',
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      })
    }

    return tx.user.create({
      data: {
        name: name || 'Shivam Sahani',
        email: normalizedEmail,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })
  })
}

// ---------------------------------------------------------------------------
// TypeScript module augmentation
// ---------------------------------------------------------------------------
// Extend next-auth's built-in types so that `session.user` and JWT token
// carry our custom fields without requiring casts everywhere.
// ---------------------------------------------------------------------------

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string
      role: string
    }
  }

  /** The shape of the user object returned from `authorize`. */
  interface User {
    id: string
    name: string | null
    email: string
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}

// ---------------------------------------------------------------------------
// NextAuth options
// ---------------------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  // Use JWT-based sessions (no database adapter required for session storage)
  session: {
    strategy: 'jwt',
    // 8 hour session lifetime — adjust to taste
    maxAge: 8 * 60 * 60,
  },

  // Custom pages
  pages: {
    signIn: '/crm/login',
    error: '/crm/login', // redirect auth errors back to login
  },

  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'agent@shivara.in',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      /**
       * Validates supplied credentials against the database.
       * Returns the user object on success, or null on failure
       * (NextAuth will surface an error to the sign-in page).
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.')
        }

        if (!isDatabaseConfigured) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        })

        if (!user) {
          // Do NOT reveal whether the email exists
          throw new Error('Invalid email or password.')
        }

        if (!user.isActive) {
          throw new Error('Your account has been deactivated. Please contact an administrator.')
        }

        // Compare the supplied plaintext password against the stored hash
        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!passwordMatch) {
          throw new Error('Invalid email or password.')
        }

        // Return the user object — this gets passed to the `jwt` callback
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== 'google') return true

      const crmUser = user.email
        ? await ensureGoogleCrmUser(user.email, user.name)
        : null
      if (!crmUser?.isActive) {
        return false
      }

      return true
    },

    /**
     * jwt callback — called whenever a JWT is created or updated.
     * On first sign-in, `user` is populated; on subsequent calls only `token`.
     * We persist `id` and `role` into the token so the session callback can
     * forward them to the client-side session object.
     */
    async jwt({ token, user }) {
      if (user) {
        const crmUser =
          user.email && isAllowedGoogleEmail(user.email)
            ? await ensureGoogleCrmUser(user.email, user.name)
            : await findActiveCrmUserByEmail(user.email)

        token.id = crmUser?.id ?? user.id
        token.role = crmUser?.role ?? user.role
        token.name = crmUser?.name ?? user.name
        token.email = crmUser?.email ?? user.email
      }
      return token
    },

    /**
     * session callback — called whenever `useSession` or `getServerSession`
     * is called. Copies the values we stored on the token into `session.user`.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  // Secret used to sign JWTs — set NEXTAUTH_SECRET in your .env
  secret: authSecret,

  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
}

if (process.env.NODE_ENV === 'development' && !configuredAdminEmail) {
  console.warn('CRM_ADMIN_EMAIL is not set. Google CRM sign-in will be denied until an authorised email is configured.')
}

// ---------------------------------------------------------------------------
// Convenience helper
// ---------------------------------------------------------------------------
// Re-export a pre-bound `getServerSession` so callers do not need to import
// and pass `authOptions` themselves.
//
// Usage inside Server Components / API Route handlers:
//   import { getServerSession } from '@/lib/auth'
//   const session = await getServerSession()
// ---------------------------------------------------------------------------

/**
 * Returns the current server-side session, or null if the user is not
 * authenticated.  Works in both App Router (Server Components) and Pages
 * Router (API routes / getServerSideProps).
 *
 * For App Router usage, call with no arguments.
 * For Pages Router usage, pass req & res as positional arguments.
 */
export async function getServerSession(
  ...args:
    | []
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
) {
  if (args.length === 0) {
    return _getServerSession(authOptions)
  }

  return _getServerSession(args[0], args[1], authOptions)
}
