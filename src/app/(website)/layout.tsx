import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import Footer from "@/components/website/Footer";
import FloatingEnquiryCTA from "@/components/website/FloatingEnquiryCTA";
import Navbar from "@/components/website/Navbar";
import { siteConfig } from "@/components/website/site-data";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://shivara.site"),
  title: {
    default: "Shivara | Exceptional Properties. Thoughtfully Chosen.",
    template: "%s | The Shivara Group",
  },
  description: siteConfig.description,
  keywords: [
    "The Shivara Group",
    "Shivara real estate",
    "luxury properties Bareilly",
    "villas in Bareilly",
    "kothi in Rajendra Nagar",
    "Aurika Bareilly",
    "Pilibhit Road Bareilly property",
    "Delhi NCR luxury real estate",
    "Godrej Golf Links Greater Noida",
    "Yamuna Expressway serviced apartments",
    "verified property Bareilly",
    "site visit Bareilly",
  ],
  openGraph: {
    title: "Shivara | Premium Real Estate Advisory",
    description: siteConfig.description,
    siteName: "The Shivara Group",
    locale: "en_IN",
    type: "website",
    url: "https://shivara.site",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivara | Exceptional Properties. Thoughtfully Chosen.",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/logo.png?v=2", sizes: "any", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: "https://shivara.site",
    telephone: siteConfig.phone,
    description: siteConfig.description,
    areaServed: ["Bareilly", "Delhi NCR", "Noida", "Greater Noida"],
    sameAs: [siteConfig.instagram, siteConfig.founderInstagram],
  };

  return (
    <ToastProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <div className="public-site min-h-[100dvh] overflow-x-hidden bg-[#F8F5EE] pb-[calc(5.8rem+env(safe-area-inset-bottom))] text-[#081120] antialiased md:pb-0">
        <Navbar />
        {children}
        <Footer />
        <FloatingEnquiryCTA />

        {/* Desktop Fixed Floating WhatsApp & Call Buttons */}
        <div className="fixed bottom-6 right-6 z-50 hidden flex-col gap-3 md:flex">
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_16px_36px_rgba(16,185,129,0.36)] transition-all duration-300 hover:scale-110"
            aria-label="Chat with Shivara on WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-xl bg-[#081120] px-3.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Chat on WhatsApp
            </span>
          </a>
          <a
            href={siteConfig.phoneHref}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#081120] text-[#F5D67B] shadow-[0_16px_36px_rgba(8,17,32,0.32)] transition-all duration-300 hover:scale-110"
            aria-label="Call Shivara Advisory Desk"
          >
            <Phone className="h-6 w-6" />
            <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-xl bg-[#081120] px-3.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Call {siteConfig.phone}
            </span>
          </a>
        </div>

        {/* Mobile Sticky Action Bar: CALL, WHATSAPP, BOOK SITE VISIT */}
        <div className="fixed inset-x-3 bottom-[calc(0.6rem+env(safe-area-inset-bottom))] z-50 grid grid-cols-3 gap-1.5 rounded-[1.25rem] border border-white/20 bg-[#081120]/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.34)] backdrop-blur-xl md:hidden">
          {/* CALL */}
          <a
            href={siteConfig.phoneHref}
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-[0.95rem] bg-white/10 text-[11px] font-black uppercase tracking-wider text-white transition active:scale-[0.97]"
            aria-label="Call Advisory Desk"
          >
            <Phone className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Call</span>
          </a>

          {/* WHATSAPP */}
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-[0.95rem] bg-[#10B981] text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition active:scale-[0.97]"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* BOOK SITE VISIT */}
          <Link
            href="/#send-enquiry"
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-[0.95rem] bg-gradient-to-br from-[#F5D67B] to-[#D4AF37] px-1 text-[10.5px] font-black uppercase tracking-wider text-[#081120] shadow-sm transition active:scale-[0.97]"
            aria-label="Book Site Visit"
          >
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Site Visit</span>
          </Link>
        </div>
      </div>
    </ToastProvider>
  );
}
