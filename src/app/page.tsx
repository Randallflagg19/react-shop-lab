import { Catalog } from "@/features/products-catalog/ui/Catalog";
import { Suspense } from "react";

function CatalogFallback() {
  return (
    <main className="page" data-page="catalog">
      <div data-page-status>Загрузка каталога…</div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <Catalog />
    </Suspense>
  );
}
