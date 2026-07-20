import type { Prisma } from '@prisma/client'

export const PRIMARY_SALES_AGENT_NAMES = ['Shivam Sahni', 'Shivam Sahani']

const configuredEmails = (process.env.CRM_SALES_AGENT_EMAILS ?? process.env.CRM_SALES_AGENT_EMAIL ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export const PRIMARY_SALES_AGENT_EMAILS = configuredEmails

export const PRIMARY_SALES_AGENT_DISPLAY_NAME = 'Shivam Sahni'

export function isPrimarySalesAgent(user: {
  name?: string | null
  email?: string | null
}) {
  const name = user.name?.trim().toLowerCase() ?? ''
  const email = user.email?.trim().toLowerCase() ?? ''

  return (
    PRIMARY_SALES_AGENT_NAMES.some((allowedName) => allowedName.toLowerCase() === name) ||
    name.includes('shivam') ||
    (PRIMARY_SALES_AGENT_EMAILS.length > 0 && PRIMARY_SALES_AGENT_EMAILS.includes(email))
  )
}

export function getPrimarySalesAgentWhere(): Prisma.UserWhereInput {
  return {
    OR: [
      ...PRIMARY_SALES_AGENT_NAMES.map((name) => ({ name: { equals: name } })),
      { name: { contains: 'Shivam' } },
      ...(PRIMARY_SALES_AGENT_EMAILS.length > 0
        ? [{ email: { in: PRIMARY_SALES_AGENT_EMAILS } }]
        : []),
    ],
  }
}
