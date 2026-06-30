import { Ref, useId, useImperativeHandle, useRef } from "react";

export type CatalogSearchHandle = {
  focus: () => void;
};

export function CatalogSearch({
  search,
  onSearchChange,
  ref,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  ref?: Ref<CatalogSearchHandle>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        onSearchChange("");
        inputRef.current?.focus();
      },
    }),
    [onSearchChange],
  );

  const searchId = useId();

  return (
    <div className="flex w-[min(380px,100%)] flex-col gap-1.5">
      <label className="sr-only" htmlFor={searchId}>
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
          ref={inputRef}
          placeholder="Найти товар"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-3 pr-3.5 pl-11 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-cyan-300 focus:shadow-[0_0_0_3px_rgba(103,232,249,0.12)]"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}
