import { Product } from "./types";

const PRODUCT_IMAGE_VERSION = "2";

export function getProductImageSrc(product: Product) {
  const imageUrl = product.images[0];

  const isAllowedImage = imageUrl?.startsWith(
    "https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/",
  );

  if (!isAllowedImage) {
    return "/placeholder-product.svg";
  }

  const separator = imageUrl.includes("?") ? "&" : "?";

  return `${imageUrl}${separator}v=${PRODUCT_IMAGE_VERSION}`;
}
