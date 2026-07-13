"use client";

import { AlertTriangle, Heart, ShoppingCart } from "lucide-react";
import type { Toast } from "./types";

type ToastViewportProps = {
  toasts: Toast[];
  onDismiss: (toastId: string) => void;
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  function getToastIcon(toast: Toast) {
    switch (toast.icon) {
      case "cart":
        return <ShoppingCart size={24} strokeWidth={1.6} />;
      case "heart":
        return <Heart size={22} strokeWidth={1.7} />;
      case "error":
        return <AlertTriangle size={22} strokeWidth={1.7} />;
      default:
        return getToastFallbackIcon(toast.variant);
    }
  }

  function getToastFallbackIcon(variant: Toast["variant"]) {
    switch (variant) {
      case "error":
        return <AlertTriangle size={22} strokeWidth={1.7} />;
      case "info":
        return <Heart size={22} strokeWidth={1.7} />;
      case "success":
        return <ShoppingCart size={24} strokeWidth={1.6} />;
    }
  }

  return (
    <div data-toast-viewport aria-live="polite" aria-atomic="false">
      {toasts.map((toast, index) => (
        <article
          key={toast.id}
          data-toast
          data-toast-stack={index}
          data-toast-variant={toast.variant}
        >
          <div data-toast-icon aria-hidden="true">
            {getToastIcon(toast)}
          </div>

          <div data-toast-content>
            <p data-toast-title>{toast.title}</p>

            {toast.description && (
              <p data-toast-description>{toast.description}</p>
            )}
            {toast.action && (
              <button
                type="button"
                data-toast-action
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            type="button"
            data-toast-dismiss
            aria-label="Закрыть уведомление"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </article>
      ))}
    </div>
  );
}
