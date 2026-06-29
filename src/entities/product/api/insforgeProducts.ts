import { insforge } from "@/shared/api/insforge";
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

export async function fetchInsforgeProducts(
  signal?: AbortSignal,
): Promise<Product[]> {
  let query = insforge.database
    .from("products")
    .select(PRODUCT_SELECT)
    .order("id", { ascending: true });

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query.overrideTypes<
    ProductRow[],
    { merge: false }
  >();

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapProductRowToProduct);
}

export async function fetchInsforgeProductBySlug(
  slug: string,
): Promise<Product | null> {
  const { data, error } = await insforge.database
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle()
    .overrideTypes<ProductRow | null, { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProductRowToProduct(data) : null;
}
