"use client";

import { ShoppingCart } from "lucide-react";
import type { Toast } from "./types";

type ToastViewportProps = {
  toasts: Toast[];
  onDismiss: (toastId: string) => void;
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
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
            <ShoppingCart size={24} strokeWidth={1.6} />
          </div>

          <div data-toast-content>
            <p data-toast-title>{toast.title}</p>

            {toast.description && (
              <p data-toast-description>{toast.description}</p>
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
