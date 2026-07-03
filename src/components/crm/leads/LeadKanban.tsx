"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LeadStatus, Priority, LeadSource } from "@prisma/client";
import { updateLeadStatus } from "@/features/leads/actions";
import { cn, getLeadSourceColor, formatDate, getPriorityColor } from "@/lib/utils";
import { User, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string | null;
  budget: string | null;
  preferredLocation: string | null;
  propertyType: any | null;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  followUpDate: Date | string | null;
  assignedTo: {
    name: string;
  } | null;
  _count?: {
    notes: number;
  };
}

interface Agent {
  id: string;
  name: string;
}

interface KanbanProps {
  leads: Lead[];
  agents: Agent[];
  currentUserId: string;
}

const COLUMNS: { key: LeadStatus; label: string; color: string }[] = [
  { key: LeadStatus.NEW, label: "New", color: "border-t-blue-500 bg-blue-500/5 text-blue-400" },
  { key: LeadStatus.ASSIGNED, label: "Assigned", color: "border-t-indigo-500 bg-indigo-500/5 text-indigo-400" },
  { key: LeadStatus.CONTACTED, label: "Contacted", color: "border-t-purple-500 bg-purple-500/5 text-purple-400" },
  { key: LeadStatus.FOLLOW_UP, label: "Follow Up", color: "border-t-amber-500 bg-amber-500/5 text-amber-400" },
  { key: LeadStatus.MEETING_SCHEDULED, label: "Meeting", color: "border-t-yellow-500 bg-yellow-500/5 text-yellow-400" },
  { key: LeadStatus.SITE_VISIT_SCHEDULED, label: "Visit Scheduled", color: "border-t-cyan-500 bg-cyan-500/5 text-cyan-400" },
  { key: LeadStatus.SITE_VISIT, label: "Site Visit", color: "border-t-teal-500 bg-teal-500/5 text-teal-400" },
  { key: LeadStatus.NEGOTIATION, label: "Negotiating", color: "border-t-orange-500 bg-orange-500/5 text-orange-400" },
  { key: LeadStatus.BOOKING, label: "Booking", color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-400" },
  { key: LeadStatus.CLOSED, label: "Closed", color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-400" },
  { key: LeadStatus.LOST, label: "Lost", color: "border-t-slate-500 bg-slate-500/5 text-slate-400" },
];

export default function LeadKanban({ leads, agents, currentUserId }: KanbanProps) {
  const { toast } = useToast();
  const [boardLeads, setBoardLeads] = useState<Lead[]>(leads);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Sync leads if prop changes
  React.useEffect(() => {
    setBoardLeads(leads);
  }, [leads]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setIsDragging(id);
  };

  const handleDragEnd = () => {
    setIsDragging(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    const lead = boardLeads.find((l) => l.id === id);
    if (!lead || lead.status === targetStatus) return;

    // Optimistically update status
    const previousLeads = [...boardLeads];
    setBoardLeads(
      boardLeads.map((l) => (l.id === id ? { ...l, status: targetStatus } : l))
    );

    // Call server action
    try {
      const res = await updateLeadStatus(id, targetStatus, currentUserId);
      if (!res.success) {
        throw new Error(res.error || "Update failed");
      }
      toast({
        title: "Lead Status Updated",
        description: `Successfully moved "${lead.name}" to ${targetStatus.replace(/_/g, " ")}.`,
        type: "success",
      });
    } catch (err: any) {
      // Revert if error
      setBoardLeads(previousLeads);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update lead status.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 select-none h-[calc(100vh-220px)] min-h-[500px]">
      {COLUMNS.map((col) => {
        const columnLeads = boardLeads.filter((l) => l.status === col.key);

        return (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            className="flex-shrink-0 w-80 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden"
          >
            {/* Column Header */}
            <div className={cn("px-4 py-3 border-t-2 border-b border-slate-800 flex items-center justify-between", col.color)}>
              <h3 className="text-xs font-bold uppercase tracking-wider">{col.label}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {columnLeads.length}
              </span>
            </div>

            {/* Column Body - Cards List */}
            <div className="flex-grow p-3 space-y-3 overflow-y-auto">
              {columnLeads.length === 0 ? (
                <div className="h-20 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-[10px] uppercase font-semibold">
                  Drop Leads Here
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const isFollowUpOverdue =
                    lead.followUpDate && new Date(lead.followUpDate) < new Date();
                  const priorityColor = getPriorityColor(lead.priority);

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "bg-slate-800 border border-slate-700/60 rounded-xl p-4 cursor-grab active:cursor-grabbing",
                        "hover:border-slate-500 transition-colors shadow-sm relative group",
                        isDragging === lead.id ? "opacity-40" : "opacity-100"
                      )}
                    >
                      {/* Priority strip on left */}
                      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r ${
                        lead.priority === "HIGH" ? "bg-red-500" :
                        lead.priority === "MEDIUM" ? "bg-amber-500" : "bg-green-500"
                      }`} />

                      <div className="space-y-3 pl-1.5">
                        {/* Name + Link */}
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/crm/leads/${lead.id}`}
                            className="font-semibold text-white hover:text-[#C9A84C] hover:underline text-sm truncate block"
                          >
                            {lead.name}
                          </Link>
                          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", getLeadSourceColor(lead.source))}>
                            {lead.source}
                          </span>
                        </div>

                        {/* Location / Budget details */}
                        {(lead.preferredLocation || lead.budget) && (
                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            {lead.preferredLocation && (
                              <p className="truncate">📍 {lead.preferredLocation}</p>
                            )}
                            {lead.budget && (
                              <p className="font-semibold text-white/95">💰 {lead.budget}</p>
                            )}
                          </div>
                        )}

                        {/* Follow up date */}
                        {lead.followUpDate && (
                          <div className={cn(
                            "flex items-center gap-1 text-[10px] p-1.5 rounded border",
                            isFollowUpOverdue
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          )}>
                            {isFollowUpOverdue ? (
                              <AlertCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                            )}
                            <span>Follow up: {formatDate(lead.followUpDate)}</span>
                          </div>
                        )}

                        {/* Card footer details */}
                        <div className="flex items-center justify-between border-t border-slate-700/50 pt-2 text-[10px] text-slate-500">
                          {/* Notes Count */}
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{lead._count?.notes || 0}</span>
                          </div>

                          {/* Agent name */}
                          <div className="flex items-center gap-1 max-w-[120px]">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate italic">
                              {lead.assignedTo?.name || "Unassigned"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
