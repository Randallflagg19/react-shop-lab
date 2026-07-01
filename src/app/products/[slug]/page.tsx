import { ProductDetails } from "@/entities/product/ui/ProductDetails";
import { AddToCartControls } from "@/features/cart/ui/AddToCartControls";
import { fetchProductBySlug } from "@/entities/product/api/productBySlug";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { ProductFavoriteButton } from "@/features/favorites/ui/ProductFavoriteButton";
import styles from "./product-page.module.css";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.arcanePage}>
      <SiteHeader />
      <main className={`page ${styles.main}`}>
        <ProductDetails
          product={product}
          actions={
            <div className="flex flex-col gap-3" data-product-actions>
              <AddToCartControls product={product} />
              <ProductFavoriteButton productId={product.id} />
            </div>
          }
        />
      </main>
    </div>
  );
}
