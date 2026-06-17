"use client";

import { ProductCardList } from "@/entities/product/ui/ProductCardList";
import { useProducts } from "../model/useProducts";
import { useState } from "react";

export function ProductsCatalog() {
  const { products, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");

  const visibleProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const filteredProducts = visibleProducts.filter(
    (product) =>
      currentCategory === "all" || currentCategory === product.category.slug,
  );

  const categories = products.reduce<string[]>((currentArray, currentEl) => {
    return currentArray.includes(currentEl.category.slug)
      ? currentArray
      : [...currentArray, currentEl.category.slug];
  }, []);

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
          <p className="product-catalog__count">
            {search.trim().length > 0 && visibleProducts.length + " of "}
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
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && products.length === 0 && <p>{"Товары не найдены"}</p>}
      {!isLoading && products.length > 0 && visibleProducts.length === 0 && (
        <p>{"По вашему запросу ничего не найдено"}</p>
      )}

      {filteredProducts.length > 0 && (
        <ProductCardList products={filteredProducts} />
      )}
    </>
  );
}
