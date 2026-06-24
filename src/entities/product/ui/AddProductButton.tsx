"use client";

import { useCartContext } from "@/features/cart/model/CartContext";
import { Product } from "../model/types";

export function AddProductButton({ product }: { product: Product }) {
  const { addToCart } = useCartContext();

  return (
    <button
      type="button"
      className="product-details__add-button"
      onClick={() => addToCart(product)}
    >
      Add to cart
    </button>
  );
}
