import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck2,
  FileText,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import PropertyCard from "@/components/website/PropertyCard";
import DirectEnquiryForm from "@/components/website/DirectEnquiryForm";
import PropertyExperienceClient from "./PropertyExperienceClient";
import {
  advisoryDisclaimer,
  fallbackProperties,
  siteConfig,
  type PublicProperty,
} from "@/components/website/site-data";

export async function generateStaticParams() {
  return fallbackProperties.map((property) => ({
    id: property.id,
  }));
}

type Props = {
  params: Promise<{ id: string }>;
};

async function getProperty(id: string): Promise<PublicProperty | null> {
  const normalizedId = id.toLowerCase();
  const fallback = fallbackProperties.find(
    (property) => property.id.toLowerCase() === normalizedId
  );

  if (fallback) {
    return fallback;
  }

  if (!isDatabaseConfigured) {
    return null;
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || !property.isActive) {
      return null;
    }

    return {
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      priceNumeric: typeof (property as any).priceNumeric === "number" ? (property as any).priceNumeric : undefined,
      location: property.location,
      microLocation: (property as any).microLocation || undefined,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      status: (property as any).status || "Available",
      amenities: Array.isArray(property.amenities)
        ? (property.amenities as unknown[]).filter((item: unknown): item is string => typeof item === "string")
        : [],
      images: Array.isArray(property.images)
        ? (property.images as unknown[]).filter((item: unknown): item is string => typeof item === "string")
        : [],
      isActive: property.isActive,
      isFeatured: property.isFeatured,
      isVerified: true,
      highlights: (property as any).highlights || [],
      specifications: (property as any).specifications || {},
      nearbyLandmarks: (property as any).nearbyLandmarks || [],
      floorPlanAvailable: (property as any).floorPlanAvailable ?? true,
    };
  } catch (error) {
    console.error("Prisma error in property details:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Property Not Found | The Shivara Group",
      description: "The requested property is currently unavailable or has been archived.",
    };
  }

  const title = `${property.title} | The Shivara Group`;
  const description = property.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/properties/${property.id}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/properties/${property.id}`,
      images: property.images.length > 0 ? [property.images[0]] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: property.images.length > 0 ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const gallery =
    property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        ];

  // Similar properties recommendation (excluding current)
  const similarProperties = fallbackProperties
    .filter((p) => p.id !== property.id && (p.type === property.type || p.location.includes("Bareilly")))
    .slice(0, 3);

  // JSON-LD Structured Data for Real Estate Listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: property.title,
    description: property.description,
    image: gallery,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.3670",
      longitude: "79.4304",
    },
    numberOfRooms: property.bedrooms || undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: property.priceNumeric ? String(property.priceNumeric) : undefined,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: property.priceNumeric ? String(property.priceNumeric) : undefined,
        priceCurrency: "INR",
      },
      seller: {
        "@type": "RealEstateAgent",
        name: siteConfig.name,
        telephone: siteConfig.phone,
        url: "https://shivara.site",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://shivara.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: "https://shivara.site/properties",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: `https://shivara.site/properties/${property.id}`,
      },
    ],
  };

  const whatsappInquiryHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi The Shivara Group, I am reviewing ${property.title} (${property.location}). Please share floor plans, pricing breakup, and availability.`
  )}`;

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#081120]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ============================================================ */}
      {/* 1. PROPERTY HEADER & BREADCRUMBS */}
      {/* ============================================================ */}
      <section className="bg-[#081120] px-4 pb-8 pt-[5.6rem] text-white sm:px-8 sm:pb-12 sm:pt-32 lg:px-12 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            <Link href="/properties" className="hover:text-white transition">
              Properties
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            <span className="truncate text-[#F5D67B]">{property.title}</span>
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                  {property.type.replace("_", " ")}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300">
                  {property.status}
                </span>
                {property.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#F5D67B]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Shivara Verified
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl lg:text-6xl">
                {property.title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-white/70 sm:text-base">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                <span>{property.location}</span>
                {property.microLocation && (
                  <span className="text-white/40">&bull; {property.microLocation}</span>
                )}
              </p>
            </div>

            {/* Price Badge */}
            <div className="rounded-[1.8rem] border border-[#D4AF37]/30 bg-white/[0.05] p-5 backdrop-blur-md sm:p-6 lg:min-w-[280px]">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                Price Guide
              </p>
              <p className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-semibold sm:text-4xl">
                {property.price}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Confirmed with owner/developer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. HERO IMAGE GALLERY & STICKY SUMMARY COMPONENT */}
      {/* ============================================================ */}
      <PropertyExperienceClient property={property} gallery={gallery} />

      {/* ============================================================ */}
      {/* 3. VERIFICATION INTEGRITY & TRANSPARENCY NOTICE */}
      {/* ============================================================ */}
      <section className="px-4 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[1.8rem] border border-[#D4AF37]/30 bg-[#FFF9E8] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 text-[#9B7A19] shrink-0" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-[#081120]">
                  Shivara Advisory & Verification Notice
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#4B5563]">
                  <strong>Shivara Verified Information:</strong> On-ground site inspection, developer/owner identity check, and active availability confirmation.
                  <br />
                  <strong>Public / Transaction Disclaimer:</strong> Buyers are advised to independently verify municipal sanction plans, title deeds, and registry clearances prior to financial commitments.
                </p>
              </div>
            </div>
            <a
              href={whatsappInquiryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#081120] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#D4AF37] hover:text-[#081120]"
            >
              <FileCheck2 className="h-4 w-4 text-[#D4AF37]" />
              <span>Request Verification Dossier</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. OVERVIEW, SPECS & HIGHLIGHTS */}
      {/* ============================================================ */}
      <section className="px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Main Description & Specifications */}
          <div className="space-y-8">
            {/* Overview */}
            <div className="rounded-[2.2rem] border border-[#081120]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#081120] sm:text-3xl">
                Property Overview
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#4B5563] sm:text-base sm:leading-8">
                {property.description}
              </p>

              {/* Core Facts Grid */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div className="rounded-2xl bg-[#F8F5EE] p-4 text-center">
                  <BedDouble className="mx-auto h-5 w-5 text-[#9B7A19]" />
                  <p className="mt-2 text-[10px] font-black uppercase text-[#6B7280]">Bedrooms</p>
                  <p className="text-sm font-black text-[#081120]">
                    {property.bedrooms ? `${property.bedrooms} BHK` : "Custom"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4 text-center">
                  <Bath className="mx-auto h-5 w-5 text-[#9B7A19]" />
                  <p className="mt-2 text-[10px] font-black uppercase text-[#6B7280]">Bathrooms</p>
                  <p className="text-sm font-black text-[#081120]">
                    {property.bathrooms ? `${property.bathrooms} Baths` : "Verified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4 text-center">
                  <Ruler className="mx-auto h-5 w-5 text-[#9B7A19]" />
                  <p className="mt-2 text-[10px] font-black uppercase text-[#6B7280]">Super Area</p>
                  <p className="text-sm font-black text-[#081120]">
                    {property.area || "On Request"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4 text-center">
                  <Building2 className="mx-auto h-5 w-5 text-[#9B7A19]" />
                  <p className="mt-2 text-[10px] font-black uppercase text-[#6B7280]">Status</p>
                  <p className="text-sm font-black text-[#081120]">
                    {property.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <div className="rounded-[2.2rem] border border-[#081120]/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#081120] sm:text-2xl">
                  Key Architectural & Lifestyle Highlights
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {property.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-3 rounded-xl bg-[#F8F5EE] p-3.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#10B981] shrink-0" />
                      <span className="text-xs font-semibold text-[#081120] sm:text-sm">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Matrix Table */}
            {property.specifications && Object.keys(property.specifications).length > 0 && (
              <div className="rounded-[2.2rem] border border-[#081120]/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#081120] sm:text-2xl">
                  Technical Specifications
                </h2>
                <div className="mt-5 divide-y divide-[#081120]/8">
                  {Object.entries(property.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[1fr_1.5fr] py-3 text-xs sm:text-sm">
                      <span className="font-bold text-[#4B5563]">{key}</span>
                      <span className="font-semibold text-[#081120]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="rounded-[2.2rem] border border-[#081120]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#081120] sm:text-2xl">
                Amenities & Features
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 rounded-xl border border-[#081120]/8 bg-[#F8F5EE] p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                    <span className="text-xs font-bold text-[#081120] sm:text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plan Request Card */}
            <div className="rounded-[2.2rem] border border-[#D4AF37]/30 bg-[#081120] p-6 text-white shadow-md sm:p-8">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#F5D67B]">
                <FileText className="h-4 w-4" />
                Floor Plans & Layout Diagrams
              </div>
              <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold sm:text-3xl">
                Detailed Layouts & Architectural Blueprints
              </h3>
              <p className="mt-3 text-xs leading-6 text-white/70 sm:text-sm">
                Architectural layouts, carpet area calculations, and structural demarcations are available
                on request directly from our advisory desk.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappInquiryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-xs font-black uppercase tracking-[0.12em] text-white shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  Request Floor Plan on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Landmarks, Video Consultation & Enquiry Form */}
          <div className="space-y-6">
            {/* Nearby Landmarks */}
            {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
              <div className="rounded-[2.2rem] border border-[#081120]/10 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9B7A19]">
                  <Navigation className="h-4 w-4" />
                  Connectivity & Landmarks
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#081120]">
                  Micro-Location Advantage
                </h3>
                <div className="mt-5 space-y-3">
                  {property.nearbyLandmarks.map((landmark) => (
                    <div
                      key={landmark.name}
                      className="flex items-center justify-between rounded-xl bg-[#F8F5EE] p-3 text-xs font-semibold"
                    >
                      <span className="text-[#081120]">{landmark.name}</span>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-[#9B7A19] shadow-sm">
                        {landmark.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Video Walkthrough Notice */}
            <div className="rounded-[2.2rem] border border-[#081120]/10 bg-white p-6 shadow-sm sm:p-7">
              <span className="inline-block rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#9B7A19]">
                Virtual Walkthrough
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#081120]">
                Video & Drone Walkthrough
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#6B7280]">
                Private video walkthroughs and drone elevation clips are available for out-of-station and NRI buyers.
              </p>
              <a
                href={whatsappInquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#081120]/15 bg-[#F8F5EE] text-xs font-bold text-[#081120] transition hover:bg-[#081120] hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-[#10B981]" />
                Request Video Walkthrough
              </a>
            </div>

            {/* Fast Advisor Contact Widget */}
            <div className="rounded-[2.2rem] bg-[#081120] p-6 text-white shadow-lg sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                Dedicated Consultant
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-semibold">
                Have questions about {property.title}?
              </h3>
              <p className="mt-2 text-xs leading-5 text-white/70">
                Our Bareilly property specialist is ready to answer questions regarding registry,
                negotiation margin, and site visit scheduling.
              </p>
              <div className="mt-5 space-y-2.5">
                <a
                  href={siteConfig.phoneHref}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-black uppercase tracking-wider text-[#081120] shadow-sm"
                >
                  <Phone className="h-4 w-4" />
                  Call: {siteConfig.phone}
                </a>
                <a
                  href={whatsappInquiryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] text-xs font-black uppercase tracking-wider text-white shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Instant WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DEDICATED PROPERTY ENQUIRY FORM */}
      {/* ============================================================ */}
      <section className="px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <DirectEnquiryForm />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SIMILAR PROPERTIES */}
      {/* ============================================================ */}
      {similarProperties.length > 0 && (
        <section className="border-t border-[#081120]/10 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between border-b border-[#081120]/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
                  Related Listings
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#081120] sm:text-3xl">
                  Similar Properties You May Like
                </h2>
              </div>
              <Link
                href="/properties"
                className="text-xs font-bold text-[#081120] hover:text-[#9B7A19] transition"
              >
                View Catalog &rarr;
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((similar) => (
                <PropertyCard key={similar.id} property={similar} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
