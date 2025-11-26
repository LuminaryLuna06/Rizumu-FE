import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  IconCircleCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import "./toast.css";

// ========================
// Types & Interfaces
// ========================

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => string;
  hideToast: (id: string) => void;
  success: (
    message: string,
    titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
    options?: Partial<Omit<Toast, "id" | "type" | "message">>
  ) => string;
  error: (
    message: string,
    titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
    options?: Partial<Omit<Toast, "id" | "type" | "message">>
  ) => string;
  warning: (
    message: string,
    titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
    options?: Partial<Omit<Toast, "id" | "type" | "message">>
  ) => string;
  info: (
    message: string,
    titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
    options?: Partial<Omit<Toast, "id" | "type" | "message">>
  ) => string;
}

// ========================
// Context Setup
// ========================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ========================
// Toast Item Component
// ========================

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isLeaving, setIsLeaving] = React.useState(false);

  const getIcon = () => {
    if (toast.icon) return toast.icon;

    switch (toast.type) {
      case "success":
        return <IconCircleCheck size={20} />;
      case "error":
        return <IconAlertCircle size={20} />;
      case "warning":
        return <IconAlertTriangle size={20} />;
      case "info":
        return <IconInfoCircle size={20} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // Match animation duration
  };

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id]);

  return (
    <div
      className={`toast-item toast-${toast.type} ${
        isLeaving ? "toast-leaving" : ""
      }`}
      role="alert"
    >
      <div className="toast-icon">{getIcon()}</div>

      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>

      {toast.action && (
        <button
          className="toast-action-btn"
          onClick={() => {
            toast.action?.onClick();
            handleClose();
          }}
        >
          {toast.action.label}
        </button>
      )}

      <button
        className="toast-close-btn"
        onClick={handleClose}
        aria-label="Close"
      >
        <IconX size={16} />
      </button>
    </div>
  );
};

// ========================
// Toast Container Component
// ========================

const ToastContainer: React.FC<{
  toasts: Toast[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || "top-right";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`toast-container toast-container-${position}`}
        >
          {positionToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={onClose} />
          ))}
        </div>
      ))}
    </>
  );
};

// ========================
// Toast Provider Component
// ========================

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      position: "top-right", // Default position
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (
      message: string,
      titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>
    ) => {
      if (typeof titleOrOptions === "string") {
        return showToast({
          type: "success",
          message,
          title: titleOrOptions,
          ...options,
        });
      }
      return showToast({ type: "success", message, ...titleOrOptions });
    },
    [showToast]
  );

  const error = useCallback(
    (
      message: string,
      titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>
    ) => {
      if (typeof titleOrOptions === "string") {
        return showToast({
          type: "error",
          message,
          title: titleOrOptions,
          ...options,
        });
      }
      return showToast({ type: "error", message, ...titleOrOptions });
    },
    [showToast]
  );

  const warning = useCallback(
    (
      message: string,
      titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>
    ) => {
      if (typeof titleOrOptions === "string") {
        return showToast({
          type: "warning",
          message,
          title: titleOrOptions,
          ...options,
        });
      }
      return showToast({ type: "warning", message, ...titleOrOptions });
    },
    [showToast]
  );

  const info = useCallback(
    (
      message: string,
      titleOrOptions?: string | Partial<Omit<Toast, "id" | "type" | "message">>,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>
    ) => {
      if (typeof titleOrOptions === "string") {
        return showToast({
          type: "info",
          message,
          title: titleOrOptions,
          ...options,
        });
      }
      return showToast({ type: "info", message, ...titleOrOptions });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, hideToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

// ========================
// useToast Hook
// ========================

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
