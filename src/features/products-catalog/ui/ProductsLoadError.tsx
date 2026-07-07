type ProductsLoadErrorProps = {
  message: string;
  onRetry: () => void;
};

export function ProductsLoadError({
  message,
  onRetry,
}: ProductsLoadErrorProps) {
  return (
    <div data-page-status="error" role="alert">
      <p className="m-0">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 cursor-pointer rounded-sm border border-[rgba(194,151,79,0.78)] bg-[linear-gradient(180deg,rgba(48,22,55,0.96),rgba(10,7,13,0.98))] px-5 py-2.5 text-[var(--arcane-gold-bright)] shadow-[inset_0_0_0_1px_rgba(239,210,151,0.06)] transition hover:border-[#e1bd78] hover:bg-[linear-gradient(180deg,rgba(76,31,88,0.98),rgba(17,9,21,0.98))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bd78]"
      >
        Повторить
      </button>
    </div>
  );
}
