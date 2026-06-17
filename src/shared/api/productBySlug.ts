import { Product } from "@/entities/product/model/types";

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  const res = await fetch(
    `https://api.escuelajs.co/api/v1/products/slug/${slug}`,
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};
