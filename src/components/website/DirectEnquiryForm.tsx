"use client";

import { PropertyType } from "@prisma/client";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { siteConfig } from "@/components/website/site-data";

type EnquiryValues = {
  name: string;
  phone: string;
  whatsappNumber: string;
  propertyType: string;
  budget: string;
  preferredLocation: string;
  message: string;
};

const initialValues: EnquiryValues = {
  name: "",
  phone: "",
  whatsappNumber: "",
  propertyType: "",
  budget: "",
  preferredLocation: "",
  message: "",
};

const propertyTypes = [
  { label: "Select property type", value: "" },
  { label: "Apartment", value: PropertyType.APARTMENT },
  { label: "Villa / Kothi", value: PropertyType.VILLA },
  { label: "Plot / Land", value: PropertyType.PLOT },
  { label: "Commercial", value: PropertyType.COMMERCIAL },
  { label: "Farmhouse", value: PropertyType.FARMHOUSE },
];

const budgetOptions = [
  "Under 25 Lakh",
  "25–50 Lakh",
  "50 Lakh–1 Cr",
  "1 Cr+",
  "Not sure",
];

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export default function DirectEnquiryForm({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { toast } = useToast();
  const [values, setValues] = useState<EnquiryValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (field: keyof EnquiryValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const phone = normalizePhone(values.phone);
    const whatsapp = normalizePhone(values.whatsappNumber);
    if (values.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (values.message.trim().length < 5) {
      setError("Please tell us briefly what property you are looking for.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone,
          whatsappNumber: whatsapp || null,
          email: null,
          budget: values.budget || null,
          preferredLocation: values.preferredLocation.trim() || null,
          propertyType: values.propertyType || null,
          source: "WEBSITE",
          status: "NEW",
          priority: "MEDIUM",
          message: [
            "Source: Website Direct Enquiry",
            `Requirement: ${values.message.trim()}`,
          ].join("\n"),
        }),
      });

      if (!response.ok) throw new Error("Unable to submit enquiry");

      setSubmitted(true);
      setValues(initialValues);
      toast({
        title: "Enquiry sent successfully",
        description: "Our property consultant will contact you shortly.",
        type: "success",
      });
    } catch {
      setError("We could not submit your enquiry. Please call or WhatsApp us directly.");
      toast({
        title: "Enquiry not submitted",
        description: "Please try again or contact us on WhatsApp.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="send-enquiry"
      className={`relative scroll-mt-24 overflow-hidden rounded-[1.45rem] border border-[#081120]/8 bg-white shadow-[0_22px_70px_rgba(8,17,32,0.09)] sm:scroll-mt-28 sm:rounded-[2.5rem] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(212,175,55,0.16),transparent_34%),radial-gradient(circle_at_92%_16%,rgba(16,185,129,0.10),transparent_28%)]" />
      <div className={`relative grid min-w-0 ${compact ? "lg:grid-cols-[0.72fr_1.28fr]" : "lg:grid-cols-[0.82fr_1.18fr]"}`}>
        <div className="bg-[linear-gradient(145deg,#081120,#101D31_62%,#13243D)] p-4 text-white sm:p-7 lg:p-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F5D67B]">
            <Sparkles className="h-3.5 w-3.5" />
            Direct property enquiry
          </div>
          <h2 className="mt-3 max-w-xl font-[family-name:var(--font-playfair)] text-[2rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:mt-5 sm:text-5xl">
            Tell us what you need.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/68 sm:mt-4 sm:leading-7">
            Share your requirement directly. No quiz or extra steps—our consultant will review it
            and contact you with relevant options.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 lg:grid-cols-1">
            <a
              href={siteConfig.phoneHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-[#D4AF37]/50"
            >
              <Phone className="h-4 w-4 text-[#D4AF37]" />
              Call now
            </a>
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#10B981] px-3 text-xs font-black uppercase tracking-[0.1em] text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="min-w-0 p-3.5 sm:p-6 lg:p-8">
          {submitted && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-3.5 text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-black">Your enquiry has been received.</p>
                <p className="mt-0.5 text-xs leading-5">Our property consultant will contact you shortly.</p>
              </div>
            </div>
          )}

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <Field
              label="Name"
              required
              value={values.name}
              onChange={(value) => updateValue("name", value)}
              placeholder="Your full name"
              autoComplete="name"
            />
            <Field
              label="Phone number"
              required
              value={values.phone}
              onChange={(value) => updateValue("phone", value)}
              placeholder="10-digit mobile number"
              inputMode="tel"
              autoComplete="tel"
            />
            <SelectField
              label="Property type"
              value={values.propertyType}
              onChange={(value) => updateValue("propertyType", value)}
              options={propertyTypes}
            />
            <SelectField
              label="Budget"
              value={values.budget}
              onChange={(value) => updateValue("budget", value)}
              options={[
                { label: "Select budget", value: "" },
                ...budgetOptions.map((option) => ({ label: option, value: option })),
              ]}
            />
            <Field
              label="Preferred location"
              value={values.preferredLocation}
              onChange={(value) => updateValue("preferredLocation", value)}
              placeholder="Area or location"
              icon={MapPin}
            />
            <Field
              label="WhatsApp number"
              value={values.whatsappNumber}
              onChange={(value) => updateValue("whatsappNumber", value)}
              placeholder="Optional"
              inputMode="tel"
              autoComplete="tel"
            />
            <label className="min-w-0 sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.17em] text-[#6B7280]">
                Your requirement <span className="text-red-500">*</span>
              </span>
              <textarea
                value={values.message}
                onChange={(event) => updateValue("message", event.target.value)}
                placeholder="Example: I need a 3 BHK home near Civil Lines within ₹70 lakh."
                rows={compact ? 3 : 4}
                maxLength={1200}
                className="w-full resize-none rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 py-3 text-[16px] font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/60 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14 sm:text-sm"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#F5D67B] to-[#D4AF37] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#081120] shadow-[0_16px_38px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-4 sm:text-sm"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Sending enquiry..." : "Send My Requirement"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  inputMode,
  autoComplete,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  inputMode?: "tel";
  autoComplete?: string;
  icon?: typeof MapPin;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.17em] text-[#6B7280]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B7A19]" />}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={`min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] pr-4 text-[16px] font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/60 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14 sm:text-sm ${Icon ? "pl-10" : "pl-4"}`}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.17em] text-[#6B7280]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-[16px] font-semibold text-[#081120] outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
