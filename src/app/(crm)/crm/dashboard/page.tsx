import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { Users, UserCheck, Calendar, CheckSquare, Building2, TrendingUp } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getDailyOperations, getDashboardStats } from "@/features/dashboard/actions";
import StatsCard from "@/components/crm/dashboard/StatsCard";
import Charts from "@/components/crm/dashboard/Charts";
import ActivityFeed from "@/components/crm/dashboard/ActivityFeed";
import DailyOperationsPanel from "@/components/crm/dashboard/DailyOperationsPanel";
import prisma from "@/lib/prisma";
import { getLeadStatusColor, getLeadSourceColor } from "@/lib/utils";
import Link from "next/link";

export const revalidate = 0; // Don't cache dashboard stats

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
  try {
    activePropertiesCount = await prisma.property.count({
      where: { isActive: true },
    });
  } catch (err) {
    console.error("Failed to count properties", err);
  }

  // Fetch today's follow-up leads
  let todaysFollowUps: Array<Awaited<ReturnType<typeof prisma.lead.findMany>>[number] & {
    assignedTo: { name: string } | null
  }> = [];
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8 font-[family-name:var(--font-inter)]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-slate-400 text-xs mt-1">
            Welcome back, <span className="text-[#C9A84C] font-semibold">{session.user.name}</span> ({session.user.role})
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
          Local Time: {new Date().toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Charts (60% / 7 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b border-slate-800 pb-3">Leads Overview & Pipeline</h2>
          <Suspense fallback={<div className="h-72 w-full skeleton" />}>
            <Charts
              sourceData={stats.leadsBySource}
              statusData={stats.leadsByStatus}
            />
          </Suspense>
        </div>

        {/* Right: Activity Feed (40% / 5 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold border-b border-slate-800 pb-3 mb-4">Recent Activities</h2>
          <div className="flex-grow overflow-y-auto max-h-[360px]">
            <Suspense fallback={<div className="space-y-4"><div className="h-10 skeleton w-full" /><div className="h-10 skeleton w-full" /></div>}>
              <ActivityFeed activities={stats.recentActivities} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Today's Followups Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
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
          <div className="overflow-x-auto">
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
        )}
      </div>
    </div>
  );
}
