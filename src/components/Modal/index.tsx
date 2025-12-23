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
};

const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title = "Modal",
  children,
  className,
  more,
  closeOnClickOutside = true,
}) => {
  if (!opened) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent z-modal w-full transition-all duration-base backdrop-blur-xs"
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      <div
        className={`${(
          className || ""
        ).trim()} mx-sm md:mx-xl w-full max-w-[800px] max-h-[90%] bg-modal-overlay text-secondary rounded-3xl shadow-2xl p-md md:p-xl border border-gray-800 relative animate-dropdown font-poppins`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-lg">
          <div className="flex items-center">
            <h2 className="md:text-2xl text-lg font-semibold mr-lg">{title}</h2>
            {more}
          </div>
          <IconX
            size={20}
            onClick={onClose}
            className="text-secondary transition-colors cursor-pointer"
            aria-label="Close modal"
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
