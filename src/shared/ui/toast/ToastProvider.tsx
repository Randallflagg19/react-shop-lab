"use client";

import { createContext, useContext, useReducer } from "react";
import type { Toast, ToastVariant } from "./types";
import { initialToastState, toastReducer } from "./toastReducer";

type ShowToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toasts: Toast[];
  showToast: (toast: ShowToastInput) => void;
  dismissToast: (toastId: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, initialToastState);

  function showToast(toast: ShowToastInput) {
    dispatch({
      type: "show",
      toast: {
        id: crypto.randomUUID(),
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? "info",
      },
    });
  }
  function dismissToast(toastId: string) {
    dispatch({ type: "dismiss", toastId });
  }
  function clearToasts() {
    dispatch({ type: "clear" });
  }

  const contextValue: ToastContextValue = {
    toasts: state.toasts,
    showToast,
    dismissToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
