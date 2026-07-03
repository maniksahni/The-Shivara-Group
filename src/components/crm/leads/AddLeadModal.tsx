"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  trigger: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEditMode = !!lead;

  useEffect(() => {
    if (!isEditMode && searchParams.get("addLead") === "1") {
      setIsOpen(true);
    }
  }, [isEditMode, searchParams]);

  // Initialize Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
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
      propertyType: data.propertyType || undefined,
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
      if (searchParams.get("addLead") === "1") {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("addLead");
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process lead. Please check inputs.");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    if (!isEditMode) reset();
    if (searchParams.get("addLead") === "1") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("addLead");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  };

  return (
    <>
      <span onClickCapture={handleOpen}>{trigger}</span>

      <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#081120]/75 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Slide-over Container */}
          <motion.div
            initial={{ y: typeof window !== "undefined" && window.innerWidth < 768 ? 720 : 0, x: typeof window !== "undefined" && window.innerWidth >= 768 ? 520 : 0, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ y: typeof window !== "undefined" && window.innerWidth < 768 ? 720 : 0, x: typeof window !== "undefined" && window.innerWidth >= 768 ? 520 : 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-[#0E1726]/98 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl md:max-w-2xl md:rounded-l-[28px] md:border-l md:border-white/10"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-4 md:px-6 md:py-5">
              <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F4B400]">Lead workspace</p>
              <h3 className="mt-1 text-xl font-black text-white">
                {isEditMode ? "Edit Lead Information" : "Create New Lead"}
              </h3>
              </div>
              <button
                onClick={handleClose}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow space-y-6 overflow-y-auto px-4 py-5 pb-28 md:p-6">
              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Section */}
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F4B400]">Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Manik Sahni"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      {...register("phone")}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Requirement Section */}
              <div className="border-t border-white/10 pt-6">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F4B400]">Requirements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Budget</label>
                    <input
                      type="text"
                      {...register("budget")}
                      placeholder="e.g. ₹45 Lakh"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Property Type</label>
                    <select
                      {...register("propertyType")}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="border-t border-white/10 pt-6">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F4B400]">CRM Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Lead Source *</label>
                    <select
                      {...register("source")}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    >
                      <option value={LeadStatus.NEW}>New</option>
                      <option value={LeadStatus.ASSIGNED}>Assigned</option>
                      <option value={LeadStatus.CONTACTED}>Contacted</option>
                      <option value={LeadStatus.FOLLOW_UP}>Follow Up</option>
                      <option value={LeadStatus.MEETING_SCHEDULED}>Meeting Scheduled</option>
                      <option value={LeadStatus.SITE_VISIT_SCHEDULED}>Site Visit Scheduled</option>
                      <option value={LeadStatus.SITE_VISIT}>Site Visit</option>
                      <option value={LeadStatus.NEGOTIATION}>Negotiation</option>
                      <option value={LeadStatus.BOOKING}>Booking</option>
                      <option value={LeadStatus.CLOSED}>Closed</option>
                      <option value={LeadStatus.LOST}>Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Priority *</label>
                    <select
                      {...register("priority")}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition focus:border-[#F4B400]/60"
                    />
                    {errors.followUpDate && (
                      <p className="text-red-400 text-[10px] mt-1">{errors.followUpDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions inside Modal Form */}
              <div className="sticky bottom-0 -mx-4 flex flex-shrink-0 justify-end gap-3 border-t border-white/10 bg-[#0E1726]/95 px-4 py-4 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="min-h-11 flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white md:flex-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#F4B400] px-5 py-3 text-sm font-black text-[#081120] transition hover:bg-[#f59e0b] disabled:opacity-50 md:flex-none"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Lead"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
