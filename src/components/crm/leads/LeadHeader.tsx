"use client";

import React, { useState } from "react";
import { LeadStatus, Priority } from "@prisma/client";
import { updateLeadStatus, assignLead } from "@/features/leads/actions";
import { cn, getLeadSourceColor } from "@/lib/utils";
import { Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import AddLeadModal from "./AddLeadModal";

interface LeadHeaderProps {
  lead: any;
  agents: { id: string; name: string; email: string }[];
  currentUserId: string;
  isAdmin: boolean;
}

const STATUSES = Object.values(LeadStatus);
const PRIORITIES = Object.values(Priority);

export default function LeadHeader({ lead, agents, currentUserId, isAdmin }: LeadHeaderProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [priority, setPriority] = useState<Priority>(lead.priority);
  const [agentId, setAgentId] = useState<string>(lead.assignedToId || "");

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as LeadStatus;
    setStatus(newStatus);
    try {
      const res = await updateLeadStatus(lead.id, newStatus, currentUserId);
      if (!res.success) throw new Error(res.error);
      toast({
        title: "Status Updated",
        description: `Pipeline stage changed to ${newStatus.replace(/_/g, " ")}.`,
        type: "success",
      });
    } catch (err: any) {
      setStatus(lead.status);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update lead status.",
        type: "error",
      });
    }
  };

  const handleAssignChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAgentId = e.target.value;
    setAgentId(newAgentId);
    try {
      const res = await assignLead(lead.id, newAgentId || null, currentUserId);
      if (!res.success) throw new Error(res.error);
      toast({
        title: "Agent Reassigned",
        description: newAgentId
          ? `Lead assigned to ${agents.find((a) => a.id === newAgentId)?.name}.`
          : "Lead unassigned.",
        type: "success",
      });
    } catch (err: any) {
      setAgentId(lead.assignedToId || "");
      toast({
        title: "Assignment Failed",
        description: err.message || "Failed to reassign agent.",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Name / Source Label */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{lead.name}</h1>
            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", getLeadSourceColor(lead.source))}>
              {lead.source}
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              priority === "HIGH" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
              priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}>
              {priority} Priority
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-400 text-xs">
            <span>Phone: <span className="text-white font-semibold">{lead.phone}</span></span>
            {lead.email && (
              <span>Email: <span className="text-white font-semibold">{lead.email}</span></span>
            )}
            <span>Created: {new Date(lead.createdAt).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* CRM Quick Filters / Assign Block */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Dropdown */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</span>
            <select
              value={status}
              onChange={handleStatusChange}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Dropdown */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Assigned Agent</span>
            <select
              value={agentId}
              onChange={handleAssignChange}
              disabled={!isAdmin}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C] disabled:opacity-60 cursor-pointer"
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Modal Launcher */}
          <div className="flex items-end self-end h-9">
            <AddLeadModal
              agents={agents}
              lead={lead}
              trigger={
                <button className="h-full inline-flex items-center gap-1.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold hover:text-white transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
