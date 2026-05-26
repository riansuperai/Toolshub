"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
  duration?: number;
};

type ToastContextValue = {
  show: (toast: Omit<Toast, "id">) => void;
  success: (title: string, body?: string) => void;
  error: (title: string, body?: string) => void;
  info: (title: string, body?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((t) => [...t, { ...toast, id }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id));
    }, toast.duration ?? 4000);
  }, []);

  const value: ToastContextValue = {
    show,
    success: (title, body) => show({ kind: "success", title, body }),
    error: (title, body) => show({ kind: "error", title, body, duration: 6000 }),
    info: (title, body) => show({ kind: "info", title, body })
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setClosing(true), (toast.duration ?? 4000) - 250);
    return () => clearTimeout(timer);
  }, [toast.duration]);

  const Icon = toast.kind === "success" ? CheckCircle2 : toast.kind === "error" ? AlertCircle : Info;

  return (
    <div className={`toast toast-${toast.kind}${closing ? " closing" : ""}`} role="status">
      <span className="toast-icon"><Icon size={18} /></span>
      <div className="toast-body">
        <strong>{toast.title}</strong>
        {toast.body ? <small>{toast.body}</small> : null}
      </div>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Sluiten">
        <X size={13} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback no-op zodat toast.success() niet crasht buiten provider
    return {
      show: () => {},
      success: () => {},
      error: () => {},
      info: () => {}
    } satisfies ToastContextValue;
  }
  return ctx;
}
