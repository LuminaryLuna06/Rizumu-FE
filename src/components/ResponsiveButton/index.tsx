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
    <button onClick={onClick} className={"flex"}>
      {leftSection}
      {children}
    </button>
  );
}

export default ResponsiveButton;
