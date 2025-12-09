import React from "react";

function ResponsiveButton({
  children,
  className,
  onClick,
  leftSection,
  rightSection,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        className ?? ""
      } flex items-center p-sm md:p-md bg-primary-light text-secondary hover:bg-primary-hover rounded-lg gap-x-xs ${
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
