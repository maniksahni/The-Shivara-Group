/**
 * Card Component
 *
 * Three card variants for the Shivara CRM design system:
 *
 *  1. Card        — base container, dark (bg-slate-800) or light variant
 *  2. StatsCard   — KPI tile: icon, title, large value, subtitle, trend indicator
 *  3. PropertyCard— real-estate listing tile: image, badges, price, specs, CTA
 */

import React from "react";
import { Badge, BadgeVariant } from "./badge";

// ---------------------------------------------------------------------------
// 1. Base Card
// ---------------------------------------------------------------------------

export type CardVariant = "dark" | "light";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual theme — dark fits the CRM, light fits the marketing site */
  variant?: CardVariant;
  /** Remove the default padding */
  noPadding?: boolean;
  /** Extra Tailwind classes */
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  dark: "bg-slate-800 border border-slate-700 text-white",
  light: "bg-white border border-slate-200 text-slate-900",
};

const Card: React.FC<CardProps> = ({
  variant = "dark",
  noPadding = false,
  className = "",
  children,
  ...rest
}) => (
  <div
    className={[
      "rounded-xl shadow-sm",
      variantStyles[variant],
      noPadding ? "" : "p-6",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </div>
);

Card.displayName = "Card";

// ---------------------------------------------------------------------------
// 2. StatsCard
// ---------------------------------------------------------------------------

export type TrendDirection = "up" | "down" | "neutral";

export interface StatsCardProps {
  /** Small icon element (e.g. an SVG icon component) */
  icon: React.ReactNode;
  /** Card heading */
  title: string;
  /** The primary large number or text value */
  value: string | number;
  /** Optional sub-label below the value */
  subtitle?: string;
  /** Trend data */
  trend?: {
    direction: TrendDirection;
    percentage: number;
    label?: string; // e.g. "vs last month"
  };
  /** Accent colour class applied to the icon container background */
  accentColor?: string;
  /** Extra classes */
  className?: string;
}

const trendIcon: Record<TrendDirection, React.ReactNode> = {
  up: (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path
        fillRule="evenodd"
        d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  down: (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  neutral: (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path
        fillRule="evenodd"
        d="M2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const trendColors: Record<TrendDirection, string> = {
  up: "text-green-400",
  down: "text-red-400",
  neutral: "text-slate-400",
};

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  accentColor = "bg-[#C9A84C]/15 text-[#C9A84C]",
  className = "",
}) => (
  <Card className={className}>
    <div className="flex items-start justify-between gap-4">
      {/* Icon */}
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          accentColor,
        ].join(" ")}
      >
        {icon}
      </div>

      {/* Trend pill */}
      {trend && (
        <div
          className={[
            "inline-flex items-center gap-1 text-xs font-medium",
            trendColors[trend.direction],
          ].join(" ")}
        >
          {trendIcon[trend.direction]}
          <span>{trend.percentage}%</span>
        </div>
      )}
    </div>

    {/* Value */}
    <p className="mt-4 text-3xl font-bold tracking-tight text-white">
      {value}
    </p>

    {/* Title */}
    <p className="mt-1 text-sm font-medium text-slate-400">{title}</p>

    {/* Subtitle / trend label */}
    {(subtitle || trend?.label) && (
      <p className="mt-0.5 text-xs text-slate-500">
        {subtitle ?? trend?.label}
      </p>
    )}
  </Card>
);

StatsCard.displayName = "StatsCard";

// ---------------------------------------------------------------------------
// 3. PropertyCard
// ---------------------------------------------------------------------------

export interface PropertyCardProps {
  /** Property listing image URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Property title / project name */
  title: string;
  /** Property type, e.g. "2 BHK Apartment" */
  type: string;
  /** Badge colour for the type chip */
  typeBadgeVariant?: BadgeVariant;
  /** Formatted price string, e.g. "₹1.2 Cr" */
  price: string;
  /** Location string */
  location: string;
  /** Number of bedrooms (undefined = skip chip) */
  bedrooms?: number;
  /** Number of bathrooms (undefined = skip chip) */
  bathrooms?: number;
  /** Area string, e.g. "1,450 sq ft" */
  area?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA button click handler */
  onCta?: () => void;
  /** Extra classes */
  className?: string;
}

/** Small spec chip (icon + label) */
const SpecChip: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
    <span className="text-slate-500">{icon}</span>
    {label}
  </span>
);

const BedIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-3.5 w-3.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 9V19M2 9h20v10M2 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M14 14h4"
    />
  </svg>
);

const BathIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-3.5 w-3.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12h18v5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-5ZM3 12V7a3 3 0 0 1 6 0v5"
    />
  </svg>
);

const AreaIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-3.5 w-3.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-3.5 w-3.5 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.088 17 12.843 17 10a7 7 0 1 0-14 0c0 2.843 1.698 5.088 3.354 6.584.83.799 1.654 1.38 2.274 1.765.311.193.572.337.757.433a5.741 5.741 0 0 0 .281.14l.018.008.006.003ZM10 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  imageAlt = "Property image",
  title,
  type,
  typeBadgeVariant = "blue",
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  ctaLabel = "View Details",
  onCta,
  className = "",
}) => (
  <div
    className={[
      "overflow-hidden rounded-xl bg-slate-800 border border-slate-700",
      "shadow-sm hover:shadow-md hover:border-slate-600",
      "transition-all duration-200",
      className,
    ].join(" ")}
  >
    {/* Image */}
    <div className="relative h-44 w-full bg-slate-700 overflow-hidden">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        /* Placeholder when no image is provided */
        <div className="flex h-full w-full items-center justify-center">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="h-16 w-16 text-slate-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
      )}
      {/* Type badge overlay */}
      <div className="absolute top-3 left-3">
        <Badge variant={typeBadgeVariant} size="sm">
          {type}
        </Badge>
      </div>
    </div>

    {/* Body */}
    <div className="p-4 flex flex-col gap-3">
      {/* Title & Price */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 flex-1">
          {title}
        </h3>
        <span className="shrink-0 text-sm font-bold text-[#C9A84C]">
          {price}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <LocationIcon />
        <span className="line-clamp-1">{location}</span>
      </div>

      {/* Spec chips */}
      {(bedrooms !== undefined || bathrooms !== undefined || area) && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-700 pt-3">
          {bedrooms !== undefined && (
            <SpecChip icon={<BedIcon />} label={`${bedrooms} Bed`} />
          )}
          {bathrooms !== undefined && (
            <SpecChip icon={<BathIcon />} label={`${bathrooms} Bath`} />
          )}
          {area && <SpecChip icon={<AreaIcon />} label={area} />}
        </div>
      )}

      {/* CTA */}
      {onCta && (
        <button
          type="button"
          onClick={onCta}
          className={[
            "mt-1 w-full rounded-lg py-2 text-xs font-semibold",
            "bg-[#C9A84C] text-slate-900",
            "hover:bg-[#b8963e] active:bg-[#a6862f]",
            "transition-colors duration-150",
          ].join(" ")}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  </div>
);

PropertyCard.displayName = "PropertyCard";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Card, StatsCard, PropertyCard };
export default Card;
