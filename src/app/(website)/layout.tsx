import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import Footer from "@/components/website/Footer";
import FloatingPropertyMatchCTA from "@/components/website/FloatingPropertyMatchCTA";
import Navbar from "@/components/website/Navbar";
import { siteConfig } from "@/components/website/site-data";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    default: "The Shivara Group | Premium Real Estate in Bareilly",
    template: "%s | The Shivara Group",
  },
  description:
    siteConfig.description,
  keywords: [
    "The Shivara Group",
    "premium real estate Bareilly",
    "property in Bareilly",
    "Aurika Bareilly",
    "Rajendar Nagar 3BHK",
    "Godrej Golf Links",
    "Delhi NCR real estate portfolio",
    "off-market real estate",
    "site visit Bareilly",
  ],
  openGraph: {
    title: "The Shivara Group | Premium Real Estate in Bareilly",
    description: siteConfig.description,
    siteName: "The Shivara Group",
    locale: "en_IN",
    type: "website",
    url: "/",
  },
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-[100dvh] overflow-x-hidden bg-[#F8F5EE] pb-[calc(5.25rem+env(safe-area-inset-bottom))] text-[#081120] antialiased md:pb-0">
        <Navbar />
        {children}
        <Footer />
        <FloatingPropertyMatchCTA />

        <div className="fixed bottom-5 right-5 z-50 hidden flex-col gap-3 md:flex">
        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_18px_40px_rgba(16,185,129,0.32)] transition hover:-translate-y-1"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="pointer-events-none absolute right-16 rounded-full bg-[#081120] px-4 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
            WhatsApp
          </span>
        </a>
        <a
          href={siteConfig.phoneHref}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#081120] text-[#F5D67B] shadow-[0_18px_40px_rgba(8,17,32,0.28)] transition hover:-translate-y-1"
          aria-label="Call The Shivara Group"
        >
          <Phone className="h-6 w-6" />
          <span className="pointer-events-none absolute right-16 rounded-full bg-[#081120] px-4 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
            Call now
          </span>
        </a>
        </div>

        <div className="fixed inset-x-3 bottom-[calc(0.65rem+env(safe-area-inset-bottom))] z-50 grid grid-cols-3 gap-1.5 rounded-[1.35rem] border border-white/20 bg-[#081120]/94 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.30)] backdrop-blur-xl md:hidden">
        <a
          href={siteConfig.phoneHref}
          className="flex min-h-12 items-center justify-center gap-1 rounded-2xl bg-white/8 text-xs font-black text-white active:scale-[0.98]"
        >
          <Phone className="h-4 w-4 text-[#D4AF37]" />
          Call
        </a>
        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-1 rounded-2xl bg-[#10B981] text-xs font-black text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <Link
          href="/#property-match-finder"
          className="flex min-h-12 items-center justify-center gap-1 rounded-2xl bg-[#D4AF37] text-xs font-black text-[#081120] shadow-[0_10px_24px_rgba(212,175,55,0.24)] active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" />
          Find Property
        </Link>
        </div>
      </div>
    </ToastProvider>
  );
}
