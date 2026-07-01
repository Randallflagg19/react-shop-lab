"use client";

import type { Product } from "@/entities/product/model/types";
import { useCartContext } from "@/features/cart/model/CartContext";
import { useState } from "react";

export function AddToCartControls({ product }: { product: Product }) {
  const { addToCart } = useCartContext();

  const [quantity, setQuantity] = useState(1);

  function increaseQuantity() {
    setQuantity((currentQuantity) => currentQuantity + 1);
  }

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-fit  self-center overflow-hidden rounded-lg border border-[var(--border)] max-[1000px]:w-full">
        <button
          disabled={quantity === 1}
          onClick={decreaseQuantity}
          className="transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:bg-transparent 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 min-w-11 cursor-pointer border-0 bg-transparent p-3 text-center text-[var(--foreground)] max-[1000px]:min-w-0 max-[1000px]:flex-1 max-[760px]:p-[13px]"
          type="button"
        >
          -
        </button>
        <span className=" min-w-11 border-0 bg-transparent p-3 text-center text-[var(--foreground)] max-[1000px]:min-w-0 max-[1000px]:flex-1 max-[760px]:p-[13px]">
          {quantity}
        </span>
        <button
          onClick={increaseQuantity}
          className="transition-colors hover:bg-white/[0.06]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 min-w-11 cursor-pointer border-0 bg-transparent p-3 text-center text-[var(--foreground)] max-[1000px]:min-w-0 max-[1000px]:flex-1 max-[760px]:p-[13px]"
          type="button"
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="font-medium transition-colors hover:bg-[#348a58]
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65c98d] block w-full cursor-pointer rounded-md border-0 bg-[#3fa267] px-[18px] py-3.5 text-center text-white max-[760px]:min-h-12 max-[760px]:px-4"
        onClick={() => addToCart(product, quantity)}
      >
        Добавить в корзину
      </button>
    </div>
  );
}
