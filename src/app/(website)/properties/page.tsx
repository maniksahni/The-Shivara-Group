import type { Metadata } from "next";
import { BadgeCheck, Building2, MapPinned, MessageCircle, Search, Sparkles } from "lucide-react";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import ClientPropertiesGrid from "./ClientPropertiesGrid";
import PropertyMatchFinder from "@/components/website/PropertyMatchFinder";
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
      <section className="relative overflow-hidden bg-[#081120] px-4 pb-12 pt-[5.8rem] text-white sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-[#D4AF37]/20 bg-white/[0.06] px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] backdrop-blur sm:text-xs sm:tracking-[0.34em]">
            Verified catalog
          </p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.74fr] lg:items-end">
            <h1 className="font-[family-name:var(--font-playfair)] text-[2.7rem] font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl sm:tracking-[-0.06em] lg:text-8xl">
              Premium properties, curated for serious buyers.
            </h1>
            <div>
              <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Explore verified public highlights and active inventory with filters for property
                type, budget comfort, location, and site-visit readiness.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href="#properties-list" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#081120]">
                  <Search className="h-4 w-4" />
                  Search
                </a>
                <a href="https://wa.me/917060788407?text=Hi%20The%20Shivara%20Group%2C%20please%20help%20me%20shortlist%20properties." target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-4 text-xs font-black uppercase tracking-[0.12em] text-white">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
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

      <section id="properties-list" className="px-4 py-10 pb-28 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl space-y-10">
          <PropertyMatchFinder compact />
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
