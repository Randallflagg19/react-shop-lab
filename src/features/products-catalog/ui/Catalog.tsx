"use client";

import { CatalogProductList } from "@/features/products-catalog/ui/CatalogProductList";
import { useProducts } from "../model/useProducts";
import { useMemo, useState, useTransition } from "react";
import { CatalogSearchSlot } from "./CatalogSearchSlot";
import { CatalogMeta } from "./CatalogMeta";
import type { SortBy } from "../model/types";
import { useDebounce } from "../model/useDebounce";
import { useFavorites } from "@/features/favorites/model/useFavorites";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { ProductsLoadError } from "./ProductsLoadError";

export function Catalog() {
  const { products, isLoading, error, retry } = useProducts();
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const debouncedSearch = useDebounce(search);
  const [isPending, startTransition] = useTransition();

  const { favoriteIds, toggleFavorite } = useFavorites();

  const visibleProducts = useMemo(() => {
    const searchFilteredProducts = products.filter((product) =>
      product.title
        .toLowerCase()
        .includes(debouncedSearch.trim().toLowerCase()),
    );

    const categoryFilteredProducts = searchFilteredProducts.filter(
      (product) =>
        currentCategory === "all" || currentCategory === product.category.slug,
    );

    switch (sortBy) {
      case "price-asc":
        return categoryFilteredProducts.toSorted((a, b) => a.price - b.price);

      case "price-desc":
        return categoryFilteredProducts.toSorted((a, b) => b.price - a.price);

      case "title-asc":
        return categoryFilteredProducts.toSorted((a, b) =>
          a.title.localeCompare(b.title),
        );

      default:
        return categoryFilteredProducts;
    }
  }, [products, debouncedSearch, currentCategory, sortBy]);

  function handleCategoryChange(category: string) {
    startTransition(() => {
      setCurrentCategory(category);
    });
  }

  const categories = useMemo(() => {
    return products.reduce<string[]>((currentArray, currentEl) => {
      return currentArray.includes(currentEl.category.slug)
        ? currentArray
        : [...currentArray, currentEl.category.slug];
    }, []);
  }, [products]);

  return (
    <>
      <SiteHeader
        searchSlot={
          <CatalogSearchSlot search={search} onSearchChange={setSearch} />
        }
      />
      <main className="page" data-page="catalog">
        {!isLoading && !error && (
          <CatalogMeta
            totalCount={products.length}
            visibleCount={visibleProducts.length}
            isFiltered={search.trim().length > 0 || currentCategory !== "all"}
            categories={categories}
            currentCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isPending={isPending}
          />
        )}
        {isLoading && <div data-page-status>Загрузка товаров…</div>}
        {error && (
          <ProductsLoadError message={error} onRetry={() => void retry()} />
        )}
        {!isLoading && !error && products.length === 0 && (
          <p data-page-status>Товары не найдены</p>
        )}
        {!isLoading &&
          !error &&
          products.length > 0 &&
          visibleProducts.length === 0 && (
            <p data-page-status>{"По выбранным фильтрам ничего не найдено"}</p>
          )}

        {visibleProducts.length > 0 && (
          <CatalogProductList
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
            products={visibleProducts}
          />
        )}
      </main>
    </>
  );
}
