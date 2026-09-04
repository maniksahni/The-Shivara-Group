import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { siteConfig, fallbackProperties } from "@/components/website/site-data";
import PropertyCard from "@/components/website/PropertyCard";

export const metadata: Metadata = {
  title: "Property in Rajendra Nagar Bareilly — Kothis, Apartments & Homes",
  description:
    "Explore premium residential properties in Rajendra Nagar, Bareilly — park-facing kothis, 3BHK apartments, and luxury homes in Bareilly's most sought-after neighbourhood. Expert advisory by The Shivara Group.",
  alternates: {
    canonical: "/locations/rajendra-nagar-bareilly",
  },
  openGraph: {
    title: "Property in Rajendra Nagar, Bareilly | The Shivara Group",
    description:
      "Verified homes, kothis, and apartments in Rajendra Nagar, Bareilly — guided site visits and expert advisory.",
    type: "website",
    url: "https://shivara.site/locations/rajendra-nagar-bareilly",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "Property in Rajendra Nagar Bareilly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property in Rajendra Nagar, Bareilly | The Shivara Group",
    description: "Verified homes, kothis and apartments in Rajendra Nagar, Bareilly. Expert advisory and site visits.",
    images: ["https://shivara.site/logo.png"],
  },
};

export default function RajendraNagarPage() {
  const rajendraNagarProperties = fallbackProperties.filter(
    (p) =>
      p.location.toLowerCase().includes("rajendra nagar") ||
      (p.microLocation && p.microLocation.toLowerCase().includes("rajendra nagar"))
  );

  const localFaqs = [
    {
      question: "Why is Rajendra Nagar considered the best area in Bareilly?",
      answer:
        "Rajendra Nagar is Bareilly's most established and prestigious residential neighbourhood — known for its tree-lined avenues, wide sector roads, top educational institutions (Hartmann College, St Francis), zero waterlogging history, proximity to Civil Lines, and a settled community of senior professionals and families. Properties here command a premium and hold their value well.",
    },
    {
      question: "What types of properties are available in Rajendra Nagar?",
      answer:
        "Rajendra Nagar primarily offers independent kothis (100–300 Gaj), park-facing builder floors, 3BHK luxury apartments, and some 4BHK premium residences. Park-facing units and corner plots command the highest premiums. The area is predominantly residential with walkable access to markets, hospitals, and schools.",
    },
    {
      question: "What is the price range of 3BHK flats in Rajendra Nagar Bareilly?",
      answer:
        "Well-maintained 3BHK ready-to-move apartments and builder floors in Rajendra Nagar are typically priced between ₹65 Lakh and ₹1.1 Crore, depending on floor, facing, parking, and overall build quality. Premium park-facing units and renovated kothis can exceed ₹1.5 Crore. Contact us for current confirmed pricing.",
    },
    {
      question: "How far is Rajendra Nagar from Bareilly Railway Junction?",
      answer:
        "Rajendra Nagar is approximately 10–15 minutes from Bareilly Railway Junction by road. Civil Lines Metro Bus terminal, Bareilly Airport (with expanding connectivity), and major commercial hubs are all within comfortable distance.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        name: "Rajendra Nagar, Bareilly",
        description: "Rajendra Nagar is the most prestigious residential neighbourhood in Bareilly, UP — known for tree-lined avenues, premium kothis, park-facing apartments, and a settled community of established families.",
        containedInPlace: {
          "@type": "City",
          name: "Bareilly",
          containedInPlace: { "@type": "State", name: "Uttar Pradesh" },
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.3670",
          longitude: "79.4304",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: localFaqs.map((faq) => ({
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
          { "@type": "ListItem", position: 3, name: "Rajendra Nagar, Bareilly", item: "https://shivara.site/locations/rajendra-nagar-bareilly" },
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,175,55,0.20),transparent_36%)]" />
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[11px] text-white/50">
            <Link href="/" className="hover:text-white/80">Home</Link>
            <span>/</span>
            <Link href="/locations/bareilly" className="hover:text-white/80">Bareilly</Link>
            <span>/</span>
            <span className="text-white/80">Rajendra Nagar</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] backdrop-blur sm:text-xs">
            <MapPin className="h-3 w-3" />
            Rajendra Nagar, Bareilly
          </div>

          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-[2.6rem] font-semibold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Property in Rajendra Nagar, Bareilly.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                Bareilly's most prestigious residential zone — park-facing kothis, 3BHK luxury homes, and
                premium builder floors in the city's most established and walkable community. Verified listings,
                guided site visits, and transparent pricing by The Shivara Group.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
                {["Verified Listings", "Escorted Site Visits", "Transparent Pricing"].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.065] p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">Book a site visit</p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-semibold">Rajendra Nagar Properties</p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                WhatsApp or call for shortlists, pricing, and site visit coordination in Rajendra Nagar.
              </p>
              <div className="mt-4 flex flex-col gap-2">
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

      {/* ── AREA OVERVIEW ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Area Profile</p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em]">
                Rajendra Nagar — Why Buyers Choose This Neighbourhood
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#4B5563]">
                Rajendra Nagar is Bareilly's premier family residential hub — established over decades, known
                for settled community life, wide roads, proximity to Civil Lines, and consistent property value appreciation.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "Wide 30–40ft sector roads with mature tree cover",
                  "Walking distance to Hartmann College, St Francis School, and other top institutions",
                  "Close proximity to Civil Lines administrative hub and hospitals",
                  "Low-rise residential character — predominantly kothis and builder floors",
                  "No waterlogging history — well-planned civic drainage",
                  "Active community parks and morning walking tracks",
                  "Established market proximity for daily needs",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                    <span className="text-sm text-[#374151]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Property Types", value: "Kothis, Builder Floors, Apartments" },
                { label: "Budget Range", value: "₹60 Lakh – ₹2.5 Crore+" },
                { label: "Configuration", value: "2 BHK, 3 BHK, 4 BHK, Independent" },
                { label: "Possession", value: "Ready to Move (most units)" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.4rem] border border-[#081120]/8 bg-white p-4 shadow-sm sm:p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9B7A19]">{item.label}</p>
                  <p className="mt-2 font-bold text-[#081120]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROPERTIES ── */}
      {rajendraNagarProperties.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#081120]/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Current Listings</p>
                <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                  Properties in Rajendra Nagar, Bareilly
                </h2>
              </div>
              <Link
                href="/properties?location=Rajendra+Nagar"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#081120]/20 bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-[#081120] hover:bg-[#081120] hover:text-white"
              >
                All Rajendra Nagar <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rajendraNagarProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      <section className="border-t border-[#081120]/10 bg-[#F8F5EE] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Questions &amp; Answers</p>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
            Property in Rajendra Nagar — FAQs
          </h2>
          <div className="mt-8 space-y-3">
            {localFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#081120]/10 bg-white p-5 transition-all open:border-[#D4AF37]/40 open:bg-[#081120] open:text-white"
              >
                <summary className="cursor-pointer list-none text-sm font-bold sm:text-base">{faq.question}</summary>
                <p className="mt-3 text-xs leading-6 text-[#4B5563] group-open:text-white/75 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#081120] px-6 text-xs font-black uppercase tracking-[0.14em] text-white"
            >
              Browse All Properties <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/locations/bareilly"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#081120]/20 px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#081120]"
            >
              All Bareilly Areas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
