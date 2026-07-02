/**
 * src/app/(crm)/crm/page.tsx
 *
 * Root CRM index page — immediately redirects to the dashboard.
 * This prevents a 404 when the user lands on /crm without a sub-path.
 */

import { redirect } from 'next/navigation'

export default function CRMPage() {
  redirect('/crm/dashboard')
}
