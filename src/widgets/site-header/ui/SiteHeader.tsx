"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartContext } from "@/features/cart/model/CartContext";
import { useFavorites } from "@/features/favorites/model/useFavorites";

export function SiteHeader({ searchSlot }: { searchSlot?: React.ReactNode }) {
  const pathname = usePathname();
  const { totalCount } = useCartContext();
  const { favoriteIds } = useFavorites();

  const navigationLinkClass =
    "flex h-[46px] shrink-0 items-center gap-2 rounded-md border bg-[var(--card)] px-4 text-sm font-medium text-[var(--foreground)] no-underline transition-colors hover:border-cyan-300 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 max-[640px]:px-3";

  return (
    <header data-site-header>
      <div className="site-header-inner flex items-center justify-between gap-8 border-b border-[var(--border)] py-6 max-[760px]:gap-4 max-[640px]:flex-col max-[640px]:items-stretch">
        <Link
          data-site-brand
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex flex-col gap-1.5 text-inherit no-underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        >
          <span className="text-[42px] font-bold uppercase leading-none [font-family:var(--font-display)] max-[760px]:text-[34px]">
            AI Slop Shop
          </span>
          <span className="text-[12px] font-medium uppercase leading-[1.4] text-[var(--muted)] [font-family:var(--font-display)]">
            Невозможные товары для сомнительной реальности
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 max-[1200px]:flex-wrap max-[640px]:grid max-[640px]:grid-cols-2">
          {searchSlot && (
            <div
              data-site-search
              className="flex w-[min(380px,100%)] justify-end max-[1200px]:order-2 max-[1200px]:w-full max-[640px]:col-span-2"
            >
              {searchSlot}
            </div>
          )}

          <nav
            data-site-navigation
            aria-label="Основная навигация"
            className="flex items-center gap-3 max-[640px]:col-span-2 max-[640px]:grid max-[640px]:grid-cols-2"
          >
          <Link
            href="/favorites"
            aria-current={pathname === "/favorites" ? "page" : undefined}
            className={`${navigationLinkClass} ${
              pathname === "/favorites"
                ? "border-cyan-300 bg-white/[0.06]"
                : "border-[var(--border)]"
            }`}
          >
            <Heart size={18} strokeWidth={2} aria-hidden="true" />
            <span className="max-[420px]:sr-only">Избранное</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cyan-300 px-1 text-xs font-bold text-black">
              {favoriteIds.length > 99 ? "99+" : favoriteIds.length}
            </span>
          </Link>

          <Link
            href="/cart"
            aria-current={pathname === "/cart" ? "page" : undefined}
            className={`${navigationLinkClass} ${
              pathname === "/cart"
                ? "border-cyan-300 bg-white/[0.06]"
                : "border-[var(--border)]"
            }`}
          >
            <ShoppingCart size={18} strokeWidth={2} aria-hidden="true" />
            <span className="max-[420px]:sr-only">Корзина</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lime-300 px-1 text-xs font-bold text-black">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
