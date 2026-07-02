import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "The Shivara Group | Premium Real Estate Consultancy in Bareilly",
    template: "%s | The Shivara Group",
  },
  description:
    "Bareilly's most trusted real estate consultancy. Explore premium residential and commercial properties in Civil Lines, Cantt, and across Uttar Pradesh.",
  keywords: [
    "real estate Bareilly",
    "property in Bareilly",
    "plots Bareilly",
    "apartments Bareilly UP",
    "The Shivara Group",
  ],
  openGraph: {
    siteName: "The Shivara Group",
    locale: "en_IN",
    type: "website",
  },
};

// ─── Layout Component ─────────────────────────────────────────────────────────
export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F8F7F4] font-[family-name:var(--font-inter)] antialiased">
        {/* ── Navbar ── */}
        <Navbar />

        {/* ── Page Content ── */}
        <main className="flex-1">{children}</main>

        {/* ── Footer ── */}
        <Footer />

        {/* ── WhatsApp Float Button (bottom-right, always visible) ── */}
        <a
          href="https://wa.me/919897012345"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="
            fixed bottom-6 right-6 z-50
            flex items-center justify-center
            w-14 h-14 rounded-full
            bg-[#25D366] text-white shadow-2xl
            hover:bg-[#1ebe59] hover:scale-110
            transition-all duration-300 ease-out
            group
          "
        >
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Tooltip label */}
          <span
            className="
              absolute right-16 whitespace-nowrap
              bg-[#0F1B2D] text-white text-xs font-medium
              px-3 py-1.5 rounded-md shadow-lg
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              pointer-events-none
            "
          >
            Chat on WhatsApp
          </span>
        </a>

        {/* ── Call Now Sticky Button (bottom-left on mobile, right side on desktop) ── */}
        <a
          href="tel:+919897012345"
          aria-label="Call Now"
          className="
            fixed bottom-6 left-6 z-50
            flex items-center gap-2
            px-4 py-3 rounded-full
            bg-[#0F1B2D] text-white text-sm font-semibold shadow-2xl
            hover:bg-[#1a2d4a] hover:scale-105
            transition-all duration-300 ease-out
            md:hidden
          "
        >
          {/* Phone icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-[#C9A84C]"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
              clipRule="evenodd"
            />
          </svg>
          Call Now
        </a>

        {/* ── Call Now sticky — desktop version (hidden on mobile, shown on desktop as a side label) ── */}
        <a
          href="tel:+919897012345"
          aria-label="Call Now"
          className="
            hidden md:flex
            fixed bottom-24 right-6 z-50
            items-center gap-2
            px-4 py-2.5 rounded-full
            bg-[#0F1B2D] text-white text-sm font-semibold shadow-xl
            hover:bg-[#1a2d4a] hover:scale-105
            transition-all duration-300 ease-out
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-[#C9A84C]"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
              clipRule="evenodd"
            />
          </svg>
          Call Now
        </a>
      </body>
    </html>
  );
}
