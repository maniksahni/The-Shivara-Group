import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarDays, CheckCircle2, Download, FileText, Heart, MapPin, MessageCircle, Phone, Ruler } from "lucide-react";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { LuxuryButton, SectionHeader, SectionShell } from "@/components/website/LuxurySection";
import { fallbackProperties, siteConfig, type PublicProperty } from "@/components/website/site-data";
import PropertyExperienceClient from "./PropertyExperienceClient";

export const revalidate = 0;

const propertyImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
];

type Props = {
  params: Promise<{ id: string }>;
};

async function getProperty(id: string): Promise<PublicProperty | null> {
  const fallback = fallbackProperties.find((property) => property.id === id);

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
      location: property.location,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      amenities: Array.isArray(property.amenities)
        ? property.amenities.filter((item): item is string => typeof item === "string")
        : [],
      images: Array.isArray(property.images)
        ? property.images.filter((item): item is string => typeof item === "string")
        : [],
      isActive: property.isActive,
      isFeatured: property.isFeatured,
    };
  } catch (error) {
    console.error("Prisma error in property details:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  return {
    title: property ? property.title : "Property Details",
    description: property?.description ?? "Premium property details from The Shivara Group.",
  };
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const gallery = property.images.length > 0 ? property.images : propertyImages;

  return (
    <main className="bg-[#F8F5EE]">
      <section className="bg-[#081120] px-5 pb-10 pt-32 text-white sm:px-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <Link href="/properties" className="text-sm font-bold text-[#F5D67B] transition hover:text-white">
            ← Back to properties
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
                {property.type.replace("_", " ")}
              </p>
              <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-7xl">
                {property.title}
              </h1>
              <p className="mt-5 flex items-center gap-2 text-white/68">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                {property.location}
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                Starting / guide price
              </p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold">
                {property.price}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/56">
                Final pricing and inventory must be confirmed manually before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PropertyExperienceClient property={property} gallery={gallery} />

      <section className="px-5 pb-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.14fr_0.86fr]">
          <div className="rounded-[2.5rem] border border-[#081120]/8 bg-white p-6 shadow-[0_24px_70px_rgba(8,17,32,0.07)]">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#081120]">
              Property overview
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#4B5563]">{property.description}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Fact icon={<BedDouble className="h-5 w-5" />} label="Bedrooms" value={property.bedrooms ? String(property.bedrooms) : "TBC"} />
              <Fact icon={<Bath className="h-5 w-5" />} label="Bathrooms" value={property.bathrooms ? String(property.bathrooms) : "TBC"} />
              <Fact icon={<Ruler className="h-5 w-5" />} label="Area" value={property.area || "TBC"} />
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#081120] p-6 text-white shadow-[0_24px_70px_rgba(8,17,32,0.12)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
              Interested?
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
              Book a private discussion.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  `Hi The Shivara Group, I am interested in ${property.title}. Please share details.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] text-sm font-black uppercase tracking-[0.12em] text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={siteConfig.phoneHref}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-black uppercase tracking-[0.12em] text-[#081120]"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
            <div className="mt-3">
              <LuxuryButton href="/contact#site-visit" variant="outline" className="w-full">
                Book Site Visit
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <div className="rounded-[2.2rem] border border-[#081120]/8 bg-white p-6 shadow-[0_22px_65px_rgba(8,17,32,0.06)]">
            <FileText className="h-7 w-7 text-[#9B7A19]" />
            <h2 className="mt-6 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em] text-[#081120]">
              Floor plans
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#4B5563]">
              Request floor plans, layout details, and unit options directly from the consultant.
            </p>
            <Link
              href="/contact#site-visit"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#081120] px-5 text-sm font-black uppercase tracking-[0.12em] text-white"
            >
              Request floor plan
            </Link>
          </div>

          <div className="rounded-[2.2rem] border border-[#081120]/8 bg-[#081120] p-6 text-white shadow-[0_22px_65px_rgba(8,17,32,0.12)]">
            <MapPin className="h-7 w-7 text-[#D4AF37]" />
            <h2 className="mt-6 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em]">
              Location map
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Get precise location guidance, route details, and visit coordination from the team.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/18 bg-white/[0.055] p-5 text-sm font-bold text-white/58">
              Location guidance • {property.location}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[#D4AF37]/24 bg-[#D4AF37] p-6 text-[#081120] shadow-[0_22px_65px_rgba(212,175,55,0.16)]">
            <Download className="h-7 w-7" />
            <h2 className="mt-6 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em]">
              Brochure
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7">
              Get pricing, availability, specifications, and site visit guidance directly from the team.
            </p>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                `Hi The Shivara Group, please share brochure/details for ${property.title}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#081120] px-5 text-sm font-black uppercase tracking-[0.12em] text-white"
            >
              Request brochure
            </a>
          </div>
        </div>
      </section>

      <SectionShell className="pb-28 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <SectionHeader
            eyebrow="Amenities"
            title="Details to confirm during your visit."
            description="Amenities listed here are either public highlights or CRM inventory details. Treat final specifications as subject to official confirmation."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {property.amenities.length > 0 ? (
              property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 rounded-3xl border border-[#081120]/8 bg-white p-5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10B981]" />
                  <span className="font-bold text-[#081120]">{amenity}</span>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-[#081120]/8 bg-white p-6 text-[#4B5563]">
                Amenities will be shared by the consultant during property shortlisting.
              </div>
            )}
            <div className="flex items-center gap-3 rounded-3xl border border-[#081120]/8 bg-white p-5">
              <CalendarDays className="h-5 w-5 shrink-0 text-[#D4AF37]" />
              <span className="font-bold text-[#081120]">Site visit available by appointment</span>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-[#081120]/8 bg-white p-5">
              <Heart className="h-5 w-5 shrink-0 text-[#D4AF37]" />
              <span className="font-bold text-[#081120]">Save and compare before booking</span>
            </div>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F5EE] p-4 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9B7A19]">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-[#081120]">{value}</p>
    </div>
  );
}
