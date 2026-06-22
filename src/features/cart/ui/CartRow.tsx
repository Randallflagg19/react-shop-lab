import type { CartItem } from "../model/types";

type CartRowProps = {
  item: CartItem;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
};

export function CartRow({
  item: { product, quantity },
  onIncrease,
  onDecrease,
  onRemove,
}: CartRowProps) {
  return (
    <article className="cart-row">
      <div className="cart-row__product">
        <h2>{product.title}</h2>
        <p>{product.category.name}</p>
      </div>

      <p className="cart-row__price">${product.price}</p>

      <div className="cart-row__quantity">
        <button type="button" onClick={() => onDecrease(product.id)}>
          -
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={() => onIncrease(product.id)}>
          +
        </button>
      </div>

      <p className="cart-row__subtotal">${product.price * quantity}</p>

      <button
        className="cart-row__remove"
        type="button"
        onClick={() => onRemove(product.id)}
      >
        Remove
      </button>
    </article>
  );
}
