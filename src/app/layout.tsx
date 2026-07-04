import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Shivara Group | Bespoke Real Estate Strategies",
    template: "%s | The Shivara Group",
  },
  description:
    "The Shivara Group — bespoke real estate strategies for Bareilly and Delhi NCR, including premium homes, plots, villas, off-market opportunities, and portfolio guidance.",
  keywords: [
    "real estate Bareilly",
    "property in Bareilly",
    "Rajendar Nagar 3BHK",
    "plots in Bareilly UP",
    "Shivara Group",
    "Aurika Bareilly",
    "Godrej Golf Links",
    "Bento by Gaurs",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "The Shivara Group",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
