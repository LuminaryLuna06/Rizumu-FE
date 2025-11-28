import { IconX } from "@tabler/icons-react";
import React from "react";

type ModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title = "Modal",
  children,
}) => {
  if (!opened) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent z-modal w-full transition-all duration-base"
      onClick={onClose}
    >
      <div
        className="bg-modal-overlay text-secondary rounded-3xl shadow-2xl w-1/3 min-w-sm p-xl border border-gray-800 relative animate-dropdown"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-lg">
          <h2 className="text-2xl font-bold">{title}</h2>
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
