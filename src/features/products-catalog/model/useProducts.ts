import { fetchProducts } from "@/entities/product/api/products";
import { useEffect, useReducer } from "react";
import {
  initialProductsRequestState,
  productsRequestReducer,
} from "./productsRequestReducer";

export function useProducts() {
  const [state, dispatch] = useReducer(
    productsRequestReducer,
    initialProductsRequestState,
  );

  const { products, status, error } = state;

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      dispatch({ type: "load" });

      try {
        const result = await fetchProducts(controller.signal);
        dispatch({ type: "success", products: result });
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(caughtError);

        dispatch({
          type: "error",
          error: "Ошибка при получении списка товаров",
        });
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    products,
    isLoading: status === "idle" || status === "loading",
    error,
  };
}
