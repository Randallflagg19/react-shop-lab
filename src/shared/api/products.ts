import { Product } from "@/entities/product/model/types";

export const fetchProducts = async (
  signal?: AbortSignal,
): Promise<Product[]> => {
  const res = await fetch("https://api.escuelajs.co/api/v1/products", {
    signal,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
};
