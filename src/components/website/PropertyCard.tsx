"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Bath,
  BedDouble,
  CalendarDays,
  ExternalLink,
  MapPin,
  MessageCircle,
  Ruler,
  Sparkles,
} from "lucide-react";
import { siteConfig, type PublicProperty } from "@/components/website/site-data";

export default function PropertyCard({
  property,
  onBookSiteVisit,
}: {
  property: PublicProperty;
  onBookSiteVisit?: (property: PublicProperty) => void;
}) {
  const primaryImage =
    property.images[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";

  const whatsappMessage = encodeURIComponent(
    `Hi The Shivara Group, I am interested in ${property.title} located at ${property.location}. Please share pricing and details.`
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#081120]/8 bg-white shadow-[0_16px_50px_rgba(8,17,32,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(8,17,32,0.14)] sm:rounded-[2rem]">
      {/* Property Image Container */}
      <Link href={`/properties/${property.id}`} className="relative block h-64 overflow-hidden bg-[#081120] sm:h-72">
        <Image
          src={primaryImage}
          alt={`${property.title} in ${property.location}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081120]/90 via-[#081120]/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5 right-3.5 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#081120] shadow-md backdrop-blur">
              {property.type.replace("_", " ")}
            </span>
            {property.status && (
              <span className="rounded-full bg-[#081120]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                {property.status}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {property.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md backdrop-blur">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            )}
            {property.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#081120] shadow-md">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price & Title inside Image Overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <p className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[-0.01em] text-[#F5D67B] sm:text-2xl">
            {property.price}
          </p>
          <h3 className="mt-0.5 line-clamp-1 font-[family-name:var(--font-playfair)] text-lg font-semibold leading-tight text-white transition group-hover:text-[#F5D67B] sm:text-xl">
            {property.title}
          </h3>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9B7A19]" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Quick Specifications Matrix */}
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-[#F8F5EE] p-2.5 text-center">
            <div className="min-w-0">
              <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#9B7A19]">
                <BedDouble className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.06em] text-[#4B5563]">
                {property.bedrooms ? `${property.bedrooms} BHK` : "Custom"}
              </p>
            </div>

            <div className="min-w-0">
              <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#9B7A19]">
                <Bath className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.06em] text-[#4B5563]">
                {property.bathrooms ? `${property.bathrooms} Baths` : "Verified"}
              </p>
            </div>

            <div className="min-w-0">
              <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#9B7A19]">
                <Ruler className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.06em] text-[#4B5563]">
                {property.area || "On Request"}
              </p>
            </div>
          </div>

          {/* Brief Description */}
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#6B7280]">
            {property.description}
          </p>

          {/* Key Amenities */}
          {property.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-[#081120]/5 px-2.5 py-0.5 text-[10px] font-bold text-[#4B5563]"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="mt-4 pt-3 border-t border-[#081120]/6">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Link
              href={`/properties/${property.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#081120] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#D4AF37] hover:text-[#081120] active:scale-[0.98]"
            >
              <span>View Property</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#10B981] text-white shadow-md transition hover:scale-105 active:scale-95"
              aria-label={`WhatsApp enquiry for ${property.title}`}
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>

          {onBookSiteVisit && (
            <button
              type="button"
              onClick={() => onBookSiteVisit(property)}
              className="mt-2 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FFF9E8] text-[11px] font-black uppercase tracking-[0.1em] text-[#081120] transition hover:bg-[#D4AF37]"
            >
              <CalendarDays className="h-3.5 w-3.5 text-[#9B7A19]" />
              Book Site Visit
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
