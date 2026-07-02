/**
 * src/app/api/auth/[...nextauth]/route.ts
 *
 * NextAuth catch-all route handler for the App Router.
 * Delegates all GET and POST requests to the NextAuth core handler,
 * configured via the shared `authOptions` from @/lib/auth.
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
