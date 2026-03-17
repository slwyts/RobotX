"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[90%] max-w-[420px] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-up bg-light-panel dark:bg-dark-panel backdrop-blur-xl border border-light-border dark:border-dark-border rounded-xl px-4 py-3 shadow-panel-light dark:shadow-panel-dark flex items-center gap-3"
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} className="text-successLight dark:text-success shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-dangerLight dark:text-danger shrink-0" />
            )}
            <span className="flex-1 text-sm font-medium text-light-textMain dark:text-dark-textMain">
              {toast.message}
            </span>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-light-textMuted dark:text-dark-textMuted hover:text-light-textMain dark:hover:text-dark-textMain transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
