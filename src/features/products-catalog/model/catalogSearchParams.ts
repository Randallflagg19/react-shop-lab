import type { SortBy } from "./types";

export type CatalogCategory =
  | "all"
  | "footwear"
  | "clothing"
  | "accessories"
  | "interior"
  | "furniture"
  | "kitchenware"
  | "electronics";

export type CatalogFilters = {
  query: string;
  category: CatalogCategory;
  sort: SortBy;
};

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  query: "",
  category: "all",
  sort: "default",
};

type SearchParamsReader = {
  get(name: string): string | null;
};

function parseSort(value: string | null): SortBy {
  switch (value) {
    case "price-asc":
    case "price-desc":
    case "title-asc":
      return value;
  }
  return DEFAULT_CATALOG_FILTERS.sort;
}

export function parseCatalogCategory(value: string | null): CatalogCategory {
  switch (value) {
    case "footwear":
    case "clothing":
    case "accessories":
    case "interior":
    case "furniture":
    case "kitchenware":
    case "electronics":
    case "all":
      return value;
  }
  return DEFAULT_CATALOG_FILTERS.category;
}

export function parseCatalogSearchParams(
  searchParams: SearchParamsReader,
): CatalogFilters {
  const query = searchParams.get("q")?.trim() ?? DEFAULT_CATALOG_FILTERS.query;
  const category = parseCatalogCategory(searchParams.get("category"));
  const sort = parseSort(searchParams.get("sort"));

  return {
    query,
    category,
    sort,
  };
}
export function serializeCatalogSearchParams(
  filters: CatalogFilters,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  const query = filters.query.trim();

  if (query) searchParams.set("q", query);

  if (filters.category !== DEFAULT_CATALOG_FILTERS.category) {
    searchParams.set("category", filters.category);
  }

  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) {
    searchParams.set("sort", filters.sort);
  }

  return searchParams;
}
