"use client";

import { ProductImage } from "./ProductImage";
import { Product } from "../model/types";
import Link from "next/link";
import React, { useState } from "react";
import { formatPrice } from "@/shared/lib/formatPrice";

export function ProductCard({
  product,
  topRightSlot,
  eager,
}: {
  product: Product;
  topRightSlot?: React.ReactNode;
  eager?: boolean;
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <article
      data-product-card
      className="relative flex flex-col gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 max-[760px]:gap-2 max-[760px]:p-3"
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col gap-2.5 text-inherit no-underline"
      >
        <div
          data-product-card-image
          className="relative aspect-square w-full overflow-hidden rounded-md"
        >
          <div
            data-product-image-portal
            data-loading={isImageLoading}
            aria-hidden="true"
          />
          <ProductImage
            product={product}
            loading={eager ? "eager" : "lazy"}
            alt={product.title}
            sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
            className={`rounded-md object-contain transition-[opacity,filter] duration-250 ease-out ${
              isImageLoading ? "opacity-0 blur-[2px]" : "opacity-100 blur-0"
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
        </div>
        <p
          data-product-card-price
          className="m-0 text-xl font-bold leading-[1.2] text-[var(--foreground)]"
        >
          {formatPrice(product.price)}
        </p>
        <h2
          data-product-card-title
          className="m-0 text-lg font-bold leading-[1.3] text-[var(--foreground)] max-[760px]:text-base"
        >
          {product.title}
        </h2>
        <p
          data-product-card-category
          className="m-0 text-sm leading-[1.3] text-[var(--muted)]"
        >
          {product.category.name}
        </p>
        <p
          data-product-card-description
          className="m-0 line-clamp-3 overflow-hidden text-sm leading-[1.45] text-[var(--muted)] max-[760px]:line-clamp-2"
        >
          {product.description}
        </p>
      </Link>
      {topRightSlot}
      <Link
        data-product-card-action
        href={`/products/${product.slug}`}
        className="mt-auto block w-full text-center no-underline"
      >
        Осмотреть артефакт
      </Link>
    </article>
  );
}
