"use client";

import { ProductCardList } from "@/entities/product/ui/ProductCardList";
import { useProducts } from "../model/useProducts";
import { useState } from "react";

export function ProductsCatalog() {
  const { products, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

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
            {search.trim().length > 0 && filteredProducts.length + " of "}
            {products.length} products
          </p>
          <p className="product-catalog__hint">Search by product title</p>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && products.length === 0 && <p>{"Товары не найдены"}</p>}
      {!isLoading && products.length > 0 && filteredProducts.length === 0 && (
        <p>{"По вашему запросу ничего не найдено"}</p>
      )}
      {filteredProducts.length > 0 && (
        <ProductCardList products={filteredProducts} />
      )}
    </>
  );
}
