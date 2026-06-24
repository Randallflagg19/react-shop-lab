import type { Product } from "../model/types";

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  const res = await fetch(
    `https://api.escuelajs.co/api/v1/products/slug/${encodeURIComponent(slug)}`,
  );

  if (res.status === 400 || res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};
