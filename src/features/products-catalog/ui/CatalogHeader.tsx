import { useEffect, useId, useRef } from "react";

export function CatalogHeader({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const searchId = useId();

  return (
    <div className="product-catalog__header">
      <div className="product-catalog__intro">
        <h1>React Shop Lab</h1>
        <p>Practice catalog built with React hooks and Next.js</p>
      </div>
      <div className="product-catalog__search">
        <label className="product-catalog__search-label" htmlFor={searchId}>
          Search products
        </label>

        <div className="product-catalog__search-field">
          <span className="product-catalog__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </span>
          <input
            id={searchId}
            ref={searchInputRef}
            placeholder="Product name"
            className="product-catalog__header-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  );
}
