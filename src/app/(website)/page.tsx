import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Compass,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import DirectEnquiryForm from "@/components/website/DirectEnquiryForm";
import HomepageSearchModule from "@/components/website/HomepageSearchModule";
import PropertyCard from "@/components/website/PropertyCard";

import AutoScrollRail from "@/components/website/AutoScrollRail";
import {
  bareillyGuide,
  categoryShowcase,
  fallbackProperties,
  faqs,
  processSteps,
  publicStats,
  services,
  siteConfig,
  trustHighlights,
} from "@/components/website/site-data";

const heroVisualImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85";

export const metadata = {
  title: "Premium Real Estate in Bareilly | The Shivara Group",
  description:
    "Discover verified luxury homes, villas, kothis, plots and investment properties in Bareilly, UP. Expert property advisory with guided site visits, transparent pricing, and documentation support. Also covering Delhi NCR.",
  alternates: {
    canonical: "https://shivara.site/",
  },
  openGraph: {
    title: "Premium Real Estate in Bareilly | The Shivara Group",
    description:
      "Verified luxury homes, villas, kothis, and plots in Bareilly. Expert real estate advisory with guided site visits and transparent pricing. Delhi NCR properties also available.",
    url: "https://shivara.site/",
    type: "website",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "The Shivara Group" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Premium Real Estate in Bareilly | The Shivara Group",
    description: "Verified luxury homes, villas, kothis, and plots in Bareilly with expert advisory, guided site visits, and transparent pricing.",
    images: ["https://shivara.site/logo.png"],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": "https://shivara.site/#organization",
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: "https://shivara.site",
        logo: {
          "@type": "ImageObject",
          url: "https://shivara.site/logo.png",
        },
        description: "Premium real estate advisory in Bareilly, UP — specialising in verified luxury homes, villas, kothis, plots and investment properties. Also serving Delhi NCR markets.",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Civil Lines & Rajendra Nagar",
          addressLocality: "Bareilly",
          addressRegion: "Uttar Pradesh",
          postalCode: "243122",
          addressCountry: "IN",
        },
        areaServed: [
          { "@type": "City", name: "Bareilly" },
          { "@type": "City", name: "Noida" },
          { "@type": "City", name: "Greater Noida" },
        ],
        openingHours: "Mo-Sa 09:30-19:30",
        sameAs: [siteConfig.instagram, siteConfig.founderInstagram],
      },
      {
        "@type": "WebSite",
        "@id": "https://shivara.site/#website",
        url: "https://shivara.site",
        name: siteConfig.name,
        description: "Premium real estate advisory — Bareilly & Delhi NCR",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://shivara.site/properties?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  const featuredProperties = fallbackProperties.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#081120]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================================================ */}
      {/* 1. EDITORIAL LUXURY HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] overflow-hidden bg-[#081120] px-4 pb-14 pt-[5.6rem] text-white sm:min-h-[100svh] sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
        {/* Full-width High-end Background Image with Elegant Treatment */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroVisualImage}
            alt="Premium luxury villa and real estate in Bareilly — The Shivara Group"
            fill
            priority
            className="object-cover object-center brightness-[0.42] contrast-[1.05]"
            sizes="100vw"
          />
          {/* Subtle editorial vignetting and contrast layers — no flashy gradient artifacts */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-[#081120]/40 to-[#081120]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081120]/90 via-[#081120]/50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(88vh-5rem)] w-full max-w-7xl flex-col justify-between sm:min-h-[calc(100svh-10rem)]">
          <div className="max-w-3xl pt-2 sm:pt-6">
            {/* Editorial Location & Trust Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/40 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#F5D67B] backdrop-blur-md sm:text-xs sm:tracking-[0.3em]">
              <Sparkles className="h-3 w-3 text-[#D4AF37]" />
              <span>Bareilly &bull; Delhi NCR Advisory</span>
            </div>

            {/* Exact Required Headline */}
            <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-[clamp(2.4rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:mt-7">
              Exceptional Properties.
              <br />
              <span className="italic font-normal text-white/90">Thoughtfully Chosen.</span>
            </h1>

            {/* Exact Required Supporting Text */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:mt-7 sm:text-xl sm:leading-8">
              Premium homes, villas, plots and investment opportunities across Bareilly and Delhi NCR.
            </p>

            {/* Trust Anchors */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/75 sm:gap-4 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                Verified Properties
              </span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                Escorted Site Visits
              </span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                Transparent Pricing
              </span>
            </div>

            {/* CTA Group with Required CTAs + Visible WhatsApp */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
              <Link
                href="/properties"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-xs font-black uppercase tracking-[0.14em] text-[#081120] shadow-lg transition-all duration-300 hover:bg-[#F5D67B] active:scale-[0.98] sm:min-h-13 sm:text-sm"
              >
                <span>Explore Properties</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/#send-enquiry"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-black/30 px-6 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10 sm:min-h-13 sm:text-sm"
              >
                Private Consultation
              </Link>

              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg transition-all duration-300 hover:bg-[#0ea5e9] sm:min-h-13 sm:text-sm"
                aria-label="Direct WhatsApp Consultation"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Homepage Search Module */}
          <div className="mt-10 sm:mt-12">
            <HomepageSearchModule />
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 md:flex">
          <span>Scroll</span>
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. LEAD GENERATION SECTION */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-20 lg:py-24" id="send-enquiry">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <DirectEnquiryForm />
        </div>
      </section>

      {/* ============================================================ */}
      {/* KEY STATS & HIGHLIGHTS RAIL */}
      {/* ============================================================ */}
      <section className="border-b border-[#081120]/10 bg-white py-6 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {publicStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-[#D4AF37] pl-3 sm:pl-4">
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#081120] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs font-bold text-[#4B5563]">
                  {stat.label}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FEATURED PROPERTIES SHORTLIST */}
      {/* ============================================================ */}
      <section id="curated" className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-4 border-b border-[#081120]/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
                Curated Collection
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] text-[#081120] sm:text-4xl lg:text-5xl">
                Featured Properties
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-5 text-[#6B7280] sm:text-sm sm:leading-6">
                Handpicked villas, residences, and development plots across Bareilly and Delhi NCR.
                Confirmed with owners and developers for site visit readiness.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#081120]/20 bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-[#081120] transition hover:border-[#081120] hover:bg-[#081120] hover:text-white"
            >
              <span>View All Properties</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-10">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* PROPERTY UNIVERSE / CATEGORIES */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
              Portfolio Structure
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] text-[#081120] sm:text-4xl lg:text-5xl">
              Explore by Asset Category
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-[#6B7280] sm:text-sm">
              Discover residential and commercial assets suited to family living or long-term capital preservation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:mt-12">
            {categoryShowcase.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.8rem] bg-[#081120] p-6 text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-[#081120]/45 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5D67B]">
                    Portfolio
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold leading-tight">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/70">
                    {category.description}
                  </p>
                  <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#081120] transition group-hover:bg-[#D4AF37]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BAREILLY & NCR LOCATION INTELLIGENCE */}
      {/* ============================================================ */}
      <section className="bg-[#081120] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                Micro-Market Intelligence
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Bareilly &amp; NCR Growth Corridors.
              </h2>
              <p className="mt-4 text-xs leading-6 text-white/70 sm:text-sm sm:leading-7">
                Every property recommendation is informed by micro-market fundamentals: road connectivity,
                upcoming civil infrastructure, civic development approvals, and verified capital appreciation trends.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/locations/bareilly"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#081120] transition hover:bg-[#F5D67B]"
                >
                  Explore Bareilly
                </Link>
                <Link
                  href="/locations/delhi-ncr"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Delhi NCR Portfolio
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {bareillyGuide.map((zone) => {
                const locationHref =
                  zone.zone === "Rajendra Nagar" ? "/locations/rajendra-nagar-bareilly"
                  : zone.zone === "Delhi NCR Portfolio" ? "/locations/delhi-ncr"
                  : `/locations/bareilly`;
                return (
                  <Link
                    key={zone.zone}
                    href={locationHref}
                    className="group rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-[#D4AF37]/40 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F5D67B]">
                        {zone.signal}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      {zone.zone}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {zone.insight}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#D4AF37]/70 group-hover:text-[#D4AF37]">
                      Explore <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* ============================================================ */}
      {/* FAQ SECTION */}
      {/* ============================================================ */}
      <section className="border-t border-[#081120]/10 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
                Questions & Answers
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight text-[#081120] sm:text-4xl">
                Frequently Asked Questions.
              </h2>
              <p className="mt-4 text-xs leading-6 text-[#6B7280] sm:text-sm sm:leading-7">
                Everything you need to know about our advisory process, property verification standards,
                pricing transparency, and site visits.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#081120] hover:text-[#9B7A19]"
                >
                  <Phone className="h-4 w-4 text-[#9B7A19]" />
                  <span>Call Advisory Desk: {siteConfig.phone}</span>
                </a>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#10B981] hover:text-emerald-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp (+91 7060788407)</span>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] p-5 transition-all open:border-[#D4AF37]/50 open:bg-[#081120] open:text-white"
                >
                  <summary className="cursor-pointer list-none text-sm font-bold sm:text-base">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-xs leading-6 text-[#4B5563] group-open:text-white/75 sm:text-sm">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
