import { useEffect, useRef } from "react";
import { CatalogSearch, CatalogSearchHandle } from "./CatalogSearch";

export function CatalogSearchSlot({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const searchRef = useRef<CatalogSearchHandle | null>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <CatalogSearch
      ref={searchRef}
      search={search}
      onSearchChange={onSearchChange}
    />
  );
}
