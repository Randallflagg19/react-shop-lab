import { formatPrice } from "@/shared/lib/formatPrice";
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
    <article
      data-cart-row
      className="grid grid-cols-[minmax(180px,1fr)_90px_128px_90px_80px] items-center gap-6 border-b border-[var(--border)] py-[18px] max-[1100px]:grid-cols-[minmax(0,1fr)_auto] max-[1100px]:gap-x-4 max-[1100px]:gap-y-3"
    >
      <div className="min-w-0 max-[1100px]:col-start-1 max-[1100px]:row-start-1">
        <h2 className="m-0 text-base">{product.title}</h2>
        <p className="m-0 mt-1.5 text-[13px] text-[#67e8f9]">
          {product.category.name}
        </p>
      </div>

      <p className="m-0 max-[1100px]:col-start-1 max-[1100px]:row-start-2">
        {formatPrice(product.price)}
      </p>

      <div
        data-cart-quantity
        className="grid w-[128px] justify-self-start grid-cols-[40px_48px_40px] overflow-hidden rounded-md border border-[var(--border)] max-[1100px]:col-start-1 max-[1100px]:row-start-3"
      >
        <button
          className="cursor-pointer border-0 bg-transparent p-2.5 text-center text-[var(--foreground)]"
          type="button"
          onClick={() => onDecrease(product.id)}
        >
          -
        </button>

        <span className="border-0 bg-transparent p-2.5 text-center text-[var(--foreground)]">
          {quantity}
        </span>

        <button
          className="cursor-pointer border-0 bg-transparent p-2.5 text-center text-[var(--foreground)]"
          type="button"
          onClick={() => onIncrease(product.id)}
        >
          +
        </button>
      </div>

      <p className="m-0 justify-self-end max-[1100px]:col-start-2 max-[1100px]:row-start-1 max-[1100px]:font-bold">
        {formatPrice(product.price * quantity)}
      </p>

      <button
        data-cart-remove
        className="w-fit cursor-pointer justify-self-end rounded-md border border-[var(--border)] bg-transparent p-2.5 text-[var(--muted)] max-[1100px]:col-start-2 max-[1100px]:row-start-3"
        type="button"
        onClick={() => onRemove(product.id)}
      >
        Удалить
      </button>
    </article>
  );
}
