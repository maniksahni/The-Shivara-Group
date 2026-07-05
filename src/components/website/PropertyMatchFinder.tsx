"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Home,
  IndianRupee,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { PropertyType } from "@prisma/client";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { siteConfig } from "@/components/website/site-data";

type MatchValues = {
  lookingFor: string;
  budget: string;
  location: string;
  timeline: string;
  helpWith: string[];
  name: string;
  phone: string;
  whatsappNumber: string;
  message: string;
};

type MatchStep = {
  id: keyof MatchValues;
  eyebrow: string;
  title: string;
  helper: string;
  icon: typeof Home;
  multi?: boolean;
  options: string[];
};

const matchSteps: MatchStep[] = [
  {
    id: "lookingFor",
    eyebrow: "Property intent",
    title: "What are you looking for?",
    helper: "We’ll shape the shortlist around your actual goal.",
    icon: Home,
    options: ["Residential", "Commercial", "Investment", "Plot / Land", "Rental"],
  },
  {
    id: "budget",
    eyebrow: "Budget comfort",
    title: "What is your budget?",
    helper: "Select the closest range. Exact pricing can be verified on call.",
    icon: IndianRupee,
    options: ["Under 25 Lakh", "25–50 Lakh", "50 Lakh–1 Cr", "1 Cr+", "Not sure"],
  },
  {
    id: "location",
    eyebrow: "Location preference",
    title: "Where would you prefer?",
    helper: "Location clarity helps us avoid irrelevant suggestions.",
    icon: MapPin,
    options: [
      "Bareilly prime locations",
      "Near school/college",
      "Near market",
      "Near highway",
      "Peaceful residential area",
      "Not sure",
    ],
  },
  {
    id: "timeline",
    eyebrow: "Decision timeline",
    title: "When are you planning to move?",
    helper: "This helps the team prioritise follow-up correctly.",
    icon: Timer,
    options: ["Immediately", "Within 1 month", "3–6 months", "Just exploring"],
  },
  {
    id: "helpWith",
    eyebrow: "Consultation support",
    title: "What do you need help with?",
    helper: "Choose one or more. We’ll include it in your CRM enquiry.",
    icon: ShieldCheck,
    multi: true,
    options: ["Site visit", "Loan", "Documentation", "Investment advice", "Price negotiation"],
  },
];

const initialValues: MatchValues = {
  lookingFor: "",
  budget: "",
  location: "",
  timeline: "",
  helpWith: [],
  name: "",
  phone: "",
  whatsappNumber: "",
  message: "",
};

function priorityFromTimeline(timeline: string) {
  if (timeline === "Immediately") return "HIGH";
  if (timeline === "Within 1 month") return "MEDIUM";
  if (timeline === "Just exploring") return "LOW";
  return "MEDIUM";
}

