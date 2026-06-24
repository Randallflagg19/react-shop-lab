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
    <div className="mb-7 flex items-center justify-between gap-8 border-b border-[var(--border)] pb-6 max-[760px]:mb-5 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-5 max-[760px]:pb-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="m-0 text-[28px] font-bold leading-[1.15] text-[var(--foreground)]">
          React Shop Lab
        </h1>
        <p className="m-0 text-sm leading-[1.4] text-[var(--muted)]">
          Practice catalog built with React hooks and Next.js
        </p>
      </div>
      <div className="flex w-[min(380px,100%)] flex-col gap-1.5">
        <label
          className="text-[13px] font-medium text-[var(--foreground)]"
          htmlFor={searchId}
        >
          Search products
        </label>

        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 grid h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]"
            aria-hidden="true"
          >
            <svg
              className="h-[18px] w-[18px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </span>
          <input
            id={searchId}
            ref={searchInputRef}
            placeholder="Product name"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-3 pr-3.5 pl-11 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-cyan-300 focus:shadow-[0_0_0_3px_rgba(103,232,249,0.12)]"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  );
}
