import { Product } from "./types";

export function getProductImageSrc(product: Product) {
  const imageUrl = product.images[0];

  const isAllowedImage =
    imageUrl?.startsWith("https://i.imgur.com/") ||
    imageUrl?.startsWith("https://picsum.photos/") ||
    imageUrl?.startsWith("https://placehold.co/");

  return isAllowedImage ? imageUrl : "/placeholder-product.svg";
}
