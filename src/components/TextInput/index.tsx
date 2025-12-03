import React, { type InputHTMLAttributes } from "react";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "filled" | "unstyled";
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  leftSectionWidth?: number;
  rightSectionWidth?: number;
  leftSectionPointerEvents?: "none" | "auto";
  rightSectionPointerEvents?: "none" | "auto";
}

function TextInput({
  label,
  description,
  error,
  size = "md",
  radius = "md",
  variant = "default",
  leftSection,
  rightSection,
  leftSectionWidth = 36,
  rightSectionWidth = 36,
  leftSectionPointerEvents = "none",
  rightSectionPointerEvents = "none",
  className = "",
  disabled,
  required,
  ...inputProps
}: TextInputProps) {
  // Size variants
  const sizeClasses = {
    xs: "h-[30px] text-xs px-[8px]",
    sm: "h-[36px] text-sm px-[10px]",
    md: "h-[42px] text-base px-[12px]",
    lg: "h-[50px] text-lg px-[16px]",
    xl: "h-[60px] text-xl px-[20px]",
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
          className={`font-base text-secondary/80 ${labelSizeClasses[size]} ${
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

      {/* Input Wrapper */}
      <div className="relative inline-flex items-center">
        {/* Left Section */}
        {leftSection && (
          <div
            className="absolute left-0 flex items-center justify-center h-full text-white/60 z-10"
            style={{
              width: `${leftSectionWidth}px`,
              pointerEvents: leftSectionPointerEvents,
            }}
          >
            {leftSection}
          </div>
        )}

        {/* Input */}
        <input
          type="text"
          className={`
            w-full
            ${sizeClasses[size]}
            ${radiusClasses[radius]}
            ${variant !== "unstyled" ? variantClasses[variant] : ""}
            ${errorClasses}
            ${disabledClasses}
            outline-none
            transition-all duration-[var(--transition-fast)]
            font-[var(--font-inter)]
          `}
          style={{
            paddingLeft: leftSection ? `${leftSectionWidth}px` : undefined,
            paddingRight: rightSection ? `${rightSectionWidth}px` : undefined,
          }}
          disabled={disabled}
          {...inputProps}
        />

        {/* Right Section */}
        {rightSection && (
          <div
            className="absolute right-0 flex items-center justify-center h-full text-white/60 z-10"
            style={{
              width: `${rightSectionWidth}px`,
              pointerEvents: rightSectionPointerEvents,
            }}
          >
            {rightSection}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-500 mt-[6px] font-medium">{error}</div>
      )}
    </div>
  );
}

export default TextInput;
