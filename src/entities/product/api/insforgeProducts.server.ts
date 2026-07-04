import "server-only";

import { insforgeServer } from "@/shared/api/insforge.server";
import type { Product } from "../model/types";
import { mapProductRowToProduct } from "./productMapper";
import type { ProductRow } from "./types";

const PRODUCT_SELECT = `
  id,
  title,
  slug,
  description,
  price,
  image_key,
  image_url,
  created_at,
  category:categories(id, name, slug)
`;

export async function fetchProductsFromInsforgeServer(): Promise<Product[]> {
  const query = insforgeServer.database
    .from("products")
    .select(PRODUCT_SELECT)
    .order("id", { ascending: true });

  const { data, error } = await query.overrideTypes<
    ProductRow[],
    { merge: false }
  >();

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapProductRowToProduct);
}
