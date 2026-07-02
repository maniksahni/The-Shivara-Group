"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { PropertyType } from "@prisma/client";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: PropertyType;
}

export default function ClientEnquiryModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [message, setMessage] = useState(
    `I am interested in "${property.title}" (Price: ${property.price}) located in ${property.location}. Please share the details.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Please fill in your Name and Phone Number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
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
          whatsappNumber: whatsappNumber.trim() || undefined,
          budget: property.price,
          preferredLocation: property.location,
          propertyType: property.type,
          source: "WEBSITE",
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      setError("Failed to submit request. Please try calling us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F1B2D]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-100 z-10 animate-fade-in-scale">
        {/* Header */}
        <div className="bg-[#0F1B2D] text-white px-6 py-5 flex items-center justify-between border-b border-[#C9A84C]/20">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold">
              Property Enquiry
            </span>
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold truncate max-w-[280px] sm:max-w-sm">
              {property.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#0F1B2D]">
                Enquiry Submitted!
              </h4>
              <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
                Thank you for your interest. A consultant from The Shivara Group will call you back shortly.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <a
                  href={`https://wa.me/917060788407?text=Hi, I just submitted an enquiry for ${encodeURIComponent(
                    property.title
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] text-white font-semibold text-xs rounded-lg hover:bg-[#1ebe59] shadow-sm transition-colors flex items-center gap-1.5"
                >
                  Confirm on WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error indicator */}
              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                />
              </div>

              {/* Phone & WhatsApp Side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="WhatsApp number (optional)"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800 resize-none"
                />
              </div>

              {/* Price/Location read-only details */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex justify-between items-center text-[10px] text-gray-500">
                <span>📍 {property.location}</span>
                <span className="font-bold text-[#C9A84C]">💰 Budget: {property.price}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#0F1B2D] text-white font-semibold text-xs rounded-xl hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-all flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Submit Enquiry"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
