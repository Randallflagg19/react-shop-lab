import Image from "next/image";
import { getProductImageSrc } from "../model/getProductImageSrc";
import { Product } from "../model/types";
import Link from "next/link";
import React from "react";

export const ProductCardMemo = React.memo(ProductCard);

function ProductCard({
  product,
  topRightSlot,
}: {
  product: Product;
  topRightSlot?: React.ReactNode;
}) {
  const imageSrc = getProductImageSrc(product);
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
            className="product-card__image"
          />
        </div>
        <p className="product-card__price">${product.price}</p>
        <h2 className="product-card__title">{product.title}</h2>
        <p className="product-card__category">{product.category.name}</p>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__slug">{product.slug}</p>
      </Link>
      {topRightSlot}
    </article>
  );
}
