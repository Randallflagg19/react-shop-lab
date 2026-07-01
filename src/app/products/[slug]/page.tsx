import { ProductDetails } from "@/entities/product/ui/ProductDetails";
import { AddToCartControls } from "@/features/cart/ui/AddToCartControls";
import { fetchProductBySlug } from "@/entities/product/api/productBySlug";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { ProductFavoriteButton } from "@/features/favorites/ui/ProductFavoriteButton";

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
    <>
      <SiteHeader />
      <main className="page">
        <ProductDetails
          product={product}
          actions={
            <div className="flex flex-col gap-3">
              <AddToCartControls product={product} />
              <ProductFavoriteButton productId={product.id} />
            </div>
          }
        />
      </main>
    </>
  );
}
