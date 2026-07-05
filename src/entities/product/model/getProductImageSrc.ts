import { Product } from "./types";

export const PRODUCT_IMAGE_FALLBACK_SRC = "/placeholder-product.jpeg";
const LOCAL_PRODUCT_IMAGE_PREFIX = "/images/products/";

export function getProductImageSrc(product: Product) {
  const imageSrc = product.images[0];

  if (imageSrc?.startsWith(LOCAL_PRODUCT_IMAGE_PREFIX)) {
    return imageSrc;
  }

  return PRODUCT_IMAGE_FALLBACK_SRC;
}
