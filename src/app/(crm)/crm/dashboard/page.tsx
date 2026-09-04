import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { Users, UserCheck, Calendar, CheckSquare, Building2, TrendingUp, DollarSign, Sparkles, Phone, MessageCircle, PlusCircle, Flame, ClipboardList } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getDailyOperations, getDashboardStats } from "@/features/dashboard/actions";
import StatsCard from "@/components/crm/dashboard/StatsCard";
import Charts from "@/components/crm/dashboard/Charts";
import ActivityFeed from "@/components/crm/dashboard/ActivityFeed";
import DailyOperationsPanel from "@/components/crm/dashboard/DailyOperationsPanel";
import DashboardHeader from "@/components/crm/dashboard/DashboardHeader";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import { getISTDayRange } from "@/lib/utils";
import Link from "next/link";

function cleanPhoneNumber(phone: string | null | undefined): string {
  return (phone ?? "").replace(/\D/g, "");
}

function telHref(phone: string | null | undefined): string {
  const digits = cleanPhoneNumber(phone);
  return digits ? `tel:${digits}` : "#";
}

function whatsappHref(phone: string | null | undefined): string {
  const digits = cleanPhoneNumber(phone);
  if (!digits) return "#";
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/crm/login");
  }

  // Fetch dashboard stats from our server actions
  const stats = await getDashboardStats().catch(() => ({
    totalLeads: 0,
    todayLeads: 0,
    pendingFollowUps: 0,
    siteVisitsScheduled: 0,
    closedDeals: 0,
    leadsBySource: [],
    leadsByStatus: [],
    recentActivities: [],
  }));

  const dailyOperations = await getDailyOperations().catch(() => ({
    todayLeads: [],
    newAssignedLeads: [],
    pendingFollowUps: [],
    missedFollowUps: [],
    overdueLeads: [],
    todaySiteVisits: [],
    tomorrowMeetings: [],
    upcomingSiteVisits: [],
    completedVisits: [],
    agentWorkload: [],
  }));

  // Fetch number of active properties
  let activePropertiesCount = 0;
  if (isDatabaseConfigured) {
    try {
      activePropertiesCount = await prisma.property.count({
        where: { isActive: true },
      });
    } catch (err) {
      console.error("Failed to count properties", err);
    }
  }

  // Fetch today's follow-up leads (aligned with IST calendar date)
  let todaysFollowUps: Array<Awaited<ReturnType<typeof prisma.lead.findMany>>[number] & {
    assignedTo: { name: string } | null
  }> = [];
  if (isDatabaseConfigured) {
    try {
      const { start: todayStart, end: todayEnd } = getISTDayRange(0);

      todaysFollowUps = await prisma.lead.findMany({
        where: {
          followUpDate: {
            gte: todayStart,
            lte: todayEnd,
          },
          assignedToId: session.user.role === "ADMIN" ? undefined : session.user.id,
        },
        include: {
          assignedTo: {
            select: { name: true },
          },
        },
        orderBy: {
          priority: "desc",
        },
      });
    } catch (err) {
      console.error("Failed to fetch today's followups", err);
    }
  }

  return (
    <div className="space-y-5 text-white font-[family-name:var(--font-inter)] md:space-y-8">
      {/* Live dynamic greeting & real-time date/clock header */}
      <DashboardHeader
        userName={session.user.name ?? "Shivam Sahani"}
        userRole={session.user.role}
      />

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { title: "Quick Add Lead", text: "Capture a fresh enquiry", href: "/crm/leads", icon: PlusCircle, tone: "bg-[#F4B400] text-[#081120]" },
          { title: "Add Property", text: "List fresh inventory", href: "/crm/properties", icon: Building2, tone: "bg-blue-500/15 text-blue-200 ring-1 ring-blue-400/20" },
          { title: "Hot Follow-ups", text: `${stats.pendingFollowUps} due now`, href: "/crm/leads", icon: Flame, tone: "bg-red-500/15 text-red-200 ring-1 ring-red-400/20" },
          { title: "Visit Calendar", text: "Plan today’s movement", href: "/crm/calendar", icon: ClipboardList, tone: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20" },
        ].map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-[22px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl shadow-black/15 transition duration-300 hover:-translate-y-1 hover:border-[#F4B400]/35"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.tone}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-black text-white">{action.title}</h2>
            <p className="mt-1 text-sm text-gray-400">{action.text}</p>
          </Link>
        ))}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          subtitle="All enquiries in CRM"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Today's Leads"
          value={stats.todayLeads}
          subtitle="Received since midnight"
          icon={TrendingUp}
          color="gold"
          trend={{ value: stats.todayLeads, isUp: stats.todayLeads > 0 }}
        />
        <StatsCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          subtitle="Overdue or due today"
          icon={CheckSquare}
          color="amber"
        />
        <StatsCard
          title="Site Visits Scheduled"
          value={stats.siteVisitsScheduled}
          subtitle="Physical site visits planned"
          icon={Calendar}
          color="purple"
        />
        <StatsCard
          title="Closed Deals"
          value={stats.closedDeals}
          subtitle="Successful conversions"
          icon={UserCheck}
          color="emerald"
        />
        <StatsCard
          title="Monthly Revenue"
          value="₹—"
          subtitle="Connect booking values to calculate revenue"
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Active Properties"
          value={activePropertiesCount}
          subtitle="Available on website"
          icon={Building2}
          color="blue"
        />
      </div>

      <DailyOperationsPanel
        data={dailyOperations}
        isAdmin={session.user.role === "ADMIN"}
      />

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
        {/* Left: Charts (60% / 7 cols) */}
        <div className="rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl md:p-6 lg:col-span-8">
          <h2 className="mb-4 text-lg font-bold md:mb-6">Premium Analytics</h2>
          <Suspense fallback={<div className="h-72 w-full skeleton" />}>
            <Charts
              sourceData={stats.leadsBySource}
              statusData={stats.leadsByStatus}
            />
          </Suspense>
        </div>

        {/* Right: Activity Feed (40% / 5 cols) */}
        <div className="flex flex-col rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl md:p-6 lg:col-span-4">
          <h2 className="mb-4 text-lg font-bold">Recent Activities Timeline</h2>
          <div className="flex-grow overflow-y-auto max-h-[360px]">
            <Suspense fallback={<div className="space-y-4"><div className="h-10 skeleton w-full" /><div className="h-10 skeleton w-full" /></div>}>
              <ActivityFeed activities={stats.recentActivities} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Today's Followups Section */}
      <div className="rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold">Today&apos;s Scheduled Follow-ups</h2>
          <Link href="/crm/leads?view=table" className="text-xs text-[#C9A84C] hover:underline font-semibold">
            View All Leads →
          </Link>
        </div>

        {todaysFollowUps.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No follow-ups scheduled for today. Good job!
          </div>
        ) : (
          <>
          <div className="space-y-3 md:hidden">
            {todaysFollowUps.map((lead) => (
              <article
                key={lead.id}
                className="rounded-[22px] border border-white/10 bg-[#0E1726]/80 p-4 shadow-lg shadow-black/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/crm/leads/${lead.id}`} className="block truncate text-base font-black text-white">
                      {lead.name}
                    </Link>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                      <Phone className="h-3.5 w-3.5 text-[#F4B400]" />
                      {lead.phone}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    lead.priority === "HIGH" ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/20" :
                    lead.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20"
                  }`}>
                    {lead.priority}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                  <span className={`rounded-full px-2.5 py-1 uppercase tracking-wider status-${lead.status.toLowerCase()}`}>
                    {lead.status.replace(/_/g, " ")}
                  </span>
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-gray-300 ring-1 ring-white/10">
                    {lead.assignedTo?.name || "Unassigned"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <a
                    href={telHref(lead.phone)}
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-blue-500/12 text-sm font-black text-blue-300 ring-1 ring-blue-400/20"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a
                    href={whatsappHref(lead.whatsappNumber || lead.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-emerald-500/12 text-sm font-black text-emerald-300 ring-1 ring-emerald-400/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WA
                  </a>
                  <Link
                    href={`/crm/leads/${lead.id}`}
                    className="flex min-h-11 items-center justify-center rounded-2xl bg-[#F4B400] text-sm font-black text-[#081120]"
                  >
                    Open
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todaysFollowUps.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <Link href={`/crm/leads/${lead.id}`} className="hover:text-[#C9A84C] hover:underline">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{lead.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider status-${lead.status.toLowerCase()}`}>
                        {lead.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                        lead.priority === "HIGH" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        lead.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {lead.assignedTo?.name || <span className="text-slate-500 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/crm/leads/${lead.id}`}
                        className="inline-block px-3 py-1 bg-slate-800 text-white rounded hover:bg-[#C9A84C] hover:text-slate-900 text-[10px] font-bold uppercase transition-colors"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
