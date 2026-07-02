/**
 * Avatar Component
 *
 * Displays either an image or a coloured circle with generated initials.
 *
 * Features:
 *  - Sizes: sm (32 px) | md (40 px) | lg (56 px)
 *  - Deterministic colour derived from the name string (always the same colour
 *    for the same name across renders and sessions)
 *  - Optional `src` prop to show a real photo (falls back to initials if the
 *    image fails to load)
 *  - Optional `status` dot (online / away / offline) in the bottom-right corner
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarStatus = "online" | "away" | "offline";

export interface AvatarProps {
  /** Full name (or any string) used to generate initials and colour */
  name: string;
  /** Optional photo URL — falls back to initials on error */
  src?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Optional status indicator dot */
  status?: AvatarStatus;
  /** Extra classes on the root element */
  className?: string;
  /** Alt text for the image (defaults to the name) */
  alt?: string;
}

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

interface SizeConfig {
  container: string;
  text: string;
  statusDot: string;
  statusOffset: string;
  statusBorder: string;
}

const sizeConfig: Record<AvatarSize, SizeConfig> = {
  sm: {
    container: "h-8 w-8",
    text: "text-xs font-semibold",
    statusDot: "h-2 w-2",
    statusOffset: "-bottom-0.5 -right-0.5",
    statusBorder: "ring-1",
  },
  md: {
    container: "h-10 w-10",
    text: "text-sm font-semibold",
    statusDot: "h-2.5 w-2.5",
    statusOffset: "-bottom-0.5 -right-0.5",
    statusBorder: "ring-1",
  },
  lg: {
    container: "h-14 w-14",
    text: "text-lg font-bold",
    statusDot: "h-3.5 w-3.5",
    statusOffset: "-bottom-0.5 -right-0.5",
    statusBorder: "ring-2",
  },
};

// ---------------------------------------------------------------------------
// Status dot colours
// ---------------------------------------------------------------------------

const statusDotColors: Record<AvatarStatus, string> = {
  online: "bg-green-400",
  away: "bg-amber-400",
  offline: "bg-slate-500",
};

// ---------------------------------------------------------------------------
// Colour palette — 12 distinct background / text combinations
// ---------------------------------------------------------------------------

interface ColorPair {
  bg: string;
  text: string;
}

const colorPalette: ColorPair[] = [
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-violet-600", text: "text-white" },
  { bg: "bg-rose-600", text: "text-white" },
  { bg: "bg-emerald-600", text: "text-white" },
  { bg: "bg-amber-500", text: "text-slate-900" },
  { bg: "bg-cyan-600", text: "text-white" },
  { bg: "bg-pink-600", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
  { bg: "bg-teal-600", text: "text-white" },
  { bg: "bg-orange-500", text: "text-white" },
  { bg: "bg-fuchsia-600", text: "text-white" },
  { bg: "bg-lime-600", text: "text-white" },
];

/**
 * Deterministic hash of a string → palette index.
 * Uses a simple djb2-style hash for stable output.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function pickColor(name: string): ColorPair {
  const index = hashString(name) % colorPalette.length;
  return colorPalette[index];
}

/**
 * Extracts up to two initials from a name string.
 * "John Doe" → "JD"
 * "Alice"    → "A"
 * ""         → "?"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

// ---------------------------------------------------------------------------
// Avatar Component
// ---------------------------------------------------------------------------

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = "md",
  status,
  className = "",
  alt,
}) => {
  const [imgError, setImgError] = useState(false);

  const cfg = sizeConfig[size];
  const color = pickColor(name);
  const initials = getInitials(name);
  const showImage = Boolean(src) && !imgError;

  return (
    <span
      className={[
        "relative inline-flex shrink-0 items-center justify-center",
        "rounded-full select-none overflow-hidden",
        cfg.container,
        showImage ? "" : [color.bg, color.text].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={alt ?? name}
      title={name}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true" className={cfg.text}>
          {initials}
        </span>
      )}

      {/* Status dot */}
      {status && (
        <span
          aria-label={status}
          className={[
            "absolute rounded-full",
            cfg.statusDot,
            cfg.statusOffset,
            cfg.statusBorder,
            "ring-slate-900",
            statusDotColors[status],
          ].join(" ")}
        />
      )}
    </span>
  );
};

Avatar.displayName = "Avatar";

// ---------------------------------------------------------------------------
// AvatarGroup — stack multiple avatars with overlap
// ---------------------------------------------------------------------------

export interface AvatarGroupProps {
  /** List of avatar names (and optional srcs) */
  avatars: Array<{ name: string; src?: string }>;
  /** Maximum number of avatars to display before showing a "+N" count */
  max?: number;
  /** Size applied to every avatar */
  size?: AvatarSize;
  /** Extra classes on the group container */
  className?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = "sm",
  className = "",
}) => {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const cfg = sizeConfig[size];

  return (
    <div
      className={["flex items-center", className].filter(Boolean).join(" ")}
    >
      {visible.map((av, i) => (
        <span
          key={`${av.name}-${i}`}
          className={[
            "relative rounded-full ring-2 ring-slate-900",
            i > 0 ? "-ml-2" : "",
          ].join(" ")}
          style={{ zIndex: visible.length - i }}
        >
          <Avatar name={av.name} src={av.src} size={size} />
        </span>
      ))}

      {overflow > 0 && (
        <span
          className={[
            "relative -ml-2 inline-flex items-center justify-center",
            "rounded-full ring-2 ring-slate-900",
            "bg-slate-600 text-white",
            cfg.container,
            cfg.text,
          ].join(" ")}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Avatar, AvatarGroup, getInitials, pickColor };
export default Avatar;
