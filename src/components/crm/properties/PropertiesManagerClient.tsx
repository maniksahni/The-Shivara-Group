"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Building2,
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import PropertyAdminCard from "./PropertyAdminCard";
import AddPropertyModal from "./AddPropertyModal";
import { CRMEmptyState, CRMHero, CRMMiniStat } from "@/components/crm/CRMPrimitives";
import type { PropertyRecord } from "@/types";

const STORAGE_KEY = "shivara_crm_properties";

interface PropertiesManagerClientProps {
  initialProperties: PropertyRecord[];
}

const TYPE_LABEL_MAP: Record<string, string> = {
  ALL: "All Listings",
  APARTMENT: "Apartments",
  VILLA: "Villas & Kothis",
  PLOT: "Plots",
  COMMERCIAL: "Commercial",
  FARMHOUSE: "Farmhouses",
};

export default function PropertiesManagerClient({
  initialProperties,
}: PropertiesManagerClientProps) {
  // ── State ─────────────────────────────────────────────────────────────────
  const [properties, setProperties] = useState<PropertyRecord[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "FEATURED" | "INACTIVE">("ALL");
  const [isMounted, setIsMounted] = useState(false);

  // ── Initialize from LocalStorage ──────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProperties(parsed);
          return;
        }
      }
      // If nothing stored yet, initialize localStorage with initial properties
      if (initialProperties.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProperties));
      }
    } catch {
      // Ignore JSON parse errors and stick with initialProperties
    }
  }, [initialProperties]);

  // ── Helper to persist changes ─────────────────────────────────────────────
  const saveToStorage = useCallback((newList: PropertyRecord[]) => {
    setProperties(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }
  }, []);

  // ── Reset to Defaults ─────────────────────────────────────────────────────
  const handleResetDefaults = () => {
    if (window.confirm("Reset property inventory back to the default Shivara portfolio catalog?")) {
      saveToStorage(initialProperties);
      toast.success("Inventory restored to default catalog.");
    }
  };

  // ── Callbacks for Cards ───────────────────────────────────────────────────
  const handleToggleActive = useCallback(
    (id: string, newActive: boolean) => {
      const updated = properties.map((p) => (p.id === id ? { ...p, isActive: newActive } : p));
      saveToStorage(updated);
    },
    [properties, saveToStorage]
  );

  const handleToggleFeatured = useCallback(
    (id: string, newFeatured: boolean) => {
      const updated = properties.map((p) => (p.id === id ? { ...p, isFeatured: newFeatured } : p));
      saveToStorage(updated);
    },
    [properties, saveToStorage]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = properties.filter((p) => p.id !== id);
      saveToStorage(updated);
    },
    [properties, saveToStorage]
  );

  const handleSave = useCallback(
    (savedProperty: PropertyRecord) => {
      const existsIndex = properties.findIndex((p) => p.id === savedProperty.id);
      let updated: PropertyRecord[];
      if (existsIndex >= 0) {
        // Edit
        updated = [...properties];
        updated[existsIndex] = savedProperty;
      } else {
        // Add new
        updated = [savedProperty, ...properties];
      }
      saveToStorage(updated);
    },
    [properties, saveToStorage]
  );

  // ── Computed stats ────────────────────────────────────────────────────────
  const totalCount = properties.length;
  const activeCount = properties.filter((p) => p.isActive).length;
  const featuredCount = properties.filter((p) => p.isFeatured).length;

  const byType = useMemo(() => {
    return properties.reduce<Record<string, number>>((acc, p) => {
      acc[p.type] = (acc[p.type] ?? 0) + 1;
      return acc;
    }, {});
  }, [properties]);

  // ── Filtered listings ─────────────────────────────────────────────────────
  const filteredProperties = useMemo(() => {
    let result = properties;

    // Filter by type
    if (selectedType !== "ALL") {
      result = result.filter((p) => p.type === selectedType);
    }

    // Filter by status
    if (statusFilter === "ACTIVE") {
      result = result.filter((p) => p.isActive);
    } else if (statusFilter === "FEATURED") {
      result = result.filter((p) => p.isFeatured);
    } else if (statusFilter === "INACTIVE") {
      result = result.filter((p) => !p.isActive);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.type.toLowerCase().includes(q)
      );
    }

    return result;
  }, [properties, selectedType, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* ── Page Hero ────────────────────────────────────────────────────── */}
      <CRMHero
        eyebrow="Inventory Studio"
        title="Properties"
        description="Manage luxury listings with fast controls, image-first cards, and real-time visibility states."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetDefaults}
              title="Reset inventory to default catalog"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Catalog</span>
            </button>
            <AddPropertyModal
              onSave={handleSave}
              trigger={
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#F4B400] px-5 py-3 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition-all hover:-translate-y-0.5 hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#F4B400]/60 active:scale-[0.98]">
                  <Plus className="h-4 w-4" />
                  Add Property
                </button>
              }
            />
          </div>
        }
      />

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <CRMMiniStat label="Total Listings" value={totalCount} tone="blue" />
        <CRMMiniStat label="Active" value={activeCount} tone="green" />
        <CRMMiniStat label="Featured" value={featuredCount} tone="gold" />
        <CRMMiniStat label="Categories" value={Object.keys(byType).length} tone="purple" />
      </div>

      {/* ── Search and Filter Controls ───────────────────────────────────── */}
      <div className="rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl backdrop-blur-xl md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by title, location, or amenities…"
              className="w-full rounded-xl border border-white/10 bg-[#0E1726]/80 py-2.5 pl-10 pr-9 text-sm text-white placeholder-slate-400 transition focus:border-[#F4B400]/60 focus:outline-none focus:ring-2 focus:ring-[#F4B400]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-[#0E1726]/80 p-1">
            {(
              [
                { key: "ALL", label: "All" },
                { key: "ACTIVE", label: "Active" },
                { key: "FEATURED", label: "Featured" },
                { key: "INACTIVE", label: "Inactive" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === tab.key
                    ? "bg-[#F4B400] text-[#081120] shadow-sm shadow-[#F4B400]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type Breakdown Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs md:flex-wrap">
          <button
            onClick={() => setSelectedType("ALL")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-bold transition ${
              selectedType === "ALL"
                ? "border border-[#F4B400]/50 bg-[#F4B400]/15 text-[#F4B400]"
                : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
            }`}
          >
            All Types
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-black">
              {totalCount}
            </span>
          </button>

          {Object.entries(byType).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type === selectedType ? "ALL" : type)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-bold transition ${
                selectedType === type
                  ? "border border-[#F4B400]/50 bg-[#F4B400]/15 text-[#F4B400]"
                  : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              {TYPE_LABEL_MAP[type] ?? type}
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-black">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Properties Grid ──────────────────────────────────────────────── */}
      {filteredProperties.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-[#162032]/70 p-8 text-center shadow-2xl shadow-black/15 backdrop-blur-xl">
          <CRMEmptyState
            icon={<Building2 className="h-8 w-8 text-slate-400" />}
            title={
              searchQuery || selectedType !== "ALL" || statusFilter !== "ALL"
                ? "No matching properties found"
                : "No properties in inventory"
            }
            description={
              searchQuery || selectedType !== "ALL" || statusFilter !== "ALL"
                ? "Try clearing your search query or switching filter tabs."
                : "Add your first property listing to build your portfolio."
            }
          />
          {(searchQuery || selectedType !== "ALL" || statusFilter !== "ALL") && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("ALL");
                  setStatusFilter("ALL");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyAdminCard
              key={property.id}
              property={property}
              onToggleActive={handleToggleActive}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
