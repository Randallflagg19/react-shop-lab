import { Product } from "../model/types";
import { ProductCard } from "./ProductCard";

export function ProductCardList({ products }: { products: Product[] }) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
