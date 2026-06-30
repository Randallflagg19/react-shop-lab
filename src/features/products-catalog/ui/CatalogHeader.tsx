import { useEffect, useRef } from "react";
import { CatalogSearch, CatalogSearchHandle } from "./CatalogSearch";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "@/features/cart/model/CartContext";
import Link from "next/link";

export function CatalogHeader({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const searchRef = useRef<CatalogSearchHandle | null>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const { totalCount } = useCartContext();

  return (
    <div className="mb-7 flex items-center justify-between gap-8 border-b border-[var(--border)] pb-6 max-[760px]:mb-5 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-5 max-[760px]:pb-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="m-0 text-[42px] font-bold uppercase leading-none text-[var(--foreground)] [font-family:var(--font-display)] max-[760px]:text-[34px]">
          AI Slop Shop
        </h1>

        <p className="m-0 max-w-[480px] text-[12px] font-medium uppercase leading-[1.4] text-[var(--muted)] [font-family:var(--font-display)]">
          Невозможные товары для сомнительной реальности
        </p>
      </div>
      <div className="grid grid-cols-[minmax(220px,380px)_auto] items-end gap-3 max-[760px]:w-full max-[760px]:grid-cols-[minmax(0,1fr)_auto]">
        <CatalogSearch
          ref={searchRef}
          search={search}
          onSearchChange={onSearchChange}
        />

        <Link
          href="/cart"
          aria-label={`Cart, ${totalCount} items`}
          className="flex h-[46px] shrink-0 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium text-[var(--foreground)] no-underline transition-colors hover:border-cyan-300 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        >
          <ShoppingCart size={18} strokeWidth={2} aria-hidden="true" />
          <span>Корзина</span>

          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lime-300 px-1 text-xs font-bold text-black">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        </Link>
      </div>
    </div>
  );
}
