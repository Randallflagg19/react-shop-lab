import { useId } from "react";
import type { SortBy } from "../model/types";

export function CatalogMeta({
  totalCount,
  visibleCount,
  isFiltered,
  categories,
  currentCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: {
  totalCount: number;
  visibleCount: number;
  isFiltered: boolean;
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}) {
  const sortId = useId();

  return (
    <div className="product-catalog__meta">
      <div className="product-catalog__filters">
        <p className="product-catalog__count">
          {isFiltered && visibleCount + " of "}
          {totalCount} products
        </p>
        <div className="product-catalog__categories">
          <button
            onClick={() => onCategoryChange("all")}
            className={`product-catalog__category ${
              currentCategory === "all"
                ? "product-catalog__category--active"
                : ""
            }`}
            type="button"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              onClick={() => onCategoryChange(category)}
              className={`product-catalog__category ${
                currentCategory === category
                  ? "product-catalog__category--active"
                  : ""
              }`}
              type="button"
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="product-catalog__sort">
        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => {
            onSortChange(e.currentTarget.value as SortBy);
          }}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price ascending</option>
          <option value="price-desc">Price descending</option>
          <option value="title-asc">Title A–Z</option>
        </select>
      </div>
    </div>
  );
}
