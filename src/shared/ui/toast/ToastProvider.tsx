"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import type { Toast, ToastActionButton, ToastIcon, ToastVariant } from "./types";
import { initialToastState, toastReducer } from "./toastReducer";
import { ToastViewport } from "./ToastViewport";

type ShowToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  icon?: ToastIcon;
  action?: ToastActionButton;
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
        icon: toast.icon,
        action: toast.action,
      },
    });
  }
  const dismissToast = useCallback((toastId: string) => {
    dispatch({ type: "dismiss", toastId });
  }, []);
  function clearToasts() {
    dispatch({ type: "clear" });
  }

  useEffect(() => {
    if (state.toasts.length === 0) {
      return;
    }

    const timers = state.toasts.map((toast) =>
      window.setTimeout(() => {
        dismissToast(toast.id);
      }, 2000),
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [dismissToast, state.toasts]);

  const contextValue: ToastContextValue = {
    toasts: state.toasts,
    showToast,
    dismissToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={state.toasts} onDismiss={dismissToast} />
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
