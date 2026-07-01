import { useId } from "react";
import type { SortBy } from "../model/types";

const CATEGORY_LABELS: Record<string, string> = {
  footwear: "Обувь",
  clothing: "Одежда",
  accessories: "Аксессуары",
  interior: "Интерьер",
  furniture: "Мебель",
  kitchenware: "Кухня",
  electronics: "Электроника",
};

function getProductLabel(count: number) {
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "товаров";

  switch (count % 10) {
    case 1:
      return "товар";
    case 2:
    case 3:
    case 4:
      return "товара";
    default:
      return "товаров";
  }
}

export function CatalogMeta({
  totalCount,
  visibleCount,
  isFiltered,
  categories,
  currentCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  isPending,
}: {
  totalCount: number;
  visibleCount: number;
  isFiltered: boolean;
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  isPending: boolean;
}) {
  const sortId = useId();

  const categoryBaseClass =
    "shrink-0 cursor-pointer rounded-full border px-3 py-[7px] text-[13px] leading-none disabled:cursor-not-allowed";

  function getCategoryClass(category: string) {
    return currentCategory === category
      ? `${categoryBaseClass} border-[#2d8998] bg-[#164e5a] text-[#d9fbff]`
      : `${categoryBaseClass} border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[#3f6670] hover:text-[var(--foreground)]`;
  }

  return (
    <div
      data-catalog-meta
      className="mb-6 flex items-center justify-between gap-6 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-[18px] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-3">
        <p
          data-catalog-count
          className="m-0 basis-[132px] text-sm font-bold leading-[1.3] text-[var(--foreground)] max-[760px]:basis-auto"
        >
          {isFiltered && (
            <>
              <span>{visibleCount}</span>
              <span>из</span>
            </>
          )}
          <span>{totalCount}</span>
          <span>{getProductLabel(totalCount)}</span>
        </p>
        <div
          data-category-list
          className={`flex min-w-0 flex-wrap gap-2 transition-opacity ${
            isPending ? "opacity-60" : "opacity-100"
          }`}
        >
          <button
            disabled={isPending}
            onClick={() => onCategoryChange("all")}
            className={getCategoryClass("all")}
            type="button"
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              disabled={isPending}
              onClick={() => onCategoryChange(category)}
              className={getCategoryClass(category)}
              type="button"
              key={category}
            >
              {CATEGORY_LABELS[category] ?? category}
            </button>
          ))}
        </div>
      </div>
      <div
        data-catalog-sort
        className="flex shrink-0 items-center gap-2 text-sm text-[var(--muted)] max-[760px]:justify-between max-[760px]:border-t max-[760px]:border-[var(--border)] max-[760px]:pt-3"
      >
        <label htmlFor={sortId}>Сортировка</label>
        <select
          className="min-h-9 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 text-[var(--foreground)]"
          id={sortId}
          value={sortBy}
          onChange={(e) => {
            onSortChange(e.currentTarget.value as SortBy);
          }}
        >
          <option value="default">По умолчанию</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
          <option value="title-asc">По названию А–Я</option>
        </select>
      </div>
    </div>
  );
}
