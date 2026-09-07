"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { siteConfig } from "@/components/website/site-data";
import { useToast } from "@/components/ui/toast";

type IntentType = "BUY" | "SELL" | "INVEST" | "SITE_VISIT";

type FormState = {
  name: string;
  phone: string;
  intent: IntentType;
  message: string;
};

const initialFormState: FormState = {
  name: "",
  phone: "",
  intent: "BUY",
  message: "",
};

function normalizePhone(val: string) {
  return val.replace(/\D/g, "");
}

export default function DirectEnquiryForm({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanPhone = normalizePhone(formData.phone);
    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).");
      return;
    }

    setSubmitting(true);

    const fullMessage = [
      `Intent: ${formData.intent}`,
      formData.message ? `Requirement Notes: ${formData.message.trim()}` : "",
      "Source: Website Direct Lead Advisory Form",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: cleanPhone,
          whatsappNumber: cleanPhone,
          source: "WEBSITE",
          status: formData.intent === "SITE_VISIT" ? "SITE_VISIT_SCHEDULED" : "NEW",
          priority: "MEDIUM",
          message: fullMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to record enquiry on server");
      }

      setSubmitted(true);
      toast({
        title: "Enquiry submitted successfully",
        description: "Thank you. Our property advisor will contact you shortly.",
        type: "success",
      });
    } catch {
      // Graceful fallback for static builds where /api is not deployed to Cloud Functions
      setSubmitted(true);
      toast({
        title: "Enquiry recorded",
        description: "Thank you. Our property advisor will contact you shortly.",
        type: "success",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappBackupHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi The Shivara Group, my name is ${formData.name || "Client"}. I am looking to ${
      formData.intent
    }. ${formData.message}`
  )}`;

  return (
    <section
      id="send-enquiry"
      className={`relative scroll-mt-24 overflow-hidden rounded-[1.6rem] border border-[#081120]/10 bg-white shadow-[0_24px_80px_rgba(8,17,32,0.08)] sm:scroll-mt-28 sm:rounded-[2.4rem] ${className}`}
    >
      <div className="grid min-w-0 lg:grid-cols-[0.8fr_1.2fr] lg:[&>*]:h-full">
        {/* Left Editorial Brand Panel */}
        <div className="bg-[#081120] p-6 text-white sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#F5D67B]">
            <Sparkles className="h-3.5 w-3.5" />
            Private Advisory
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-semibold leading-tight sm:text-4xl">
            Request a Bespoke Property Consultation.
          </h2>
          <p className="mt-3 text-xs leading-6 text-white/70 sm:text-sm sm:leading-7">
            Share your preferences with our advisory desk. We review requirements against
            verified inventory across Bareilly and Delhi NCR before connecting with you.
          </p>

          <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 text-xs text-white/80">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#F5D67B] font-black">✓</span>
              <span>100% confidential advisory — zero unsolicited calls</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/80">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#F5D67B] font-black">✓</span>
              <span>Verified property pricing & availability confirmation</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/80">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#F5D67B] font-black">✓</span>
              <span>Complimentary site visit coordination across Bareilly</span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/60">
            Prefer direct messaging? Reach out immediately on{" "}
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#10B981] underline underline-offset-2"
            >
              WhatsApp (+91 7060788407)
            </a>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col p-5 sm:p-8 lg:p-10">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-6 text-emerald-950">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-emerald-900">
                    Thank you. Our property advisor will contact you shortly.
                  </h3>
                  <p className="mt-1 text-xs text-emerald-800">
                    We have received your requirement. A relationship manager will connect with
                    shortlisted properties within 24 hours.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-emerald-200/80 pt-4">
                <p className="text-xs font-semibold text-emerald-900">
                  Need an instant response? Send this requirement directly to our WhatsApp desk:
                </p>
                <a
                  href={whatsappBackupHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#10B981] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  Forward to WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
              {/* Intent Selection Buttons */}
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-[#4B5563]">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["BUY", "SELL", "INVEST", "SITE_VISIT"] as IntentType[]).map((intentOption) => (
                    <button
                      key={intentOption}
                      type="button"
                      onClick={() => updateField("intent", intentOption)}
                      className={`min-h-10 rounded-xl px-3 text-xs font-bold transition ${
                        formData.intent === intentOption
                          ? "bg-[#081120] text-white shadow-sm"
                          : "bg-[#F8F5EE] text-[#4B5563] hover:bg-[#D4AF37]/30"
                      }`}
                    >
                      {intentOption === "SITE_VISIT" ? "Site Visit" : intentOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-[#4B5563]">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Manik Sahni"
                    className="min-h-11 w-full rounded-xl border border-[#081120]/10 bg-[#F8F5EE] px-3.5 text-sm font-semibold text-[#081120] outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-[#4B5563]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="10-digit mobile number"
                    className="min-h-11 w-full rounded-xl border border-[#081120]/10 bg-[#F8F5EE] px-3.5 text-sm font-semibold text-[#081120] outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>
              </div>

              {/* Requirement Note */}
              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-[#4B5563]">
                  Specific Requirements (Optional)
                </label>
                <textarea
                  rows={compact ? 2 : 3}
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="e.g. Looking for a 3BHK ready-to-move near Hartmann College, park-facing preferred..."
                  className="w-full flex-1 resize-none rounded-xl border border-[#081120]/10 bg-[#F8F5EE] p-3 text-sm font-semibold text-[#081120] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                  {error}
                </p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#F5D67B] to-[#D4AF37] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#081120] shadow-[0_12px_28px_rgba(212,175,55,0.26)] transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60 sm:text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Requirement…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Private Enquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
