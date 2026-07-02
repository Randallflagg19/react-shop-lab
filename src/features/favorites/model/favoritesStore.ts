const STORAGE_KEY = "ai-slop-shop:favorite-ids";
const EMPTY_FAVORITE_IDS: number[] = [];
let favoriteIds: number[] = readFavoriteIds();
let listeners: (() => void)[] = [];

function readFavoriteIds(): number[] {
  if (typeof window === "undefined") {
    return EMPTY_FAVORITE_IDS;
  }

  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (storedValue === null) {
    return EMPTY_FAVORITE_IDS;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return Array.isArray(parsedValue) &&
      parsedValue.every((id) => typeof id === "number")
      ? parsedValue
      : EMPTY_FAVORITE_IDS;
  } catch {
    return EMPTY_FAVORITE_IDS;
  }
}
function handleStorageChange(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) {
    return;
  }

  favoriteIds = readFavoriteIds();
  emitChanges();
}

export const favoritesStore = {
  getSnapshot: () => {
    return favoriteIds;
  },
  subscribe: (listener: () => void) => {
    listeners = [...listeners, listener];
    if (listeners.length === 1) {
      window.addEventListener("storage", handleStorageChange);
    }
    return () => {
      listeners = listeners.filter((el) => el !== listener);
      if (listeners.length === 0) {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  },
  toggleFavorite(id: number) {
    if (favoriteIds.includes(id)) {
      favoriteIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
    } else {
      favoriteIds = [...favoriteIds, id];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    emitChanges();
  },
  getServerSnapshot: () => {
    return EMPTY_FAVORITE_IDS;
  },
};

function emitChanges() {
  listeners.forEach((listener) => listener());
}
