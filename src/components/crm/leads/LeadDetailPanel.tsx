"use client";

import React, { useState } from "react";
import { addNote, scheduleSiteVisit } from "@/features/leads/actions";
import { cn, formatDate } from "@/lib/utils";
import { MessageSquare, History, MapPin, Send, Plus, CheckCircle, Calendar, PlusCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface LeadDetailPanelProps {
  lead: any;
  currentUserId: string;
}

export default function LeadDetailPanel({ lead, currentUserId }: LeadDetailPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"notes" | "activity" | "visit">("notes");

  // Notes Form State
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [notes, setNotes] = useState<any[]>(lead.notes || []);

  // Site Visit Form State
  const [visitDate, setVisitDate] = useState("");
  const [visitLocation, setVisitLocation] = useState(lead.preferredLocation || "");
  const [visitNotes, setVisitNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);
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
      const res = await scheduleSiteVisit(
        lead.id,
        new Date(visitDate),
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
      // Reload page to reflect new pipeline status on the header
      window.location.reload();
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ── Left Column: Detailed Parameters (5 cols) ── */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-[#C9A84C] uppercase tracking-wider border-b border-slate-800 pb-3">
          Lead Properties
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 text-xs">
          <div>
            <span className="block text-slate-500 font-semibold mb-1">Price / Budget</span>
            <span className="font-semibold text-white">{lead.budget || "Not Specified"}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-semibold mb-1">Property Interest</span>
            <span className="font-semibold text-white uppercase tracking-wider text-[10px]">
              {lead.propertyType || "Any"}
            </span>
          </div>
          <div className="col-span-2">
            <span className="block text-slate-500 font-semibold mb-1">Preferred Location</span>
            <span className="font-semibold text-white">{lead.preferredLocation || "Any Location"}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-semibold mb-1">WhatsApp Number</span>
            {lead.whatsappNumber ? (
              <a
                href={`https://wa.me/${lead.whatsappNumber}`}
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
          <div>
            <span className="block text-slate-500 font-semibold mb-1">Email ID</span>
            {lead.email ? (
              <span className="font-semibold text-white truncate block">{lead.email}</span>
            ) : (
              <span className="text-slate-500 italic">None Provided</span>
            )}
          </div>
          <div className="col-span-2">
            <span className="block text-slate-500 font-semibold mb-1">Follow-up Scheduled</span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
              {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString("en-IN") : "None Scheduled"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Column: Interactive Tabs Panel (8 cols) ── */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[480px]">
        {/* Navigation Tabs */}
        <div className="bg-slate-950 px-6 py-1 flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab("notes")}
            className={cn(
              "py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all",
              activeTab === "notes"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Notes ({notes.length})
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={cn(
              "py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all",
              activeTab === "activity"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <History className="w-3.5 h-3.5" />
            Audit Trail
          </button>

          <button
            onClick={() => setActiveTab("visit")}
            className={cn(
              "py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all",
              activeTab === "visit"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            Site Visit {siteVisit ? "Scheduled" : ""}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-grow flex flex-col">
          {/* TABS 1: Notes Section */}
          {activeTab === "notes" && (
            <div className="space-y-6 flex-grow flex flex-col">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type a new update note (e.g. Spoke to client, requested price list)..."
                  className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
                <button
                  type="submit"
                  disabled={addingNote || !noteContent.trim()}
                  className="px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-50 text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-4 overflow-y-auto max-h-[300px] flex-grow pr-1">
                {notes.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No notes added yet. Use form above to log calls or conversations.
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
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
                <div className="text-center py-12 text-slate-500 text-xs">
                  No activity trails found for this lead.
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
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-6 space-y-4 max-w-xl">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle className="w-4.5 h-4.5" />
                    Site Visit Scheduled
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-slate-500 mb-0.5">Scheduled Date & Time</span>
                      <span className="font-semibold text-white">
                        {new Date(siteVisit.scheduledAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-0.5">Site Location</span>
                      <span className="font-semibold text-white">{siteVisit.location}</span>
                    </div>
                  </div>

                  {siteVisit.notes && (
                    <div className="text-xs">
                      <span className="block text-slate-500 mb-0.5">Coordinator Notes</span>
                      <p className="text-slate-300 italic">{siteVisit.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Booking Form
                <form onSubmit={handleScheduleVisit} className="space-y-4 max-w-xl">
                  <div className="bg-cyan-500/5 border border-cyan-500/10 p-3.5 rounded-xl text-[11px] text-cyan-400 flex items-start gap-2">
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
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
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
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
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
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={scheduling}
                    className="px-5 py-2.5 bg-[#C9A84C] text-slate-900 rounded-lg text-xs font-bold hover:bg-[#b8963e] flex items-center gap-1.5 transition-colors"
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
