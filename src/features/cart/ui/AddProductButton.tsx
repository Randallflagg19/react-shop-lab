"use client";

import { Product } from "@/entities/product/model/types";
import { useCartContext } from "@/features/cart/model/CartContext";

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
