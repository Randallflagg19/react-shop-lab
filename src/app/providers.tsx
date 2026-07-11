"use client";

import { CartProvider } from "@/features/cart/model/CartContext";
import { ToastProvider } from "@/shared/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
