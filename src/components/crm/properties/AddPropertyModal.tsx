"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, BadgeCheck, Building2, ImagePlus, MapPin, Save, Sparkles } from "lucide-react";
import { PropertyType } from "@prisma/client";
import type { z } from "zod";

import CRMDrawer from "@/components/crm/CRMDrawer";
import { useToast } from "@/components/ui/toast";
import { createProperty, updateProperty } from "@/features/properties/actions";
import { propertySchema } from "@/lib/validations";

type PropertyFormValues = z.input<typeof propertySchema>;

interface PropertyForForm {
  id: string;
  title: string;
  description: string | null;
  price: string | number;
  location: string;
  type: PropertyType | string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

interface AddPropertyModalProps {
  trigger: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  property?: PropertyForForm;
}

export default function AddPropertyModal({ trigger, property }: AddPropertyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [amenityText, setAmenityText] = useState(property?.amenities?.join(", ") ?? "");
  const [imageText, setImageText] = useState(property?.images?.join("\n") ?? "");
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = Boolean(property);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      price: property?.price ? String(property.price) : "",
      location: property?.location ?? "",
      type: (property?.type as PropertyType) ?? PropertyType.APARTMENT,
      bedrooms: property?.bedrooms ?? null,
      bathrooms: property?.bathrooms ?? null,
      area: property?.area ?? "",
      amenities: property?.amenities ?? [],
      images: property?.images ?? [],
      isActive: property?.isActive ?? true,
      isFeatured: property?.isFeatured ?? false,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setFormError("");
    if (!isEditMode) {
      reset();
      setAmenityText("");
      setImageText("");
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setFormError("");

    const amenities = amenityText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const images = imageText
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    const formattedData = {
      ...data,
      bedrooms: data.bedrooms === undefined || data.bedrooms === null ? null : Number(data.bedrooms),
      bathrooms: data.bathrooms === undefined || data.bathrooms === null ? null : Number(data.bathrooms),
      area: data.area?.trim() || null,
      amenities,
      images,
      isActive: Boolean(data.isActive),
      isFeatured: Boolean(data.isFeatured),
    };

    try {
      const result =
        isEditMode && property
          ? await updateProperty(property.id, formattedData)
          : await createProperty(formattedData);

      if (!result.success) {
        throw new Error(result.error || "Could not save property.");
      }

      toast({
        title: isEditMode ? "Property updated" : "Property created",
        description: `"${data.title}" has been saved successfully.`,
        type: "success",
      });

      setIsOpen(false);
      if (!isEditMode) {
        reset();
        setAmenityText("");
        setImageText("");
      }
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save property. Please review the form and try again.";
      setFormError(message);
      toast({
        title: "Property save failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <>
      <span className="inline-flex" onClickCapture={() => setIsOpen(true)}>
        {trigger}
      </span>

      <CRMDrawer
        isOpen={isOpen}
        onClose={handleClose}
        eyebrow="Inventory studio"
        title={isEditMode ? "Edit Property Listing" : "Add New Property"}
        description="Keep every listing complete, polished, and ready for public discovery."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="min-h-11 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="property-drawer-form"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#F4B400] px-6 py-3 text-sm font-black text-[#081120] shadow-lg shadow-[#F4B400]/20 transition hover:bg-[#f59e0b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Property"}
            </button>
          </div>
        }
      >
        <form id="property-drawer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {formError && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <FormSection icon={<Building2 className="h-4 w-4" />} title="Basic Details">
            <Field label="Property title" error={errors.title?.message} required>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. 3BHK luxury apartment near Civil Lines"
                className={fieldClass}
              />
            </Field>

            <Field label="Property type" error={errors.type?.message} required>
              <select {...register("type")} className={fieldClass}>
                <option value={PropertyType.APARTMENT}>Apartment</option>
                <option value={PropertyType.VILLA}>Villa</option>
                <option value={PropertyType.PLOT}>Plot</option>
                <option value={PropertyType.COMMERCIAL}>Commercial</option>
                <option value={PropertyType.FARMHOUSE}>Farmhouse</option>
              </select>
            </Field>
          </FormSection>

          <FormSection icon={<BadgeCheck className="h-4 w-4" />} title="Pricing">
            <Field label="Price / price tag" error={errors.price?.message} required>
              <input
                type="text"
                {...register("price")}
                placeholder="e.g. ₹45 Lakh / Contact for pricing"
                className={fieldClass}
              />
            </Field>
          </FormSection>

          <FormSection icon={<MapPin className="h-4 w-4" />} title="Location">
            <Field label="Location" error={errors.location?.message} required>
              <input
                type="text"
                {...register("location")}
                placeholder="e.g. Civil Lines, Bareilly"
                className={fieldClass}
              />
            </Field>
          </FormSection>

          <FormSection icon={<Sparkles className="h-4 w-4" />} title="Property Features">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Bedrooms" error={errors.bedrooms?.message}>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  {...register("bedrooms")}
                  placeholder="3"
                  className={fieldClass}
                />
              </Field>
              <Field label="Bathrooms" error={errors.bathrooms?.message}>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  {...register("bathrooms")}
                  placeholder="2"
                  className={fieldClass}
                />
              </Field>
              <Field label="Area" error={errors.area?.message}>
                <input
                  type="text"
                  {...register("area")}
                  placeholder="1,800 sqft"
                  className={fieldClass}
                />
              </Field>
            </div>

            <Field label="Amenities">
              <input
                type="text"
                value={amenityText}
                onChange={(event) => setAmenityText(event.target.value)}
                placeholder="Parking, Lift, Power Backup, Gated Entry"
                className={fieldClass}
              />
            </Field>
          </FormSection>

          <FormSection icon={<ImagePlus className="h-4 w-4" />} title="Images">
            <Field label="Image URLs" error={errors.images?.message}>
              <textarea
                value={imageText}
                onChange={(event) => setImageText(event.target.value)}
                rows={4}
                placeholder="Paste one image URL per line"
                className={`${fieldClass} min-h-32 resize-none py-4`}
              />
            </Field>
            <p className="text-xs leading-5 text-slate-500">
              Use publicly accessible image URLs. Empty images are allowed; the public site will
              use premium fallback visuals.
            </p>
          </FormSection>

          <FormSection icon={<BadgeCheck className="h-4 w-4" />} title="Status">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-200">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="h-4 w-4 rounded border-white/20 bg-[#111827] text-[#F4B400] focus:ring-[#F4B400]/30"
                />
                Listed Active
              </label>
              <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-200">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="h-4 w-4 rounded border-white/20 bg-[#111827] text-[#F4B400] focus:ring-[#F4B400]/30"
                />
                Featured Property
              </label>
            </div>
          </FormSection>

          <FormSection icon={<Building2 className="h-4 w-4" />} title="Description">
            <Field label="Description" error={errors.description?.message} required>
              <textarea
                rows={7}
                {...register("description")}
                placeholder="Describe layout details, amenities, location advantages, possession, and visit guidance..."
                className={`${fieldClass} min-h-44 resize-none py-4`}
              />
            </Field>
          </FormSection>
        </form>
      </CRMDrawer>
    </>
  );
}

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#F4B400]/70 focus:bg-[#111827] focus:ring-4 focus:ring-[#F4B400]/10";

const labelClass =
  "mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-400";

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/10 sm:p-5">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#F4B400]">
        {icon}
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error && <p className="mt-2 text-xs font-semibold text-red-300">{error}</p>}
    </label>
  );
}
