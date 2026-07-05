"use client";

import { Building2, CheckCircle2, Loader2, MapPin, Phone, Sparkles } from "lucide-react";
import { PropertyType } from "@prisma/client";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";

const propertyTypeOptions = [
  { label: "Residential", value: PropertyType.APARTMENT },
  { label: "Commercial", value: PropertyType.COMMERCIAL },
  { label: "Plot / Land", value: PropertyType.PLOT },
  { label: "Villa / Kothi", value: PropertyType.VILLA },
  { label: "Farmhouse", value: PropertyType.FARMHOUSE },
];

const budgetOptions = [
  "Under 25 Lakh",
  "25–50 Lakh",
  "50 Lakh–1 Cr",
  "1 Cr+",
  "Not sure",
];

function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

export default function FloatingEnquiryCard() {
  const { toast } = useToast();
  const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.APARTMENT);
  const [budget, setBudget] = useState("50 Lakh–1 Cr");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const mobile = cleanPhone(phone);
    if (!name.trim() || !/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter your name and a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: mobile,
          whatsappNumber: null,
          email: null,
          budget,
          propertyType,
          preferredLocation: location.trim() || "Not sure",
          source: "WEBSITE",
          status: "NEW",
          priority: budget === "1 Cr+" ? "HIGH" : "MEDIUM",
          message: [
            "Source: Hero Premium Enquiry Card",
            `Property Type: ${propertyType}`,
            `Budget: ${budget}`,
            `Preferred Location: ${location.trim() || "Not sure"}`,
          ].join("\n"),
        }),
      });

      if (!response.ok) throw new Error("Unable to submit enquiry");

      setSubmitted(true);
      setName("");
      setPhone("");
      setLocation("");
      toast({
        title: "Property suggestion request sent",
        description: "Our consultant will contact you shortly.",
        type: "success",
      });
    } catch {
      setError("We could not submit this request. Please call or WhatsApp us directly.");
      toast({
        title: "Enquiry not submitted",
        description: "Please try again or use WhatsApp.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-white/[0.09] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:rounded-[2.2rem] sm:p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(212,175,55,0.20),transparent_34%)]" />
      <div className="relative rounded-[1.35rem] bg-white p-4 text-[#081120] sm:rounded-[1.85rem] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#9B7A19]">
              <Sparkles className="h-3.5 w-3.5" />
              Premium consultation
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold leading-tight tracking-[-0.035em]">
              Get property suggestions
            </h2>
          </div>
          {submitted && <CheckCircle2 className="h-6 w-6 shrink-0 text-[#10B981]" />}
        </div>

        <div className="grid gap-3">
          <label>
            <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
              <Building2 className="h-3.5 w-3.5" />
              Property Type
            </span>
            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value as PropertyType)}
              className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-bold outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
            >
              {propertyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
                Budget
              </span>
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-bold outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
              >
                {budgetOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
                <MapPin className="h-3.5 w-3.5" />
                Location
              </span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Bareilly prime / Not sure"
                className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-bold outline-none transition placeholder:text-[#6B7280]/60 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-bold outline-none transition placeholder:text-[#6B7280]/60 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
              />
            </label>
            <label>
              <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="10-digit mobile"
                inputMode="tel"
                className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-sm font-bold outline-none transition placeholder:text-[#6B7280]/60 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        )}
        {submitted && !error && (
          <p className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            Request received. Our property consultant will contact you shortly.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-sm font-black uppercase tracking-[0.13em] text-[#081120] shadow-[0_18px_42px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5 hover:bg-[#F5D67B] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Get Property Suggestions
        </button>
      </div>
    </form>
  );
}
