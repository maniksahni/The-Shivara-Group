"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Send, X } from "lucide-react";
import type { PublicProperty } from "@/components/website/site-data";
import { siteConfig } from "@/components/website/site-data";

export default function ClientEnquiryModal({
  property,
  onClose,
}: {
  property: PublicProperty;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [message, setMessage] = useState(
    `I am interested in ${property.title} at ${property.location}. Please share verified pricing, availability, and site visit details.`,
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and mobile number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          whatsappNumber: whatsappNumber.trim() || null,
          budget: property.price || null,
          preferredLocation: property.location || null,
          propertyType: property.type,
          source: "WEBSITE",
          status: "NEW",
          followUpDate: null,
          message: message.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      setError("We could not submit this enquiry. Please call or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-[#081120]/74 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close enquiry modal"
      />

      <div className="relative max-h-[94svh] w-full max-w-2xl overflow-hidden rounded-t-[2rem] border border-white/20 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.36)] sm:rounded-[2.4rem]">
        <div className="bg-[#081120] p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">
                Property enquiry
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em]">
                {property.title}
              </h2>
              <p className="mt-2 text-sm text-white/58">
                {property.location} • {property.price}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(94svh-150px)] overflow-y-auto p-5 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-[#10B981]" />
              <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#081120]">
                Enquiry submitted.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#4B5563]">
                A consultant will contact you soon. You can also confirm the enquiry instantly on WhatsApp.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                    `Hi, I just submitted an enquiry for ${property.title}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-sm font-black uppercase tracking-[0.14em] text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirm on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-12 rounded-full bg-[#081120] px-6 text-sm font-black uppercase tracking-[0.14em] text-white"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Full name *</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    placeholder="Your name"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Mobile number *</span>
                  <input
                    type="tel"
                    value={phone}
                    maxLength={10}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="10-digit mobile"
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>WhatsApp number</span>
                <input
                  type="tel"
                  value={whatsappNumber}
                  maxLength={10}
                  onChange={(event) => setWhatsappNumber(event.target.value.replace(/\D/g, ""))}
                  placeholder="Optional"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  className={`${inputClass} min-h-36 resize-none py-4`}
                />
              </label>

              <div className="rounded-2xl bg-[#F8F5EE] p-4 text-sm text-[#4B5563]">
                This creates a CRM lead with source <strong>Website</strong>. Final pricing and
                inventory will be confirmed manually by The Shivara Group.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#081120] shadow-[0_18px_45px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const labelClass =
  "mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#4B5563]";

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/65 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/14";
