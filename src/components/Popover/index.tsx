import type { ReactNode } from "react";
import ResponsiveButton from "../ResponsiveButton";
import { IconX } from "@tabler/icons-react";

type PopoverProps = {
  opened: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children?: ReactNode;
  className?: string;
  position?: "bottom" | "top" | "left" | "right";
};

const Popover: React.FC<PopoverProps> = ({
  opened,
  onClose,
  trigger,
  children,
  className,
  position = "bottom",
}) => {
  const positionClasses = {
    bottom: "left-0 top-full mt-sm",
    top: "left-0 bottom-full mb-sm",
    left: "right-full top-0 mr-sm",
    right: "left-full top-0 ml-sm",
  };

  return (
    <div className="relative inline-block">
      <div onClick={onClose}>{trigger}</div>
      <>
        <div
          className={`fixed inset-0 z-modal transition-opacity duration-base ${
            opened ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />

        <div
          className={`absolute ${
            positionClasses[position]
          } z-popover w-96 transition-all duration-base ${
            opened
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          } ${className || ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-modal-overlay backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
            {children}
          </div>
        </div>
      </>
    </div>
  );
};

export default Popover;
