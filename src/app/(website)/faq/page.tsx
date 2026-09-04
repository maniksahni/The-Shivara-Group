import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle, Phone } from "lucide-react";
import { faqs, siteConfig } from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "Real Estate FAQs — Property Buying, Verification & Site Visits in Bareilly",
  description:
    "Frequently asked questions about buying property in Bareilly, how The Shivara Group verifies properties, site visit booking process, pricing transparency, and documentation guidance.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Real Estate FAQs | The Shivara Group — Bareilly",
    description:
      "Common questions answered about property verification, site visits, pricing, documentation, and buying process for Bareilly and Delhi NCR properties.",
    type: "website",
    url: "https://shivara.site/faq",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "The Shivara Group FAQs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate FAQs | The Shivara Group — Bareilly",
    description: "Answers to common questions about property verification, site visits, pricing, and buying in Bareilly.",
    images: ["https://shivara.site/logo.png"],
  },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#F8F5EE] py-28 px-4 sm:px-8 lg:px-12 text-[#081120]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.4rem] border border-[#081120]/10 bg-white p-7 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#FFF9E8] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#9B7A19]">
            <HelpCircle className="h-4 w-4" />
            Advisory FAQs
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-semibold sm:text-5xl text-[#081120]">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs font-semibold text-[#6B7280]">
            Everything you need to know about property discovery, verification, pricing, and visits.
          </p>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] p-5 transition-all open:border-[#D4AF37]/40 open:bg-[#081120] open:text-white"
              >
                <summary className="cursor-pointer list-none text-base font-bold sm:text-lg">
                  {faq.question}
                </summary>
                <p className="mt-3 text-xs leading-6 text-[#4B5563] group-open:text-white/80 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[#081120] p-6 text-white text-center sm:p-8">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
              Have a specific question not covered here?
            </h2>
            <p className="mt-2 text-xs leading-6 text-white/70 sm:text-sm">
              Our real estate advisory desk is available 6 days a week for direct telephone and WhatsApp consultations.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-wider text-[#081120]"
              >
                <Phone className="h-4 w-4" />
                Call {siteConfig.phone}
              </a>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#10B981] px-6 text-xs font-bold uppercase tracking-wider text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Advisory
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
