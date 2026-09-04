import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Compass,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { siteConfig, bareillyGuide, fallbackProperties, faqs } from "@/components/website/site-data";
import PropertyCard from "@/components/website/PropertyCard";

export const metadata: Metadata = {
  title: "Properties & Real Estate in Bareilly — Villas, Kothis & Plots",
  description:
    "Explore verified properties in Bareilly, UP — park-facing kothis in Rajendra Nagar, luxury villas on Pilibhit Road, premium apartments in Aurika corridor, and residential plots. Expert advisory by The Shivara Group.",
  alternates: {
    canonical: "/locations/bareilly",
  },
  openGraph: {
    title: "Real Estate in Bareilly | Villas, Kothis & Plots — The Shivara Group",
    description:
      "Verified residential properties in Bareilly — luxury villas, park-facing kothis, premium apartments, and residential plots. Expert advisory and guided site visits.",
    type: "website",
    url: "https://shivara.site/locations/bareilly",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "Real Estate in Bareilly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate in Bareilly | The Shivara Group",
    description:
      "Verified villas, kothis, plots and apartments in Bareilly with expert advisory and guided site visits.",
    images: ["https://shivara.site/logo.png"],
  },
};

export default function BareillyLocationPage() {
  const bareillyProperties = fallbackProperties.filter(
    (p) => p.location.toLowerCase().includes("bareilly") || (p.microLocation && p.microLocation.toLowerCase().includes("bareilly"))
  );

  const bareillyFaqs = [
    {
      question: "Which are the best residential areas in Bareilly?",
      answer:
        "The most established and sought-after residential areas in Bareilly are Rajendra Nagar (premium family living), Pilibhit Road (independent villas and luxury apartments), Civil Lines (prestige zone near administrative hub), and the Aurika corridor (new master-planned development). Each offers distinct lifestyle profiles and property types.",
    },
    {
      question: "What is the typical price range for properties in Bareilly?",
      answer:
        "Property prices in Bareilly vary significantly by location and type. Residential plots start from around ₹35–40 Lakh. 3BHK apartments in Rajendra Nagar range from ₹65 Lakh to ₹1 Crore. Premium villas and independent kothis (240 Gaj+) are typically priced at ₹1.5 Crore to ₹3 Crore+. All prices are indicative — contact us for current confirmed pricing.",
    },
    {
      question: "How do I book a property site visit in Bareilly?",
      answer:
        "Simply WhatsApp or call The Shivara Group at +91 7060788407 with your preferred property, date, and time. Our advisor will coordinate an escorted private site visit, typically within 24–48 hours of your enquiry.",
    },
    {
      question: "Is Bareilly a good city for real estate investment?",
      answer:
        "Bareilly is showing increasing infrastructure development, proximity to key highway corridors (Delhi-Lucknow NH-30), a functional civil airport with expanded flight operations, strong academic institutions like Rohilkhand University, and a growing aspirational buyer base. Micro-markets like Pilibhit Road and the Aurika corridor are particularly active for capital appreciation.",
    },
    {
      question: "Does The Shivara Group offer RERA-verified properties?",
      answer:
        "Several projects in our portfolio are RERA registered. Shivara Group is an advisory and marketing consultancy — we review project registration details and advise you accordingly. All buyers are strongly advised to independently verify RERA numbers and legal title documentation before any transaction.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "City",
        name: "Bareilly",
        containedInPlace: {
          "@type": "State",
          name: "Uttar Pradesh",
          containedInPlace: { "@type": "Country", name: "India" },
        },
        description: "Bareilly is a major city in western Uttar Pradesh, India, known for its growing real estate market, luxury residential developments, and strategic location on the Delhi-Lucknow corridor.",
      },
      {
        "@type": "RealEstateAgent",
        "@id": "https://shivara.site/#organization",
        name: siteConfig.name,
        url: "https://shivara.site",
        telephone: siteConfig.phone,
        areaServed: { "@type": "City", name: "Bareilly" },
      },
      {
        "@type": "FAQPage",
        mainEntity: bareillyFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://shivara.site" },
          { "@type": "ListItem", position: 2, name: "Locations", item: "https://shivara.site/locations/bareilly" },
          { "@type": "ListItem", position: 3, name: "Bareilly", item: "https://shivara.site/locations/bareilly" },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#081120]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#081120] px-4 pb-14 pt-[5.8rem] text-white sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(212,175,55,0.22),transparent_38%),radial-gradient(circle_at_82%_10%,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[11px] text-white/50">
            <Link href="/" className="hover:text-white/80">Home</Link>
            <span>/</span>
            <span className="text-white/80">Bareilly</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] backdrop-blur sm:text-xs">
            <MapPin className="h-3 w-3" />
            Bareilly, Uttar Pradesh
          </div>

          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-[2.6rem] font-semibold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Real Estate in Bareilly.
                <br />
                <span className="font-normal italic text-white/85">Premium. Verified. Guided.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                Discover verified luxury homes, park-facing kothis, residential plots, and premium apartments
                across Bareilly's most sought-after neighbourhoods — from established Rajendra Nagar to the
                emerging Aurika corridor and Pilibhit Road luxury belt.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Rajendra Nagar", "Pilibhit Road", "Aurika Corridor", "Civil Lines"].map((area) => (
                  <span key={area} className="rounded-full border border-white/10 bg-white/[0.065] px-3 py-1.5 text-[11px] font-semibold text-white/76">
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.065] p-5 backdrop-blur sm:rounded-[2rem] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Speak with an advisor</p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-semibold">Bareilly Property Desk</p>
              <p className="mt-3 text-sm leading-6 text-white/62">
                Call or WhatsApp for property shortlists, site visit booking, and pricing guidance for Bareilly properties.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#081120]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call {siteConfig.phone}
                </a>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 text-xs font-black uppercase tracking-[0.12em] text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp Advisory
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-b border-[#081120]/10 bg-white py-5 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold text-[#4B5563]">
            {["Verified Properties", "Escorted Site Visits", "Transparent Pricing", "Bareilly Experts", "WhatsApp-First Advisory"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BAREILLY MICRO-MARKET GUIDE ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Neighbourhood Intelligence</p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Bareilly Property Zones — Micro-Market Guide
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6B7280]">
              Each neighbourhood in Bareilly has distinct characteristics, buyer profiles, and pricing dynamics.
              Our advisors provide in-depth micro-market knowledge to help you find the right location for your lifestyle and investment goals.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bareillyGuide.slice(0, -1).map((zone) => (
              <div
                key={zone.zone}
                className="rounded-[1.75rem] border border-[#081120]/8 bg-white p-5 shadow-[0_12px_40px_rgba(8,17,32,0.05)] sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9B7A19]">{zone.signal}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#081120]">{zone.zone}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">{zone.insight}</p>
                <Link
                  href={`/properties?location=${encodeURIComponent(zone.zone)}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#9B7A19] hover:text-[#D4AF37]"
                >
                  View Properties <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BAREILLY PROPERTIES ── */}
      {bareillyProperties.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#081120]/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Current Portfolio</p>
                <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  Properties in Bareilly
                </h2>
                <p className="mt-2 max-w-xl text-sm text-[#6B7280]">
                  Verified residential properties in Bareilly — confirmed for site visit readiness.
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bareillyProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY INVEST IN BAREILLY ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Investment Context</p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                Why Bareilly for Real Estate?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#4B5563]">
                Bareilly is one of western Uttar Pradesh's fastest-growing urban centres, with several macro factors
                driving real estate demand and capital appreciation:
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "Strategic location on Delhi-Lucknow NH-30 highway corridor",
                  "Bareilly Airport with expanding air connectivity to Delhi & Mumbai",
                  "Strong academic infrastructure — Rohilkhand University, SRMS, MJP Rohilkhand University",
                  "Growing commercial activity in Civil Lines and Kutchery Road corridors",
                  "New master-planned developments along Pilibhit Road and Aurika belt",
                  "Established community living hubs in Rajendra Nagar with top schools and parks",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                    <span className="text-sm text-[#374151]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] bg-[#081120] p-6 text-white sm:p-8">
              <Compass className="h-7 w-7 text-[#D4AF37]" />
              <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                Get a personalised Bareilly property shortlist
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Share your budget, preferred area, and timeline — our Bareilly advisory desk will curate matching options within 24 hours.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 text-xs font-black uppercase tracking-[0.12em] text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp Your Requirement
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white"
                >
                  Fill Enquiry Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-[#081120]/10 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Questions &amp; Answers</p>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Bareilly Real Estate — FAQs
          </h2>
          <div className="mt-8 space-y-3">
            {bareillyFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] p-5 transition-all open:border-[#D4AF37]/40 open:bg-[#081120] open:text-white"
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
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#081120] px-6 text-xs font-black uppercase tracking-[0.14em] text-white"
            >
              Browse Bareilly Properties <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#081120]/20 px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#081120]"
            >
              Contact Advisory Desk
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
