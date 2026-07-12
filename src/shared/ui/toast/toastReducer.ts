import { ToastAction, ToastState } from "./types";

export const initialToastState: ToastState = {
  toasts: [],
};

const MAX_TOASTS = 2;

export function toastReducer(
  state: ToastState,
  action: ToastAction,
): ToastState {
  switch (action.type) {
    case "show":
      return {
        toasts: [action.toast, ...state.toasts].slice(0, MAX_TOASTS),
      };

    case "dismiss":
      return {
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case "clear":
      return { toasts: [] };
  }
}
