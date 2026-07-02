/**
 * UI Component Library — Barrel Export
 *
 * Import any UI component from this single entry-point:
 *
 *   import { Button, Input, Badge, StatusBadge, ... } from "@/components/ui";
 */

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
export { Button } from "./button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./button";

// ---------------------------------------------------------------------------
// Input & Textarea
// ---------------------------------------------------------------------------
export { Input, TextareaInput } from "./input";
export type { InputProps, TextareaInputProps, BaseFieldProps } from "./input";

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
export { Select } from "./select";
export type { SelectProps, SelectOption } from "./select";

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
export {
  Badge,
  StatusBadge,
  SourceBadge,
  PriorityBadge,
  // Colour maps (useful for programmatic access)
  statusColorMap,
  sourceColorMap,
  priorityColorMap,
  statusLabelMap,
  sourceLabelMap,
  priorityLabelMap,
} from "./badge";
export type {
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  LeadStatus,
  LeadSource,
  Priority,
  StatusBadgeProps,
  SourceBadgeProps,
  PriorityBadgeProps,
} from "./badge";

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
export { Modal, ModalFooter } from "./modal";
export type { ModalProps, ModalFooterProps, ModalSize } from "./modal";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export { Card, StatsCard, PropertyCard } from "./card";
export type {
  CardProps,
  CardVariant,
  StatsCardProps,
  TrendDirection,
  PropertyCardProps,
} from "./card";

// ---------------------------------------------------------------------------
// Table & Pagination
// ---------------------------------------------------------------------------
export { Table, Pagination } from "./table";
export type {
  TableColumn,
  TableProps,
  PaginationProps,
} from "./table";

// ---------------------------------------------------------------------------
// Avatar & AvatarGroup
// ---------------------------------------------------------------------------
export { Avatar, AvatarGroup, getInitials, pickColor } from "./avatar";
export type {
  AvatarProps,
  AvatarSize,
  AvatarStatus,
  AvatarGroupProps,
} from "./avatar";

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
export { ToastProvider, useToast } from "./toast";
export type { ToastOptions, ToastType, ToastItem } from "./toast";
