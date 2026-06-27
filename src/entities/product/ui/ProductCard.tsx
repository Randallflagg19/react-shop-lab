import Image from "next/image";
import { getProductImageSrc } from "../model/getProductImageSrc";
import { Product } from "../model/types";
import Link from "next/link";
import React from "react";

export function ProductCard({
  product,
  topRightSlot,
}: {
  product: Product;
  topRightSlot?: React.ReactNode;
}) {
  const imageSrc = getProductImageSrc(product);
  return (
    <article className="relative flex flex-col gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 max-[760px]:gap-2 max-[760px]:p-3">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col gap-2.5 text-inherit no-underline"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
            className="rounded-md object-cover"
          />
        </div>
        <p className="m-0 text-xl font-bold leading-[1.2] text-[var(--foreground)]">
          ${product.price}
        </p>
        <h2 className="m-0 text-lg font-bold leading-[1.3] text-[var(--foreground)] max-[760px]:text-base">
          {product.title}
        </h2>
        <p className="m-0 text-sm leading-[1.3] text-[var(--muted)]">
          {product.category.name}
        </p>
        <p className="m-0 line-clamp-3 overflow-hidden text-sm leading-[1.45] text-[var(--muted)] max-[760px]:line-clamp-2">
          {product.description}
        </p>
        <p className="m-0 font-mono text-xs leading-[1.3] text-[var(--muted)] [overflow-wrap:anywhere]">
          {product.slug}
        </p>
      </Link>
      {topRightSlot}
    </article>
  );
}
