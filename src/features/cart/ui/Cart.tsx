"use client";

import { CartRow } from "./CartRow";
import { CartSummary } from "./CartSummary";
import { useCartContext } from "../model/CartContext";

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

  return (
    <section data-cart>
      <header
        data-page-heading
        className="mb-6 border-b border-[var(--border)] pb-5"
      >
        <h1 className="m-0">Корзина</h1>
        <p className="m-0 mt-2 text-sm text-[var(--muted)]">
          {cart.cartItems.length}{" "}
          {pluralize(cart.cartItems.length, ["позиция", "позиции", "позиций"])} ·{" "}
          {cart.totalCount}{" "}
          {pluralize(cart.totalCount, ["товар", "товара", "товаров"])}
        </p>
      </header>
      <div
        data-cart-layout
        className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-8 max-[900px]:grid-cols-1"
      >
        {cart.cartItems.length === 0 && (
          <p
            data-empty-state
            className="m-0 mt-2 text-sm text-[var(--muted)]"
          >
            Корзина пуста
          </p>
        )}
        {cart.cartItems.length > 0 && (
          <div data-cart-list className="flex min-w-0 flex-col">
            {cart.cartItems.map((cartItem) => (
              <CartRow
                key={cartItem.product.id}
                item={cartItem}
                onIncrease={() => cart.increaseQuantity(cartItem.product.id)}
                onDecrease={() => cart.decreaseQuantity(cartItem.product.id)}
                onRemove={() => cart.removeFromCart(cartItem.product.id)}
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
