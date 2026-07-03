"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadInput } from "@/lib/validations";
import { LeadStatus, Priority, LeadSource, PropertyType } from "@prisma/client";
import { createLead, updateLead } from "@/features/leads/actions";
import { X, Save, AlertCircle, UserRound, Home, Settings2 } from "lucide-react";
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

function toDateTimeLocalValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoOrNull(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export default function AddLeadModal({ agents, trigger, lead }: AddLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEditMode = !!lead;
  const fieldClass =
    "min-h-12 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#F4B400]/70 focus:bg-[#111827] focus:ring-4 focus:ring-[#F4B400]/10";
  const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400";
  const sectionClass =
    "rounded-[22px] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/10";
  const sectionTitleClass =
    "mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#F4B400]";

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
      followUpDate: toDateTimeLocalValue(lead?.followUpDate),
    },
  });

  const onSubmit = async (data: LeadInput) => {
    setError("");
    const formattedData = {
      ...data,
      whatsappNumber: data.whatsappNumber || null,
      email: data.email || null,
      budget: data.budget || null,
      preferredLocation: data.preferredLocation || null,
      propertyType: data.propertyType || null,
      assignedToId: data.assignedToId || null,
      followUpDate: toIsoOrNull(data.followUpDate),
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
      <span className="inline-flex" onClickCapture={handleOpen}>{trigger}</span>

      <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#081120]/55 backdrop-blur-[2px] md:bg-[#081120]/35"
            onClick={handleClose}
          />

          {/* Slide-over Container */}
          <motion.div
            initial={{ y: typeof window !== "undefined" && window.innerWidth < 768 ? 720 : 0, x: typeof window !== "undefined" && window.innerWidth >= 768 ? 440 : 0, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ y: typeof window !== "undefined" && window.innerWidth < 768 ? 720 : 0, x: typeof window !== "undefined" && window.innerWidth >= 768 ? 440 : 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative z-10 flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-[30px] border border-white/10 bg-[#0E1726]/98 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl md:h-full md:max-h-none md:w-[440px] md:max-w-[440px] md:rounded-l-[26px] md:rounded-tr-none md:border-y-0 md:border-r-0 xl:w-[480px] xl:max-w-[480px]"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-white/[0.07] to-transparent px-4 py-4 md:px-5">
              <div className="min-w-0">
                <div className="mb-3 h-1 w-12 rounded-full bg-white/20 md:hidden" />
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F4B400]">Lead workspace</p>
                <h3 className="mt-1 truncate text-xl font-black text-white">
                  {isEditMode ? "Edit Lead Information" : "Create New Lead"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Capture enquiry details, assignment, and the next follow-up in one clean flow.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close lead drawer"
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow space-y-4 overflow-y-auto px-4 py-5 pb-28 md:px-5 md:py-4">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Section */}
              <div className={sectionClass}>
                <h4 className={sectionTitleClass}>
                  <UserRound className="h-4 w-4" />
                  Contact Details
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Manik Sahni"
                      className={fieldClass}
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      inputMode="tel"
                      {...register("phone")}
                      placeholder="10-digit mobile number"
                      className={fieldClass}
                    />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>WhatsApp Number</label>
                    <input
                      type="tel"
                      inputMode="tel"
                      {...register("whatsappNumber")}
                      placeholder="Same or alternate number"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className={fieldClass}
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Requirement Section */}
              <div className={sectionClass}>
                <h4 className={sectionTitleClass}>
                  <Home className="h-4 w-4" />
                  Requirements
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>Budget</label>
                    <input
                      type="text"
                      {...register("budget")}
                      placeholder="e.g. ₹45 Lakh"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Property Type</label>
                    <select
                      {...register("propertyType")}
                      className={fieldClass}
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
                    <label className={labelClass}>Preferred Location</label>
                    <input
                      type="text"
                      {...register("preferredLocation")}
                      placeholder="e.g. Civil Lines, Bareilly"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className={sectionClass}>
                <h4 className={sectionTitleClass}>
                  <Settings2 className="h-4 w-4" />
                  CRM Settings
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>Lead Source *</label>
                    <select
                      {...register("source")}
                      className={fieldClass}
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
                    <label className={labelClass}>Pipeline Status *</label>
                    <select
                      {...register("status")}
                      className={fieldClass}
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
                    <label className={labelClass}>Priority *</label>
                    <select
                      {...register("priority")}
                      className={fieldClass}
                    >
                      <option value={Priority.HIGH}>High</option>
                      <option value={Priority.MEDIUM}>Medium</option>
                      <option value={Priority.LOW}>Low</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>Assign Sales Agent</label>
                    <select
                      {...register("assignedToId")}
                      className={fieldClass}
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
                    <label className={labelClass}>Follow-up Date & Time</label>
                    <input
                      type="datetime-local"
                      {...register("followUpDate")}
                      className={fieldClass}
                    />
                    {errors.followUpDate && (
                      <p className="text-red-400 text-[10px] mt-1">{errors.followUpDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions inside Modal Form */}
              <div className="sticky bottom-0 -mx-4 flex flex-shrink-0 justify-end gap-3 border-t border-white/10 bg-[#0E1726]/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur md:-mx-5 md:px-5">
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
