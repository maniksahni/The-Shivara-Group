/**
 * Modal / Dialog Component
 *
 * A fully accessible modal rendered via React Portal.
 *
 * Features:
 *  - Backdrop click dismisses the modal
 *  - ESC key dismisses the modal
 *  - Focus trap: keeps keyboard focus inside while open
 *  - CSS transitions: fade + scale animation
 *  - Dark mode (bg-slate-900 panel, backdrop-blur)
 *  - Size variants: sm | md | lg | xl
 */

"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useId,
} from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /** Title shown in the modal header */
  title?: string;
  /** Modal body content */
  children: React.ReactNode;
  /** Width preset */
  size?: ModalSize;
  /** When true, clicking the backdrop will NOT close the modal */
  disableBackdropClose?: boolean;
  /** Extra classes applied to the modal panel */
  className?: string;
}

// ---------------------------------------------------------------------------
// Size styles
// ---------------------------------------------------------------------------

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm w-full",
  md: "max-w-md w-full",
  lg: "max-w-lg w-full",
  xl: "max-w-2xl w-full",
};

// ---------------------------------------------------------------------------
// Focusable element selector (for focus trap)
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// ---------------------------------------------------------------------------
// CloseIcon
// ---------------------------------------------------------------------------

const CloseIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ---------------------------------------------------------------------------
// Modal Component
// ---------------------------------------------------------------------------

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  disableBackdropClose = false,
  className = "",
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // ---- ESC key handler ----
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap — cycle focus within the panel
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => !el.closest("[aria-hidden='true']"));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab — wrap to last element
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab — wrap to first element
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ---- Scroll lock ----
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // ---- Auto-focus first focusable element ----
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusable = panelRef.current.querySelector<HTMLElement>(
        FOCUSABLE_SELECTOR
      );
      // Slight delay ensures the portal has painted
      const raf = requestAnimationFrame(() => focusable?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [isOpen]);

  // ---- Backdrop click ----
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disableBackdropClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // ---- Render ----
  // Always render in DOM so CSS transitions can play out, but use
  // visibility/pointer-events to hide when closed.

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        className={[
          "fixed inset-0 z-40",
          "bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-200 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Scroll container */}
      <div
        role="presentation"
        aria-hidden={!isOpen}
        onClick={handleBackdropClick}
        className={[
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          "overflow-y-auto",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={[
            // Layout
            sizeStyles[size],
            "mx-auto my-auto",
            // Appearance
            "rounded-xl bg-slate-900 border border-slate-700 shadow-2xl",
            // Transition — scale + fade
            "transition-all duration-200 ease-out",
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h2
                id={titleId}
                className="text-lg font-semibold text-white leading-snug"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={[
                  "rounded-lg p-1.5 text-slate-400",
                  "hover:bg-slate-700 hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[#C9A84C]/50",
                  "transition-colors duration-150",
                ].join(" ")}
              >
                <CloseIcon />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
};

Modal.displayName = "Modal";

// ---------------------------------------------------------------------------
// ModalFooter — convenience layout component for action buttons
// ---------------------------------------------------------------------------

export interface ModalFooterProps {
  children: React.ReactNode;
  /** Alignment of the footer buttons */
  align?: "left" | "right" | "center" | "between";
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  align = "right",
}) => {
  const alignStyles: Record<string, string> = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
    between: "justify-between",
  };

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-3 border-t border-slate-700",
        "px-6 py-4 -mx-6 -mb-5 mt-4 rounded-b-xl",
        alignStyles[align] ?? "justify-end",
      ].join(" ")}
    >
      {children}
    </div>
  );
};

ModalFooter.displayName = "ModalFooter";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Modal, ModalFooter };
export default Modal;
