import React from "react";

export interface SwitchProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  labelPosition?: "left" | "right";
}

function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  labelPosition = "left",
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(
    checked ?? defaultChecked
  );

  // Sync with external checked prop
  React.useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !internalChecked;
    setInternalChecked(newValue);
    onChange?.(newValue);
  };

  // Size variants for the switch track
  const trackSizeClasses = {
    xs: "w-[32px] h-[16px]",
    sm: "w-[38px] h-[20px]",
    md: "w-[44px] h-[24px]",
    lg: "w-[52px] h-[28px]",
    xl: "w-[60px] h-[32px]",
  };

  // Size variants for the thumb (circle)
  const thumbSizeClasses = {
    xs: "w-[12px] h-[12px]",
    sm: "w-[16px] h-[16px]",
    md: "w-[20px] h-[20px]",
    lg: "w-[24px] h-[24px]",
    xl: "w-[28px] h-[28px]",
  };

  // Thumb translation when checked
  const thumbTranslateClasses = {
    xs: "translate-x-[16px]",
    sm: "translate-x-[18px]",
    md: "translate-x-[20px]",
    lg: "translate-x-[24px]",
    xl: "translate-x-[28px]",
  };

  // Label size classes
  const labelSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const switchElement = (
    <div
      onClick={handleToggle}
      className={`
        relative inline-flex items-center
        ${trackSizeClasses[size]}
        rounded-[var(--radius-full)]
        cursor-pointer
        transition-all duration-[var(--transition-base)]
        ${internalChecked ? "bg-white/90" : "bg-white/20 hover:bg-white/25"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* Thumb (circle) */}
      <div
        className={`
          ${thumbSizeClasses[size]}
          rounded-full
          bg-primary
          shadow-md
          transition-transform duration-[var(--transition-base)]
          absolute left-[2px]
          ${internalChecked ? thumbTranslateClasses[size] : "translate-x-0"}
        `}
      />
    </div>
  );

  const labelElement = (label || description) && (
    <div
      className={`flex flex-col ${labelPosition === "right" ? "ml-3" : "mr-3"}`}
    >
      {label && (
        <span
          className={`
            font-base text-secondary/80
            ${labelSizeClasses[size]}
            ${disabled ? "opacity-50" : ""}
          `}
        >
          {label}
        </span>
      )}
      {description && (
        <span className="text-xs text-white/60 mt-1">{description}</span>
      )}
    </div>
  );

  return (
    <div
      className={`
        inline-flex items-center
        ${className}
      `}
    >
      {labelPosition === "left" && labelElement}
      {switchElement}
      {labelPosition === "right" && labelElement}
    </div>
  );
}

export default Switch;
