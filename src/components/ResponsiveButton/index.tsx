import React from "react";

function ResponsiveButton({
  children,
  className,
  onClick,
  leftSection,
  rightSection,
  disabled,
  ariaLabel,
  title,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`${
        className ?? ""
      } flex items-center p-sm md:p-md bg-primary-light text-secondary hover:bg-primary-hover rounded-lg gap-x-xs transition-all duration-base ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`.trim()}
    >
      {leftSection}
      {children}
      {rightSection}
    </button>
  );
}

export default ResponsiveButton;
