"use client";

import { ProductCardList } from "@/entities/product/ui/ProductCardList";
import { useProducts } from "../model/useProducts";

export function ProductsCatalog() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (products.length === 0) {
    return <p>{"Товары не найдены"}</p>;
  }
  return <ProductCardList products={products} />;
}
