import { IconX } from "@tabler/icons-react";
import React, { useEffect } from "react";

type ModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  more?: React.ReactNode;
  closeOnClickOutside?: boolean;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title = "Modal",
  children,
  className,
  more,
  closeOnClickOutside = true,
  hideHeader = false,
  hideCloseButton = false,
}) => {
  // Lock body scroll when modal is open to prevent background scrolling
  useEffect(() => {
    if (!opened) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [opened]);

  if (!opened) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/65 z-modal w-full p-3 sm:p-4 md:p-6 transition-all duration-200 backdrop-blur-sm overscroll-contain"
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      <div
        className={`w-full max-w-[800px] max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-3.5rem)] bg-modal-overlay text-secondary rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-800 relative animate-dropdown font-poppins flex flex-col overflow-hidden ${(
          className || ""
        ).trim()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center">
              {title && <h2 className="md:text-2xl text-lg font-semibold mr-4">{title}</h2>}
              {more}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-secondary/70 hover:text-secondary rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <IconX size={20} />
              </button>
            )}
          </div>
        )}
        {hideHeader && !hideCloseButton && (
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <IconX size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain [-webkit-overflow-scrolling:touch] pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
