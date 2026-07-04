"use client";

import Image from "next/image";
import { useState } from "react";
import {
  getProductImageSrc,
  PRODUCT_IMAGE_FALLBACK_SRC,
} from "../model/getProductImageSrc";
import type { Product } from "../model/types";

type ProductImageProps = {
  product: Product;
  alt: string;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
  onLoad?: () => void;
};

export function ProductImage({
  product,
  alt,
  sizes,
  className,
  loading,
  onLoad,
}: ProductImageProps) {
  const productImageSrc = getProductImageSrc(product);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  const imageSrc =
    failedImageSrc === productImageSrc
      ? PRODUCT_IMAGE_FALLBACK_SRC
      : productImageSrc;

  function handleImageError() {
    if (imageSrc !== PRODUCT_IMAGE_FALLBACK_SRC) {
      setFailedImageSrc(productImageSrc);
    }
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      loading={loading}
      onLoad={onLoad}
      onError={handleImageError}
      unoptimized={process.env.NODE_ENV === "development"}
    />
  );
}
