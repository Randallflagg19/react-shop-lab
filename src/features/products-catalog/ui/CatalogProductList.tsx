import { Product } from "@/entities/product/model/types";
import { ProductCardMemo } from "@/entities/product/ui/ProductCard";
import { FavoriteButton } from "@/features/favorites/ui/FavoriteButton";

export function CatalogProductList({
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
            topRightSlot={
              <FavoriteButton
                isFavorite={favoriteIds.includes(product.id)}
                onToggle={() => toggleFavorite(product.id)}
              />
            }
          />
        </li>
      ))}
    </ul>
  );
}
