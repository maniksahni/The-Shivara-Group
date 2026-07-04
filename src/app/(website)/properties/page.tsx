import type { Metadata } from "next";
import { BadgeCheck, Building2, MapPinned, Sparkles } from "lucide-react";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import ClientPropertiesGrid from "./ClientPropertiesGrid";
import {
  partnerPlaceholders,
  fallbackProperties,
  sampleSeedTitles,
  type PublicProperty,
} from "@/components/website/site-data";
import { SectionShell } from "@/components/website/LuxurySection";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Explore premium apartments, villas, plots, commercial spaces, and verified property opportunities from The Shivara Group.",
};

export const revalidate = 0;

async function getProperties(): Promise<PublicProperty[]> {
  let properties: PublicProperty[] = [];

  try {
    if (!isDatabaseConfigured) {
      throw new Error("Database is not configured; using fallback public catalog.");
    }

    const databaseProperties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    properties = databaseProperties.map((property) => ({
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
    }));
  } catch (error) {
    if (isDatabaseConfigured) {
      console.error("Prisma error in public properties list:", error);
    }
  }

  const onlySampleSeedData =
    properties.length > 0 &&
    properties.every((property) => sampleSeedTitles.has(property.title));

  return properties.length === 0 || onlySampleSeedData ? fallbackProperties : properties;
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="bg-[#F8F5EE]">
      <section className="relative overflow-hidden bg-[#081120] px-5 pb-16 pt-32 text-white sm:px-8 lg:px-12 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
            Verified catalog
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.74fr] lg:items-end">
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              Premium properties, curated for serious buyers.
            </h1>
            <p className="text-lg leading-8 text-white/66">
              Explore public highlights and active CRM inventory. Pricing and final availability
              should be confirmed directly with The Shivara Group.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Verified visibility", "Active public listings only", BadgeCheck],
              ["Guided shortlist", "Compare category, location and visit readiness", MapPinned],
              ["Site visit CTA", "Move from browsing to appointment", Sparkles],
            ].map(([title, text, Icon]) => (
              <div key={title as string} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-white">
                  {title as string}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/58">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 pb-28 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <ClientPropertiesGrid initialProperties={properties} />
        </div>
      </section>

      <SectionShell className="bg-white pb-28 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#9B7A19]">
              Verification desk
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-[-0.04em] text-[#081120] sm:text-5xl">
              Every listing deserves a direct confirmation before booking.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#4B5563]">
              This catalog is designed for premium discovery. Final pricing, official inventory,
              payment plans, maps, and loan support should be confirmed by The Shivara Group team.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {partnerPlaceholders.map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-[#F8F5EE] p-5">
                <Building2 className="h-5 w-5 text-[#9B7A19]" />
                <p className="mt-4 text-sm font-black text-[#081120]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
