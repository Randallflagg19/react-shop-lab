export function FavoriteButton({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="product-card__favorite"
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={onToggle}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}
