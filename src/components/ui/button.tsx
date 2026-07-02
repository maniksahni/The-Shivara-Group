/**
 * Button Component
 *
 * A fully typed, accessible button with multiple variants and sizes.
 * Supports a loading state with an inline spinner.
 *
 * Variants:
 *  - primary   : gold background (#C9A84C) with dark text
 *  - secondary : slate border / transparent background
 *  - danger    : red background for destructive actions
 *  - ghost     : fully transparent, text-only
 *
 * Sizes: sm | md | lg
 */

import React, { forwardRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** When true, renders a spinner and disables interaction */
  loading?: boolean;
  /** Optional left-side icon rendered before the label */
  leftIcon?: React.ReactNode;
  /** Optional right-side icon rendered after the label */
  rightIcon?: React.ReactNode;
  /** Stretch to fill the parent container width */
  fullWidth?: boolean;
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[#C9A84C] text-slate-900 font-semibold",
    "hover:bg-[#b8963e] active:bg-[#a6862f]",
    "focus-visible:ring-[#C9A84C]/50",
    "disabled:bg-[#C9A84C]/50 disabled:text-slate-900/50",
  ].join(" "),

  secondary: [
    "bg-transparent text-slate-200 border border-slate-600",
    "hover:bg-slate-700 hover:border-slate-500 active:bg-slate-600",
    "focus-visible:ring-slate-500/50",
    "disabled:border-slate-700 disabled:text-slate-500",
  ].join(" "),

  danger: [
    "bg-red-600 text-white font-semibold",
    "hover:bg-red-500 active:bg-red-700",
    "focus-visible:ring-red-500/50",
    "disabled:bg-red-600/50",
  ].join(" "),

  ghost: [
    "bg-transparent text-slate-300",
    "hover:bg-slate-700/60 hover:text-white active:bg-slate-700",
    "focus-visible:ring-slate-500/50",
    "disabled:text-slate-600",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

const Spinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize: Record<ButtonSize, string> = {
    sm: "h-3 w-3 border",
    md: "h-4 w-4 border-2",
    lg: "h-5 w-5 border-2",
  };

  return (
    <span
      aria-hidden="true"
      className={[
        spinnerSize[size],
        "animate-spin rounded-full border-current border-t-transparent",
        "shrink-0",
      ].join(" ")}
    />
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = [
      "inline-flex items-center justify-center",
      "select-none whitespace-nowrap",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
      "disabled:cursor-not-allowed disabled:pointer-events-none",
      fullWidth ? "w-full" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {/* Loading spinner replaces the left icon when loading */}
        {loading ? (
          <Spinner size={size} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {/* Button label */}
        {children && <span>{children}</span>}

        {/* Right icon is hidden during loading to keep width stable */}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
