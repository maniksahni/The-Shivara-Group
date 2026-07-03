import React from "react";
import Link from "next/link";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { Property, PropertyType } from "@prisma/client";
import ClientPropertiesGrid from "./ClientPropertiesGrid";

export const revalidate = 0; // Fetch fresh properties on every request

const defaultProperties = [
  {
    id: "aurika-the-residences",
    title: "Aurika The Residences",
    description: "Public Instagram content highlights The Residences by Aurika as a premium Bareilly opportunity. Call The Shivara Group for verified pricing, floor plans, and site visits.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: null,
    bathrooms: null,
    area: "Floor plans on request",
    amenities: ["Premium Residences", "Bareilly", "Site Visit Available", "Floor Plans on Request"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "amara-villas-bareilly",
    title: "Amara Villas by Aurika",
    description: "A premium villa project publicly referenced by The Shivara Group. Exact availability and pricing should be confirmed directly with the team.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.VILLA,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: ["Villa Community", "Premium Living", "Pricing on Request", "Site Visit Available"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "the-residences-plots",
    title: "The Residences by Aurika — Plots",
    description: "Public posts describe plot ownership at The Residences by Aurika. Contact The Shivara Group for official inventory and site visit scheduling.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.PLOT,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: ["Residential Plots", "Aurika", "Bareilly", "Site Visit Available"],
    images: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: "rajendar-nagar-3bhk",
    title: "Rajendar Nagar 3BHK Homes",
    description: "Instagram snippets reference 3BHK homes in Rajendar Nagar, Bareilly. Exact unit details and price should be confirmed manually.",
    price: "Contact for pricing",
    location: "Rajendar Nagar, Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: ["3BHK Homes", "Rajendar Nagar", "Bareilly", "Call for Details"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "flower-city-bareilly",
    title: "Flower City, Bareilly",
    description: "Flower City appears in public Instagram snippets as an investment/property highlight. Confirm official pricing and inventory before publishing final details.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.PLOT,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: ["Investment Highlight", "Bareilly", "Inventory on Request", "Site Visit Available"],
    images: [],
    isActive: true,
    isFeatured: false,
  },
];

type PublicProperty = Omit<
  Property,
  "createdAt" | "updatedAt" | "amenities" | "images"
> & {
  amenities: string[];
  images: string[];
};

const sampleSeedTitles = new Set([
  "3 BHK Premium Apartment — Civil Lines",
  "Luxury 4 BHK Villa — Pilibhit Road",
  "Residential Plot — Cantt Area",
  "Commercial Shop — Kutchery Road",
  "2 BHK Ready-to-Move Apartment — Subhash Nagar",
  "Farmhouse with Agricultural Land — Nawabganj Road",
]);

export default async function PropertiesPage() {
  let properties: PublicProperty[] = [];

  try {
    if (!isDatabaseConfigured) {
      throw new Error("Database is not configured; using development fallback properties.");
    }
    const databaseProperties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    properties = databaseProperties.map((property) => ({
      ...property,
      amenities: Array.isArray(property.amenities)
        ? property.amenities.filter(
            (item): item is string => typeof item === "string"
          )
        : [],
      images: Array.isArray(property.images)
        ? property.images.filter(
            (item): item is string => typeof item === "string"
          )
        : [],
    }));
  } catch (error) {
    if (isDatabaseConfigured) {
      console.error("Prisma error in properties list:", error);
    }
  }

  const onlySampleSeedData =
    properties.length > 0 &&
    properties.every((property) => sampleSeedTitles.has(property.title));

  // Fallback to Instagram-aligned public catalog if DB is empty, fails, or only
  // contains starter seed records.
  if (properties.length === 0 || onlySampleSeedData) {
    properties = defaultProperties;
  }

  return (
    <main className="bg-[#F8F7F4] min-h-screen text-[#1A1A2E] font-[family-name:var(--font-inter)]">
      {/* ── Header banner ── */}
      <section className="relative py-20 bg-[#0F1B2D] text-white overflow-hidden" aria-label="Properties Banner">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #C9A84C 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.2em]">Verified Catalog</span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold tracking-tight">
            Our Property Listings
          </h1>
          <p className="mt-2 max-w-xl text-white/70 text-sm sm:text-base">
            Explore publicly highlighted opportunities from The Shivara Group, including Aurika, villa communities, plots, and 3BHK homes. Pricing and inventory should be confirmed directly.
          </p>
        </div>
      </section>

      {/* ── Client properties list with live filters ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ClientPropertiesGrid initialProperties={properties} />
      </div>
    </main>
  );
}
