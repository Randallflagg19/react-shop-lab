export function CartSummary({
  productCount,
  totalCount,
  totalPrice,
  onClear,
}: {
  productCount: number;
  totalCount: number;
  totalPrice: number;
  onClear: () => void;
}) {
  return (
    <aside className="cart-summary">
      <h2>Cart summary</h2>

      <div className="cart-summary__row">
        <span>Products</span>
        <strong>{productCount}</strong>
      </div>

      <div className="cart-summary__row">
        <span>Items</span>
        <strong>{totalCount}</strong>
      </div>

      <div className="cart-summary__row cart-summary__total">
        <span>Total</span>
        <strong>${totalPrice}</strong>
      </div>

      <button className="cart-summary__clear" type="button" onClick={onClear}>
        Clear cart
      </button>
    </aside>
  );
}
