import type { Metadata } from "next";
import { Banknote, Building2, CalendarCheck, CheckCircle2, Home, KeyRound, MapPinned } from "lucide-react";
import { LuxuryButton, SectionHeader, SectionShell } from "@/components/website/LuxurySection";
import { processSteps, services, siteConfig } from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore The Shivara Group's property consultation, site visit, home loan assistance, and buyer support services.",
};

const icons = [Home, CalendarCheck, MapPinned, Banknote, Building2, KeyRound];

export default function ServicesPage() {
  return (
    <main className="bg-[#F8F5EE]">
      <section className="bg-[#081120] px-5 pb-16 pt-32 text-white sm:px-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
            Buyer services
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <h1 className="font-[family-name:var(--font-playfair)] text-[2.55rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl sm:tracking-[-0.06em] lg:text-8xl">
              Services designed around confident decisions.
            </h1>
            <p className="text-lg leading-8 text-white/66">
              From the first WhatsApp enquiry to the final site visit, the service experience is
              structured for clarity, speed, and premium buyer confidence.
            </p>
          </div>
        </div>
      </section>

      <SectionShell>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Home;
            return (
              <div
                key={service.title}
                className="group rounded-[1.75rem] border border-[#081120]/8 bg-white p-5 shadow-[0_24px_70px_rgba(8,17,32,0.07)] transition hover:-translate-y-2 hover:bg-[#081120] hover:text-white sm:rounded-[2.2rem] sm:p-7"
              >
                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#081120]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                  {service.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#4B5563] transition group-hover:text-white/66 sm:min-h-28">
                  {service.description}
                </p>
                <LuxuryButton
                  href="/contact"
                  variant={index % 2 === 0 ? "gold" : "navy"}
                  className="mt-7"
                >
                  {service.cta}
                </LuxuryButton>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeader
          eyebrow="What you receive"
          title="A more premium and organised buying experience."
          description="The Shivara Group's public website now feeds directly into enquiry and site-visit flows so the CRM can track every lead properly."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Requirement capture",
            "Budget and location matching",
            "Site visit coordination",
            "Follow-up reminders",
            "Loan assistance request",
            "Property comparison support",
            "WhatsApp-first updates",
            "Manual verification before booking",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-3xl bg-[#F8F5EE] p-5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10B981]" />
              <span className="font-bold">{item}</span>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-[#081120] pb-28 text-white md:pb-24">
        <SectionHeader
          eyebrow="How it works"
          title="Simple, guided, and conversion-focused."
          dark
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {processSteps.map((step) => (
            <div key={step.step} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <p className="font-[family-name:var(--font-playfair)] text-5xl font-semibold text-[#D4AF37]">
                {step.step}
              </p>
              <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] border border-[#D4AF37]/20 bg-[#D4AF37] p-6 text-[#081120] md:p-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                Need a property advisor today?
              </h2>
              <p className="mt-2 text-sm font-semibold">
                Call {siteConfig.phone} or send your requirements on WhatsApp.
              </p>
            </div>
            <LuxuryButton href="/contact#site-visit" variant="navy">
              Book Site Visit
            </LuxuryButton>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
