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
  title: "The Shivara Group | Bespoke Real Estate Strategies",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
      </head>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
