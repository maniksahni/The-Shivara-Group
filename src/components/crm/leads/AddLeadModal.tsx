"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadInput } from "@/lib/validations";
import { LeadStatus, Priority, LeadSource, PropertyType } from "@prisma/client";
import { createLead, updateLead } from "@/features/leads/actions";
import { X, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface AddLeadModalProps {
  agents: Agent[];
  trigger: React.ReactElement;
  lead?: {
    id: string;
    name: string;
    phone: string;
    whatsappNumber: string | null;
    email: string | null;
    budget: string | null;
    preferredLocation: string | null;
    propertyType: PropertyType | null;
    source: LeadSource;
    status: LeadStatus;
    priority: Priority;
    assignedToId: string | null;
    followUpDate: Date | string | null;
  };
}

export default function AddLeadModal({ agents, trigger, lead }: AddLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const isEditMode = !!lead;

  // Initialize Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name || "",
      phone: lead?.phone || "",
      whatsappNumber: lead?.whatsappNumber || "",
      email: lead?.email || "",
      budget: lead?.budget || "",
      preferredLocation: lead?.preferredLocation || "",
      propertyType: lead?.propertyType || undefined,
      source: lead?.source || LeadSource.WEBSITE,
      status: lead?.status || LeadStatus.NEW,
      priority: lead?.priority || Priority.MEDIUM,
      assignedToId: lead?.assignedToId || "",
      followUpDate: lead?.followUpDate
        ? new Date(lead.followUpDate).toISOString().slice(0, 16)
        : "",
    },
  });

  const onSubmit = async (data: LeadInput) => {
    setError("");
    const formattedData = {
      ...data,
      whatsappNumber: data.whatsappNumber || undefined,
      email: data.email || undefined,
      budget: data.budget || undefined,
      preferredLocation: data.preferredLocation || undefined,
      assignedToId: data.assignedToId || undefined,
      followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : undefined,
    };

    try {
      let result;
      if (isEditMode && lead) {
        result = await updateLead(lead.id, formattedData);
      } else {
        result = await createLead(formattedData);
      }

      if (!result.success) {
        throw new Error(result.error || "Operation failed");
      }

      toast({
        title: isEditMode ? "Lead Updated" : "Lead Created",
        description: `Successfully ${isEditMode ? "saved updates for" : "created new lead"} "${data.name}".`,
        type: "success",
      });

      setIsOpen(false);
      if (!isEditMode) reset();
      // Reload page to reflect changes
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to process lead. Please check inputs.");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    if (!isEditMode) reset();
  };

  return (
    <>
      {React.cloneElement(trigger, { onClick: handleOpen })}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F1B2D]/70 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fade-in-scale">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-base text-white">
                {isEditMode ? "Edit Lead Information" : "Create New Lead"}
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] mb-4">Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Manik Sahni"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      {...register("phone")}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      {...register("whatsappNumber")}
                      placeholder="Same or alternate number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Requirement Section */}
              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] mb-4">Requirements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Budget</label>
                    <input
                      type="text"
                      {...register("budget")}
                      placeholder="e.g. ₹45 Lakh"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Property Type</label>
                    <select
                      {...register("propertyType")}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="">Select Property Type</option>
                      <option value={PropertyType.APARTMENT}>Apartment</option>
                      <option value={PropertyType.VILLA}>Villa</option>
                      <option value={PropertyType.PLOT}>Plot</option>
                      <option value={PropertyType.COMMERCIAL}>Commercial</option>
                      <option value={PropertyType.FARMHOUSE}>Farmhouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Preferred Location</label>
                    <input
                      type="text"
                      {...register("preferredLocation")}
                      placeholder="e.g. Civil Lines, Bareilly"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] mb-4">CRM Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Lead Source *</label>
                    <select
                      {...register("source")}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value={LeadSource.WEBSITE}>Website</option>
                      <option value={LeadSource.INSTAGRAM}>Instagram</option>
                      <option value={LeadSource.WHATSAPP}>WhatsApp</option>
                      <option value={LeadSource.FACEBOOK}>Facebook</option>
                      <option value={LeadSource.GOOGLE}>Google Ads</option>
                      <option value={LeadSource.REFERRAL}>Referral</option>
                      <option value={LeadSource.OTHER}>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Pipeline Status *</label>
                    <select
                      {...register("status")}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value={LeadStatus.NEW}>New</option>
                      <option value={LeadStatus.CONTACTED}>Contacted</option>
                      <option value={LeadStatus.FOLLOW_UP}>Follow Up</option>
                      <option value={LeadStatus.SITE_VISIT_SCHEDULED}>Site Visit Scheduled</option>
                      <option value={LeadStatus.NEGOTIATION}>Negotiation</option>
                      <option value={LeadStatus.CLOSED}>Closed</option>
                      <option value={LeadStatus.LOST}>Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Priority *</label>
                    <select
                      {...register("priority")}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value={Priority.HIGH}>High</option>
                      <option value={Priority.MEDIUM}>Medium</option>
                      <option value={Priority.LOW}>Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Assign Sales Agent</label>
                    <select
                      {...register("assignedToId")}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="">Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({agent.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Follow-up Date & Time</label>
                    <input
                      type="datetime-local"
                      {...register("followUpDate")}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                    {errors.followUpDate && (
                      <p className="text-red-400 text-[10px] mt-1">{errors.followUpDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions inside Modal Form */}
              <div className="border-t border-slate-800 pt-6 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#C9A84C] text-slate-900 text-xs font-bold rounded-lg hover:bg-[#b8963e] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
