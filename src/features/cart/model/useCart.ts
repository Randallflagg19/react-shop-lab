import { useState } from "react";
import type { CartItem } from "./types";
import type { Product } from "@/entities/product/model/types";

export function useCart(initialItems: CartItem[] = []) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const alreadyExist = prev.some((item) => item.product.id === product.id);

      if (!alreadyExist) {
        return [...prev, { product, quantity: 1 }];
      }

      return prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  }

  function removeFromCart(productId: number) {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }

  function increaseQuantity(productId: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decreaseQuantity(productId: number) {
    setCartItems((prev) => {
      const currentItem = prev.find((item) => item.product.id === productId);

      if (!currentItem) return prev;

      if (currentItem.quantity === 1) {
        return prev.filter((item) => item !== currentItem);
      }

      return prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalPrice = cartItems.reduce((acc, el) => {
    return acc + el.product.price * el.quantity;
  }, 0);

  const totalCount = cartItems.reduce((acc, el) => acc + el.quantity, 0);

  return {
    addToCart,
    cartItems,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    setCartItems,
    totalPrice,
    totalCount,
  };
}
