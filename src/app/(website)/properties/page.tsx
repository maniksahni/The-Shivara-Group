import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyType } from "@prisma/client";
import { Building2, Search, MapPin, Check } from "lucide-react";
import ClientPropertiesGrid from "./ClientPropertiesGrid";

export const revalidate = 0; // Fetch fresh properties on every request

const defaultProperties = [
  {
    id: "civil-lines-3bhk",
    title: "3BHK Luxury Apartment in Civil Lines",
    description: "Premium 3BHK flat located in Bareilly's most elite neighborhood. Offers modular kitchen, marble flooring, and 24x7 elevator and security.",
    price: "₹45 Lakh",
    location: "Civil Lines, Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: 2,
    area: "1,450 sqft",
    amenities: ["Modular Kitchen", "Marble Flooring", "Lift", "Security Guard", "Parking"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "pilibhit-road-villa",
    title: "4BHK Independent Villa",
    description: "Beautiful independent duplex villa with a small garden, spacious balcony, modular fixtures, and separate servant quarter.",
    price: "₹85 Lakh",
    location: "Pilibhit Road, Bareilly",
    type: PropertyType.VILLA,
    bedrooms: 4,
    bathrooms: 4,
    area: "2,400 sqft",
    amenities: ["Duplex", "Private Lawn", "Balcony", "Security Systems", "Servant Room"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cantt-plot",
    title: "Residential Plot near Cantt Area",
    description: "East-facing residential plot in a gated colony. Highly secure locality, close to schools and shopping centers. Clear titles and registry ready.",
    price: "₹18 Lakh",
    location: "Cantt Area, Bareilly",
    type: PropertyType.PLOT,
    bedrooms: null,
    bathrooms: null,
    area: "1,800 sqft",
    amenities: ["Gated Colony", "24/7 Water Supply", "East Facing", "Registry Ready"],
    images: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: "kutchery-shop",
    title: "Commercial Retail Space",
    description: "Prime ground floor retail showroom location near Kutchery Road. High visibility and high footfall. Ideal for banks, retail outlets, or offices.",
    price: "₹75 Lakh",
    location: "Kutchery Road, Bareilly",
    type: PropertyType.COMMERCIAL,
    bedrooms: null,
    bathrooms: 1,
    area: "2,200 sqft",
    amenities: ["Prime Location", "Ground Floor", "High Footfall", "Glass Front"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "nawabganj-farmhouse",
    title: "Premium Weekend Farmhouse",
    description: "Lush green weekend getaway farmhouse on Nawabganj Road. Features a small plunge pool, organic vegetable garden, and 2-room cottage.",
    price: "₹1.2 Cr",
    location: "Nawabganj Road, Bareilly",
    type: PropertyType.FARMHOUSE,
    bedrooms: 2,
    bathrooms: 2,
    area: "5,000 sqft",
    amenities: ["Plunge Pool", "Organic Garden", "Boundary Wall", "Cottage", "Fruit Trees"],
    images: [],
    isActive: true,
    isFeatured: false,
  },
];

export default async function PropertiesPage() {
  let properties = [];

  try {
    properties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Prisma error in properties list:", error);
  }

  // Fallback to default properties if DB is empty or fails
  if (properties.length === 0) {
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
            Explore premium houses, commercial spaces, and residential plots in Bareilly with complete transparency and zero brokerage on select deals.
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
