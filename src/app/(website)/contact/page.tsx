import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Our Real Estate Consultants in Bareilly \u2014 Call, WhatsApp or Visit",
  description:
    "Contact The Shivara Group for property buying, site visit bookings, investment consultation, and pricing guidance in Bareilly, UP. Call +91 7060788407 or WhatsApp for instant advisory support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact The Shivara Group | Real Estate Advisory in Bareilly",
    description:
      "Book a site visit, call, or WhatsApp The Shivara Group for verified property advisory and consultation in Bareilly, UP.",
    type: "website",
    url: "https://shivara.site/contact",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "The Shivara Group Contact" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact The Shivara Group | Real Estate Advisory in Bareilly",
    description: "Call or WhatsApp The Shivara Group for verified property advisory and site visit booking in Bareilly.",
    images: ["https://shivara.site/logo.png"],
  },
};


export default function ContactPage() {
  return <ContactClient />;
}
