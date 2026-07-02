import React from "react";
import { redirect } from "next/navigation";
import { Plus, Users, ShieldAlert, BadgeCheck, Phone, Mail } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getAgentStats } from "@/features/agents/actions";
import AddAgentModal from "@/components/crm/agents/AddAgentModal";
import { getInitials } from "@/lib/utils";

export const revalidate = 0; // Fetch fresh data

export default async function AgentsPage() {
  // ---- Admin Auth Guard ----
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/crm/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/crm/dashboard");
  }

  // Fetch agents statistics
  const statsRes = await getAgentStats();
  const agents = statsRes.success && statsRes.data ? statsRes.data : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8 font-[family-name:var(--font-inter)]">
      {/* ── Page Header ── */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Agents</h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage agent accounts, allocate leads, and track deal closures.
          </p>
        </div>

        {/* Add Agent Modal Trigger */}
        <AddAgentModal
          trigger={
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2.5 text-xs font-bold text-slate-950 hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Add Agent
            </button>
          }
        />
      </div>

      {/* ── Summary Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Agents</span>
            <span className="text-2xl font-bold text-white">{agents.length}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Highest Lead Count</span>
            <span className="text-2xl font-bold text-white">
              {agents.length > 0 ? Math.max(...agents.map((a) => a.totalLeads)) : 0}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Unassigned Leads</span>
            <span className="text-2xl font-bold text-white">
              {/* Dummy check or could query unassigned in database */}
              CRM Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Agents Cards Grid ── */}
      {agents.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
          <Users className="w-12 h-12 text-[#C9A84C] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-white">No Sales Agents Registered</h3>
          <p className="text-slate-500 text-xs mt-1">
            Create an agent profile to assign leads from public website enquiries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-sm"
            >
              {/* Top Meta info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* Initials Circle */}
                  <div className="w-11 h-11 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/35 text-[#C9A84C] font-bold text-sm flex items-center justify-center">
                    {getInitials(agent.name || "Sales Agent")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                      Sales Partner
                    </span>
                  </div>
                </div>

                {/* Email / Phone */}
                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  {agent.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs">
                  <div>
                    <span className="block text-slate-500 text-[10px] font-semibold mb-0.5">Leads</span>
                    <span className="font-bold text-white">{agent.totalLeads}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px] font-semibold mb-0.5">Visits</span>
                    <span className="font-bold text-cyan-400">{agent.siteVisitsScheduled}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px] font-semibold mb-0.5">Closed</span>
                    <span className="font-bold text-emerald-400">{agent.closedLeads}</span>
                  </div>
                </div>
              </div>

              {/* Edit Modal Action */}
              <div className="mt-6 flex justify-end gap-2">
                <AddAgentModal
                  agent={agent}
                  trigger={
                    <button className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors">
                      Edit Info
                    </button>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
