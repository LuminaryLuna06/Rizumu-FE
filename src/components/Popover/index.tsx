import type { ReactNode } from "react";
import { useRef, useEffect } from "react";
import { useClickOutside } from "@rizumu/hooks/useClickOutside";

type PopoverProps = {
  opened: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children?: ReactNode;
  className?: string;
  position?: "top-right" | "bottom-left" | "bottom-right";
};

const Popover: React.FC<PopoverProps> = ({
  opened,
  onClose,
  trigger,
  children,
  className,
  position = "bottom-right",
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const positionClasses = {
    "top-right": "top-16 right-5",
    "bottom-left": "bottom-20 left-5",
    "bottom-right": "bottom-20 right-5",
  };
  useClickOutside(popoverRef, onClose, opened);
  useEffect(() => {
    if (!opened) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [opened, onClose]);

  return (
    <>
      <div onClick={onClose} className="z-base inline-block">
        {trigger}
      </div>

      <div
        ref={popoverRef}
        className={`fixed ${
          positionClasses[position]
        } z-popover w-96 transition-all duration-base ${
          opened
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } ${className || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-popover-overlay backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
          {children}
        </div>
      </div>
    </>
  );
};

export default Popover;
