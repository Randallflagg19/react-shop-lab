import { fetchProducts } from "@/entities/product/api/products";
import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  initialProductsRequestState,
  productsRequestReducer,
} from "./productsRequestReducer";

export function useProducts() {
  const [productsState, dispatch] = useReducer(
    productsRequestReducer,
    initialProductsRequestState,
  );

  const { products, status, error } = productsState;

  const controllerRef = useRef<AbortController | null>(null);

  const loadProducts = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    dispatch({ type: "load" });

    try {
      const result = await fetchProducts(controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      dispatch({ type: "success", products: result });
    } catch {
      if (controller.signal.aborted) {
        return;
      }

      dispatch({
        type: "error",
        error: "Ошибка при получении списка товаров",
      });
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    loadProducts();

    return () => {
      controllerRef.current?.abort();
    };
  }, [loadProducts]);

  return {
    products,
    isLoading: status === "idle" || status === "loading",
    error,
    retry: loadProducts,
  };
}
