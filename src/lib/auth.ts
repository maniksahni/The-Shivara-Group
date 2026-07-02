/**
 * src/lib/auth.ts
 *
 * NextAuth v4 configuration for Shivara CRM.
 * Provides a CredentialsProvider backed by Prisma + bcryptjs,
 * JWT session strategy, and role / id forwarding to the session.
 */

import { NextAuthOptions, getServerSession as _getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

import prisma from './prisma'

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

        // Look up the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
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
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

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
    /**
     * jwt callback — called whenever a JWT is created or updated.
     * On first sign-in, `user` is populated; on subsequent calls only `token`.
     * We persist `id` and `role` into the token so the session callback can
     * forward them to the client-side session object.
     */
    async jwt({ token, user }) {
      if (user) {
        // `user` is only present on the initial sign-in
        token.id = user.id
        token.role = user.role
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
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
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
  return _getServerSession(...(args as Parameters<typeof _getServerSession>), authOptions)
}
