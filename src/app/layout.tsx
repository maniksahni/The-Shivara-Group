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
    default: "The Shivara Group | Premium Real Estate in Bareilly",
    template: "%s | The Shivara Group",
  },
  description:
    "The Shivara Group — Leading real estate consultancy in Bareilly, Uttar Pradesh. Find your dream apartment, villa, plot, or commercial space with zero brokerage on select properties.",
  keywords: [
    "real estate Bareilly",
    "property in Bareilly",
    "flats in Bareilly",
    "plots in Bareilly UP",
    "Shivara Group",
    "real estate consultancy Bareilly",
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
