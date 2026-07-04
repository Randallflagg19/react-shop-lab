import { Product } from "./types";

export const PRODUCT_IMAGE_FALLBACK_SRC = "/placeholder-product.jpeg";
const LOCAL_PRODUCT_IMAGE_PREFIX = "/images/products/";
const INSFORGE_PRODUCT_IMAGE_PREFIX =
  "https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/";

export function getProductImageSrc(product: Product) {
  const imageSrc = product.images[0];

  if (imageSrc?.startsWith(LOCAL_PRODUCT_IMAGE_PREFIX)) {
    return imageSrc;
  }

  if (imageSrc?.startsWith(INSFORGE_PRODUCT_IMAGE_PREFIX)) {
    const imageKey = imageSrc.slice(INSFORGE_PRODUCT_IMAGE_PREFIX.length);

    if (/^[a-z0-9-]+-v\d+\.jpg$/.test(imageKey)) {
      return `${LOCAL_PRODUCT_IMAGE_PREFIX}${imageKey}`;
    }
  }

  return PRODUCT_IMAGE_FALLBACK_SRC;
}
