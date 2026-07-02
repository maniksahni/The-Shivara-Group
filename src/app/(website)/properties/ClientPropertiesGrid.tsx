"use client";

import React, { useState } from "react";
import { PropertyType } from "@prisma/client";
import { Search, MapPin, Sparkles } from "lucide-react";
import ClientEnquiryModal from "./ClientEnquiryModal";

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export default function ClientPropertiesGrid({
  initialProperties,
}: {
  initialProperties: Property[];
}) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filterTabs = [
    { value: "ALL", label: "All Properties" },
    { value: PropertyType.APARTMENT, label: "Apartments" },
    { value: PropertyType.VILLA, label: "Villas" },
    { value: PropertyType.PLOT, label: "Plots & Land" },
    { value: PropertyType.COMMERCIAL, label: "Commercial" },
    { value: PropertyType.FARMHOUSE, label: "Farmhouses" },
  ];

  const filteredProperties = initialProperties.filter((property) => {
    const matchesType = selectedType === "ALL" || property.type === selectedType;
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* ── Filter Controls Bar ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 justify-between items-center">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedType(tab.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === tab.value
                  ? "bg-[#C9A84C] text-[#0F1B2D]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location or project..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] text-sm text-gray-800"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
        </div>
      </div>

      {/* ── Properties Grid ── */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl py-20 text-center border border-gray-200 shadow-sm">
          <Search className="w-12 h-12 text-[#C9A84C] mx-auto mb-4 opacity-50" />
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F1B2D]">
            No Properties Found
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">
            Try adjusting your search filters or browse other property categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-gray-200/80 flex flex-col"
            >
              {/* Image box (premium gold gradient overlay) */}
              <div
                className="relative h-52 overflow-hidden flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0F1B2D 0%, #162236 50%, #C9A84C22 100%)",
                }}
              >
                {/* SVG decorative house silhouette */}
                <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-25 transition-transform duration-500 group-hover:scale-105">
                  <svg
                    viewBox="0 0 200 100"
                    className="w-48 h-24 text-[#C9A84C]"
                    fill="currentColor"
                  >
                    <rect x="25" y="30" width="30" height="70" />
                    <rect x="65" y="10" width="40" height="90" />
                    <rect x="115" y="40" width="25" height="60" />
                    <rect x="150" y="20" width="25" height="80" />
                  </svg>
                </div>

                {/* Badge Type */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-white/90 text-[#0F1B2D] rounded-full shadow-sm">
                    {property.type}
                  </span>
                  {property.isFeatured && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-[#C9A84C] text-[#0F1B2D] rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                </div>

                {/* Price pill */}
                <div className="absolute bottom-4 right-4 bg-[#C9A84C] text-[#0F1B2D] px-3.5 py-1.5 rounded-lg shadow-md">
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-lg">
                    {property.price}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#0F1B2D] line-clamp-1 group-hover:text-[#C9A84C] transition-colors duration-300">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                  {property.location}
                </div>

                {/* Details layout */}
                {(property.bedrooms || property.bathrooms || property.area) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    {property.bedrooms && <span>🛏 {property.bedrooms} Beds</span>}
                    {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
                    {property.area && <span>📐 {property.area}</span>}
                  </div>
                )}

                <p className="text-gray-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-3">
                  {property.description}
                </p>

                {/* Amenities tag list (max 3 on card) */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {property.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="text-[10px] font-semibold text-[#C9A84C] px-1 py-0.5">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => setSelectedProperty(property)}
                  className="w-full mt-auto py-3 bg-[#0F1B2D] text-white text-xs font-semibold rounded-xl hover:bg-[#C9A84C] hover:text-[#0F1B2D] hover:shadow-md transition-all duration-300 uppercase tracking-wider"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal handler */}
      {selectedProperty && (
        <ClientEnquiryModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
