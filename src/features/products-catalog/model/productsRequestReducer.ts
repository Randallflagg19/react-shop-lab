import type { Product } from "@/entities/product/model/types";

export const initialProductsRequestState: ProductsRequestState = {
  status: "idle",
  products: [],
  error: null,
};

type ProductsRequestState =
  | { status: "idle"; products: Product[]; error: null }
  | { status: "loading"; products: Product[]; error: null }
  | { status: "success"; products: Product[]; error: null }
  | { status: "error"; products: Product[]; error: string };

type ProductsRequestAction =
  | { type: "load" }
  | { type: "success"; products: Product[] }
  | { type: "error"; error: string };

export function productsRequestReducer(
  state: ProductsRequestState,
  action: ProductsRequestAction,
): ProductsRequestState {
  switch (action.type) {
    case "load":
      return {
        status: "loading",
        products: state.products,
        error: null,
      };
    case "success":
      return {
        status: "success",
        products: action.products,
        error: null,
      };
    case "error":
      return {
        status: "error",
        products: state.products,
        error: action.error,
      };
  }
}
