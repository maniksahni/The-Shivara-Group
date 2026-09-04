"use client";

import { signOut } from "next-auth/react";

/**
 * Robust client-side sign out handler for Shivara CRM.
 *
 * Handles both traditional NextAuth server environments and static
 * export hosting (Firebase Hosting) where NextAuth API endpoints (/api/auth)
 * do not run on a server.
 */
export async function handleCrmSignOut() {
  try {
    if (typeof window !== "undefined") {
      // 1. Clear local admin authentication flag
      localStorage.removeItem("shivara_admin_auth");
      sessionStorage.removeItem("shivara_admin_auth");

      // 2. Clear authentication cookies with immediate expiration across paths
      const cookiesToClear = [
        "shivara_admin_auth",
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
        "next-auth.csrf-token",
        "__Host-next-auth.csrf-token",
        "next-auth.callback-url",
        "__Secure-next-auth.callback-url",
      ];

      for (const name of cookiesToClear) {
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${name}=; path=/crm; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  } catch (err) {
    console.error("[handleCrmSignOut] Error clearing local session", err);
  }

  // 3. Gracefully attempt NextAuth signOut (catches network failure on static export)
  try {
    await signOut({ redirect: false });
  } catch {
    // Expected on static exports without backend /api/auth
  }

  // 4. Force full page redirect to login to clear all in-memory React state
  if (typeof window !== "undefined") {
    window.location.href = "/crm/login";
  }
}
