import type { Metadata } from "next";
import { Award, BadgeCheck, Building2, Compass, Eye, ShieldCheck, Users } from "lucide-react";
import {
  Eyebrow,
  LuxuryButton,
  SectionHeader,
  SectionShell,
} from "@/components/website/LuxurySection";
import {
  processSteps,
  publicStats,
  siteConfig,
  trustHighlights,
} from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "About The Shivara Group",
  description:
    "Learn about The Shivara Group's premium real estate guidance across Bareilly and Delhi NCR.",
};

const heroImage =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";
const lobbyImage =
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80";

export default function AboutPage() {
  return (
    <main className="bg-[#F8F5EE]">
      <section className="relative overflow-hidden bg-[#081120] px-4 pb-14 pt-[5.8rem] text-white sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-40">
        <div
          className="absolute inset-0 opacity-42"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(8,17,32,0.98),rgba(8,17,32,0.72),rgba(8,17,32,0.35)),url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <Eyebrow dark>About the brand</Eyebrow>
          <div className="grid gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-[2.7rem] font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl sm:tracking-[-0.06em] lg:text-8xl">
                Premium property guidance, built around trust.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:mt-7 sm:text-lg sm:leading-8">
                The Shivara Group helps buyers and investors move from interest to site
                visit with cleaner conversations, curated options, and transparent next steps.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Bareilly local expertise", "WhatsApp-first guidance", "Site-visit-led decisions"].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.065] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/76">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="touch-lift rounded-[1.75rem] border border-white/12 bg-white/[0.065] p-5 backdrop-blur sm:rounded-[2rem] sm:p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                Primary market focus
              </p>
              <p className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-semibold">
                {siteConfig.coverage}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/62">
                Speak with the team for appointment-led consultations, current projects,
                and location-specific guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div
            className="min-h-[320px] rounded-[2rem] bg-cover bg-center shadow-[0_30px_90px_rgba(8,17,32,0.16)] sm:min-h-[520px] sm:rounded-[2.5rem]"
            style={{ backgroundImage: `url(${lobbyImage})` }}
          />
          <div>
            <SectionHeader
              eyebrow="Our philosophy"
              title="Real estate should feel considered, not rushed."
              description="Premium buyers need more than a listing card. They need a trusted team that understands budget, micro-location, lifestyle, documentation confidence, and timing."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Compass,
                  title: "Curated search",
                  text: "Focused shortlists instead of noisy property browsing.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verified conversations",
                  text: "Clear manual confirmation for pricing, availability, and site visits.",
                },
                {
                  icon: Eye,
                  title: "Transparent follow-up",
                  text: "CRM-backed follow-ups keep enquiries from getting lost.",
                },
                {
                  icon: Award,
                  title: "Premium positioning",
                  text: "A brand language built for high-value property decisions.",
                },
              ].map((item) => (
              <div key={item.title} className="touch-lift rounded-[1.75rem] border border-[#081120]/8 bg-white p-5 shadow-[0_18px_50px_rgba(8,17,32,0.05)]">
                  <item.icon className="mb-5 h-7 w-7 text-[#D4AF37]" />
                  <h3 className="text-lg font-bold text-[#081120]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4B5563]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeader
          eyebrow="Business highlights"
          title="Built for buyers coming from Instagram, WhatsApp, calls, and referrals."
          align="center"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {publicStats.map((stat) => (
            <div key={stat.label} className="touch-lift rounded-[2rem] bg-[#081120] p-6 text-white">
              <p className="font-[family-name:var(--font-playfair)] text-5xl font-semibold text-[#F5D67B]">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-white/82">
                {stat.label}
              </p>
              <p className="mt-2 text-sm text-white/52">{stat.note}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-[#081120] text-white">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <SectionHeader
            eyebrow="Operating model"
            title="A premium buyer journey in four clean steps."
            description="This is the experience the public website now supports: capture, qualify, visit, and close with less friction."
            dark
          />
          <div className="grid gap-4">
            {processSteps.map((step) => (
              <div key={step.step} className="touch-lift rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                  {step.step}
                </p>
                <h3 className="mt-3 text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/62">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pb-28 md:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {trustHighlights.slice(0, 6).map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-3xl border border-[#081120]/8 bg-white p-5">
              <BadgeCheck className="h-5 w-5 shrink-0 text-[#10B981]" />
              <span className="font-bold text-[#081120]">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[2.4rem] bg-white p-8 shadow-[0_24px_70px_rgba(8,17,32,0.08)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[#9B7A19]">
                <Building2 className="h-5 w-5" />
                <Users className="h-5 w-5" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-[-0.04em]">
                Speak to the team before you shortlist.
              </h2>
              <p className="mt-4 text-[#4B5563]">
                A quick call helps us understand your budget, family needs, and preferred visit
                timing.
              </p>
            </div>
            <LuxuryButton href="/contact">Start Consultation</LuxuryButton>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
