"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addNote, scheduleSiteVisit, updateSiteVisit } from "@/features/leads/actions";
import { cn } from "@/lib/utils";
import { MessageSquare, History, MapPin, Send, CheckCircle, Calendar, PlusCircle, XCircle, Save, Phone, MessageCircle, Clock3 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface LeadDetailPanelProps {
  lead: any;
  currentUserId: string;
}

function cleanPhoneNumber(phone: string | null | undefined): string {
  return (phone ?? "").replace(/\D/g, "");
}

function whatsappHref(phone: string | null | undefined): string {
  const digits = cleanPhoneNumber(phone);
  if (!digits) return "#";
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

function telHref(phone: string | null | undefined): string {
  const digits = cleanPhoneNumber(phone);
  return digits ? `tel:${digits}` : "#";
}

export default function LeadDetailPanel({ lead, currentUserId }: LeadDetailPanelProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"notes" | "activity" | "visit">("notes");

  // Notes Form State
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [notes, setNotes] = useState<any[]>(lead.notes || []);

  // Site Visit Form State
  const [visitDate, setVisitDate] = useState("");
  const [visitLocation, setVisitLocation] = useState(lead.preferredLocation || "");
  const [visitNotes, setVisitNotes] = useState("");
  const [visitFeedback, setVisitFeedback] = useState(lead.siteVisit?.customerFeedback || "");
  const [visitOutcomeNotes, setVisitOutcomeNotes] = useState(lead.siteVisit?.notes || "");
  const [scheduling, setScheduling] = useState(false);
  const [updatingVisit, setUpdatingVisit] = useState(false);
  const [siteVisit, setSiteVisit] = useState<any | null>(lead.siteVisit);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setAddingNote(true);
    try {
      const res = await addNote(lead.id, noteContent.trim(), currentUserId);
      if (!res.success) throw new Error(res.error);

      toast({
        title: "Note Added",
        description: "Your note was successfully added to this lead.",
        type: "success",
      });

      // Reload/update local state with the returned note structure
      if (res.data) {
        setNotes([res.data, ...notes]);
      }
      setNoteContent("");
    } catch (err: any) {
      toast({
        title: "Failed to Add Note",
        description: err.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setAddingNote(false);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate || !visitLocation.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify Date, Time and Location.",
        type: "warning",
      });
      return;
    }

    setScheduling(true);
    try {
      const scheduledDate = new Date(visitDate);
      if (Number.isNaN(scheduledDate.getTime())) {
        toast({
          title: "Invalid Date",
          description: "Please select a valid site visit date and time.",
          type: "warning",
        });
        return;
      }

      const scheduledAtIso = scheduledDate.toISOString();
      const res = await scheduleSiteVisit(
        lead.id,
        scheduledAtIso,
        visitLocation.trim(),
        visitNotes.trim() || undefined
      );

      if (!res.success) throw new Error(res.error);

      toast({
        title: "Site Visit Scheduled",
        description: "The site visit has been booked. Lead status updated.",
        type: "success",
      });

      if (res.data) {
        setSiteVisit(res.data);
      }
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Booking Failed",
        description: err.message || "Failed to schedule site visit.",
        type: "error",
      });
    } finally {
      setScheduling(false);
    }
  };

  const handleVisitUpdate = async (status: "SCHEDULED" | "COMPLETED" | "CANCELLED") => {
    if (!siteVisit) return;

    setUpdatingVisit(true);
    try {
      const res = await updateSiteVisit(
        lead.id,
        {
          status,
          notes: visitOutcomeNotes,
          customerFeedback: visitFeedback,
        },
        currentUserId
      );

      if (!res.success) throw new Error(res.error);

      toast({
        title: status === "COMPLETED" ? "Visit Completed" : "Visit Updated",
        description:
          status === "COMPLETED"
            ? "Site visit marked completed and lead moved to Site Visit stage."
            : `Site visit marked ${status.toLowerCase()}.`,
        type: "success",
      });

      router.refresh();
    } catch (err: any) {
      toast({
        title: "Visit Update Failed",
        description: err.message || "Failed to update site visit.",
        type: "error",
      });
    } finally {
      setUpdatingVisit(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
      {/* ── Left Column: Detailed Parameters (5 cols) ── */}
      <div className="rounded-[26px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-6 lg:col-span-4">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F4B400]">Lead profile</p>
            <h2 className="mt-1 text-lg font-black text-white">Client Requirements</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <span className="block text-slate-500 font-semibold mb-1">Price / Budget</span>
            <span className="font-semibold text-white">{lead.budget || "Not Specified"}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <span className="block text-slate-500 font-semibold mb-1">Property Interest</span>
            <span className="font-semibold text-white uppercase tracking-wider text-[10px]">
              {lead.propertyType || "Any"}
            </span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
            <span className="block text-slate-500 font-semibold mb-1">Preferred Location</span>
            <span className="font-semibold text-white">{lead.preferredLocation || "Any Location"}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <span className="block text-slate-500 font-semibold mb-1">WhatsApp Number</span>
            {lead.whatsappNumber ? (
              <a
                href={whatsappHref(lead.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                {lead.whatsappNumber}
              </a>
            ) : (
              <span className="text-slate-500 italic">None Provided</span>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <span className="block text-slate-500 font-semibold mb-1">Email ID</span>
            {lead.email ? (
              <span className="font-semibold text-white truncate block">{lead.email}</span>
            ) : (
              <span className="text-slate-500 italic">None Provided</span>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
            <span className="block text-slate-500 font-semibold mb-1">Follow-up Scheduled</span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
              {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString("en-IN") : "None Scheduled"}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={telHref(lead.phone)}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-500/12 text-sm font-black text-blue-300 ring-1 ring-blue-400/20 transition hover:bg-blue-500/20"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <a
            href={whatsappHref(lead.whatsappNumber || lead.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500/12 text-sm font-black text-emerald-300 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/20"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* ── Right Column: Interactive Tabs Panel (8 cols) ── */}
      <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#162032]/80 shadow-2xl shadow-black/15 backdrop-blur-xl lg:col-span-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#081120]/70 px-2 py-2 sm:px-4">
          <button
            onClick={() => setActiveTab("notes")}
            className={cn(
              "min-h-11 whitespace-nowrap rounded-2xl px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all",
              activeTab === "notes"
                ? "bg-[#F4B400]/10 text-[#F4B400] ring-1 ring-[#F4B400]/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Notes ({notes.length})
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={cn(
              "min-h-11 whitespace-nowrap rounded-2xl px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all",
              activeTab === "activity"
                ? "bg-[#F4B400]/10 text-[#F4B400] ring-1 ring-[#F4B400]/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
            )}
          >
            <History className="w-3.5 h-3.5" />
            Audit Trail
          </button>

          <button
            onClick={() => setActiveTab("visit")}
            className={cn(
              "min-h-11 whitespace-nowrap rounded-2xl px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all",
              activeTab === "visit"
                ? "bg-[#F4B400]/10 text-[#F4B400] ring-1 ring-[#F4B400]/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            Site Visit {siteVisit ? "Scheduled" : ""}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex flex-grow flex-col p-4 sm:p-6">
          {/* TABS 1: Notes Section */}
          {activeTab === "notes" && (
            <div className="space-y-6 flex-grow flex flex-col">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type a new update note (e.g. Spoke to client, requested price list)..."
                  className="min-h-12 flex-grow rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#F4B400]/70 focus:ring-4 focus:ring-[#F4B400]/10"
                />
                <button
                  type="submit"
                  disabled={addingNote || !noteContent.trim()}
                  className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-[#F4B400] px-5 py-3 text-sm font-black text-[#081120] transition-colors hover:bg-[#f59e0b] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-4 overflow-y-auto max-h-[300px] flex-grow pr-1">
                {notes.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-slate-400">
                    <MessageSquare className="mx-auto mb-3 h-8 w-8 text-slate-600" />
                    No notes yet. Log the first call, objection, or follow-up detail above.
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold text-white">{note.author?.name || "Team Member"}</span>
                        <span>{new Date(note.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-body">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TABS 2: Activity Audit Trail */}
          {activeTab === "activity" && (
            <div className="space-y-4 overflow-y-auto max-h-[360px] flex-grow pr-1">
              {(lead.activities || []).length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-slate-400">
                  <History className="mx-auto mb-3 h-8 w-8 text-slate-600" />
                  No activity trail yet. Updates will appear here as the lead moves through the pipeline.
                </div>
              ) : (
                lead.activities.map((act: any) => (
                  <div key={act.id} className="flex gap-3 text-xs border-b border-slate-800/30 pb-3 last:border-0 last:pb-0">
                    <div className="w-2 bg-[#C9A84C] rounded-full self-stretch flex-shrink-0 opacity-40 mt-1" />
                    <div>
                      <p className="text-slate-200">
                        <span className="font-semibold text-white">{act.user?.name || "System"}</span>{" "}
                        {act.action.toLowerCase()}{" "}
                        {act.newValue && (
                          <span className="text-[#C9A84C] font-semibold">
                            &quot;{act.newValue.replace(/_/g, " ")}&quot;
                          </span>
                        )}
                        {act.oldValue && !act.newValue && (
                          <span className="text-slate-400">
                            (was: {act.oldValue})
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {new Date(act.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TABS 3: Site Visit Booking */}
          {activeTab === "visit" && (
            <div className="space-y-6 flex-grow">
              {siteVisit ? (
                // Booked site visit details
                <div className="max-w-2xl space-y-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300">
                      <CheckCircle className="w-4 h-4" />
                      Site Visit {siteVisit.status?.replace(/_/g, " ") || "Scheduled"}
                    </div>
                    {siteVisit.completedAt && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                        Completed {new Date(siteVisit.completedAt).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl border border-white/10 bg-[#081120]/40 p-4">
                      <span className="block text-slate-500 mb-0.5">Scheduled Date & Time</span>
                      <span className="flex items-center gap-1.5 font-semibold text-white">
                        <Clock3 className="h-3.5 w-3.5 text-[#F4B400]" />
                        {new Date(siteVisit.scheduledAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#081120]/40 p-4">
                      <span className="block text-slate-500 mb-0.5">Site Location</span>
                      <span className="font-semibold text-white">{siteVisit.location}</span>
                    </div>
                  </div>

                  {siteVisit.notes && (
                    <div className="text-xs">
                      <span className="block text-slate-500 mb-0.5">Visit Notes</span>
                      <p className="text-slate-300 italic">{siteVisit.notes}</p>
                    </div>
                  )}

                  {siteVisit.customerFeedback && (
                    <div className="text-xs">
                      <span className="block text-slate-500 mb-0.5">Customer Feedback</span>
                      <p className="text-slate-300 italic">{siteVisit.customerFeedback}</p>
                    </div>
                  )}

                  <div className="border-t border-slate-700/60 pt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Visit Notes / Meeting Outcome
                      </label>
                      <textarea
                        rows={3}
                        value={visitOutcomeNotes}
                        onChange={(e) => setVisitOutcomeNotes(e.target.value)}
                        placeholder="Add visit outcome, next steps, objections, documents requested..."
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Customer Feedback
                      </label>
                      <textarea
                        rows={3}
                        value={visitFeedback}
                        onChange={(e) => setVisitFeedback(e.target.value)}
                        placeholder="Customer liked/disliked, budget feedback, booking probability..."
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/70"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        disabled={updatingVisit}
                        onClick={() => handleVisitUpdate("SCHEDULED")}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Notes
                      </button>
                      <button
                        type="button"
                        disabled={updatingVisit}
                        onClick={() => handleVisitUpdate("COMPLETED")}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Completed
                      </button>
                      <button
                        type="button"
                        disabled={updatingVisit}
                        onClick={() => handleVisitUpdate("CANCELLED")}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-red-500/40 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Visit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Booking Form
                <form onSubmit={handleScheduleVisit} className="max-w-xl space-y-4">
                  <div className="flex items-start gap-2 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-xs leading-5 text-cyan-300">
                    <PlusCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Booking a site visit will automatically advance this lead to <strong>SITE_VISIT_SCHEDULED</strong> status on the pipeline board.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Visit Date & Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/70"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Location / Site Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visitLocation}
                        onChange={(e) => setVisitLocation(e.target.value)}
                        placeholder="e.g. Green Park Colony, Civil Lines"
                        className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Coordinator Instructions (Driver, meeting point etc.)
                    </label>
                    <textarea
                      rows={3}
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      placeholder="e.g. Agent Amit Kumar to pick client from Civil Lines office..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/70"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={scheduling}
                    className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-[#F4B400] px-5 py-3 text-sm font-black text-[#081120] transition-colors hover:bg-[#f59e0b] disabled:opacity-50 sm:w-auto"
                  >
                    <Calendar className="w-4 h-4" />
                    {scheduling ? "Booking..." : "Schedule Site Visit"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
