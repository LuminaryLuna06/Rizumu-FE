import React, { type TextareaHTMLAttributes, useEffect, useRef } from "react";

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "filled" | "unstyled";
  minRows?: number;
  maxRows?: number;
  autosize?: boolean;
}

function TextArea({
  label,
  description,
  error,
  size = "md",
  radius = "md",
  variant = "default",
  minRows = 4,
  maxRows,
  autosize = false,
  className = "",
  disabled,
  required,
  rows,
  ...textareaProps
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize functionality
  useEffect(() => {
    if (!autosize || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const adjustHeight = () => {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;

      // Calculate min and max heights based on rows
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows ? maxRows * lineHeight : Infinity;

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    };

    adjustHeight();
    textarea.addEventListener("input", adjustHeight);

    return () => {
      textarea.removeEventListener("input", adjustHeight);
    };
  }, [autosize, minRows, maxRows, textareaProps.value]);

  // Size variants - using min-height instead of height for textarea
  const sizeClasses = {
    xs: "min-h-[60px] text-xs px-[8px] py-[6px]",
    sm: "min-h-[72px] text-sm px-[10px] py-[7px]",
    md: "min-h-[84px] text-base px-[12px] py-[8px]",
    lg: "min-h-[100px] text-lg px-[16px] py-[10px]",
    xl: "min-h-[120px] text-xl px-[20px] py-[12px]",
  };

  // Radius variants
  const radiusClasses = {
    sm: "rounded-[var(--radius-sm)]",
    md: "rounded-[var(--radius-md)]",
    lg: "rounded-[var(--radius-lg)]",
    xl: "rounded-[var(--radius-xl)]",
    full: "rounded-[var(--radius-full)]",
  };

  // Variant styles
  const variantClasses = {
    default: `border border-white/20 bg-white/5 text-white placeholder:text-white/40
      focus:border-white/50 focus:bg-white/8
      hover:bg-white/8 hover:border-white/30`,
    filled: `border border-transparent bg-white/10 text-white placeholder:text-white/40
      focus:border-white/30 focus:bg-white/12
      hover:bg-white/12`,
    unstyled: "border-none bg-transparent text-white placeholder:text-white/40",
  };

  // Error state
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 hover:border-red-500"
    : "";

  // Disabled state
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-white/5 hover:bg-white/5"
    : "";

  // Label size classes
  const labelSizeClasses = {
    xs: "text-xs mb-[4px]",
    sm: "text-sm mb-[4px]",
    md: "text-sm mb-[6px]",
    lg: "text-base mb-[6px]",
    xl: "text-lg mb-[8px]",
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      {label && (
        <label
          className={`font-medium text-secondary/80 ${labelSizeClasses[size]} ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <div className="text-xs text-white/60 mb-[6px]">{description}</div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={autosize ? undefined : rows || minRows}
        className={`
          w-full
          resize-${autosize ? "none" : "y"}
          ${sizeClasses[size]}
          ${radiusClasses[radius]}
          ${variant !== "unstyled" ? variantClasses[variant] : ""}
          ${errorClasses}
          ${disabledClasses}
          outline-none
          transition-all duration-[var(--transition-fast)]
          font-[var(--font-inter)]
        `}
        disabled={disabled}
        {...textareaProps}
      />

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-500 mt-[6px] font-medium">{error}</div>
      )}
    </div>
  );
}

export default TextArea;
