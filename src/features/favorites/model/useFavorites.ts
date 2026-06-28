import { startTransition, useOptimistic, useSyncExternalStore } from "react";
import { favoritesStore } from "./favoritesStore";

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );

  const [favoriteOptimisticIds, toggleOptimisticFavorite] = useOptimistic(
    favoriteIds,
    function getToggledOptimisticIds(favoriteIds, id: number) {
      return favoriteIds.includes(id)
        ? favoriteIds.filter((el) => el !== id)
        : [...favoriteIds, id];
    },
  );

  function toggleFavorite(id: number) {
    startTransition(async () => {
      toggleOptimisticFavorite(id);

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      favoritesStore.toggleFavorite(id);
    });
  }

  return { favoriteIds: favoriteOptimisticIds, toggleFavorite };
}
