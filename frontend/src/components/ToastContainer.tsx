import React, { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps>({
  addToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // remover automaticamente com 3s
    setTimeout(() => {
       removeToast(id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Container dos toasts (superior direito) */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-[350px]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="w-full min-h-[100px] bg-neutral-500 text-white rounded-xl overflow-hidden shadow-lg flex mt-6"
          >
            {/* Lado colorido (50px) */}
            <div
              className={`w-[50px] flex items-center justify-center ${
                toast.type === "success" ? "bg-green-500" : "bg-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="text-white w-6 h-6" />
              ) : (
                <XCircle className="text-white w-6 h-6" />
              )}
            </div>

            {/* Mensagem (restante) */}
            <div className="flex-1 p-3 flex items-center justify-between">
              <span className="text-sm">{toast.message}</span>

              {/* botão fechar */}
              <button onClick={() => removeToast(toast.id)}>
                <X className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
