/**
 * Select Component
 *
 * A fully typed, dark-mode styled native <select> element.
 * Supports label, error message, placeholder option, and a typed options array.
 * Gold focus ring matches the design system accent colour (#F4B400).
 */

import React, { forwardRef, useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption {
  /** The value submitted with the form */
  value: string;
  /** Human-readable label shown in the dropdown */
  label: string;
  /** When true, the option cannot be selected */
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  /** Options to render inside the dropdown */
  options: SelectOption[];
  /** Label rendered above the select */
  label?: string;
  /** Validation error message — turns the border red */
  error?: string;
  /** Small helper text rendered below the select */
  helperText?: string;
  /** Placeholder option shown when no value is selected */
  placeholder?: string;
  /** Marks the label with a red asterisk */
  required?: boolean;
  /** Stretch to fill parent width (default: true) */
  fullWidth?: boolean;
}

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const baseSelectClass = [
  "w-full min-h-11 rounded-2xl bg-slate-800/80 text-white text-sm",
  "border border-white/10 shadow-sm shadow-black/10",
  "pl-4 pr-11 appearance-none cursor-pointer",
  "transition-all duration-200",
  "focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/30",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const errorSelectClass = [
  "w-full min-h-11 rounded-2xl bg-slate-800/80 text-white text-sm",
  "border border-red-500/70 shadow-sm shadow-red-950/20",
  "pl-4 pr-11 appearance-none cursor-pointer",
  "transition-all duration-200",
  "focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-500/30",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const labelClass = "mb-2 block select-none text-sm font-bold text-slate-300";
const errorLabelClass = "mb-2 block select-none text-sm font-bold text-red-300";
const helperClass = "mt-2 text-xs leading-5 text-slate-500";
const errorMsgClass = "mt-2 text-xs font-semibold leading-5 text-red-300";

// ---------------------------------------------------------------------------
// Chevron icon (pure SVG, no external dep)
// ---------------------------------------------------------------------------

const ChevronIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 text-slate-400"
  >
    <path
      fillRule="evenodd"
      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      placeholder,
      required,
      fullWidth = true,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();

    const selectClass = error ? errorSelectClass : baseSelectClass;

    return (
      <div className={fullWidth ? "w-full" : "inline-block"}>
        {/* Label */}
        {label && (
          <label
            htmlFor={autoId}
            className={error ? errorLabelClass : labelClass}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-400" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Select wrapper — positions the custom chevron */}
        <div className="relative">
          <select
            ref={ref}
            id={autoId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${autoId}-error`
                : helperText
                ? `${autoId}-helper`
                : undefined
            }
            className={[selectClass, className].filter(Boolean).join(" ")}
            {...rest}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Typed options */}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-slate-800 text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron arrow — pointer-events-none so clicks pass through */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronIcon />
          </div>
        </div>

        {/* Error / helper text */}
        {error ? (
          <p id={`${autoId}-error`} role="alert" className={errorMsgClass}>
            {error}
          </p>
        ) : helperText ? (
          <p id={`${autoId}-helper`} className={helperClass}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export default Select;
