"use client";

import type { CartItem } from "../model/types";
import { CartRow } from "./CartRow";
import { CartSummary } from "./CartSummary";
import { useCart } from "../model/useCart";

type CartProps = {
  initialItems?: CartItem[];
};

export function Cart({ initialItems = [] }: CartProps) {
  const {
    addToCart,
    cartItems,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    totalCount,
    totalPrice,
  } = useCart(initialItems);

  return (
    <section className="cart">
      <header className="cart__header">
        <h1>Cart</h1>
        <p>
          {cartItems.length} products · {totalCount} items
        </p>
      </header>
      {/* test button */}
      {initialItems[0] && (
        <button
          type="button"
          onClick={() => addToCart(initialItems[0].product)}
        >
          Add test product
        </button>
      )}
      <div className="cart__content">
        {cartItems.length === 0 && (
          <p className="cart__empty">Your cart is empty</p>
        )}
        {cartItems.length > 0 && (
          <div className="cart__list">
            {cartItems.map((cartItem) => (
              <CartRow
                key={cartItem.product.id}
                item={cartItem}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <CartSummary
            productCount={cartItems.length}
            totalCount={totalCount}
            totalPrice={totalPrice}
            onClear={clearCart}
          />
        )}
      </div>
    </section>
  );
}
