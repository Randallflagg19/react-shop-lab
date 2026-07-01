import { Product } from "./types";

export function getProductImageSrc(product: Product) {
  const imageUrl = product.images[0];

  const isAllowedImage = imageUrl?.startsWith(
    "https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/",
  );

  return isAllowedImage ? imageUrl : "/placeholder-product.svg";
}
