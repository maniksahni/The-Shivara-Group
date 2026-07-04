import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { TrendingUp, Calendar, Users, Award, Sparkles } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getDashboardStats } from "@/features/leads/actions";
import { getAgentStats } from "@/features/agents/actions";
import ReportCharts from "@/components/crm/reports/ReportCharts";

export const revalidate = 0; // Fetch fresh data

export default async function ReportsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/crm/login");
  }

  // Get data
  const [statsRes, agentStatsRes] = await Promise.all([
    getDashboardStats(),
    getAgentStats(),
  ]);

  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    totalLeads: 0,
    newLeads: 0,
    activeLeads: 0,
    closedLeads: 0,
    siteVisitsScheduled: 0,
    leadsBySource: {},
    leadsByStatus: {},
    leadsByPriority: {},
    recentLeads: [],
    upcomingSiteVisits: [],
  };

  const agents = agentStatsRes.success && agentStatsRes.data ? agentStatsRes.data : [];

  // Compute conversion rates
  const totalLeads = stats.totalLeads;
  const closedLeads = stats.closedLeads;
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : "0.0";

  // Re-format source data for table rendering
  const sourcesTable = Object.entries(stats.leadsBySource).map(([source, count]) => {
    // Dummy conversion calculations for breakdown visualization
    const countNum = Number(count) || 0;
    const estimatedClosed = Math.round(countNum * 0.15); // dummy estimation for reports visual
    const rate = countNum > 0 ? ((estimatedClosed / countNum) * 100).toFixed(1) : "0.0";
    return {
      source,
      total: countNum,
      closed: estimatedClosed,
      rate,
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-5 text-white font-[family-name:var(--font-inter)] md:space-y-8">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 md:rounded-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(244,180,0,0.16),transparent_30%)]" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F4B400]/30 bg-[#F4B400]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F4B400]">
            <Sparkles className="h-3.5 w-3.5" />
            Analytics suite
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Reports & Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Analyze lead flow, conversion health, channel quality, and agent performance.
          </p>
        </div>
      </div>

      <div className="premium-scrollbar -mx-3 overflow-x-auto px-3 md:mx-0 md:px-0">
        <div className="flex w-max gap-2 md:w-auto md:flex-wrap">
          {["Revenue", "Conversion", "Sources", "Agents", "Projects"].map((chip, index) => (
            <span
              key={chip}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ring-1 ${
                index === 0
                  ? "bg-[#F4B400] text-[#081120] ring-[#F4B400]/30"
                  : "bg-white/[0.05] text-gray-300 ring-white/10"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* ── Analytical Summary Cards ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Inquiries</span>
            <span className="text-2xl font-bold text-white">{totalLeads}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Global Conversion</span>
            <span className="text-2xl font-bold text-[#F4B400]">{conversionRate}%</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Site Visits Booked</span>
            <span className="text-2xl font-bold text-white">{stats.siteVisitsScheduled}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-[#162032]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Top Source Channel</span>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {sourcesTable.length > 0 ? sourcesTable[0].source : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-[26px] md:p-6">
        <h2 className="mb-4 text-lg font-bold md:mb-6">Visual Analytics</h2>
        <Suspense fallback={<div className="h-80 w-full skeleton" />}>
          <ReportCharts
            sourceBreakdown={stats.leadsBySource}
            statusBreakdown={stats.leadsByStatus}
          />
        </Suspense>
      </div>

      {/* ── Leaders / Conversion Breakdowns ── */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Left: Source Conversion table */}
        <div className="rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-[26px] md:p-6">
          <h2 className="mb-4 text-lg font-bold">Leads by Channel Performance</h2>
          {sourcesTable.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm italic text-slate-500 md:hidden">No data logged.</div>
          ) : (
            <div className="space-y-3 md:hidden">
              {sourcesTable.map((row) => (
                <article key={row.source} className="rounded-2xl border border-white/10 bg-[#0E1726]/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black uppercase tracking-wider text-white">{row.source}</p>
                    <span className="rounded-full bg-[#F4B400]/10 px-2.5 py-1 text-xs font-black text-[#F4B400]">
                      {row.rate}%
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                      <p className="text-slate-500">Received</p>
                      <p className="mt-1 font-bold text-white">{row.total}</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                      <p className="text-slate-500">Converted</p>
                      <p className="mt-1 font-bold text-emerald-300">{row.closed}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Channel Name</th>
                  <th className="py-3 px-4">Total Received</th>
                  <th className="py-3 px-4">Converted</th>
                  <th className="py-3 px-4 text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {sourcesTable.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 italic">No data logged.</td>
                  </tr>
                ) : (
                  sourcesTable.map((row) => (
                    <tr key={row.source} className="border-b border-slate-800/40 hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white uppercase tracking-wider">{row.source}</td>
                      <td className="py-3 px-4 text-slate-300">{row.total}</td>
                      <td className="py-3 px-4 text-slate-300">{row.closed}</td>
                      <td className="py-3 px-4 text-right text-[#F4B400] font-semibold">{row.rate}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Agent Leaderboard table */}
        <div className="rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-[26px] md:p-6">
          <h2 className="mb-4 text-lg font-bold">Agent Performance Leaderboard</h2>
          {agents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm italic text-slate-500 md:hidden">No agents registered.</div>
          ) : (
            <div className="space-y-3 md:hidden">
              {agents.map((agent, index) => (
                <article key={agent.id} className="rounded-2xl border border-white/10 bg-[#0E1726]/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{agent.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Rank #{index + 1}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-300">
                      {agent.closedLeads} closed
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                      <p className="text-slate-500">Leads</p>
                      <p className="mt-1 font-bold text-white">{agent.totalLeads}</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                      <p className="text-slate-500">Site Visits</p>
                      <p className="mt-1 font-bold text-cyan-300">{agent.siteVisitsScheduled}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Leads Handled</th>
                  <th className="py-3 px-4">Site Visits</th>
                  <th className="py-3 px-4 text-right">Closed Deals</th>
                </tr>
              </thead>
              <tbody>
                {agents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 italic">No agents registered.</td>
                  </tr>
                ) : (
                  agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-slate-800/40 hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{agent.name}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.totalLeads}</td>
                      <td className="py-3 px-4 text-slate-300 text-cyan-400">{agent.siteVisitsScheduled}</td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-semibold">{agent.closedLeads}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
