import { redirect } from "next/navigation";
import { BadgeCheck, Mail, Phone, Plus, ShieldAlert, TrendingUp, Users } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getAgentStats } from "@/features/agents/actions";
import AddAgentModal from "@/components/crm/agents/AddAgentModal";
import { CRMEmptyState, CRMHero, CRMPanel, CRMMiniStat } from "@/components/crm/CRMPrimitives";
import { getInitials } from "@/lib/utils";

export const revalidate = 0;

export default async function AgentsPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/crm/login");
  if (session.user.role !== "ADMIN") redirect("/crm/dashboard");

  const statsRes = await getAgentStats();
  const agents = statsRes.success && statsRes.data ? statsRes.data : [];

  const highestLeadCount = agents.length > 0 ? Math.max(...agents.map((agent) => agent.totalLeads)) : 0;
  const totalClosed = agents.reduce((sum, agent) => sum + agent.closedLeads, 0);

  return (
    <div className="space-y-6 text-white">
      <CRMHero
        eyebrow="Team command center"
        title="Sales agents, workload, and conversion quality."
        description="Manage agent accounts and understand performance without leaving the premium CRM workspace."
        actions={
          <AddAgentModal
            trigger={
              <button className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#F4B400] px-4 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition hover:-translate-y-0.5 hover:bg-[#f59e0b]">
                <Plus className="h-4 w-4" />
                Add Agent
              </button>
            }
          />
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <CRMMiniStat label="Total Agents" value={agents.length} tone="gold" />
        <CRMMiniStat label="Highest Lead Count" value={highestLeadCount} tone="blue" />
        <CRMMiniStat label="Closed Deals" value={totalClosed} tone="green" />
      </div>

      <CRMPanel title="Agent Leaderboard" eyebrow="Performance studio">
        {agents.length === 0 ? (
          <CRMEmptyState
            icon={<Users className="h-7 w-7" />}
            title="No sales agents registered"
            description="Create an agent profile to assign leads from website enquiries, WhatsApp, Instagram, referrals, and direct calls."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent, index) => (
              <article
                key={agent.id}
                className="group rounded-[24px] border border-white/10 bg-[#0E1726]/75 p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#F4B400]/35 hover:shadow-[#F4B400]/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4B400]/15 text-sm font-black text-[#F4B400] ring-1 ring-[#F4B400]/30">
                      {getInitials(agent.name || "Sales Agent")}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-black text-white">{agent.name || "Sales Agent"}</h2>
                      <p className="mt-1 text-xs font-semibold text-slate-500">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#F4B400]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#F4B400] ring-1 ring-[#F4B400]/20">
                    Active
                  </span>
                </div>

                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-400">
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  {agent.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <AgentMetric label="Leads" value={agent.totalLeads} icon={<Users className="h-4 w-4" />} />
                  <AgentMetric label="Visits" value={agent.siteVisitsScheduled} icon={<BadgeCheck className="h-4 w-4" />} />
                  <AgentMetric label="Closed" value={agent.closedLeads} icon={<TrendingUp className="h-4 w-4" />} />
                </div>

                <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-[0.14em] text-slate-500">Conversion</span>
                    <span className="font-black text-emerald-300">{agent.conversionRate}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F4B400] to-emerald-400"
                      style={{ width: `${Math.min(100, agent.conversionRate)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <AddAgentModal
                    agent={agent}
                    trigger={
                      <button className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-xs font-black text-slate-200 transition hover:bg-white/10 hover:text-white">
                        Edit Info
                      </button>
                    }
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        {!statsRes.success && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            <ShieldAlert className="h-4 w-4" />
            {statsRes.error}
          </div>
        )}
      </CRMPanel>
    </div>
  );
}

function AgentMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] text-[#F4B400]">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
