"use client";

import { useFavorites } from "../model/useFavorites";
import { FavoriteButton } from "./FavoriteButton";

export function ProductFavoriteButton({
  productId,
  productTitle,
}: {
  productId: number;
  productTitle: string;
}) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(productId);

  return (
    <FavoriteButton
      variant="full"
      isFavorite={isFavorite}
      productTitle={productTitle}
      onToggle={() => toggleFavorite(productId)}
    />
  );
}
