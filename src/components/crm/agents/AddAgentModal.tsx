"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createAgent, updateAgent } from "@/features/agents/actions";
import { X, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface AddAgentModalProps {
  trigger: React.ReactElement;
  agent?: any; // If editing
}

export default function AddAgentModal({ trigger, agent }: AddAgentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const isEditMode = !!agent;

  // Since edit/add schemas differ slightly (password required vs optional),
  // we do simple react hook form validation manually or with custom resolver.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: agent?.name || "",
      email: agent?.email || "",
      password: "",
      phone: agent?.phone || "",
      role: agent?.role || "AGENT",
    },
  });

  const onSubmit = async (data: any) => {
    setError("");

    // Basic Validation
    if (!data.name.trim() || !data.email.trim()) {
      setError("Name and Email are required.");
      return;
    }

    if (!isEditMode && (!data.password || data.password.length < 8)) {
      setError("Password is required and must be at least 8 characters.");
      return;
    }

    const payload: any = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim() || undefined,
      role: data.role,
    };

    if (data.password) {
      payload.password = data.password;
    }

    try {
      let result;
      if (isEditMode && agent) {
        result = await updateAgent(agent.id, payload);
      } else {
        result = await createAgent(payload);
      }

      if (!result.success) {
        throw new Error(result.error || "Operation failed");
      }

      toast({
        title: isEditMode ? "Agent Profile Updated" : "Agent Registered",
        description: `Successfully ${isEditMode ? "updated details for" : "created login credentials for"} "${data.name}".`,
        type: "success",
      });

      setIsOpen(false);
      reset();
      window.location.reload(); // Reload to refresh Stats
    } catch (err: any) {
      setError(err.message || "Failed to process request.");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    reset();
  };

  return (
    <>
      <span onClick={handleOpen} style={{ display: 'contents' }}>{trigger}</span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F1B2D]/75 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in-scale">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {isEditMode ? "Update Agent Profile" : "Register Sales Agent"}
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  {...register("name")}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Login Email *</label>
                <input
                  type="email"
                  required
                  {...register("email")}
                  placeholder="e.g. rahul@shivaragroup.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Password {isEditMode ? "(Leave blank to keep same)" : "*"}
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder={isEditMode ? "Enter new password if changing" : "Minimum 8 characters"}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">System Role *</label>
                <select
                  {...register("role")}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="AGENT">Sales Agent</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
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
                  {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Register Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
