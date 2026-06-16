import { Product } from "@/entities/product/model/types";
import { fetchProducts } from "@/shared/api/products";
import { useEffect, useState } from "react";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchProducts(controller.signal);
        setProducts(result);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setError("Ошибка при получении списка товаров");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    products,
    isLoading,
    error,
  };
}
