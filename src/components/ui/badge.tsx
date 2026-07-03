/**
 * Badge Component
 *
 * Compact pill-shaped labels for statuses, sources, and priorities.
 *
 * Exports:
 *  - Badge         : generic badge with explicit color variant
 *  - StatusBadge   : auto-colors by LeadStatus string
 *  - SourceBadge   : auto-colors by LeadSource string
 *  - PriorityBadge : auto-colors by Priority string
 */

import React from "react";

// ---------------------------------------------------------------------------
// Colour variant map
// ---------------------------------------------------------------------------

export type BadgeVariant =
  // Status
  | "blue"
  | "purple"
  | "amber"
  | "cyan"
  | "orange"
  | "green"
  | "red"
  | "gray"
  // Extras
  | "pink"
  | "indigo"
  | "teal"
  | "yellow"
  | "slate";

const variantStyles: Record<BadgeVariant, string> = {
  blue: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  purple: "bg-purple-500/15 text-purple-300 ring-purple-500/30",
  amber: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 ring-cyan-500/30",
  orange: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  green: "bg-green-500/15 text-green-300 ring-green-500/30",
  red: "bg-red-500/15 text-red-300 ring-red-500/30",
  gray: "bg-slate-600/40 text-slate-400 ring-slate-600/40",
  pink: "bg-pink-500/15 text-pink-300 ring-pink-500/30",
  indigo: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/30",
  teal: "bg-teal-500/15 text-teal-300 ring-teal-500/30",
  yellow: "bg-yellow-500/15 text-yellow-300 ring-yellow-500/30",
  slate: "bg-slate-700/60 text-slate-300 ring-slate-600/30",
};

// ---------------------------------------------------------------------------
// Domain-type colour maps
// ---------------------------------------------------------------------------

/** Shivara CRM lead status values */
export type LeadStatus =
  | "NEW"
  | "ASSIGNED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "MEETING_SCHEDULED"
  | "SITE_VISIT_SCHEDULED"
  | "SITE_VISIT"
  | "NEGOTIATION"
  | "BOOKING"
  | "CLOSED"
  | "LOST";

const statusColorMap: Record<LeadStatus, BadgeVariant> = {
  NEW: "blue",
  ASSIGNED: "indigo",
  CONTACTED: "purple",
  FOLLOW_UP: "amber",
  MEETING_SCHEDULED: "yellow",
  SITE_VISIT_SCHEDULED: "cyan",
  SITE_VISIT: "teal",
  NEGOTIATION: "orange",
  BOOKING: "green",
  CLOSED: "green",
  LOST: "gray",
};

/** Human-friendly labels for status values */
const statusLabelMap: Record<LeadStatus, string> = {
  NEW: "New",
  ASSIGNED: "Assigned",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow-Up",
  MEETING_SCHEDULED: "Meeting Scheduled",
  SITE_VISIT_SCHEDULED: "Visit Scheduled",
  SITE_VISIT: "Site Visit",
  NEGOTIATION: "Negotiation",
  BOOKING: "Booking",
  CLOSED: "Closed",
  LOST: "Lost",
};

/** Shivara CRM lead source values */
export type LeadSource =
  | "INSTAGRAM"
  | "WHATSAPP"
  | "WEBSITE"
  | "FACEBOOK"
  | "GOOGLE"
  | "REFERRAL";

const sourceColorMap: Record<LeadSource, BadgeVariant> = {
  INSTAGRAM: "pink",
  WHATSAPP: "green",
  WEBSITE: "blue",
  FACEBOOK: "indigo",
  GOOGLE: "red",
  REFERRAL: "teal",
};

const sourceLabelMap: Record<LeadSource, string> = {
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  WEBSITE: "Website",
  FACEBOOK: "Facebook",
  GOOGLE: "Google",
  REFERRAL: "Referral",
};

/** Generic priority levels */
export type Priority = "HIGH" | "MEDIUM" | "LOW";

const priorityColorMap: Record<Priority, BadgeVariant> = {
  HIGH: "red",
  MEDIUM: "amber",
  LOW: "green",
};

const priorityLabelMap: Record<Priority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

// ---------------------------------------------------------------------------
// Badge size
// ---------------------------------------------------------------------------

export type BadgeSize = "sm" | "md";

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] leading-[18px]",
  md: "px-2.5 py-1 text-xs leading-5",
};

// ---------------------------------------------------------------------------
// Badge Props
// ---------------------------------------------------------------------------

export interface BadgeProps {
  /** The colour variant to render */
  variant?: BadgeVariant;
  /** Size — defaults to sm to stay compact */
  size?: BadgeSize;
  /** Content to display inside the badge */
  children: React.ReactNode;
  /** Extra Tailwind classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Badge Component
// ---------------------------------------------------------------------------

const Badge: React.FC<BadgeProps> = ({
  variant = "slate",
  size = "sm",
  children,
  className = "",
}) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 font-medium rounded-full",
        "ring-1 ring-inset",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

// ---------------------------------------------------------------------------
// StatusBadge — auto-colors from LeadStatus
// ---------------------------------------------------------------------------

export interface StatusBadgeProps {
  status: LeadStatus;
  size?: BadgeSize;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  className = "",
}) => {
  const color = statusColorMap[status] ?? "slate";
  const label = statusLabelMap[status] ?? status;

  return (
    <Badge variant={color} size={size} className={className}>
      {/* Coloured dot */}
      <span
        aria-hidden="true"
        className={[
          "inline-block h-1.5 w-1.5 rounded-full",
          dotColorByVariant(color),
        ].join(" ")}
      />
      {label}
    </Badge>
  );
};

// ---------------------------------------------------------------------------
// SourceBadge — auto-colors from LeadSource
// ---------------------------------------------------------------------------

export interface SourceBadgeProps {
  source: LeadSource;
  size?: BadgeSize;
  className?: string;
}

const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  size = "sm",
  className = "",
}) => {
  const color = sourceColorMap[source] ?? "slate";
  const label = sourceLabelMap[source] ?? source;

  return (
    <Badge variant={color} size={size} className={className}>
      {label}
    </Badge>
  );
};

// ---------------------------------------------------------------------------
// PriorityBadge — auto-colors from Priority
// ---------------------------------------------------------------------------

export interface PriorityBadgeProps {
  priority: Priority;
  size?: BadgeSize;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "sm",
  className = "",
}) => {
  const color = priorityColorMap[priority] ?? "slate";
  const label = priorityLabelMap[priority] ?? priority;

  return (
    <Badge variant={color} size={size} className={className}>
      {label}
    </Badge>
  );
};

// ---------------------------------------------------------------------------
// Helper — dot colour (matches text colour of each variant)
// ---------------------------------------------------------------------------

function dotColorByVariant(variant: BadgeVariant): string {
  const map: Record<BadgeVariant, string> = {
    blue: "bg-blue-300",
    purple: "bg-purple-300",
    amber: "bg-amber-300",
    cyan: "bg-cyan-300",
    orange: "bg-orange-300",
    green: "bg-green-300",
    red: "bg-red-300",
    gray: "bg-slate-400",
    pink: "bg-pink-300",
    indigo: "bg-indigo-300",
    teal: "bg-teal-300",
    yellow: "bg-yellow-300",
    slate: "bg-slate-300",
  };
  return map[variant] ?? "bg-slate-300";
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Badge,
  StatusBadge,
  SourceBadge,
  PriorityBadge,
};

export {
  statusColorMap,
  sourceColorMap,
  priorityColorMap,
  statusLabelMap,
  sourceLabelMap,
  priorityLabelMap,
};

export default Badge;
