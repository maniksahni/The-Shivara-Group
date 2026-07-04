"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyType } from "@prisma/client";
import { LuxuryButton } from "@/components/website/LuxurySection";
import { siteConfig } from "@/components/website/site-data";

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"enquiry" | "visit">("enquiry");
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

  const resetFeedback = (tab: "enquiry" | "visit") => {
    setActiveTab(tab);
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const cleanPhone = phone.trim();
    if (!name.trim() || !cleanPhone) {
      setError("Please enter your name and mobile number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    let followUpDate: string | null = null;
    let status = "NEW";
    let finalMessage = message.trim();

    if (activeTab === "visit") {
      status = "SITE_VISIT_SCHEDULED";
      if (!visitDate) {
        setError("Please select your preferred site visit date and time.");
        return;
      }
      const parsedVisitDate = new Date(visitDate);
      if (Number.isNaN(parsedVisitDate.getTime())) {
        setError("Please select a valid site visit date and time.");
        return;
      }
      followUpDate = parsedVisitDate.toISOString();
      finalMessage = `[Requested site visit: ${followUpDate}] ${finalMessage}`.trim();
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          whatsappNumber: whatsapp.trim() || null,
          email: email.trim() || null,
          budget: budget.trim() || null,
          propertyType: propertyType ? (propertyType as PropertyType) : null,
          preferredLocation: location.trim() || null,
          source: "WEBSITE",
          status,
          followUpDate,
          message: finalMessage || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      setSubmitted(true);
      setName("");
      setPhone("");
      setWhatsapp("");
      setEmail("");
      setBudget("");
      setPropertyType("");
      setLocation("");
      setVisitDate("");
      setMessage("");
    } catch {
      setError("We could not submit this request. Please call or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#F8F5EE]">
      <section className="bg-[#081120] px-5 pb-16 pt-32 text-white sm:px-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
            Contact & site visits
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <h1 className="font-[family-name:var(--font-playfair)] text-[2.55rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl sm:tracking-[-0.06em] lg:text-8xl">
              Start with a call. Continue with confidence.
            </h1>
            <p className="text-lg leading-8 text-white/66">
              Send an enquiry, book a site visit, or connect instantly on WhatsApp. Every form
              submission creates a lead for the CRM team to follow up.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 pb-28 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            {[
              {
                icon: Phone,
                title: "Call support",
                text: siteConfig.phone,
                href: siteConfig.phoneHref,
              },
              {
                icon: MessageCircle,
                title: "WhatsApp enquiry",
                text: "Fastest way to share your requirement",
                href: siteConfig.whatsappHref,
              },
              {
                icon: Sparkles,
                title: "Instagram",
                text: siteConfig.instagramHandle,
                href: siteConfig.instagram,
              },
              {
                icon: MapPin,
                title: "Office location",
                text: "Bareilly, Uttar Pradesh — private consultations by appointment",
              },
              {
                icon: Clock,
                title: "Working hours",
                text: "Site visits and consultations available by appointment.",
              },
              {
                icon: Mail,
                title: "Email",
                text: "Please call or WhatsApp for the fastest response",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-[#081120]/8 bg-white p-5 shadow-[0_18px_50px_rgba(8,17,32,0.05)]">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8F5EE] text-[#9B7A19]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#081120]">{item.title}</h2>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-1 block text-sm leading-6 text-[#4B5563] transition hover:text-[#9B7A19]"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm leading-6 text-[#4B5563]">{item.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-[2rem] bg-[#081120] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                Instant help
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                Prefer talking directly?
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/62">
                Use WhatsApp for quick property shortlisting and site visit confirmation.
              </p>
              <div className="mt-6">
                <LuxuryButton href="/properties" variant="light">
                  View Properties
                </LuxuryButton>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#081120]/8 bg-white shadow-[0_18px_50px_rgba(8,17,32,0.05)]">
              <div className="min-h-56 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.35),transparent_30%),linear-gradient(135deg,#081120,#13223A)] p-5 text-white">
                <MapPin className="h-7 w-7 text-[#D4AF37]" />
                <h2 className="mt-16 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                  Google Maps location
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Connect with the team for location guidance and appointment details.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4">
                <a href={siteConfig.phoneHref} className="flex min-h-12 items-center justify-center rounded-2xl bg-[#F8F5EE] text-sm font-black text-[#081120]">
                  Call
                </a>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center rounded-2xl bg-[#10B981] text-sm font-black text-white"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>

          <div id="site-visit" className="rounded-[2.4rem] border border-[#081120]/8 bg-white p-5 shadow-[0_28px_90px_rgba(8,17,32,0.1)] sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#F8F5EE] p-2">
              <button
                type="button"
                onClick={() => resetFeedback("enquiry")}
                className={`min-h-12 rounded-xl text-sm font-black transition ${
                  activeTab === "enquiry"
                    ? "bg-[#081120] text-white shadow-lg"
                    : "text-[#4B5563] hover:bg-white"
                }`}
              >
                Send Enquiry
              </button>
              <button
                type="button"
                onClick={() => resetFeedback("visit")}
                className={`min-h-12 rounded-xl text-sm font-black transition ${
                  activeTab === "visit"
                    ? "bg-[#D4AF37] text-[#081120] shadow-lg"
                    : "text-[#4B5563] hover:bg-white"
                }`}
              >
                Book Site Visit
              </button>
            </div>

            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9B7A19]">
                {activeTab === "visit" ? "Private site visit request" : "Buyer enquiry"}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-[-0.04em] text-[#081120]">
                {activeTab === "visit" ? "Choose a preferred visit slot." : "Tell us what you are looking for."}
              </h2>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {["CRM lead created", "Consultant follow-up", "Visit confirmation"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl bg-[#F8F5EE] p-3 text-xs font-black uppercase tracking-[0.12em] text-[#4B5563]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#10B981]" />
                  {item}
                </div>
              ))}
            </div>

            {submitted ? (
              <div className="rounded-[2rem] border border-[#10B981]/20 bg-[#ECFDF5] p-8 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-[#10B981]" />
                <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#081120]">
                  Request submitted successfully.
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#4B5563]">
                  Your enquiry has been sent to the CRM. A consultant will connect with you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 min-h-12 rounded-full bg-[#081120] px-6 text-sm font-black uppercase tracking-[0.14em] text-white"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your name" className={inputClass} />
                  </Field>
                  <Field label="Mobile number" required>
                    <input type="tel" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} required placeholder="10-digit mobile" className={inputClass} />
                  </Field>
                  <Field label="WhatsApp number">
                    <input type="tel" maxLength={10} value={whatsapp} onChange={(event) => setWhatsapp(event.target.value.replace(/\D/g, ""))} placeholder="Optional" className={inputClass} />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Optional" className={inputClass} />
                  </Field>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <Field label="Property type">
                    <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className={inputClass}>
                      <option value="">Any property</option>
                      <option value={PropertyType.APARTMENT}>Apartment</option>
                      <option value={PropertyType.VILLA}>Villa</option>
                      <option value={PropertyType.PLOT}>Plot / Land</option>
                      <option value={PropertyType.COMMERCIAL}>Commercial</option>
                      <option value={PropertyType.FARMHOUSE}>Farmhouse</option>
                    </select>
                  </Field>
                  <Field label="Budget">
                    <input value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="e.g. ₹50L - ₹1Cr" className={inputClass} />
                  </Field>
                  <Field label="Preferred location">
                    <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Bareilly, Civil Lines..." className={inputClass} />
                  </Field>
                </div>

                {activeTab === "visit" && (
                  <Field label="Preferred date & time" required>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9B7A19]" />
                      <input
                        type="datetime-local"
                        value={visitDate}
                        onChange={(event) => setVisitDate(event.target.value)}
                        min={toDateTimeLocalValue(new Date())}
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </Field>
                )}

                <Field label="Requirement details">
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us about budget, facing, preferred project, floor, possession timeline..."
                    className={`${inputClass} min-h-36 resize-none py-4`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#081120] shadow-[0_18px_45px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : activeTab === "visit" ? "Book Site Visit" : "Submit Enquiry"}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/65 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/14";

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
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#4B5563]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