function propertyTypeFromIntent(intent: string) {
  if (intent === "Commercial") return PropertyType.COMMERCIAL;
  if (intent === "Plot / Land" || intent === "Investment") return PropertyType.PLOT;
  if (intent === "Residential" || intent === "Rental") return PropertyType.APARTMENT;
  return null;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function MatchOptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition duration-300 sm:min-h-16 sm:rounded-3xl sm:px-5 ${
        selected
          ? "border-[#D4AF37] bg-[#081120] text-white shadow-[0_18px_46px_rgba(8,17,32,0.22)]"
          : "border-[#081120]/8 bg-white text-[#081120] hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:bg-[#FFF9E8]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
          selected ? "bg-[#D4AF37] text-[#081120]" : "bg-[#F8F5EE] text-[#9B7A19] group-hover:bg-[#D4AF37]"
        }`}
      >
        {selected ? <Check className="h-4 w-4" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

export function MatchStepCard({
  step,
  values,
  onSelect,
}: {
  step: MatchStep;
  values: MatchValues;
  onSelect: (id: keyof MatchValues, option: string, multi?: boolean) => void;
}) {
  const Icon = step.icon;
  const selectedValue = values[step.id];

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 28, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -28, scale: 0.98 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="rounded-[1.75rem] border border-[#081120]/8 bg-[#F8F5EE] p-4 shadow-[0_24px_70px_rgba(8,17,32,0.06)] sm:rounded-[2.4rem] sm:p-6"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#081120] shadow-[0_14px_34px_rgba(212,175,55,0.25)]">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9B7A19]">
            {step.eyebrow}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#081120] sm:text-4xl">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#4B5563]">{step.helper}</p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {step.options.map((option) => {
          const selected = Array.isArray(selectedValue)
            ? selectedValue.includes(option)
            : selectedValue === option;
          return (
            <MatchOptionButton
              key={option}
              label={option}
              selected={selected}
              onClick={() => onSelect(step.id, option, step.multi)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export function MatchSuccessScreen({
  name,
  onRestart,
}: {
  name: string;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-[1.75rem] border border-[#10B981]/25 bg-[#081120] p-5 text-white shadow-[0_28px_90px_rgba(8,17,32,0.22)] sm:rounded-[2.4rem] sm:p-8"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_18px_45px_rgba(16,185,129,0.28)]">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="mt-6 text-[11px] font-black uppercase tracking-[0.28em] text-[#D4AF37]">
        Match request received
      </p>
      <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
        {name ? `${name}, your shortlist is on its way.` : "Your shortlist is on its way."}
      </h3>
      <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">
        Our property consultant will contact you shortly with options matched to your budget,
        location, timeline, and support needs.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Chat with our consultant
        </a>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-5 text-sm font-black uppercase tracking-[0.12em] text-white/80 transition hover:border-[#D4AF37]/60 hover:text-[#F5D67B]"
        >
          Start another match
        </button>
      </div>
    </motion.div>
  );
}

export default function PropertyMatchFinder({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { toast } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<MatchValues>(initialValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const totalSteps = matchSteps.length + 1;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const currentStep = matchSteps[stepIndex];

  const summary = useMemo(
    () => [
      values.lookingFor || "Intent pending",
      values.budget || "Budget pending",
      values.location || "Location pending",
      values.timeline || "Timeline pending",
    ],
    [values],
  );

  const selectOption = (id: keyof MatchValues, option: string, multi?: boolean) => {
    setError("");
    setValues((current) => {
      if (multi) {
        const currentValues = Array.isArray(current[id]) ? (current[id] as string[]) : [];
        return {
          ...current,
          [id]: currentValues.includes(option)
            ? currentValues.filter((item) => item !== option)
            : [...currentValues, option],
        };
      }
      return { ...current, [id]: option };
    });
  };

  const canContinue = () => {
    if (stepIndex < matchSteps.length) {
      const id = matchSteps[stepIndex].id;
      const value = values[id];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }
    return Boolean(values.name.trim()) && /^[6-9]\d{9}$/.test(normalizePhone(values.phone));
  };

  const goNext = () => {
    if (!canContinue()) {
      setError(
        stepIndex < matchSteps.length
          ? "Please select an option to continue."
          : "Please enter your name and a valid 10-digit Indian mobile number.",
      );
      return;
    }
    setError("");
    setStepIndex((index) => Math.min(index + 1, totalSteps - 1));
  };

  const goBack = () => {
    setError("");
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const submitMatch = async () => {
    if (!canContinue()) {
      setError("Please enter your name and a valid 10-digit Indian mobile number.");
      return;
    }

    const phone = normalizePhone(values.phone);
    const whatsapp = normalizePhone(values.whatsappNumber);
    const priority = priorityFromTimeline(values.timeline);
    const message = [
      "Source: Property Match Finder",
      `Looking for: ${values.lookingFor}`,
      `Budget: ${values.budget}`,
      `Preferred location: ${values.location}`,
      `Timeline: ${values.timeline}`,
      `Needs help with: ${values.helpWith.join(", ")}`,
      values.message.trim() ? `Message: ${values.message.trim()}` : "",
    ].filter(Boolean).join("\n");

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone,
          whatsappNumber: whatsapp || null,
          email: null,
          budget: values.budget,
          preferredLocation: values.location,
          propertyType: propertyTypeFromIntent(values.lookingFor),
          source: "WEBSITE",
          status: "NEW",
          priority,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Match request failed");
      }

      setSubmittedName(values.name.trim());
      setSubmitted(true);
      toast({
        title: "Property match request sent",
        description: "Our consultant will contact you shortly.",
        type: "success",
      });
    } catch {
      setError("We could not submit this request. Please call or WhatsApp us directly.");
      toast({
        title: "Could not submit match request",
        description: "Please try again or contact us on WhatsApp.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setValues(initialValues);
    setStepIndex(0);
    setSubmitted(false);
    setError("");
  };

  return (
    <section
      id="property-match-finder"
      className={`relative scroll-mt-24 overflow-hidden rounded-[2rem] border border-[#081120]/8 bg-white p-3 shadow-[0_30px_100px_rgba(8,17,32,0.1)] sm:rounded-[3rem] sm:p-5 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,175,55,0.18),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="relative grid gap-4 lg:grid-cols-[0.76fr_1.24fr] lg:gap-5">
        <aside className="rounded-[1.6rem] bg-[#081120] p-5 text-white sm:rounded-[2.4rem] sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#F5D67B]">
            <Sparkles className="h-3.5 w-3.5" />
            Signature experience
          </div>
          <h2 className="mt-5 font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
            Property Match Finder
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/66">
            Answer a few guided questions and Shivara will turn your requirement into a consultant-led shortlist.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-white/58">
              <span>Progress</span>
              <span className="text-[#F5D67B]">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#10B981]"
                animate={{ width: `${submitted ? 100 : progress}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>

          {!compact && (
            <div className="mt-5 grid gap-2">
              {summary.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/[0.045] px-3 py-2 text-sm text-white/68">
                  <BadgeCheck className="h-4 w-4 text-[#D4AF37]" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <div className="min-w-0">
          {submitted ? (
            <MatchSuccessScreen name={submittedName} onRestart={restart} />
          ) : (
            <div className="rounded-[1.6rem] border border-[#081120]/8 bg-white/80 p-3 sm:rounded-[2.4rem] sm:p-5">
              <AnimatePresence mode="wait">
                {stepIndex < matchSteps.length ? (
                  <MatchStepCard
                    key={currentStep.id}
                    step={currentStep}
                    values={values}
                    onSelect={selectOption}
                  />
                ) : (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, x: 28, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -28, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="rounded-[1.75rem] border border-[#081120]/8 bg-[#F8F5EE] p-4 shadow-[0_24px_70px_rgba(8,17,32,0.06)] sm:rounded-[2.4rem] sm:p-6"
                  >
                    <div className="mb-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9B7A19]">
                        Contact details
                      </p>
                      <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#081120] sm:text-4xl">
                        Where should our consultant call you?
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                        We’ll save this as a new CRM enquiry and contact you shortly.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Name" required value={values.name} onChange={(value) => setValues((current) => ({ ...current, name: value }))} placeholder="Your full name" />
                      <Field label="Phone number" required value={values.phone} onChange={(value) => setValues((current) => ({ ...current, phone: value }))} placeholder="10-digit mobile number" inputMode="tel" />
                      <Field label="WhatsApp number" value={values.whatsappNumber} onChange={(value) => setValues((current) => ({ ...current, whatsappNumber: value }))} placeholder="Optional" inputMode="tel" />
                      <label className="sm:col-span-2">
                        <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#6B7280]">
                          Message
                        </span>
                        <textarea
                          value={values.message}
                          onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
                          placeholder="Anything specific we should know?"
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-[#081120]/10 bg-white px-4 py-3 text-sm font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/65 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
                        />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </p>
              )}

              <div className="sticky bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-10 mt-4 grid gap-2 rounded-2xl border border-[#081120]/8 bg-white/92 p-2 shadow-[0_18px_46px_rgba(8,17,32,0.14)] backdrop-blur sm:static sm:flex sm:items-center sm:justify-between sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0 || submitting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#081120]/10 px-5 text-sm font-black text-[#4B5563] transition hover:bg-[#F8F5EE] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                {stepIndex < matchSteps.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-sm font-black uppercase tracking-[0.12em] text-[#081120] shadow-[0_18px_42px_rgba(212,175,55,0.22)] transition hover:bg-[#F5D67B]"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitMatch}
                    disabled={submitting}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-sm font-black uppercase tracking-[0.12em] text-[#081120] shadow-[0_18px_42px_rgba(212,175,55,0.22)] transition hover:bg-[#F5D67B] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                    Get My Property Suggestions
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  inputMode?: "tel";
}) {
  return (
    <label>
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#6B7280]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-white px-4 text-sm font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/65 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/14"
      />
    </label>
  );
}
