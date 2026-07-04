"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AlertCircle, Save, UserRound } from "lucide-react";

import CRMDrawer from "@/components/crm/CRMDrawer";
import { useToast } from "@/components/ui/toast";
import { createAgent, updateAgent } from "@/features/agents/actions";

interface AgentForForm {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role?: "ADMIN" | "AGENT";
}

interface AgentFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "ADMIN" | "AGENT";
}

interface AddAgentModalProps {
  trigger: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  agent?: AgentForForm;
}

export default function AddAgentModal({ trigger, agent }: AddAgentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = Boolean(agent);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AgentFormData>({
    defaultValues: {
      name: agent?.name ?? "",
      email: agent?.email ?? "",
      password: "",
      phone: agent?.phone ?? "",
      role: agent?.role ?? "AGENT",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    if (!isEditMode) {
      reset();
    }
  };

  const onSubmit = async (data: AgentFormData) => {
    setError("");

    if (!data.name.trim() || !data.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!isEditMode && data.password.length < 8) {
      setError("Password is required and must be at least 8 characters.");
      return;
    }

    const payload = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim() || undefined,
      role: data.role,
      ...(data.password ? { password: data.password } : {}),
    };

    try {
      const result =
        isEditMode && agent
          ? await updateAgent(agent.id, payload)
          : await createAgent({
              name: payload.name,
              email: payload.email,
              password: data.password,
              phone: payload.phone,
              role: payload.role,
              isActive: true,
            });

      if (!result.success) {
        throw new Error(result.error || "Could not save agent.");
      }

      toast({
        title: isEditMode ? "Agent updated" : "Agent registered",
        description: `${data.name} has been saved successfully.`,
        type: "success",
      });

      setIsOpen(false);
      if (!isEditMode) {
        reset();
      }
      router.refresh();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to save agent. Please try again.";
      setError(message);
      toast({
        title: "Agent save failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <>
      <span className="inline-flex" onClickCapture={() => setIsOpen(true)}>
        {trigger}
      </span>

      <CRMDrawer
        isOpen={isOpen}
        onClose={handleClose}
        eyebrow="Team management"
        title={isEditMode ? "Update Agent Profile" : "Register Sales Agent"}
        description="Manage CRM users without leaving the current workspace."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="min-h-11 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="agent-drawer-form"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#F4B400] px-6 py-3 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition hover:bg-[#f59e0b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Register Agent"}
            </button>
          </div>
        }
      >
        <form id="agent-drawer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/10 sm:p-5">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#F4B400]">
              <UserRound className="h-4 w-4" />
              Agent Details
            </h3>
            <div className="space-y-4">
              <Field label="Full name" required>
                <input {...register("name")} placeholder="e.g. Rahul Sharma" className={fieldClass} />
              </Field>
              <Field label="Login email" required>
                <input type="email" {...register("email")} placeholder="agent@example.com" className={fieldClass} />
              </Field>
              <Field label={isEditMode ? "Password (optional)" : "Password"} required={!isEditMode}>
                <input
                  type="password"
                  {...register("password")}
                  placeholder={isEditMode ? "Leave blank to keep same" : "Minimum 8 characters"}
                  className={fieldClass}
                />
              </Field>
              <Field label="Contact phone">
                <input {...register("phone")} placeholder="10-digit mobile number" className={fieldClass} />
              </Field>
              <Field label="System role" required>
                <select {...register("role")} className={fieldClass}>
                  <option value="AGENT">Sales Agent</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </Field>
            </div>
          </section>
        </form>
      </CRMDrawer>
    </>
  );
}

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#F4B400]/70 focus:bg-[#111827] focus:ring-4 focus:ring-[#F4B400]/10";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}
