"use client";

import { CartRow } from "./CartRow";
import { CartSummary } from "./CartSummary";
import { useCartContext } from "../model/CartContext";

export function Cart() {
  const cart = useCartContext();

  return (
    <section className="cart">
      <header className="cart__header">
        <h1>Cart</h1>
        <p>
          {cart.cartItems.length} products · {cart.totalCount} items
        </p>
      </header>
      <div className="cart__content">
        {cart.cartItems.length === 0 && (
          <p className="cart__empty">Your cart is empty</p>
        )}
        {cart.cartItems.length > 0 && (
          <div className="cart__list">
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
