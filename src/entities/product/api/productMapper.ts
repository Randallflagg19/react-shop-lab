import type { Product } from "../model/types";
import type { ProductRow } from "./types";

export function mapProductRowToProduct(row: ProductRow): Product {
  if (!row.category) {
    throw new Error(`Product "${row.slug}" has no category`);
  }

  return {
    id: Number(row.id),
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    category: {
      id: Number(row.category.id),
      name: row.category.name,
      slug: row.category.slug,
      image: "",
    },
    images: [row.image_url],
    creationAt: row.created_at,
    updatedAt: row.created_at,
  };
}
