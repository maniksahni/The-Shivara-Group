"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PropertyType } from "@prisma/client";
import { Bath, BedDouble, Heart, MapPin, MessageCircle, Phone, Ruler, Search, Sparkles } from "lucide-react";
import ClientEnquiryModal from "./ClientEnquiryModal";
import { siteConfig, type PublicProperty } from "@/components/website/site-data";

const propertyImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
];

const filterTabs = [
  { value: "ALL", label: "All" },
  { value: PropertyType.APARTMENT, label: "Apartments" },
  { value: PropertyType.VILLA, label: "Villas" },
  { value: PropertyType.PLOT, label: "Plots" },
  { value: PropertyType.COMMERCIAL, label: "Commercial" },
  { value: PropertyType.FARMHOUSE, label: "Farmhouse" },
];

export default function ClientPropertiesGrid({
  initialProperties,
}: {
  initialProperties: PublicProperty[];
}) {
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<PublicProperty | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialProperties.filter((property) => {
      const matchesType = selectedType === "ALL" || property.type === selectedType;
      const matchesSearch =
        !query ||
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [initialProperties, searchQuery, selectedType]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#081120]/8 bg-white p-4 shadow-[0_24px_70px_rgba(8,17,32,0.07)] sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9B7A19]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search project, location, category..."
              className="min-h-14 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-[#6B7280]/70 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/14"
            />
          </div>
          <div className="premium-scrollbar flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedType(tab.value)}
                className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-[0.14em] transition ${
                  selectedType === tab.value
                    ? "bg-[#081120] text-white"
                    : "bg-[#F8F5EE] text-[#4B5563] hover:bg-[#D4AF37] hover:text-[#081120]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
            {filteredProperties.length} properties found
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#081120]">
            Curated opportunities
          </h2>
        </div>
        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-12 items-center gap-2 rounded-full bg-[#10B981] px-5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 sm:inline-flex"
        >
          <MessageCircle className="h-4 w-4" />
          Ask on WhatsApp
        </a>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="rounded-[2.4rem] border border-[#081120]/8 bg-white p-10 text-center shadow-[0_24px_70px_rgba(8,17,32,0.07)]">
          <Search className="mx-auto h-12 w-12 text-[#D4AF37]" />
          <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
            No matching properties found.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#4B5563]">
            Try another category or send your requirement. The team can manually shortlist options.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("ALL");
            }}
            className="mt-6 min-h-12 rounded-full bg-[#081120] px-6 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property, index) => {
            const image = property.images[0] || propertyImages[index % propertyImages.length];
            const isSaved = savedIds.has(property.id);
            return (
              <article
                key={property.id}
                className="group overflow-hidden rounded-[2.2rem] border border-[#081120]/8 bg-white shadow-[0_24px_70px_rgba(8,17,32,0.07)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_32px_90px_rgba(8,17,32,0.16)]"
              >
                <Link href={`/properties/${property.id}`} className="block">
                  <div
                    className="relative h-72 overflow-hidden bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{
                      backgroundImage: `linear-gradient(180deg,rgba(8,17,32,0.02),rgba(8,17,32,0.68)),url(${image})`,
                    }}
                  >
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#081120]">
                        {property.type.replace("_", " ")}
                      </span>
                      {property.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#081120]">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        toggleSaved(property.id);
                      }}
                      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#081120] shadow-lg transition hover:scale-105"
                      aria-label={isSaved ? "Remove saved property" : "Save property"}
                    >
                      <Heart className={`h-5 w-5 ${isSaved ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5D67B]">
                        {property.price}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight">
                        {property.title}
                      </h3>
                    </div>
                  </div>
                </Link>

                <div className="p-6">
                  <p className="flex items-center gap-2 text-sm font-bold text-[#4B5563]">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {property.location}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Fact icon={<BedDouble className="h-4 w-4" />} value={property.bedrooms ? `${property.bedrooms} Beds` : "On request"} />
                    <Fact icon={<Bath className="h-4 w-4" />} value={property.bathrooms ? `${property.bathrooms} Baths` : "Verified"} />
                    <Fact icon={<Ruler className="h-4 w-4" />} value={property.area || "Area TBC"} />
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-7 text-[#4B5563]">
                    {property.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-[#F8F5EE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4B5563]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProperty(property)}
                      className="min-h-12 rounded-full bg-[#081120] px-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#D4AF37] hover:text-[#081120]"
                    >
                      Quick Enquiry
                    </button>
                    <a
                      href={siteConfig.phoneHref}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F5EE] text-[#081120]"
                      aria-label="Call"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                        `Hi The Shivara Group, I am interested in ${property.title}. Please share details.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-white"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedProperty && (
        <ClientEnquiryModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

function Fact({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[#F8F5EE] p-3 text-center">
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#9B7A19]">
        {icon}
      </div>
      <p className="truncate text-[11px] font-black uppercase tracking-[0.08em] text-[#4B5563]">
        {value}
      </p>
    </div>
  );
}
