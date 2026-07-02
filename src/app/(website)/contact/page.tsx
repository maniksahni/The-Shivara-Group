"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Calendar } from "lucide-react";
import { PropertyType } from "@prisma/client";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"enquiry" | "visit">("enquiry");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (tab: "enquiry" | "visit") => {
    setActiveTab(tab);
    setError("");
    setSubmitted(false);
    // Reset form states
    setName("");
    setPhone("");
    setWhatsapp("");
    setEmail("");
    setBudget("");
    setPropertyType("");
    setLocation("");
    setVisitDate("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Name and Phone Number are required.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      let finalMessage = message.trim();
      let status = "NEW";
      let followUpDate: string | undefined = undefined;

      if (activeTab === "visit") {
        status = "SITE_VISIT_SCHEDULED";
        if (visitDate) {
          followUpDate = new Date(visitDate).toISOString();
        }
        finalMessage = `[REQUESTED SITE VISIT ON ${visitDate}] ${message}`.trim();
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          whatsappNumber: whatsapp.trim() || undefined,
          email: email.trim() || undefined,
          budget: budget || undefined,
          propertyType: propertyType ? (propertyType as PropertyType) : undefined,
          preferredLocation: location || undefined,
          source: "WEBSITE",
          status,
          followUpDate,
          message: finalMessage,
        }),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please call us directly or chat via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#F8F7F4] min-h-screen text-[#1A1A2E] font-[family-name:var(--font-inter)]">
      {/* ── Header banner ── */}
      <section className="relative py-20 bg-[#0F1B2D] text-white overflow-hidden" aria-label="Contact Banner">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 10% 80%, #C9A84C 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.2em]">Contact Us</span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold tracking-tight">
            Connect With The Shivara Group
          </h1>
          <p className="mt-2 max-w-xl text-white/70 text-sm sm:text-base">
            Have questions about premium real estate in Bareilly or Delhi NCR? Fill in the enquiry form or book a site visit with The Shivara Group.
          </p>
        </div>
      </section>

      {/* ── Two-Column Layout ── */}
      <section className="max-w-6xl mx-auto px-6 py-16" aria-label="Contact Channels">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#0F1B2D]">
                Office Headquarters
              </h2>
              <div className="w-12 h-0.5 bg-[#C9A84C] rounded" />
              <p className="text-gray-600 text-sm leading-relaxed">
                Public Instagram information confirms Bareilly and Delhi NCR coverage. Exact office address, email, maps link, and working hours should be completed manually if required.
              </p>
            </div>

            {/* Channels Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#0F1B2D]">Address</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Bareilly, Uttar Pradesh<br />
                    Full office address: Manual completion required
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#0F1B2D]">Call Support</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Mobile / WhatsApp: +91 7060788407<br />
                    Alternate number: Manual completion required
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#0F1B2D]">Email</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Manual completion required<br />
                    Instagram: @theshivaragroup
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#0F1B2D]">Office Hours</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Manual completion required<br />
                    Site visits available by appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Maps Mockup */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative h-48 bg-[#0F1B2D]/5">
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28073.4913222379!2d79.40058869805903!3d28.361546765057037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a16086b97db57%3A0xe5a3c9b0e27f00d8!2sCivil%20Lines%2C%20Bareilly%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale opacity-80"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Interaction Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 pb-4 mb-6">
              <button
                onClick={() => handleTabChange("enquiry")}
                className={`flex-1 pb-3 text-center text-xs uppercase font-bold tracking-wider transition-all border-b-2 ${
                  activeTab === "enquiry"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Send Enquiry
              </button>
              <button
                onClick={() => handleTabChange("visit")}
                className={`flex-1 pb-3 text-center text-xs uppercase font-bold tracking-wider transition-all border-b-2 ${
                  activeTab === "visit"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Book a Site Visit
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-16 space-y-4 my-auto">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F1B2D]">
                  Request Submitted Successfully!
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                  We have successfully created a CRM lead record for your enquiry. A sales advisor will review your preferences and get back to you shortly.
                </p>
                <div className="pt-6 flex justify-center gap-4">
                  <a
                    href="https://wa.me/917060788407"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#25D366] text-white font-semibold text-xs rounded-lg hover:bg-[#1ebe59] shadow-sm transition-colors"
                  >
                    Ping us on WhatsApp
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                {/* Base Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    />
                  </div>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp (optional)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email (optional)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    />
                  </div>
                </div>

                {/* Preference Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    >
                      <option value="">Any</option>
                      <option value={PropertyType.APARTMENT}>Apartment</option>
                      <option value={PropertyType.VILLA}>Villa</option>
                      <option value={PropertyType.PLOT}>Plot / Land</option>
                      <option value={PropertyType.COMMERCIAL}>Commercial</option>
                      <option value={PropertyType.FARMHOUSE}>Farmhouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Budget / Price Range
                    </label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. ₹40 - 50 Lakh"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Location of Interest
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Civil Lines, Cantt"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    />
                  </div>
                </div>

                {/* Date Picker (Site Visit only) */}
                {activeTab === "visit" && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                      Preferred Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      We will assign a dedicated consultant and vehicle for your physical site visit.
                    </span>
                  </div>
                )}

                {/* Message Textbox */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Describe Your Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about size, preferred facing, floor choice, or any other preferences..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] text-gray-800 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#0F1B2D] text-white font-semibold text-xs rounded-xl hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-all flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    "Submitting Request..."
                  ) : activeTab === "visit" ? (
                    <>
                      Book Physical Site Visit
                      <Calendar className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Send Enquiry Message
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
