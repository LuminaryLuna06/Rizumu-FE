import React from "react";

function ResponsiveButton({
  children,
  onClick,
  leftSection,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  leftSection?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex p-lg bg-primary-light text-white hover:bg-primary-hover rounded-xl gap-x-sm"
      }
    >
      {leftSection}
      {children}
    </button>
  );
}

export default ResponsiveButton;
