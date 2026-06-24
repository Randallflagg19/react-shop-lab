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

  const categoryBaseClass =
    "shrink-0 cursor-pointer rounded-full border px-3 py-[7px] text-[13px] leading-none";

  function getCategoryClass(category: string) {
    return currentCategory === category
      ? `${categoryBaseClass} border-[#2d8998] bg-[#164e5a] text-[#d9fbff]`
      : `${categoryBaseClass} border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[#3f6670] hover:text-[var(--foreground)]`;
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-6 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-[18px] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-3">
        <p className="m-0 basis-[132px] text-sm font-bold leading-[1.3] text-[var(--foreground)] max-[760px]:basis-auto">
          {isFiltered && visibleCount + " of "}
          {totalCount} products
        </p>
        <div className="flex min-w-0 flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={getCategoryClass("all")}
            type="button"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              onClick={() => onCategoryChange(category)}
              className={getCategoryClass(category)}
              type="button"
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-sm text-[var(--muted)] max-[760px]:justify-between max-[760px]:border-t max-[760px]:border-[var(--border)] max-[760px]:pt-3">
        <label htmlFor={sortId}>Sort by</label>
        <select
          className="min-h-9 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 text-[var(--foreground)]"
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
