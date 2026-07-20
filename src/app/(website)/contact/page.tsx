import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact The Shivara Group | Real Estate Consultants in Bareilly",
  description:
    "Contact The Shivara Group for property buying, selling, investment consultation, site visits, home loan support, and documentation assistance in Bareilly.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact The Shivara Group | Real Estate Consultants in Bareilly",
    description:
      "Book a site visit, call, or WhatsApp The Shivara Group for verified property consultation in Bareilly.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
