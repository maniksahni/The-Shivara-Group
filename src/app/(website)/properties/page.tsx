import type { Metadata } from "next";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import ClientPropertiesGrid from "./ClientPropertiesGrid";
import {
  fallbackProperties,
  sampleSeedTitles,
  type PublicProperty,
} from "@/components/website/site-data";

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
        </div>
      </section>

      <section className="px-5 py-12 pb-28 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <ClientPropertiesGrid initialProperties={properties} />
        </div>
      </section>
    </main>
  );
}
