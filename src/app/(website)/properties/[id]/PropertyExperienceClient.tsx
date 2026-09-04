"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  Heart,
  Maximize2,
  MessageCircle,
  Phone,
  Share2,
  Sparkles,
} from "lucide-react";
import { siteConfig, type PublicProperty } from "@/components/website/site-data";
import ClientEnquiryModal from "../ClientEnquiryModal";

export default function PropertyExperienceClient({
  property,
  gallery,
}: {
  property: PublicProperty;
  gallery: string[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);

  const shareProperty = async () => {
    const shareData = {
      title: property.title,
      text: `${property.title} in ${property.location} by The Shivara Group`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href).catch(() => undefined);
      alert("Property link copied to clipboard!");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi The Shivara Group, I am reviewing ${property.title} (${property.location}). Please share floor plans, pricing breakup, and availability.`
  );

  return (
    <section className="px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Gallery Column */}
        <div className="space-y-4">
          {/* Main Active Image Viewport */}
          <div className="relative h-[340px] sm:h-[500px] w-full overflow-hidden rounded-[2rem] bg-[#081120] shadow-[0_24px_80px_rgba(8,17,32,0.12)] sm:rounded-[2.6rem]">
            <Image
              src={gallery[activeImage] || gallery[0]}
              alt={`${property.title} photo ${activeImage + 1}`}
              fill
              priority
              className="object-cover transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 65vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Badges on Top */}
            <div className="absolute left-4 top-4 right-4 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/95 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#081120] shadow-md backdrop-blur">
                  {property.type.replace("_", " ")}
                </span>
                <span className="rounded-full bg-[#081120]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {property.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSaved((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#081120] shadow-md transition hover:scale-105"
                  aria-label={saved ? "Saved to favourites" : "Save property"}
                >
                  <Heart className={`h-4 w-4 ${saved ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={shareProperty}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#081120] shadow-md transition hover:scale-105"
                  aria-label="Share property link"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image Index Indicator */}
            <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {activeImage + 1} / {gallery.length} Photos
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {gallery.map((img, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={`relative h-20 w-24 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-2xl transition-all ${
                  activeImage === idx
                    ? "ring-2 ring-[#D4AF37] scale-[1.02]"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Sticky Summary & Action Card */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="rounded-[2.4rem] border border-[#081120]/10 bg-white p-6 shadow-[0_20px_60px_rgba(8,17,32,0.06)] sm:p-8">
            <div className="flex items-center justify-between border-b border-[#081120]/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9B7A19]">
                  Price Indication
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#081120] sm:text-3xl">
                  {property.price}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </span>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#6B7280]">
              Pricing is subject to unit availability, orientation, and final developer negotiation.
              Contact our advisory desk for official cost sheet and payment plans.
            </p>

            {/* Quick CTAs */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setIsSiteVisitOpen(true)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#F5D67B] to-[#D4AF37] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#081120] shadow-md transition hover:brightness-105 active:scale-[0.99] sm:text-sm"
              >
                <CalendarDays className="h-4 w-4" />
                Book Private Site Visit
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#10B981] px-4 text-xs font-black uppercase tracking-[0.1em] text-white shadow-sm transition hover:bg-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>

                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#081120]/15 bg-white px-4 text-xs font-black uppercase tracking-[0.1em] text-[#081120] transition hover:bg-[#081120] hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  Call Advisor
                </a>
              </div>
            </div>
          </div>

          {/* Shivara Advisory Assurance Card */}
          <div className="rounded-[2.4rem] bg-[#081120] p-6 text-white shadow-xl sm:p-7">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#F5D67B]">
              <Sparkles className="h-4 w-4" />
              Shivara Advisory Protocol
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                <span>Escorted site walkthrough by dedicated relationship manager</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                <span>On-ground location and micro-market growth evaluation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                <span>Zero commission / developer direct pricing on partner projects</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Book Site Visit Modal */}
      {isSiteVisitOpen && (
        <ClientEnquiryModal
          property={property}
          onClose={() => setIsSiteVisitOpen(false)}
        />
      )}
    </section>
  );
}
