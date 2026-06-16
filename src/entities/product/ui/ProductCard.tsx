import { Product } from "../model/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <img
        src={product.images[0]}
        alt={product.title}
        className="product-card__image"
      />
      <p className="product-card__price">${product.price}</p>
      <h2 className="product-card__title">{product.title}</h2>
      <p className="product-card__category">{product.category.name}</p>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__slug">{product.slug}</p>
    </article>
  );
}
