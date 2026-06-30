import { useEffect, useReducer, useState } from "react";
import type { CartItem } from "./types";
import type { Product } from "@/entities/product/model/types";

const CART_STORAGE_KEY = "react-shop-lab:cart";
const EMPTY_CART_ITEMS: CartItem[] = [];

type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "remove"; productId: number }
  | { type: "increase"; productId: number }
  | { type: "decrease"; productId: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

function readCartItems() {
  if (typeof window == "undefined") return EMPTY_CART_ITEMS;

  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (storedCart === null) return EMPTY_CART_ITEMS;

  try {
    const parsedCart: unknown = JSON.parse(storedCart);

    return Array.isArray(parsedCart)
      ? (parsedCart as CartItem[])
      : EMPTY_CART_ITEMS;
  } catch {
    return EMPTY_CART_ITEMS;
  }
}

export function useCart(initialItems: CartItem[] = []) {
  const [cartItems, dispatch] = useReducer(reducer, initialItems);
  const [isCartRestored, setIsCartRestored] = useState(false);

  useEffect(() => {
    dispatch({
      type: "hydrate",
      items: readCartItems(),
    });

    // Restore client-only persisted state after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCartRestored(true);

    function handleStorageChange(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY) {
        return;
      }

      dispatch({
        type: "hydrate",
        items: readCartItems(),
      });
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!isCartRestored) {
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isCartRestored]);

  function reducer(state: CartItem[], action: CartAction) {
    switch (action.type) {
      case "add": {
        const alreadyExist = state.some(
          (item) => item.product.id === action.product.id,
        );

        if (!alreadyExist) {
          return [
            ...state,
            { product: action.product, quantity: action.quantity },
          ];
        }

        return state.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + action.quantity }
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

      case "hydrate":
        return action.items;
    }
  }

  function addToCart(product: Product, quantity: number) {
    dispatch({ type: "add", product, quantity });
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
