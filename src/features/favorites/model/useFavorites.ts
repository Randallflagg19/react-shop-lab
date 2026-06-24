import { useCallback, useState } from "react";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => {
      return prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id];
    });
  }, []);

  return { favoriteIds, toggleFavorite };
}
