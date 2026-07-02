"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, PropertyInput } from "@/lib/validations";
import { PropertyType } from "@prisma/client";
import { createProperty, updateProperty } from "@/features/properties/actions";
import { X, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface AddPropertyModalProps {
  trigger: React.ReactElement;
  property?: any; // If editing
}

export default function AddPropertyModal({ trigger, property }: AddPropertyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const isEditMode = !!property;

  // Initialize form with defaults
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price: property?.price || "",
      location: property?.location || "",
      type: property?.type || PropertyType.APARTMENT,
      bedrooms: property?.bedrooms ?? undefined,
      bathrooms: property?.bathrooms ?? undefined,
      area: property?.area || "",
      amenities: property?.amenities || [],
      images: property?.images || [],
      isActive: property?.isActive ?? true,
      isFeatured: property?.isFeatured ?? false,
    },
  });

  // Handle tags for amenities
  const [amenityText, setAmenityText] = useState(
    property?.amenities ? property.amenities.join(", ") : ""
  );

  const onSubmit = async (data: PropertyInput) => {
    setError("");

    // Process amenities array
    const amenitiesArr = amenityText
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const formattedData = {
      ...data,
      bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
      amenities: amenitiesArr,
      images: data.images && data.images.length > 0 ? data.images : [],
    };

    try {
      let result;
      if (isEditMode && property) {
        result = await updateProperty(property.id, formattedData);
      } else {
        result = await createProperty(formattedData);
      }

      if (!result.success) {
        throw new Error(result.error || "Operation failed");
      }

      toast({
        title: isEditMode ? "Property Updated" : "Property Created",
        description: `Successfully ${isEditMode ? "saved updates for" : "created property listing"} "${data.title}".`,
        type: "success",
      });

      setIsOpen(false);
      if (!isEditMode) {
        reset();
        setAmenityText("");
      }
      window.location.reload(); // Reload to refresh Server Component
    } catch (err: any) {
      setError(err.message || "Failed to save property detail. Please review inputs.");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    if (!isEditMode) {
      reset();
      setAmenityText("");
    }
  };

  return (
    <>
      {React.cloneElement(trigger, { onClick: handleOpen })}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F1B2D]/75 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fade-in-scale">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-base text-white">
                {isEditMode ? "Edit Property Listing" : "Add New Property"}
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Property Title *</label>
                  <input
                    type="text"
                    {...register("title")}
                    placeholder="e.g. 3BHK Luxury Duplex Penthouse"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                  {errors.title && <p className="text-red-400 text-[10px] mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Description *</label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    placeholder="Describe layout details, location advantages, pricing breakdown..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                  />
                  {errors.description && <p className="text-red-400 text-[10px] mt-1">{errors.description.message}</p>}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Pricing / Price Tag *</label>
                  <input
                    type="text"
                    {...register("price")}
                    placeholder="e.g. ₹45 Lakh"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                  {errors.price && <p className="text-red-400 text-[10px] mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Location *</label>
                  <input
                    type="text"
                    {...register("location")}
                    placeholder="e.g. Civil Lines, Bareilly"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                  {errors.location && <p className="text-red-400 text-[10px] mt-1">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Property Type *</label>
                  <select
                    {...register("type")}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value={PropertyType.APARTMENT}>Apartment</option>
                    <option value={PropertyType.VILLA}>Villa</option>
                    <option value={PropertyType.PLOT}>Plot</option>
                    <option value={PropertyType.COMMERCIAL}>Commercial</option>
                    <option value={PropertyType.FARMHOUSE}>Farmhouse</option>
                  </select>
                </div>
              </div>

              {/* Structural Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bedrooms Count</label>
                  <input
                    type="number"
                    {...register("bedrooms")}
                    placeholder="e.g. 3"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bathrooms Count</label>
                  <input
                    type="number"
                    {...register("bathrooms")}
                    placeholder="e.g. 2"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Built-up Area (Sq Ft / Sq Yd)</label>
                  <input
                    type="text"
                    {...register("area")}
                    placeholder="e.g. 1,800 sqft"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Amenities & Flags */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Amenities (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={amenityText}
                    onChange={(e) => setAmenityText(e.target.value)}
                    placeholder="e.g. Modular Kitchen, Parking, Gated Entry, Power Backup"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="rounded bg-slate-800 border-slate-700 text-[#C9A84C] focus:ring-[#C9A84C]"
                    />
                    Listed Active (Show on Website)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="rounded bg-slate-800 border-slate-700 text-[#C9A84C] focus:ring-[#C9A84C]"
                    />
                    Featured Spot (Highlighted in Grid)
                  </label>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="border-t border-slate-800 pt-6 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#C9A84C] text-slate-900 text-xs font-bold rounded-lg hover:bg-[#b8963e] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
