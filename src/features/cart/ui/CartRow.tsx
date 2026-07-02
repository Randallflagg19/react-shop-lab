import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getProductImageSrc } from "@/entities/product/model/getProductImageSrc";
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
  const productHref = `/products/${product.slug}`;

  return (
    <article
      data-cart-row
      className="grid grid-cols-[128px_minmax(0,1fr)_auto_auto] items-center gap-7 rounded-xl border border-[var(--border)] p-5 max-[1200px]:grid-cols-[112px_minmax(0,1fr)_auto] max-[1200px]:gap-5 max-[640px]:grid-cols-[88px_minmax(0,1fr)] max-[640px]:gap-4 max-[640px]:p-3"
    >
      <Link
        data-cart-product-image
        href={productHref}
        aria-label={`Открыть товар «${product.title}»`}
        className="relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-black/30"
      >
        <Image
          src={getProductImageSrc(product)}
          alt=""
          fill
          sizes="(max-width: 640px) 88px, (max-width: 1200px) 112px, 128px"
          className="object-cover transition-transform duration-300 hover:scale-[1.03]"
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </Link>

      <div data-cart-product-info className="min-w-0 self-stretch py-1">
        <Link
          href={productHref}
          className="text-inherit no-underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/70"
        >
          <h2 className="m-0 text-xl leading-snug max-[640px]:text-base">
            {product.title}
          </h2>
        </Link>
        <p className="m-0 mt-1.5 text-xs uppercase tracking-[0.12em]">
          {product.category.name}
        </p>
        <p data-cart-unit-price className="m-0 mt-6 text-lg max-[640px]:mt-3 max-[640px]:text-base">
          {formatPrice(product.price)}
        </p>
      </div>

      <div
        data-cart-quantity
        className="grid h-12 w-[144px] grid-cols-[44px_56px_44px] overflow-hidden rounded-lg border border-[var(--border)] max-[1200px]:col-start-2 max-[1200px]:row-start-2 max-[640px]:col-start-1 max-[640px]:row-start-2 max-[640px]:w-[132px] max-[640px]:grid-cols-[40px_52px_40px]"
      >
        <button
          className="cursor-pointer border-0 bg-transparent text-center text-[var(--foreground)]"
          type="button"
          aria-label={`Уменьшить количество товара «${product.title}»`}
          onClick={() => onDecrease(product.id)}
        >
          −
        </button>

        <span className="inline-flex items-center justify-center border-0 bg-transparent text-center text-[var(--foreground)]">
          {quantity}
        </span>

        <button
          className="cursor-pointer border-0 bg-transparent text-center text-[var(--foreground)]"
          type="button"
          aria-label={`Увеличить количество товара «${product.title}»`}
          onClick={() => onIncrease(product.id)}
        >
          +
        </button>
      </div>

      <div className="flex min-w-[132px] flex-col items-end gap-4 max-[1200px]:col-start-3 max-[1200px]:row-span-2 max-[1200px]:row-start-1 max-[640px]:col-start-2 max-[640px]:row-start-2 max-[640px]:min-w-0 max-[640px]:gap-2">
        <p data-cart-line-total className="m-0 text-xl font-bold max-[640px]:text-base">
          {formatPrice(product.price * quantity)}
        </p>

        <button
          data-cart-remove
          className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-1 text-sm text-[var(--muted)]"
          type="button"
          onClick={() => onRemove(product.id)}
        >
          <Trash2 size={16} strokeWidth={1.7} aria-hidden="true" />
          Удалить
        </button>
      </div>
    </article>
  );
}
