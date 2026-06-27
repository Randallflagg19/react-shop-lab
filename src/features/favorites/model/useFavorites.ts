import { useSyncExternalStore } from "react";
import { favoritesStore } from "./favoritesStore";

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );

  return { favoriteIds, toggleFavorite: favoritesStore.toggleFavorite };
}
