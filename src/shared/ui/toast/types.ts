export type ToastVariant = "success" | "info" | "error";
export type ToastIcon = "cart" | "heart" | "error";

export type ToastActionButton = {
  label: string;
  onClick: () => void;
};

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  icon?: ToastIcon;
  action?: ToastActionButton;
};

export type ToastState = {
  toasts: Toast[];
};

export type ToastAction =
  | { type: "show"; toast: Toast }
  | { type: "dismiss"; toastId: string }
  | { type: "clear" };
