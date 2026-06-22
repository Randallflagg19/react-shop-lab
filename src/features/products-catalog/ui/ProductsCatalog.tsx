"use client";

import { ProductCardList } from "@/entities/product/ui/ProductCardList";
import { useProducts } from "../model/useProducts";
import { useCallback, useMemo, useState } from "react";
import { CatalogHeader } from "./CatalogHeader";
import { CatalogMeta } from "./CatalogMeta";
import type { SortBy } from "../model/types";
import { useDebounce } from "../model/useDebounce";

export function ProductsCatalog() {
  const { products, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const debouncedSearch = useDebounce(search);

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

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => {
      return prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id];
    });
  }, []);

  const categories = useMemo(() => {
    return products.reduce<string[]>((currentArray, currentEl) => {
      return currentArray.includes(currentEl.category.slug)
        ? currentArray
        : [...currentArray, currentEl.category.slug];
    }, []);
  }, [products]);

  return (
    <>
      {!error && <CatalogHeader search={search} onSearchChange={setSearch} />}
      {!isLoading && !error && (
        <CatalogMeta
          totalCount={products.length}
          visibleCount={visibleProducts.length}
          isFiltered={search.trim().length > 0 || currentCategory !== "all"}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && !error && products.length === 0 && (
        <p>Товары не найдены</p>
      )}
      {!isLoading && products.length > 0 && visibleProducts.length === 0 && (
        <p>{"По выбранным фильтрам ничего не найдено"}</p>
      )}

      {visibleProducts.length > 0 && (
        <ProductCardList
          favoriteIds={favoriteIds}
          toggleFavorite={toggleFavorite}
          products={visibleProducts}
        />
      )}
    </>
  );
}
