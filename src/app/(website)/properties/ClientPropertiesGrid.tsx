"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PropertyType } from "@prisma/client";
import { Bath, BedDouble, CalendarDays, Heart, MapPin, MessageCircle, Phone, Ruler, Search, Sparkles } from "lucide-react";
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

const budgetTabs = ["All Budgets", "Under 25 Lakh", "25–50 Lakh", "50 Lakh–1 Cr", "1 Cr+", "Contact for pricing"];

const locationTabs = ["All Locations", "Bareilly", "Rajendar Nagar", "Aurika", "Delhi NCR"];

export default function ClientPropertiesGrid({
  initialProperties,
}: {
  initialProperties: PublicProperty[];
}) {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");
  const initialQuery = searchParams.get("q") ?? "";
  const [selectedType, setSelectedType] = useState(
    initialType && filterTabs.some((tab) => tab.value === initialType) ? initialType : "ALL",
  );
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedProperty, setSelectedProperty] = useState<PublicProperty | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialProperties.filter((property) => {
      const matchesType = selectedType === "ALL" || property.type === selectedType;
      const price = property.price.toLowerCase();
      const matchesBudget =
        selectedBudget === "All Budgets" ||
        (selectedBudget === "Contact for pricing"
          ? price.includes("contact") || price.includes("request")
          : price.includes(selectedBudget.toLowerCase().replace("–", "–")) ||
            property.description.toLowerCase().includes(selectedBudget.toLowerCase()));
      const matchesLocation =
        selectedLocation === "All Locations" ||
        property.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        property.title.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        property.description.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesSearch =
        !query ||
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query);
      return matchesType && matchesBudget && matchesLocation && matchesSearch;
    });
  }, [initialProperties, searchQuery, selectedBudget, selectedLocation, selectedType]);

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
      <div className="rounded-[1.6rem] border border-[#081120]/8 bg-white p-3.5 shadow-[0_24px_70px_rgba(8,17,32,0.07)] sm:rounded-[2rem] sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9B7A19]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search project, location, category..."
              className="min-h-13 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-[#6B7280]/70 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/14 sm:min-h-14"
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
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="premium-scrollbar flex gap-2 overflow-x-auto pb-1">
            {budgetTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedBudget(tab)}
                className={`min-h-10 shrink-0 rounded-full px-3 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                  selectedBudget === tab
                    ? "bg-[#D4AF37] text-[#081120]"
                    : "bg-[#F8F5EE] text-[#4B5563] hover:bg-[#081120] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="premium-scrollbar flex gap-2 overflow-x-auto pb-1 lg:justify-end">
            {locationTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedLocation(tab)}
                className={`min-h-10 shrink-0 rounded-full px-3 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                  selectedLocation === tab
                    ? "bg-[#081120] text-white"
                    : "bg-[#F8F5EE] text-[#4B5563] hover:bg-[#D4AF37] hover:text-[#081120]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
            {filteredProperties.length} properties found
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-[2rem] font-semibold leading-none tracking-[-0.035em] text-[#081120] sm:text-3xl">
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
              setSelectedBudget("All Budgets");
              setSelectedLocation("All Locations");
            }}
            className="mt-6 min-h-12 rounded-full bg-[#081120] px-6 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property, index) => {
            const image = property.images[0] || propertyImages[index % propertyImages.length];
            const isSaved = savedIds.has(property.id);
            return (
              <article
                key={property.id}
                className="group overflow-hidden rounded-[1.75rem] border border-[#081120]/8 bg-white shadow-[0_20px_58px_rgba(8,17,32,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_32px_90px_rgba(8,17,32,0.16)] sm:rounded-[2.2rem]"
              >
                <Link href={`/properties/${property.id}`} className="block">
                  <div
                    className="relative h-64 overflow-hidden bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02] sm:h-72"
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
                      <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-playfair)] text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-3xl">
                        {property.title}
                      </h3>
                    </div>
                  </div>
                </Link>

                <div className="p-4 sm:p-6">
                  <p className="flex items-center gap-2 text-sm font-bold text-[#4B5563]">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {property.location}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Fact icon={<BedDouble className="h-4 w-4" />} value={property.bedrooms ? `${property.bedrooms} Beds` : "On request"} />
                    <Fact icon={<Bath className="h-4 w-4" />} value={property.bathrooms ? `${property.bathrooms} Baths` : "Verified"} />
                    <Fact icon={<Ruler className="h-4 w-4" />} value={property.area || "Area TBC"} />
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#4B5563] sm:leading-7">
                    {property.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-[#F8F5EE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4B5563]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <Link
                      href={`/properties/${property.id}`}
                      className="col-span-2 flex min-h-12 items-center justify-center rounded-full bg-[#081120] px-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#D4AF37] hover:text-[#081120] sm:col-span-1"
                    >
                      View Details
                    </Link>
                    <a
                      href={siteConfig.phoneHref}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#F8F5EE] text-xs font-black text-[#081120] sm:w-12"
                      aria-label="Call"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="sm:hidden">Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                        `Hi The Shivara Group, I am interested in ${property.title}. Please share details.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#10B981] text-xs font-black text-white sm:w-12"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="sm:hidden">WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedProperty(property)}
                      className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#FFF9E8] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#081120] transition hover:bg-[#D4AF37]"
                    >
                      <CalendarDays className="h-4 w-4" />
                      Book Site Visit
                    </button>
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
