"use client";

import Link from "next/link";
import { useFavorites } from "@/features/favorites/model/useFavorites";
import { useProducts } from "@/features/products-catalog/model/useProducts";
import { CatalogProductList } from "@/features/products-catalog/ui/CatalogProductList";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { ProductsLoadError } from "@/features/products-catalog/ui/ProductsLoadError";

export default function FavoritesPage() {
  const { products, isLoading, error, retry } = useProducts();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <div data-page-shell="favorites">
      <SiteHeader />
      <main className="page" data-page="favorites">
        <header
          data-page-heading
          className="mb-7 border-b border-[var(--border)] pb-5"
        >
          <h1 className="m-0 text-3xl">Избранное</h1>
          <p className="m-0 mt-2 text-sm text-[var(--muted)]">
            Сохранённые товары: {favoriteProducts.length}
          </p>
        </header>

        {isLoading && (
          <p data-page-status className="text-[var(--muted)]">
            Загрузка товаров…
          </p>
        )}
        {error && (
          <ProductsLoadError message={error} onRetry={() => void retry()} />
        )}

        {!isLoading && !error && favoriteProducts.length === 0 && (
          <div
            data-empty-state
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <p className="m-0 text-[var(--muted)]">
              В избранном пока ничего нет.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-cyan-300 underline-offset-4 hover:underline"
            >
              Вернуться в каталог
            </Link>
          </div>
        )}

        {favoriteProducts.length > 0 && (
          <CatalogProductList
            products={favoriteProducts}
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  );
}
