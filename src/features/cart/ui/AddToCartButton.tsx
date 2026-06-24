"use client";

import { Product } from "@/entities/product/model/types";
import { useCartContext } from "@/features/cart/model/CartContext";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCartContext();

  return (
    <button
      type="button"
      className="block w-full cursor-pointer rounded-md border-0 bg-[#3fa267] px-[18px] py-3.5 text-center text-white max-[760px]:min-h-12 max-[760px]:px-4"
      onClick={() => addToCart(product)}
    >
      Add to cart
    </button>
  );
}
