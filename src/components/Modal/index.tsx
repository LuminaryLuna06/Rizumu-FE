import { IconX } from "@tabler/icons-react";
import React from "react";

type ModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title = "Modal",
  children,
  className,
}) => {
  if (!opened) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent z-modal w-full transition-all duration-base backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`${(
          className || ""
        ).trim()} mx-xl w-[800px] max-w-[90%] max-h-[80%] bg-modal-overlay text-secondary rounded-3xl shadow-2xl p-xl border border-gray-800 relative animate-dropdown font-poppins`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-lg">
          <h2 className="md:text-2xl text-lg font-semibold">{title}</h2>
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
