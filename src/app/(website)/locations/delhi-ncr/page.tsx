import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  TrendingUp,
} from "lucide-react";
import { siteConfig, fallbackProperties } from "@/components/website/site-data";
import PropertyCard from "@/components/website/PropertyCard";

export const metadata: Metadata = {
  title: "Delhi NCR Properties — Greater Noida, Yamuna Expressway & Investment",
  description:
    "Explore premium investment properties in Delhi NCR — Godrej Golf Links Greater Noida, luxury serviced suites on Yamuna Expressway near Noida International Airport. Expert advisory by The Shivara Group from Bareilly.",
  alternates: {
    canonical: "/locations/delhi-ncr",
  },
  openGraph: {
    title: "Delhi NCR Properties | Greater Noida & Yamuna Expressway — The Shivara Group",
    description:
      "High-value investment properties in Greater Noida and Yamuna Expressway — golf-linked residences, luxury suites, and airport-corridor opportunities. Expert advisory by The Shivara Group.",
    type: "website",
    url: "https://shivara.site/locations/delhi-ncr",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "Delhi NCR Property Advisory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delhi NCR Properties | The Shivara Group",
    description: "Premium investment properties in Greater Noida and Yamuna Expressway. Expert advisory by The Shivara Group.",
    images: ["https://shivara.site/logo.png"],
  },
};

