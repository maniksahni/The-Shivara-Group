import Link from 'next/link'
import type React from 'react'
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Phone,
  TrendingUp,
  UserCheck,
} from 'lucide-react'

import { StatusBadge, PriorityBadge } from '@/components/ui/badge'
import { formatDate, formatDateTime } from '@/lib/utils'
import type {
  AgentWorkloadItem,
  DailyLeadItem,
  DailyOperationsData,
  DailyVisitItem,
} from '@/features/dashboard/actions'

function MiniMetric({
  label,
  value,
  tone = 'slate',
  icon: Icon,
}: {
  label: string
  value: number
  tone?: 'slate' | 'gold' | 'red' | 'green' | 'cyan'
  icon: React.ComponentType<{ className?: string }>
}) {
  const toneClass = {
    slate: 'border-slate-800 bg-slate-900 text-slate-200',
    gold: 'border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
    green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  }[tone]

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</span>
        <Icon className="h-4 w-4 opacity-80" />
      </div>
      <div className="mt-3 text-2xl font-black">{value}</div>
    </div>
  )
}

function LeadList({
  title,
  leads,
  empty,
  alert = false,
}: {
  title: string
  leads: DailyLeadItem[]
  empty: string
  alert?: boolean
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${alert ? 'bg-red-500/10 text-red-300' : 'bg-slate-800 text-slate-300'}`}>
          {leads.length}
        </span>
      </div>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-800 py-8 text-center text-xs text-slate-500">{empty}</p>
      ) : (
        <div className="space-y-3">
          {leads.slice(0, 6).map((lead) => (
            <Link
              key={lead.id}
              href={`/crm/leads/${lead.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition hover:border-[#C9A84C]/50 hover:bg-slate-800/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{lead.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Phone className="h-3 w-3" />
                    {lead.phone}
                  </p>
                </div>
                <PriorityBadge priority={lead.priority as Parameters<typeof PriorityBadge>[0]['priority']} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={lead.status as Parameters<typeof StatusBadge>[0]['status']} />
                <span className="text-[11px] text-slate-500">
                  {lead.followUpDate ? `Follow-up: ${formatDateTime(lead.followUpDate)}` : `Created: ${formatDate(lead.createdAt)}`}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Agent: {lead.assignedTo?.name ?? 'Unassigned'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

function VisitList({
  title,
  visits,
  empty,
  completed = false,
}: {
  title: string
  visits: DailyVisitItem[]
  empty: string
  completed?: boolean
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">{visits.length}</span>
      </div>

      {visits.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-800 py-8 text-center text-xs text-slate-500">{empty}</p>
      ) : (
        <div className="space-y-3">
          {visits.slice(0, 6).map((visit) => (
            <Link
              key={visit.id}
              href={`/crm/leads/${visit.lead.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition hover:border-cyan-400/50 hover:bg-slate-800/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{visit.lead.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {visit.location}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${completed ? 'bg-emerald-500/10 text-emerald-300' : 'bg-cyan-500/10 text-cyan-300'}`}>
                  {visit.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                {completed && visit.completedAt
                  ? `Completed: ${formatDateTime(visit.completedAt)}`
                  : `Scheduled: ${formatDateTime(visit.scheduledAt)}`}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Agent: {visit.lead.assignedTo?.name ?? 'Unassigned'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

function AgentWorkload({ agents }: { agents: AgentWorkloadItem[] }) {
  if (agents.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-bold text-white">Agent Workload & Conversion</h3>
        <Link href="/crm/reports" className="text-xs font-semibold text-[#C9A84C] hover:underline">
          Full reports →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 pr-4">Agent</th>
              <th className="py-3 pr-4">Workload</th>
              <th className="py-3 pr-4">Follow-ups</th>
              <th className="py-3 pr-4">Today Visits</th>
              <th className="py-3 pr-4">Closed</th>
              <th className="py-3 pr-4">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-slate-800/60 last:border-0">
                <td className="py-3 pr-4">
                  <div className="font-semibold text-white">{agent.name}</div>
                  <div className="text-[11px] text-slate-500">{agent.email}</div>
                </td>
                <td className="py-3 pr-4 text-slate-300">{agent.totalLeads} leads</td>
                <td className="py-3 pr-4 text-amber-300">{agent.pendingFollowUps}</td>
                <td className="py-3 pr-4 text-cyan-300">{agent.todayVisits}</td>
                <td className="py-3 pr-4 text-emerald-300">{agent.closedDeals}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-full bg-[#C9A84C]/10 px-2 py-1 font-bold text-[#C9A84C]">
                    {agent.conversionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function DailyOperationsPanel({ data, isAdmin }: { data: DailyOperationsData; isAdmin: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A84C]">Daily command center</p>
          <h2 className="mt-1 text-xl font-bold text-white">Lead Assignment & Visit Management</h2>
          <p className="mt-1 text-sm text-slate-400">
            Today&apos;s workload, reminders, calendar, completed visits, and agent performance in one place.
          </p>
        </div>
        <Link
          href="/crm/leads"
          className="inline-flex items-center justify-center rounded-lg border border-[#C9A84C]/40 px-4 py-2 text-xs font-bold text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-slate-950"
        >
          Manage Leads
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniMetric label="Today's Leads" value={data.todayLeads.length} icon={ClipboardList} tone="gold" />
        <MiniMetric label="Today's Visits" value={data.todaySiteVisits.length} icon={CalendarClock} tone="cyan" />
        <MiniMetric label="Pending Follow-ups" value={data.pendingFollowUps.length} icon={UserCheck} tone="slate" />
        <MiniMetric label="Overdue Tasks" value={data.overdueLeads.length} icon={AlertTriangle} tone={data.overdueLeads.length ? 'red' : 'green'} />
      </div>

      {data.overdueLeads.length > 0 && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-300" />
            <div>
              <p className="font-bold">Overdue work needs attention today.</p>
              <p className="mt-1 text-xs text-red-200/80">
                Follow-ups or scheduled visits are past due. Open each lead and update status, notes, or visit outcome.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <LeadList title="New Assigned Leads" leads={data.newAssignedLeads} empty="No newly assigned leads pending." />
        <LeadList title="Today's Follow-ups" leads={data.pendingFollowUps} empty="No follow-ups due today." />
        <LeadList title="Missed Follow-ups" leads={data.missedFollowUps} empty="No missed follow-ups." alert />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <VisitList title="Today's Site Visits / Meetings" visits={data.todaySiteVisits} empty="No visits scheduled today." />
        <VisitList title="Tomorrow's Meetings" visits={data.tomorrowMeetings} empty="No meetings scheduled tomorrow." />
        <VisitList title="Completed Site Visits" visits={data.completedVisits} empty="No completed visits yet." completed />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <VisitList title="Upcoming 30-Day Visit Calendar" visits={data.upcomingSiteVisits} empty="No upcoming site visits scheduled." />
        </div>
        <LeadList title="Today's New Leads" leads={data.todayLeads} empty="No new leads received today." />
      </div>

      {isAdmin && <AgentWorkload agents={data.agentWorkload} />}

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-400 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          Completed meetings are pulled from completed site visits.
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
          Conversion = closed deals ÷ assigned leads.
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-cyan-300" />
          Calendar uses scheduled site visit dates.
        </div>
      </div>
    </div>
  )
}
