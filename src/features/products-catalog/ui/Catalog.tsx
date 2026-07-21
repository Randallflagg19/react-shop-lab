"use client";

import { CatalogProductList } from "@/features/products-catalog/ui/CatalogProductList";
import { useProducts } from "../model/useProducts";
import { useMemo } from "react";
import { CatalogSearchSlot } from "./CatalogSearchSlot";
import { CatalogMeta } from "./CatalogMeta";
import type { SortBy } from "../model/types";
import { useDebounce } from "../model/useDebounce";
import { useFavorites } from "@/features/favorites/model/useFavorites";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { ProductsLoadError } from "./ProductsLoadError";
import { usePathname, useSearchParams } from "next/navigation";
import {
  parseCatalogCategory,
  parseCatalogSearchParams,
  serializeCatalogSearchParams,
} from "../model/catalogSearchParams";

import type {
  CatalogCategory,
  CatalogFilters,
} from "../model/catalogSearchParams";

export function Catalog() {
  const { products, isLoading, error, retry } = useProducts();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlFilters = parseCatalogSearchParams(searchParams);

  const search = urlFilters.query;
  const currentCategory = urlFilters.category;
  const sortBy = urlFilters.sort;

  const debouncedSearch = useDebounce(search);

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

  function getCatalogHref(nextFilters: CatalogFilters) {
    const nextSearchParams = serializeCatalogSearchParams(nextFilters);
    const queryString = nextSearchParams.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  function handleCategoryChange(category: CatalogCategory) {
    const nextFilters = {
      ...urlFilters,
      category,
    };

    window.history.pushState(null, "", getCatalogHref(nextFilters));
  }

  function handleSortChange(sort: SortBy) {
    const nextFilters = {
      ...urlFilters,
      sort,
    };

    window.history.pushState(null, "", getCatalogHref(nextFilters));
  }

  function handleSearchChange(query: string) {
    const nextFilters = {
      ...urlFilters,
      query,
    };

    window.history.replaceState(null, "", getCatalogHref(nextFilters));
  }

  const categories = useMemo(() => {
    return products.reduce<CatalogCategory[]>((currentArray, product) => {
      const category = parseCatalogCategory(product.category.slug);

      if (category === "all" || currentArray.includes(category)) {
        return currentArray;
      }

      return [...currentArray, category];
    }, []);
  }, [products]);

  return (
    <>
      <SiteHeader
        searchSlot={
          <CatalogSearchSlot
            search={search}
            onSearchChange={handleSearchChange}
          />
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
            onSortChange={handleSortChange}
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
