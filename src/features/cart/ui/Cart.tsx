"use client";

import Link from "next/link";
import { CartRow } from "./CartRow";
import { CartSummary } from "./CartSummary";
import { useCartContext } from "../model/CartContext";
import type { CartItem } from "../model/types";
import { useToast } from "@/shared/ui/toast";

function pluralize(
  count: number,
  forms: [singular: string, paucal: string, plural: string],
) {
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return forms[2];

  switch (count % 10) {
    case 1:
      return forms[0];
    case 2:
    case 3:
    case 4:
      return forms[1];
    default:
      return forms[2];
  }
}

export function Cart() {
  const cart = useCartContext();
  const { showToast } = useToast();

  function handleRemoveCartItem(cartItem: CartItem, index: number) {
    cart.removeFromCart(cartItem.product.id);

    showToast({
      title: "Удалено из корзины",
      description: cartItem.product.title,
      variant: "success",
      icon: "cart",
      action: {
        label: "Вернуть",
        onClick: () => cart.restoreCartItem(cartItem, index),
      },
    });
  }

  return (
    <section data-cart>
      <header
        data-page-heading
        className="mb-7 border-b border-[var(--border)] pb-5"
      >
        <h1 className="m-0">Корзина</h1>
        <p className="m-0 mt-2 text-sm text-[var(--muted)]">
          {cart.cartItems.length}{" "}
          {pluralize(cart.cartItems.length, ["позиция", "позиции", "позиций"])}{" "}
          · {cart.totalCount}{" "}
          {pluralize(cart.totalCount, ["товар", "товара", "товаров"])}
        </p>
      </header>
      <div
        data-cart-layout
        className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-8 max-[1100px]:grid-cols-[minmax(0,1fr)_340px] max-[900px]:grid-cols-1"
      >
        {cart.cartItems.length === 0 && (
          <div data-empty-state>
            <h2>Ваша корзина пуста</h2>
            <p>Самое время найти что-то невероятное.</p>
            <Link href="/">Перейти к покупкам</Link>
          </div>
        )}
        {cart.cartItems.length > 0 && (
          <div data-cart-list className="flex min-w-0 flex-col gap-4">
            {cart.cartItems.map((cartItem, index) => (
              <CartRow
                key={cartItem.product.id}
                item={cartItem}
                onIncrease={() => cart.increaseQuantity(cartItem.product.id)}
                onDecrease={() => cart.decreaseQuantity(cartItem.product.id)}
                onRemove={() => handleRemoveCartItem(cartItem, index)}
              />
            ))}
          </div>
        )}
        {cart.cartItems.length > 0 && (
          <CartSummary
            productCount={cart.cartItems.length}
            totalCount={cart.totalCount}
            totalPrice={cart.totalPrice}
            onClear={cart.clearCart}
          />
        )}
      </div>
    </section>
  );
}
