import React from "react";

function ResponsiveButton({
  children,
  className,
  onClick,
  leftSection,
  disabled = false,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  leftSection?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${
        className ?? ""
      } flex items-center p-sm md:p-md bg-primary-light text-secondary hover:bg-primary-hover rounded-lg gap-x-sm ${
        disabled
          ? "opacity-50 cursor-not-allowed hover:bg-primary-light"
          : "cursor-pointer"
      }`.trim()}
    >
      {leftSection}
      {children}
    </button>
  );
}

export default ResponsiveButton;
