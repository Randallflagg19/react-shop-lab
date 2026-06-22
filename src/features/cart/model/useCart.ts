import { useReducer } from "react";
import type { CartItem } from "./types";
import type { Product } from "@/entities/product/model/types";

type CartAction =
  | { type: "add"; product: Product }
  | { type: "remove"; productId: number }
  | { type: "increase"; productId: number }
  | { type: "decrease"; productId: number }
  | { type: "clear" };

export function useCart(initialItems: CartItem[] = []) {
  const [cartItems, dispatch] = useReducer(reducer, initialItems);

  function reducer(state: CartItem[], action: CartAction) {
    switch (action.type) {
      case "add": {
        const alreadyExist = state.some(
          (item) => item.product.id === action.product.id,
        );

        if (!alreadyExist) {
          return [...state, { product: action.product, quantity: 1 }];
        }

        return state.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      case "remove":
        return state.filter((item) => item.product.id !== action.productId);

      case "increase":
        return state.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );

      case "decrease": {
        const currentItem = state.find(
          (item) => item.product.id === action.productId,
        );

        if (!currentItem) return state;

        if (currentItem.quantity === 1) {
          return state.filter((item) => item !== currentItem);
        }

        return state.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }

      case "clear":
        return [];
    }
  }

  function addToCart(product: Product) {
    dispatch({ type: "add", product });
  }

  function removeFromCart(productId: number) {
    dispatch({ type: "remove", productId });
  }

  function increaseQuantity(productId: number) {
    dispatch({ type: "increase", productId });
  }

  function decreaseQuantity(productId: number) {
    dispatch({ type: "decrease", productId });
  }

  function clearCart() {
    dispatch({ type: "clear" });
  }

  const totalPrice = cartItems.reduce((acc, el) => {
    return acc + el.product.price * el.quantity;
  }, 0);

  const totalCount = cartItems.reduce((acc, el) => acc + el.quantity, 0);

  return {
    cartItems,
    totalPrice,
    totalCount,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
}
