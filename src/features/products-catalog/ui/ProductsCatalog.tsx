"use client";

import { ProductCardList } from "@/entities/product/ui/ProductCardList";
import { useProducts } from "../model/useProducts";
import { useState } from "react";

export function ProductsCatalog() {
  const { products, isLoading, error } = useProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {!error && (
        <div className="product-catalog__header">
          <div className="product-catalog__header-left">
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
