import { Product } from "../model/types";
import { ProductCardMemo } from "./ProductCard";

export function ProductCardList({
  products,
  favoriteIds,
  toggleFavorite,
}: {
  products: Product[];
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
}) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCardMemo
            product={product}
            isFavorite={favoriteIds.includes(product.id)}
            toggleFavorite={toggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
