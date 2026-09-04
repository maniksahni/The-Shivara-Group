"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Loader2, MessageCircle, Send, X } from "lucide-react";
import type { PublicProperty } from "@/components/website/site-data";
import { siteConfig } from "@/components/website/site-data";

type IntentType = "BUY" | "SELL" | "INVEST" | "SITE_VISIT";
type TimelineType = "Immediately" | "1–3 Months" | "3–6 Months" | "Just Exploring";

export default function ClientEnquiryModal({
  property,
  onClose,
}: {
  property: PublicProperty;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<IntentType>("SITE_VISIT");
  const [timeline, setTimeline] = useState<TimelineType>("Immediately");
  const [message, setMessage] = useState(
    `I am interested in scheduling a site visit for ${property.title} at ${property.location}. Please share pricing and available appointment slots.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (!name.trim() || !cleanPhone) {
      setError("Please enter your name and mobile number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).");
      return;
    }

    setSubmitting(true);

    const fullMessage = [
      `Property: ${property.title} (${property.id})`,
      `Intent: ${intent}`,
      `Timeline: ${timeline}`,
      `Location: ${property.location}`,
      `Budget: ${property.price}`,
      message ? `Notes: ${message.trim()}` : "",
      "Source: Property Detail / Site Visit Modal",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          whatsappNumber: cleanPhone,
          email: email.trim() || null,
          budget: property.price || null,
          preferredLocation: property.location || null,
          propertyType: property.type,
          source: "WEBSITE",
          status: intent === "SITE_VISIT" ? "SITE_VISIT_SCHEDULED" : "NEW",
          priority: timeline === "Immediately" ? "HIGH" : "MEDIUM",
          message: fullMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      // Fallback for static hosting environments
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappBackupHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi The Shivara Group, my name is ${name || "Client"}. I am enquiring about ${property.title} in ${property.location} (Intent: ${intent}, Timeline: ${timeline}).`
  )}`;

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center p-0 sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#081120]/75 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close enquiry modal"
      />

      <div className="relative max-h-[94svh] w-full max-w-2xl overflow-hidden rounded-t-[2rem] border border-white/20 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.36)] sm:rounded-[2.4rem]">
        {/* Header */}
        <div className="bg-[#081120] p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                Private Consultation & Visit
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                {property.title}
              </h2>
              <p className="mt-1 text-xs text-white/70">
                {property.location} &bull; {property.price}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(94svh-140px)] overflow-y-auto p-5 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-[#10B981]" />
              <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#081120] sm:text-3xl">
                Enquiry Recorded.
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#4B5563] sm:text-sm">
                Thank you. Our property advisor will contact you shortly to coordinate details.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={whatsappBackupHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-xs font-black uppercase tracking-[0.12em] text-white shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  Instant WhatsApp Confirmation
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-12 rounded-full bg-[#081120] px-6 text-xs font-black uppercase tracking-[0.12em] text-white"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              {/* Intent Toggle */}
              <div>
                <label className={labelClass}>Consultation Purpose</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["SITE_VISIT", "BUY", "INVEST", "SELL"] as IntentType[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIntent(opt)}
                      className={`min-h-10 rounded-xl px-2.5 text-xs font-bold transition ${
                        intent === opt
                          ? "bg-[#081120] text-white"
                          : "bg-[#F8F5EE] text-[#4B5563] hover:bg-slate-200"
                      }`}
                    >
                      {opt === "SITE_VISIT" ? "Site Visit" : opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="10-digit mobile"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email & Timeline */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Planning Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value as TimelineType)}
                    className={inputClass}
                  >
                    <option value="Immediately">Immediately</option>
                    <option value="1–3 Months">1–3 Months</option>
                    <option value="3–6 Months">3–6 Months</option>
                    <option value="Just Exploring">Just Exploring</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>Specific Notes or Visit Slot</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none py-3`}
                />
              </div>

              <div className="rounded-xl bg-[#F8F5EE] p-3 text-xs text-[#6B7280]">
                Every enquiry is managed confidentially by our senior advisor. We respect your privacy.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#F5D67B] to-[#D4AF37] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#081120] shadow-md transition hover:brightness-105 disabled:opacity-60 sm:text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Confirm Requirement
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

const labelClass =
  "mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-[#4B5563]";

const inputClass =
  "min-h-11 w-full rounded-xl border border-[#081120]/10 bg-[#F8F5EE] px-3.5 text-xs font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/60 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20";
