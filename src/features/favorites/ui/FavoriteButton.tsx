export function FavoriteButton({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) {
  const colorClass = isFavorite ? "text-[#fb7185]" : "text-[var(--muted)]";

  return (
    <button
      className={`absolute right-6 top-6 z-[1] grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[#0a0a0a]/[0.78] p-0 font-sans text-[24px] leading-none ${colorClass}`}
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={onToggle}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}
