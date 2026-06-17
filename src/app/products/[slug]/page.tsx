import { ProductDetails } from "@/entities/product/ui/ProductDetails";
import { fetchProductBySlug } from "@/shared/api/productBySlug";
import { notFound } from "next/navigation";

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
    <main className="page">
      <ProductDetails product={product} />
    </main>
  );
}
