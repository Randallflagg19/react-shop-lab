"use client";

import { useFavorites } from "../model/useFavorites";
import { FavoriteButton } from "./FavoriteButton";

export function ProductFavoriteButton({ productId }: { productId: number }) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(productId);

  return (
    <FavoriteButton
      variant="full"
      isFavorite={isFavorite}
      onToggle={() => toggleFavorite(productId)}
    />
  );
}
