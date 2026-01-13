import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`
          relative glass rounded-xl shadow-xl border border-surface-200 w-full ${sizeClasses[size]}
          animate-bounce-in
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
