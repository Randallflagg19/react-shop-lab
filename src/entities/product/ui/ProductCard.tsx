import Image from "next/image";
import { getProductImageSrc } from "../model/getProductImageSrc";
import { Product } from "../model/types";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const imageSrc = getProductImageSrc(product);
  return (
    <Link href={`/products/${product.slug}`} className="product-card__link">
      <article className="product-card">
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
      </article>
    </Link>
  );
}
