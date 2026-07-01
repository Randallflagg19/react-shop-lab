"use client";

import { CartRow } from "./CartRow";
import { CartSummary } from "./CartSummary";
import { useCartContext } from "../model/CartContext";

export function Cart() {
  const cart = useCartContext();

  return (
    <section>
      <header className="mb-6 border-b border-[var(--border)] pb-5">
        <h1 className="m-0">Cart</h1>
        <p className="m-0 mt-2 text-sm text-[var(--muted)]">
          {cart.cartItems.length} products · {cart.totalCount} items
        </p>
      </header>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-8 max-[900px]:grid-cols-1">
        {cart.cartItems.length === 0 && (
          <p className="m-0 mt-2 text-sm text-[var(--muted)]">
            Your cart is empty
          </p>
        )}
        {cart.cartItems.length > 0 && (
          <div className="flex min-w-0 flex-col">
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
