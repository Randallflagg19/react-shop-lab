import { useEffect, useRef } from "react";
import { CatalogSearch, CatalogSearchHandle } from "./CatalogSearch";

export function CatalogHeader({
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
    <div className="mb-7 flex items-center justify-between gap-8 border-b border-[var(--border)] pb-6 max-[760px]:mb-5 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-5 max-[760px]:pb-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="m-0 text-[28px] font-bold leading-[1.15] text-[var(--foreground)]">
          AI Slop Shop
        </h1>
        <p className="m-0 text-sm leading-[1.4] text-[var(--muted)]">
          Practice catalog built with React hooks and Next.js
        </p>
      </div>
      <CatalogSearch
        ref={searchRef}
        search={search}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}
