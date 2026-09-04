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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png?v=3", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/logo.png?v=3", sizes: "any", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [
      { url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" },
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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png?v=3" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="Shivara" />
        <meta name="theme-color" content="#081120" />
      </head>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
