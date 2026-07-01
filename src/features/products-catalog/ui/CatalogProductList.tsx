import { Product } from "@/entities/product/model/types";
import { ProductCard } from "@/entities/product/ui/ProductCard";
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
    <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6 xl:gap-y-8">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            eager={index < 5}
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
