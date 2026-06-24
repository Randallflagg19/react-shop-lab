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
    <aside className="sticky top-6 flex flex-col gap-[18px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 max-[900px]:static">
      <h2 className="m-0 mb-1 text-lg">Cart summary</h2>

      <div className="flex items-center justify-between gap-5 text-sm text-[var(--muted)]">
        <span>Products</span>
        <strong>{productCount}</strong>
      </div>

      <div className="flex items-center justify-between gap-5 text-sm text-[var(--muted)]">
        <span>Items</span>
        <strong className="font-medium text-[var(--foreground)]">
          {totalCount}
        </strong>
      </div>

      <div className="mt-1 flex items-center justify-between gap-5 border-t border-[var(--border)] pt-[18px] text-sm text-[var(--foreground)]">
        <span>Total</span>
        <strong className="text-2xl font-bold">${totalPrice}</strong>
      </div>

      <button
        className="w-full cursor-pointer rounded-md border border-[var(--border)] bg-transparent px-4 py-3 text-[var(--foreground)] hover:border-zinc-600"
        type="button"
        onClick={onClear}
      >
        Clear cart
      </button>
    </aside>
  );
}
