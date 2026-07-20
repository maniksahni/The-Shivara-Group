"use client";

import React, { useState } from "react";
import { LeadStatus, Priority } from "@prisma/client";
import { updateLeadStatus } from "@/features/leads/actions";
import { cn, getLeadSourceColor } from "@/lib/utils";
import { Edit2, Phone, Mail, CalendarDays } from "lucide-react";
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

export default function LeadHeader({ lead, agents, currentUserId }: LeadHeaderProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [priority, setPriority] = useState<Priority>(lead.priority);

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

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#162032] to-[#0E1726] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Name / Source Label */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4B400]/15 text-base font-black text-[#F4B400] ring-1 ring-[#F4B400]/20">
              {String(lead.name || "L").slice(0, 1).toUpperCase()}
            </div>
            <h1 className="min-w-0 text-2xl font-black tracking-tight text-white sm:text-3xl">{lead.name}</h1>
            <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider", getLeadSourceColor(lead.source))}>
              {lead.source}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              priority === "HIGH" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
              priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}>
              {priority} Priority
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#F4B400]" />
              <span className="text-white font-semibold">{lead.phone}</span>
            </span>
            {lead.email && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span className="max-w-[220px] truncate text-white font-semibold">{lead.email}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
              Created {new Date(lead.createdAt).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CRM Quick Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[360px]">
          {/* Status Dropdown */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</span>
            <select
              value={status}
              onChange={handleStatusChange}
              className="min-h-11 cursor-pointer rounded-2xl border border-white/10 bg-[#111827]/80 px-3 py-2 text-xs font-bold text-white outline-none transition focus:border-[#F4B400]/70"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Modal Launcher */}
          <div className="flex items-end">
            <AddLeadModal
              agents={agents}
              lead={lead}
              trigger={
                <button className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-xs font-black text-slate-200 transition-colors hover:bg-white/10 hover:text-white">
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
