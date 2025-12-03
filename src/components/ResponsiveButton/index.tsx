import React from "react";

function ResponsiveButton({
  children,
  className,
  onClick,
  leftSection,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  leftSection?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        className ?? ""
      } flex items-center p-sm md:p-md bg-primary-light text-secondary hover:bg-primary-hover cursor-pointer rounded-lg gap-x-sm`.trim()}
    >
      {leftSection}
      {children}
    </button>
  );
}

export default ResponsiveButton;
