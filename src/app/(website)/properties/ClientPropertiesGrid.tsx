"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  Filter,
  MessageCircle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PropertyCard from "@/components/website/PropertyCard";
import ClientEnquiryModal from "./ClientEnquiryModal";
import {
  filterBedrooms,
  filterBudgets,
  filterLocations,
  filterPropertyTypes,
  filterStatuses,
  siteConfig,
  sortOptions,
  type PublicProperty,
} from "@/components/website/site-data";

export default function ClientPropertiesGrid({
  initialProperties,
}: {
  initialProperties: PublicProperty[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial params
  const paramLocation = searchParams.get("location") ?? "All Locations";
  const paramType = searchParams.get("type") ?? "ALL";
  const paramBudget = searchParams.get("budget") ?? "ALL";
  const paramBhk = searchParams.get("bhk") ?? "ALL";
  const paramStatus = searchParams.get("status") ?? "All Status";
  const paramSort = searchParams.get("sort") ?? "recommended";
  const paramQ = searchParams.get("q") ?? "";

  // Component state
  const [searchQuery, setSearchQuery] = useState(paramQ);
  const [selectedLocation, setSelectedLocation] = useState(paramLocation);
  const [selectedType, setSelectedType] = useState(paramType);
  const [selectedBudget, setSelectedBudget] = useState(paramBudget);
  const [selectedBhk, setSelectedBhk] = useState(paramBhk);
  const [selectedStatus, setSelectedStatus] = useState(paramStatus);
  const [selectedSort, setSelectedSort] = useState(paramSort);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPropertyForModal, setSelectedPropertyForModal] =
    useState<PublicProperty | null>(null);

  // Sync state if URL params change externally
  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
    setSelectedLocation(searchParams.get("location") ?? "All Locations");
    setSelectedType(searchParams.get("type") ?? "ALL");
    setSelectedBudget(searchParams.get("budget") ?? "ALL");
    setSelectedBhk(searchParams.get("bhk") ?? "ALL");
    setSelectedStatus(searchParams.get("status") ?? "All Status");
    setSelectedSort(searchParams.get("sort") ?? "recommended");
  }, [searchParams]);

  // Update URL params
  const syncParams = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const loc = overrides.location ?? selectedLocation;
    const typ = overrides.type ?? selectedType;
    const bud = overrides.budget ?? selectedBudget;
    const bhk = overrides.bhk ?? selectedBhk;
    const sta = overrides.status ?? selectedStatus;
    const srt = overrides.sort ?? selectedSort;
    const q = overrides.q ?? searchQuery;

    if (loc && loc !== "All Locations") params.set("location", loc);
    if (typ && typ !== "ALL") params.set("type", typ);
    if (bud && bud !== "ALL") params.set("budget", bud);
    if (bhk && bhk !== "ALL") params.set("bhk", bhk);
    if (sta && sta !== "All Status") params.set("status", sta);
    if (srt && srt !== "recommended") params.set("sort", srt);
    if (q.trim()) params.set("q", q.trim());

    const queryString = params.toString();
    router.replace(queryString ? `/properties?${queryString}` : "/properties", {
      scroll: false,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setSelectedType("ALL");
    setSelectedBudget("ALL");
    setSelectedBhk("ALL");
    setSelectedStatus("All Status");
    setSelectedSort("recommended");
    router.replace("/properties", { scroll: false });
  };

  // Active filters count
  const activeFiltersCount = [
    selectedLocation !== "All Locations",
    selectedType !== "ALL",
    selectedBudget !== "ALL",
    selectedBhk !== "ALL",
    selectedStatus !== "All Status",
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  // Filter & Sort Logic
  const filteredAndSortedProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter
    const results = initialProperties.filter((item) => {
      // Search query filter
      if (query) {
        const titleMatch = item.title.toLowerCase().includes(query);
        const locMatch = item.location.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const microMatch = item.microLocation?.toLowerCase().includes(query) ?? false;
        const amenityMatch = item.amenities.some((a) => a.toLowerCase().includes(query));
        if (!titleMatch && !locMatch && !descMatch && !microMatch && !amenityMatch) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation !== "All Locations") {
        const itemLoc = `${item.location} ${item.microLocation || ""}`.toLowerCase();
        if (!itemLoc.includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Property Type filter
      if (selectedType !== "ALL") {
        if (selectedType === "VILLA") {
          if (item.type !== "VILLA") return false;
        } else if (selectedType === "APARTMENT") {
          if (item.type !== "APARTMENT") return false;
        } else if (selectedType === "PLOT") {
          if (item.type !== "PLOT") return false;
        } else if (selectedType === "COMMERCIAL") {
          if (item.type !== "COMMERCIAL") return false;
        } else if (selectedType === "FARMHOUSE") {
          if (item.type !== "FARMHOUSE") return false;
        }
      }

      // Budget filter
      if (selectedBudget !== "ALL") {
        const budgetDef = filterBudgets.find((b) => b.value === selectedBudget);
        if (budgetDef && item.priceNumeric) {
          if (budgetDef.min && item.priceNumeric < budgetDef.min) return false;
          if (budgetDef.max && item.priceNumeric > budgetDef.max) return false;
        }
      }

      // Bedroom filter
      if (selectedBhk !== "ALL") {
        const targetBhk = Number(selectedBhk);
        if (targetBhk === 5) {
          if (!item.bedrooms || item.bedrooms < 5) return false;
        } else {
          if (item.bedrooms !== targetBhk) return false;
        }
      }

      // Status filter
      if (selectedStatus !== "All Status") {
        if (item.status !== selectedStatus) return false;
      }

      return true;
    });

    // 2. Sort
    results.sort((a, b) => {
      if (selectedSort === "price_asc") {
        return (a.priceNumeric || 0) - (b.priceNumeric || 0);
      }
      if (selectedSort === "price_desc") {
        return (b.priceNumeric || 0) - (a.priceNumeric || 0);
      }
      if (selectedSort === "newest") {
        return b.id.localeCompare(a.id);
      }
      // recommended: featured first, then verified
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      if (a.isVerified !== b.isVerified) {
        return a.isVerified ? -1 : 1;
      }
      return 0;
    });

    return results;
  }, [
    initialProperties,
    searchQuery,
    selectedLocation,
    selectedType,
    selectedBudget,
    selectedBhk,
    selectedStatus,
    selectedSort,
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ============================================================ */}
      {/* SEARCH AND FILTER BAR */}
      {/* ============================================================ */}
      <div className="rounded-[1.6rem] border border-[#081120]/10 bg-white p-4 shadow-[0_20px_60px_rgba(8,17,32,0.06)] sm:rounded-[2.2rem] sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_auto]">
          {/* Main Keyword Search Bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B7A19]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                syncParams({ q: e.target.value });
              }}
              placeholder="Search by locality, villa, 3 BHK, kothi, plot..."
              className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] pl-11 pr-4 text-sm font-semibold text-[#081120] outline-none transition placeholder:text-[#6B7280]/70 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>

          {/* Location Quick Select */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                syncParams({ location: e.target.value });
              }}
              className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-4 text-xs font-bold text-[#081120] outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20"
            >
              {filterLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  syncParams({ sort: e.target.value });
                }}
                className="min-h-12 w-full rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] px-3.5 text-xs font-bold text-[#081120] outline-none transition focus:border-[#D4AF37] focus:bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
              className="relative flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-[#081120]/15 bg-[#081120] px-4 text-xs font-black uppercase tracking-[0.1em] text-white transition lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] text-[#081120]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Filter Pills Row */}
        <div className="mt-4 hidden border-t border-[#081120]/8 pt-4 lg:block">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
              Category:
            </span>
            {filterPropertyTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setSelectedType(type.value);
                  syncParams({ type: type.value });
                }}
                className={`min-h-9 rounded-full px-3.5 text-xs font-bold transition ${
                  selectedType === type.value
                    ? "bg-[#081120] text-white shadow-sm"
                    : "bg-[#F8F5EE] text-[#4B5563] hover:bg-[#D4AF37]/25 hover:text-[#081120]"
                }`}
              >
                {type.label}
              </button>
            ))}

            <div className="mx-2 h-4 w-[1px] bg-[#081120]/15" />

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
              Budget:
            </span>
            {filterBudgets.slice(0, 5).map((budget) => (
              <button
                key={budget.value}
                type="button"
                onClick={() => {
                  setSelectedBudget(budget.value);
                  syncParams({ budget: budget.value });
                }}
                className={`min-h-9 rounded-full px-3 text-xs font-bold transition ${
                  selectedBudget === budget.value
                    ? "bg-[#D4AF37] text-[#081120] shadow-sm"
                    : "bg-[#F8F5EE] text-[#4B5563] hover:bg-slate-200"
                }`}
              >
                {budget.label}
              </button>
            ))}

            <div className="mx-2 h-4 w-[1px] bg-[#081120]/15" />

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
              Bedrooms:
            </span>
            {filterBedrooms.map((bhk) => (
              <button
                key={String(bhk.value)}
                type="button"
                onClick={() => {
                  setSelectedBhk(String(bhk.value));
                  syncParams({ bhk: String(bhk.value) });
                }}
                className={`min-h-9 rounded-full px-2.5 text-xs font-bold transition ${
                  selectedBhk === String(bhk.value)
                    ? "bg-[#081120] text-white shadow-sm"
                    : "bg-[#F8F5EE] text-[#4B5563] hover:bg-slate-200"
                }`}
              >
                {bhk.label}
              </button>
            ))}

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterDrawerOpen && (
          <div className="mt-4 space-y-3 rounded-2xl border border-[#081120]/10 bg-[#F8F5EE] p-4 lg:hidden">
            <div className="flex items-center justify-between border-b border-[#081120]/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#081120]">
                Filter Criteria
              </span>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 text-[#4B5563]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase text-[#6B7280]">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  syncParams({ type: e.target.value });
                }}
                className="w-full rounded-xl bg-white p-2.5 text-xs font-bold text-[#081120]"
              >
                {filterPropertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase text-[#6B7280]">
                Budget
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => {
                  setSelectedBudget(e.target.value);
                  syncParams({ budget: e.target.value });
                }}
                className="w-full rounded-xl bg-white p-2.5 text-xs font-bold text-[#081120]"
              >
                {filterBudgets.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase text-[#6B7280]">
                Bedrooms
              </label>
              <select
                value={selectedBhk}
                onChange={(e) => {
                  setSelectedBhk(e.target.value);
                  syncParams({ bhk: e.target.value });
                }}
                className="w-full rounded-xl bg-white p-2.5 text-xs font-bold text-[#081120]"
              >
                {filterBedrooms.map((bhk) => (
                  <option key={String(bhk.value)} value={String(bhk.value)}>
                    {bhk.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase text-[#6B7280]">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  syncParams({ status: e.target.value });
                }}
                className="w-full rounded-xl bg-white p-2.5 text-xs font-bold text-[#081120]"
              >
                {filterStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-red-100 text-xs font-bold text-red-800"
              >
                <RotateCcw className="h-3 w-3" />
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* RESULTS HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9B7A19]">
            {filteredAndSortedProperties.length} Properties Available
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#081120] sm:text-3xl">
            {selectedLocation === "All Locations" ? "All Curated Listings" : `${selectedLocation} Listings`}
          </h2>
        </div>

        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#10B981] px-4 text-xs font-black uppercase tracking-[0.1em] text-white shadow-sm transition hover:bg-emerald-600"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Ask Requirement on WhatsApp</span>
        </a>
      </div>

      {/* ============================================================ */}
      {/* PROPERTY GRID */}
      {/* ============================================================ */}
      {filteredAndSortedProperties.length === 0 ? (
        <div className="rounded-[2.4rem] border border-[#081120]/10 bg-white p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF9E8] text-[#9B7A19]">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-2xl font-semibold sm:text-3xl">
            No properties matched your criteria.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#6B7280] sm:text-sm">
            Try adjusting your budget, location, or property category filter. Alternatively, share
            your exact requirements and our advisory team will manually shortlist off-market options.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#081120] px-6 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm"
            >
              Reset All Filters
            </button>

            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                "Hi The Shivara Group, I am searching for specific property options in Bareilly. Can you share custom options?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Requirement
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onBookSiteVisit={(prop) => setSelectedPropertyForModal(prop)}
            />
          ))}
        </div>
      )}

      {/* Book Site Visit Modal */}
      {selectedPropertyForModal && (
        <ClientEnquiryModal
          property={selectedPropertyForModal}
          onClose={() => setSelectedPropertyForModal(null)}
        />
      )}
    </div>
  );
}
