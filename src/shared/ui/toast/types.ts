export type ToastVariant = "success" | "info" | "error";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

export type ToastState = {
  toasts: Toast[];
};

export type ToastAction =
  | { type: "show"; toast: Toast }
  | { type: "dismiss"; toastId: string }
  | { type: "clear" };
