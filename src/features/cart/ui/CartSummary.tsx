import { LockKeyhole } from "lucide-react";
import { useState } from "react";
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
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  function handleConfirmClear() {
    onClear();
    setIsConfirmingClear(false);
  }

  return (
    <aside
      data-cart-summary
      className="sticky top-6 flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 max-[1100px]:p-6 max-[900px]:static"
    >
      <h2 className="m-0 mb-2 text-2xl">Итого в корзине</h2>

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

      <div className="mt-1 flex items-end justify-between gap-5 border-t border-[var(--border)] pt-6 text-sm text-[var(--foreground)]">
        <span>Итоговая сумма</span>
        <strong className="text-3xl font-bold max-[1100px]:text-2xl">
          {formatPrice(totalPrice)}
        </strong>
      </div>

      <button
        data-cart-checkout
        aria-describedby="cart-checkout-note"
        disabled
        className="mt-2 min-h-14 w-full rounded-lg border px-4 py-3 text-sm uppercase tracking-[0.09em]"
        type="button"
      >
        Перейти к оформлению
      </button>

      <div data-cart-clear-area>
        {isConfirmingClear ? (
          <div data-cart-clear-confirm role="group" aria-label="Очистить корзину">
            <p>Очистить корзину?</p>
            <div data-cart-clear-actions>
              <button
                data-cart-clear-confirm-button
                type="button"
                onClick={handleConfirmClear}
              >
                Да, очистить
              </button>
              <button
                data-cart-clear-cancel
                type="button"
                onClick={() => setIsConfirmingClear(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button
            data-cart-clear
            className="w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-[var(--foreground)]"
            type="button"
            onClick={() => setIsConfirmingClear(true)}
          >
            Очистить корзину
          </button>
        )}
      </div>

      <p
        id="cart-checkout-note"
        data-cart-storage-note
        className="m-0 flex items-center gap-2 border-t border-[var(--border)] pt-5 text-xs leading-relaxed text-[var(--muted)]"
      >
        <LockKeyhole size={15} strokeWidth={1.7} aria-hidden="true" />
        Корзина сохраняется на этом устройстве. Оформление пока недоступно.
      </p>
    </aside>
  );
}