export default function DelhiNCRPage() {
  const ncrProperties = fallbackProperties.filter(
    (p) =>
      p.location.toLowerCase().includes("noida") ||
      p.location.toLowerCase().includes("ncr") ||
      p.location.toLowerCase().includes("yamuna") ||
      (p.microLocation && ["Greater Noida", "Noida", "Yamuna Expressway"].includes(p.microLocation))
  );

  const ncrFaqs = [
    {
      question: "Which Delhi NCR areas does The Shivara Group advise on?",
      answer:
        "We focus on high-growth investment corridors — primarily Greater Noida (around Pari Chowk and the Godrej Golf Links township), and the Yamuna Expressway corridor near the upcoming Noida International Airport (Jewar). These are the markets with strong capital appreciation potential and managed investment-grade product.",
    },
    {
      question: "Why is the Yamuna Expressway a good real estate investment?",
      answer:
        "The Yamuna Expressway between Noida and Agra is one of India's fastest appreciating real estate corridors. Key drivers include: the upcoming Noida International Airport (Jewar) expected to be one of Asia's largest, proximity to the Buddh International Circuit (Formula 1), the Eastern Peripheral Expressway intersection, and strong infrastructure investment from the UP government.",
    },
    {
      question: "Can The Shivara Group coordinate site visits to Greater Noida properties from Bareilly?",
      answer:
        "Yes. We coordinate private site visit logistics from Bareilly or Delhi for all our NCR portfolio properties. Our advisor accompanies you on the site walk, provides a developer briefing, and assists with pricing and payment plan discussions. WhatsApp us to schedule.",
    },
    {
      question: "What is the investment potential of Godrej Golf Links in Greater Noida?",
      answer:
        "Godrej Golf Links is a 100+ acre premium township project in Greater Noida near Pari Chowk. The final phases offer golf-facing high-rise residences at a premium positioning that tends to hold value strongly. With proximity to metro connectivity, DND Flyway access to South Delhi, and the Jewar Airport corridor, it represents a quality long-term portfolio holding. Prices and returns should be independently assessed.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        name: "Delhi NCR",
        description: "Delhi National Capital Region — including Noida, Greater Noida, Gurugram, Ghaziabad, and the Yamuna Expressway corridor.",
        containedInPlace: { "@type": "Country", name: "India" },
      },
      {
        "@type": "FAQPage",
        mainEntity: ncrFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://shivara.site" },
          { "@type": "ListItem", position: 2, name: "Delhi NCR Properties", item: "https://shivara.site/locations/delhi-ncr" },
        ],
      },
    ],
  };

  const ncrZones = [
    {
      zone: "Greater Noida — Pari Chowk",
      signal: "Premium residential & golf township",
      insight: "Well-planned sector with golf-linked residences, metro connectivity via Aqua Line, and signal-free access to South Delhi via DND. Home to Godrej Golf Links and similar premium integrated townships.",
    },
    {
      zone: "Yamuna Expressway",
      signal: "High-growth airport corridor",
      insight: "India's fastest appreciating real estate belt — anchored by the upcoming Noida International Airport (Jewar), Buddh International Circuit (F1 track), and strong state infrastructure investment. Strong capital growth corridor for early investors.",
    },
    {
      zone: "Noida — Sector 150 Belt",
      signal: "Lifestyle & green city",
      insight: "Noida's greenest sector — planned around the National Golf Course, with a disproportionate share of green space, modern towers, and connectivity via Noida Expressway and metro.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#081120]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#081120] px-4 pb-14 pt-[5.8rem] text-white sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.18),transparent_36%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[11px] text-white/50">
            <Link href="/" className="hover:text-white/80">Home</Link>
            <span>/</span>
            <span className="text-white/80">Delhi NCR</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] backdrop-blur sm:text-xs">
            <MapPin className="h-3 w-3" />
            Delhi NCR — Investment Portfolio
          </div>

          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-[2.6rem] font-semibold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Delhi NCR Properties.
                <br />
                <span className="font-normal italic text-white/85">High-Value. Investment-Grade.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                Curated investment-grade and lifestyle properties across Delhi NCR's highest-growth corridors —
                Greater Noida, Yamuna Expressway, and Noida — with private site visit coordination from Bareilly
                or Delhi by The Shivara Group.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
                {["Golf-Linked Residences", "Airport Corridor Properties", "Managed Investment Suites"].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.065] p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">NCR Advisory Desk</p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-semibold">Delhi NCR Portfolio</p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Book site visits to Greater Noida, Yamuna Expressway, and Noida from Bareilly or Delhi.
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

      {/* ── NCR ZONE GUIDE ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">Growth Corridor Intelligence</p>
          <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Delhi NCR Investment Zones
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6B7280]">
            Our NCR portfolio is focused on investment-grade projects in the highest-conviction growth corridors —
            not mass market speculation, but curated opportunities with strong macro fundamentals.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ncrZones.map((zone) => (
              <div
                key={zone.zone}
                className="rounded-[1.75rem] border border-[#081120]/8 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9B7A19]">{zone.signal}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold">{zone.zone}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">{zone.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NCR PROPERTIES ── */}
      {ncrProperties.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#081120]/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">NCR Portfolio</p>
                <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                  Delhi NCR Properties
                </h2>
              </div>
              <Link
                href="/properties?location=Delhi+NCR"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#081120]/20 bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-[#081120] hover:bg-[#081120] hover:text-white"
              >
                View All NCR <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ncrProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY NCR ── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="rounded-[2.4rem] bg-[#081120] p-7 text-white sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">Why NCR Portfolio</p>
                <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold sm:text-4xl">
                  Investment-grade diversification beyond Bareilly
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  For Bareilly-based buyers and investors looking to add NCR exposure, our curated portfolio
                  focuses on projects with strong developer credibility, infrastructure-led appreciation, and
                  clear capital appreciation potential.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {[
                    "Godrej, Gaurs, and credible NCR developer portfolios only",
                    "Airport corridor appreciation — Jewar Noida International Airport",
                    "Private site visit coordination from Bareilly or Delhi",
                    "No speculative land parcels or pre-launch-only exposure",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                      <span className="text-sm text-white/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-sm font-black uppercase tracking-[0.12em] text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-bold uppercase tracking-[0.12em] text-white"
                >
                  Contact Advisory Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="border-t border-[#081120]/10 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold">Delhi NCR Property — FAQs</h2>
          <div className="mt-8 space-y-3">
            {ncrFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] p-5 transition-all open:border-[#D4AF37]/40 open:bg-[#081120] open:text-white"
              >
                <summary className="cursor-pointer list-none text-sm font-bold sm:text-base">{faq.question}</summary>
                <p className="mt-3 text-xs leading-6 text-[#4B5563] group-open:text-white/75 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
