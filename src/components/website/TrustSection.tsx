import {
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  advisoryDisclaimer,
  verificationSteps,
  whyShivaraCards,
} from "@/components/website/site-data";

export default function TrustSection() {
  const iconMap: Record<string, React.ReactNode> = {
    "Verified": <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />,
    "Transparency": <CheckCircle2 className="h-6 w-6 text-[#10B981]" />,
    "Expertise": <MapPin className="h-6 w-6 text-[#D4AF37]" />,
    "Guided Visits": <Sparkles className="h-6 w-6 text-[#F5D67B]" />,
    "Advisory": <FileCheck2 className="h-6 w-6 text-[#D4AF37]" />,
    "Bespoke": <Users className="h-6 w-6 text-[#10B981]" />,
  };

  return (
    <section className="bg-[#081120] py-16 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section 1: Why Shivara */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/24 bg-white/[0.06] px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-[#F5D67B] backdrop-blur">
            <BadgeCheck className="h-3.5 w-3.5" />
            Advisory Standards
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Why Shivara
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
            In an unorganized real estate landscape, The Shivara Group acts as your trusted
            property advisor—prioritizing clarity, vetted intelligence, and transparent representation.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyShivaraCards.map((card) => (
            <div
              key={card.title}
              className="group relative rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/[0.07] sm:p-7"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] shadow-inner transition group-hover:scale-110">
                {iconMap[card.badge] || <BadgeCheck className="h-6 w-6 text-[#D4AF37]" />}
              </div>
              <span className="inline-block rounded-full bg-[#D4AF37]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#F5D67B]">
                {card.badge}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-semibold text-white">
                {card.title}
              </h3>
              <p className="mt-2.5 text-xs leading-6 text-white/65 sm:text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section 2: Shivara Verification Process */}
        <div className="mt-20 border-t border-white/10 pt-16 sm:mt-28 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
              Meticulous Advisory Methodology
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-semibold sm:text-4xl">
              Shivara Verification Process
            </h3>
            <p className="mt-3 text-xs leading-6 text-white/65 sm:text-sm">
              How every property is vetted, evaluated, and presented to our private buyers.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {verificationSteps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5 sm:p-6"
              >
                <span className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#D4AF37]">
                  {step.step}
                </span>
                <h4 className="mt-2 text-base font-bold text-white">
                  {step.title}
                </h4>
                <p className="mt-2 text-xs leading-6 text-white/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Responsible Legal Notice & Disclaimer Banner */}
        <div className="mt-14 rounded-[1.6rem] border border-[#D4AF37]/25 bg-white/[0.035] p-5 sm:p-7">
          <div className="flex items-start gap-3.5">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F5D67B]" />
            <div className="text-xs leading-6 text-white/70">
              <p className="font-bold text-[#F5D67B] uppercase tracking-wider text-[11px] mb-1">
                Advisory Integrity & Legal Transparency
              </p>
              <p>{advisoryDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
