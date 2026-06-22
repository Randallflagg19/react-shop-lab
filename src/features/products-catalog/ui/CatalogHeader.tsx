import { useEffect, useRef } from "react";

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

  return (
    <div className="product-catalog__header">
      <div className="product-catalog__intro">
        <h1>React Shop Lab</h1>
        <p>Practice catalog built with React hooks and Next.js</p>
      </div>
      <input
        ref={searchInputRef}
        placeholder="Search products"
        className="product-catalog__header-input"
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
      />
    </div>
  );
}
