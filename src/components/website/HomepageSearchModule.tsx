"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Building2, IndianRupee, MapPin, Search } from "lucide-react";
import { filterBudgets, filterLocations, filterPropertyTypes } from "@/components/website/site-data";

export default function HomepageSearchModule() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedBudget, setSelectedBudget] = useState("ALL");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (selectedLocation && selectedLocation !== "All Locations") {
      params.set("location", selectedLocation);
    }
    if (selectedType && selectedType !== "ALL") {
      params.set("type", selectedType);
    }
    if (selectedBudget && selectedBudget !== "ALL") {
      params.set("budget", selectedBudget);
    }

    const queryStr = params.toString();
    router.push(queryStr ? `/properties?${queryStr}` : "/properties");
  };

  return (
    <div className="w-full rounded-[1.85rem] border border-[#D4AF37]/30 bg-[#081120]/92 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:rounded-[2.4rem] sm:p-6 lg:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 sm:mb-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F5D67B] sm:text-xs sm:tracking-[0.32em]">
            Property Discovery
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-white sm:text-2xl">
            What are you looking for?
          </h2>
        </div>

      </div>

      <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_auto]">
        {/* Location select */}
        <div className="relative">
          <label htmlFor="home-search-location" className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
            <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
            Location
          </label>
          <select
            id="home-search-location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="min-h-12 w-full appearance-none rounded-2xl border border-white/12 bg-white/[0.08] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#D4AF37] focus:bg-[#081120] focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            {filterLocations.map((loc) => (
              <option key={loc} value={loc} className="bg-[#081120] text-white">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Property type select */}
        <div className="relative">
          <label htmlFor="home-search-type" className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
            <Building2 className="h-3.5 w-3.5 text-[#D4AF37]" />
            Property Type
          </label>
          <select
            id="home-search-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="min-h-12 w-full appearance-none rounded-2xl border border-white/12 bg-white/[0.08] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#D4AF37] focus:bg-[#081120] focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            {filterPropertyTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-[#081120] text-white">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget select */}
        <div className="relative">
          <label htmlFor="home-search-budget" className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
            <IndianRupee className="h-3.5 w-3.5 text-[#D4AF37]" />
            Budget Tier
          </label>
          <select
            id="home-search-budget"
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="min-h-12 w-full appearance-none rounded-2xl border border-white/12 bg-white/[0.08] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#D4AF37] focus:bg-[#081120] focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            {filterBudgets.map((budget) => (
              <option key={budget.value} value={budget.value} className="bg-[#081120] text-white">
                {budget.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#F5D67B] to-[#D4AF37] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#081120] shadow-[0_14px_34px_rgba(212,175,55,0.28)] transition hover:brightness-105 active:scale-[0.98] sm:text-sm"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search Properties</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </form>
    </div>
  );
}
