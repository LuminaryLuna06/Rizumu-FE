import { IconX } from "@tabler/icons-react";
import React from "react";

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
  if (!opened) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-modal w-full transition-all duration-base backdrop-blur-sm"
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      <div
        className={`${(
          className || ""
        ).trim()} mx-sm md:mx-xl w-full max-w-[800px] max-h-[90%] bg-modal-overlay text-secondary rounded-3xl shadow-2xl p-md md:p-xl border border-gray-800 relative animate-dropdown font-poppins`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="flex justify-between items-center mb-lg">
            <div className="flex items-center">
              {title && <h2 className="md:text-2xl text-lg font-semibold mr-lg">{title}</h2>}
              {more}
            </div>
            {!hideCloseButton && (
              <IconX
                size={20}
                onClick={onClose}
                className="text-secondary transition-colors cursor-pointer"
                aria-label="Close modal"
              />
            )}
          </div>
        )}
        {hideHeader && !hideCloseButton && (
          <div className="absolute top-4 right-4 z-10">
            <IconX
              size={20}
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            />
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
