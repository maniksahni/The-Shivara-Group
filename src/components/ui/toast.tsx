/**
 * Toast / Notification System
 *
 * Provides a React context-based toast notification layer.
 *
 * Usage:
 *  1. Wrap your app (or layout) with <ToastProvider>
 *  2. In any child component: const { toast } = useToast()
 *  3. Call: toast({ title: "Saved!", type: "success" })
 *
 * Features:
 *  - toast types: success | error | warning | info
 *  - Toasts appear bottom-right, stacked newest on top
 *  - Auto-dismiss after 4 s (configurable per toast via `duration`)
 *  - Animated slide-in from the right, slide-out on dismiss
 *  - Dark styled with a coloured left border
 *  - Manual close button on each toast
 *  - Renders via React Portal (outside the normal DOM tree)
 */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  /** Main heading */
  title: string;
  /** Optional supporting text */
  description?: string;
  /** Visual style / intent */
  type?: ToastType;
  /** Duration in milliseconds before auto-dismiss (default: 4000) */
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastOptions, "description">> {
  id: string;
  description?: string;
  /** Controls the CSS transition state */
  visible: boolean;
}

interface ToastContextValue {
  /** Trigger a new toast notification */
  toast: (options: ToastOptions) => void;
  /** Programmatically dismiss a toast by id */
  dismiss: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const borderColorMap: Record<ToastType, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

const iconColorMap: Record<ToastType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  const cls = ["h-5 w-5 shrink-0", iconColorMap[type]].join(" ");

  if (type === "success") {
    return (
      <svg aria-hidden="true" className={cls} viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg aria-hidden="true" className={cls} viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg aria-hidden="true" className={cls} viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  // info
  return (
    <svg aria-hidden="true" className={cls} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Single Toast Item Component
// ---------------------------------------------------------------------------

interface ToastItemProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastItemComponent: React.FC<ToastItemProps> = ({ item, onDismiss }) => (
  <div
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    className={[
      // Layout
      "flex w-80 max-w-full items-start gap-3 overflow-hidden",
      "rounded-2xl bg-[#0E1726]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl",
      // Left border accent
      "border border-white/10 border-l-4",
      borderColorMap[item.type],
      // Transition — slide in from right, fade
      "transition-all duration-300 ease-out",
      item.visible
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0 pointer-events-none",
    ].join(" ")}
  >
    {/* Type icon */}
    <ToastIcon type={item.type} />

    {/* Text */}
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-white leading-snug">
        {item.title}
      </p>
      {item.description && (
        <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
          {item.description}
        </p>
      )}
    </div>

    {/* Close button */}
    <button
      type="button"
      aria-label="Dismiss notification"
      onClick={() => onDismiss(item.id)}
      className={[
        "shrink-0 rounded-md p-1 text-slate-500",
        "hover:bg-white/10 hover:text-slate-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]/50",
        "transition-colors duration-100",
      ].join(" ")}
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Toast Container — renders into a portal at the bottom-right
// ---------------------------------------------------------------------------

const DEFAULT_DURATION = 4000;
/** Animation out takes 300ms; give it a buffer before actually removing */
const REMOVAL_DELAY = 350;

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className={[
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[9999]",
        "flex flex-col-reverse gap-2",
        // Newest toast is added at the bottom of the list visually
        // (flex-col-reverse flips so newest is on top)
      ].join(" ")}
    >
      {toasts.map((item) => (
        <ToastItemComponent key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
};

// ---------------------------------------------------------------------------
// ToastProvider
// ---------------------------------------------------------------------------

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts shown simultaneously (default: 5) */
  maxToasts?: number;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // We keep a ref to auto-dismiss timers so we can clear them on unmount
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ---- Dismiss a toast (starts the slide-out transition) ----
  const dismiss = useCallback((id: string) => {
    // Mark as invisible → CSS transition plays
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );

    // Remove from DOM after the transition has finished
    const removeTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, REMOVAL_DELAY);

    // Store so we can clear on unmount
    timers.current.set(`remove-${id}`, removeTimer);

    // Clear the auto-dismiss timer if it still exists
    const autoTimer = timers.current.get(id);
    if (autoTimer) {
      clearTimeout(autoTimer);
      timers.current.delete(id);
    }
  }, []);

  // ---- Add a new toast ----
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = options.duration ?? DEFAULT_DURATION;

      const newToast: ToastItem = {
        id,
        title: options.title,
        description: options.description,
        type: options.type ?? "info",
        duration,
        visible: false, // start invisible, flip to true on next frame for animation
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Trim to maxToasts (remove oldest visible ones)
        return updated.length > maxToasts
          ? updated.slice(updated.length - maxToasts)
          : updated;
      });

      // Flip to visible on the next animation frame to trigger CSS transition
      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
        );
      });

      // Schedule auto-dismiss
      const autoTimer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, autoTimer);
    },
    [dismiss, maxToasts]
  );

  // ---- Cleanup all timers on unmount ----
  useEffect(() => {
    const allTimers = timers.current;
    return () => {
      allTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";

// ---------------------------------------------------------------------------
// useToast hook
// ---------------------------------------------------------------------------

/**
 * Returns `{ toast, dismiss }` from the nearest <ToastProvider>.
 * Throws if used outside of a <ToastProvider>.
 */
function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used inside a <ToastProvider>. " +
        "Wrap your app or layout with <ToastProvider>."
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { ToastProvider, useToast };
export type { ToastItem };
