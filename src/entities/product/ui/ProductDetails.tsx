import Image from "next/image";
import Link from "next/link";
import { getProductImageSrc } from "../model/getProductImageSrc";
import { Product } from "../model/types";

export function ProductDetails({
  product,
  actions,
}: {
  product: Product;
  actions?: React.ReactNode;
}) {
  const imageSrc = getProductImageSrc(product);

  return (
    <section className="product-details">
      <div className="product-details__image-wrap">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          unoptimized
          sizes="(max-width: 900px) 100vw, 50vw"
          className="product-details__image"
        />
      </div>

      <div className="product-details__content">
        <p className="product-details__category">{product.category.name}</p>
        <h1 className="product-details__title">{product.title}</h1>
        <p className="product-details__price">${product.price}</p>

        <div className="product-details__description">
          {product.description}
        </div>

        <div className="product-details__meta">
          <span>SLUG / ID</span>
          <code>{product.slug}</code>
        </div>

        <div className="product-details__quantity">
          <button type="button">-</button>
          <span>1</span>
          <button type="button">+</button>
        </div>

        {actions}

        <Link href="/" className="product-details__back-link">
          Back to catalog
        </Link>
        <Link href="/cart" className="product-details__back-link">
          To cart
        </Link>
      </div>
    </section>
  );
}
