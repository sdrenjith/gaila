"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type Toast = {
  id: string;
  message: string;
  variant?: "success" | "error" | "info";
};

type ToastContextValue = {
  push: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const subscribe = () => () => {};

function useHasMounted() {
  // `useSyncExternalStore` lets us return false on the server and true on the
  // client without a setState-in-effect lint warning.
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const mounted = useHasMounted();
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current, { ...toast, id }]);
      const timer = setTimeout(() => {
        timeoutsRef.current.delete(id);
        setToasts((current) => current.filter((entry) => entry.id !== id));
      }, 4000);
      timeoutsRef.current.set(id, timer);
    },
    [],
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timer) => clearTimeout(timer));
      timeouts.clear();
    };
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed right-6 top-6 z-[80] flex flex-col items-end gap-3">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`pointer-events-auto min-w-[240px] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur ${
                    toast.variant === "error"
                      ? "border-red-400 bg-red-600 text-white"
                      : toast.variant === "info"
                        ? "border-stone-300 bg-white/95 text-stone-900"
                        : "border-emerald-400 bg-emerald-600 text-white"
                  }`}
                >
                  {toast.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { push: () => {} } as ToastContextValue;
  }
  return ctx;
}
