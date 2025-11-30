import React from "react";

function ResponsiveButton({
  children,
  className,
  onClick,
  leftSection,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  leftSection?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-sm md:p-md bg-primary-light text-white hover:bg-primary-hover cursor-pointer rounded-xl gap-x-sm ${
        className ?? ""
      }`.trim()}
    >
      {leftSection}
      {children}
    </button>
  );
}

export default ResponsiveButton;
