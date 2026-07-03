import { redirect } from 'next/navigation'
import { Mail, ShieldCheck, UserCircle2 } from 'lucide-react'

import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function CRMProfilePage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/crm/login')
  }

  const name = session.user.name ?? 'CRM User'
  const email = session.user.email ?? 'Email not available'
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-5 text-white md:space-y-8">
      <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#162032]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-[28px] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,180,0,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.16),transparent_30%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#F4B400] to-[#f59e0b] text-2xl font-black text-[#081120] shadow-2xl shadow-[#F4B400]/20 ring-1 ring-white/20">
            {initials || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F4B400]">CRM Profile</p>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight md:text-4xl">{name}</h1>
            <p className="mt-2 text-sm text-gray-400">Your field-ready Shivara CRM account overview.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
        <div className="rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/15">
          <UserCircle2 className="h-6 w-6 text-[#F4B400]" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Name</p>
          <p className="mt-1 truncate text-lg font-black text-white">{name}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/15">
          <Mail className="h-6 w-6 text-blue-300" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Email</p>
          <p className="mt-1 truncate text-lg font-black text-white">{email}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/15">
          <ShieldCheck className="h-6 w-6 text-emerald-300" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Role</p>
          <p className="mt-1 text-lg font-black text-white">{session.user.role ?? 'USER'}</p>
        </div>
      </section>
    </div>
  )
}
