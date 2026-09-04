import { Suspense } from "react";
import type { Metadata } from "next";
import { MessageCircle, Search } from "lucide-react";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import ClientPropertiesGrid from "./ClientPropertiesGrid";
import {
  fallbackProperties,
  sampleSeedTitles,
  siteConfig,
  type PublicProperty,
} from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "Properties for Sale in Bareilly — Villas, Kothis, Plots, Apartments",
  description:
    "Browse verified properties for sale in Bareilly — luxury villas, park-facing kothis, residential plots, premium apartments, and commercial properties. Expert guidance, guided site visits, and WhatsApp enquiry by The Shivara Group.",
  alternates: {
    canonical: "/properties",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Properties for Sale in Bareilly | The Shivara Group",
    description:
      "Explore verified properties in Bareilly — villas, kothis, plots, apartments and investment opportunities. Book site visits with expert guidance.",
    type: "website",
    url: "https://shivara.site/properties",
    images: [{ url: "https://shivara.site/logo.png", width: 676, height: 676, alt: "The Shivara Group Properties in Bareilly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Sale in Bareilly | The Shivara Group",
    description: "Browse verified villas, kothis, plots and apartments in Bareilly with site visit assistance.",
    images: ["https://shivara.site/logo.png"],
  },
};


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

    properties = (databaseProperties as Array<Record<string, any>>).map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      priceNumeric: typeof property.priceNumeric === "number" ? property.priceNumeric : undefined,
      location: property.location,
      microLocation: property.microLocation || undefined,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      status: property.status || "Available",
      amenities: Array.isArray(property.amenities)
        ? (property.amenities as unknown[]).filter((item: unknown): item is string => typeof item === "string")
        : [],
      images: Array.isArray(property.images)
        ? (property.images as unknown[]).filter((item: unknown): item is string => typeof item === "string")
        : [],
      isActive: property.isActive,
      isFeatured: property.isFeatured,
      isVerified: true,
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
      <section className="relative overflow-hidden bg-[#081120] px-4 pb-7 pt-[5.2rem] text-white sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(212,175,55,0.24),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(180deg,rgba(8,17,32,0.12),#081120)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-[#D4AF37]/20 bg-white/[0.06] px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] backdrop-blur sm:text-xs sm:tracking-[0.34em]">
            Verified catalog
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_0.74fr] lg:items-end">
            <h1 className="font-[family-name:var(--font-playfair)] text-[2.35rem] font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl sm:tracking-[-0.06em] lg:text-8xl">
              Premium properties, curated for serious buyers.
            </h1>
            <div>
              <p className="text-[15px] leading-6 text-white/70 sm:text-lg sm:leading-8">
                Explore verified residential properties in Bareilly, commercial properties,
                plots, and investment opportunities with filters for budget, location, and
                site-visit readiness.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href="#properties-list" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#081120]">
                  <Search className="h-4 w-4" />
                  Search
                </a>
                <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-4 text-xs font-black uppercase tracking-[0.12em] text-white">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="properties-list" className="px-4 py-6 pb-28 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading properties…</div>}>
            <ClientPropertiesGrid initialProperties={properties} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
