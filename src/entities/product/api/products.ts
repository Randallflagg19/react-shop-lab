import type { Product } from "../model/types";

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch("/api/products", { signal });

  if (!response.ok) {
    throw new Error(`Products request failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Products response is not an array");
  }

  return data as Product[];
}
