import { formatPrice } from "@/shared/lib/formatPrice";

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
    <aside data-cart-summary className="sticky top-6 flex flex-col gap-[18px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 max-[900px]:static">
      <h2 className="m-0 mb-1 text-lg">Итого в корзине</h2>

      <div className="flex items-center justify-between gap-5 text-sm text-[var(--muted)]">
        <span>Позиций</span>
        <strong>{productCount}</strong>
      </div>

      <div className="flex items-center justify-between gap-5 text-sm text-[var(--muted)]">
        <span>Товаров</span>
        <strong className="font-medium text-[var(--foreground)]">
          {totalCount}
        </strong>
      </div>

      <div className="mt-1 flex items-center justify-between gap-5 border-t border-[var(--border)] pt-[18px] text-sm text-[var(--foreground)]">
        <span>Итоговая сумма</span>
        <strong className="text-2xl font-bold">
          {formatPrice(totalPrice)}
        </strong>
      </div>

      <button
        data-cart-clear
        className="w-full cursor-pointer rounded-md border border-[var(--border)] bg-transparent px-4 py-3 text-[var(--foreground)] hover:border-zinc-600"
        type="button"
        onClick={onClear}
      >
        Очистить корзину
      </button>
    </aside>
  );
}
