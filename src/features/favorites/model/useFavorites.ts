import { useSyncExternalStore } from "react";
import { favoritesStore } from "./favoritesStore";

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );

  function toggleFavorite(id: number) {
    favoritesStore.toggleFavorite(id);
  }

  return { favoriteIds, toggleFavorite };
}
