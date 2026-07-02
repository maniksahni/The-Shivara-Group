/**
 * Input Component
 *
 * A fully typed, dark-mode styled text input and textarea.
 * Supports label, helper text, and error message slots.
 * Gold focus ring matches the design system accent colour (#C9A84C).
 *
 * Exports:
 *  - Input        : single-line <input>
 *  - TextareaInput: multi-line  <textarea>
 */

import React, { forwardRef, useId } from "react";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface BaseFieldProps {
  /** Label rendered above the input */
  label?: string;
  /** Small helper text below the input */
  helperText?: string;
  /** Validation error message — turns the border red */
  error?: string;
  /** Marks the label with a red asterisk */
  required?: boolean;
  /** Stretch to fill parent width (default: true) */
  fullWidth?: boolean;
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export interface InputProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Icon/element placed at the left inside the input */
  leftAddon?: React.ReactNode;
  /** Icon/element placed at the right inside the input */
  rightAddon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Textarea types
// ---------------------------------------------------------------------------

export interface TextareaInputProps
  extends BaseFieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  /** Number of visible text rows (default: 4) */
  rows?: number;
}

// ---------------------------------------------------------------------------
// Shared style helpers
// ---------------------------------------------------------------------------

const labelClass =
  "block text-sm font-medium text-slate-300 mb-1.5 select-none";

const errorLabelClass = "block text-sm font-medium text-red-400 mb-1.5 select-none";

const baseFieldClass = [
  "w-full rounded-lg bg-slate-800 text-white placeholder-slate-500",
  "border border-slate-700",
  "transition-colors duration-150",
  "focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/40",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const errorFieldClass = [
  "w-full rounded-lg bg-slate-800 text-white placeholder-slate-500",
  "border border-red-500",
  "transition-colors duration-150",
  "focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500/40",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const helperClass = "mt-1.5 text-xs text-slate-500";
const errorMsgClass = "mt-1.5 text-xs text-red-400";

// ---------------------------------------------------------------------------
// FieldWrapper — shared label / helper / error layout
// ---------------------------------------------------------------------------

interface FieldWrapperProps {
  id: string;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({
  id,
  label,
  helperText,
  error,
  required,
  fullWidth = true,
  children,
}) => (
  <div className={fullWidth ? "w-full" : "inline-block"}>
    {label && (
      <label
        htmlFor={id}
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
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className={errorMsgClass}>
        {error}
      </p>
    ) : helperText ? (
      <p id={`${id}-helper`} className={helperClass}>
        {helperText}
      </p>
    ) : null}
  </div>
);

// ---------------------------------------------------------------------------
// Input Component
// ---------------------------------------------------------------------------

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      fullWidth = true,
      leftAddon,
      rightAddon,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();

    const fieldClass = error ? errorFieldClass : baseFieldClass;

    const hasLeft = Boolean(leftAddon);
    const hasRight = Boolean(rightAddon);

    // Adjust padding to make room for inline addons
    const paddingX = [
      hasLeft ? "pl-10" : "pl-3.5",
      hasRight ? "pr-10" : "pr-3.5",
    ].join(" ");

    return (
      <FieldWrapper
        id={autoId}
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        fullWidth={fullWidth}
      >
        <div className="relative">
          {/* Left addon */}
          {leftAddon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftAddon}
            </div>
          )}

          <input
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
            className={[fieldClass, paddingX, "h-10 text-sm", className]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          />

          {/* Right addon */}
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightAddon}
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

Input.displayName = "Input";

// ---------------------------------------------------------------------------
// TextareaInput Component
// ---------------------------------------------------------------------------

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      fullWidth = true,
      rows = 4,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();

    const fieldClass = error ? errorFieldClass : baseFieldClass;

    return (
      <FieldWrapper
        id={autoId}
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        fullWidth={fullWidth}
      >
        <textarea
          ref={ref}
          id={autoId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${autoId}-error`
              : helperText
              ? `${autoId}-helper`
              : undefined
          }
          className={[
            fieldClass,
            "px-3.5 py-2.5 text-sm resize-y min-h-[80px]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      </FieldWrapper>
    );
  }
);

TextareaInput.displayName = "TextareaInput";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Input, TextareaInput };
export default Input;
