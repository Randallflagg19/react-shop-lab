"use client";

import { CartProvider } from "@/features/cart/model/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
