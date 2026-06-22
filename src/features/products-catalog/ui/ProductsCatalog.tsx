"use client";

import { ProductCardList } from "@/entities/product/ui/ProductCardList";
import { useProducts } from "../model/useProducts";
import { useMemo, useState } from "react";

type SortBy = "default" | "price-asc" | "price-desc" | "title-asc";

export function ProductsCatalog() {
  const { products, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const visibleProducts = useMemo(() => {
    const searchFilteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(search.trim().toLowerCase()),
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
  }, [products, search, currentCategory, sortBy]);

  const categories = useMemo(() => {
    return products.reduce<string[]>((currentArray, currentEl) => {
      return currentArray.includes(currentEl.category.slug)
        ? currentArray
        : [...currentArray, currentEl.category.slug];
    }, []);
  }, [products]);

  return (
    <>
      {!error && (
        <div className="product-catalog__header">
          <div className="product-catalog__intro">
            <h1>React Shop Lab</h1>
            <p>Practice catalog built with React hooks and Next.js</p>
          </div>
          <input
            placeholder="Search products"
            className="product-catalog__header-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
      )}
      {!isLoading && !error && (
        <div className="product-catalog__meta">
          <div className="product-catalog__filters">
            <p className="product-catalog__count">
              {(search.trim().length > 0 || currentCategory !== "all") &&
                visibleProducts.length + " of "}
              {products.length} products
            </p>
            <div className="product-catalog__categories">
              <button
                onClick={() => setCurrentCategory("all")}
                className={`product-catalog__category ${
                  currentCategory === "all"
                    ? "product-catalog__category--active"
                    : ""
                }`}
                type="button"
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  onClick={() => setCurrentCategory(category)}
                  className={`product-catalog__category ${
                    currentCategory === category
                      ? "product-catalog__category--active"
                      : ""
                  }`}
                  type="button"
                  key={category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="product-catalog__sort">
            <label htmlFor="product-sort">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.currentTarget.value as SortBy);
              }}
              id="product-sort"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price ascending</option>
              <option value="price-desc">Price descending</option>
              <option value="title-asc">Title A–Z</option>
            </select>
          </div>
        </div>
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
        <ProductCardList products={visibleProducts} />
      )}
    </>
  );
}
