export function FavoriteButton({
  isFavorite,
  onToggle,
  variant = "icon",
}: {
  isFavorite: boolean;
  onToggle: () => void;
  variant?: "icon" | "full";
}) {
  const label = isFavorite ? "Удалить из избранного" : "Добавить в избранное";
  const symbol = isFavorite ? "♥" : "♡";
  const content = variant === "full" ? `${symbol} ${label}` : symbol;
  const iconClass = `absolute right-6 top-6 z-[1] grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[#0a0a0a]/[0.78] p-0 text-[24px] leading-none ${
    isFavorite ? "text-[#fb7185]" : "text-[var(--muted)]"
  }`;
  const fullClass = `w-full rounded-md border px-[18px] py-3.5 text-center font-medium ${
    isFavorite
      ? "border-rose-400/60 bg-rose-400/10 text-rose-300 hover:bg-rose-400/15"
      : "border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-rose-400/60 hover:bg-white/[0.04]"
  }`;

  return (
    <button
      className={`cursor-pointer font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 ${
        variant === "full" ? fullClass : iconClass
      }`}
      type="button"
      aria-pressed={isFavorite}
      aria-label={label}
      onClick={onToggle}
    >
      {content}
    </button>
  );
}
