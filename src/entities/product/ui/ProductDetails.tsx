import Image from "next/image";
import { getProductImageSrc } from "../model/getProductImageSrc";
import { Product } from "../model/types";
import { formatPrice } from "@/shared/lib/formatPrice";

export function ProductDetails({
  product,
  actions,
}: {
  product: Product;
  actions?: React.ReactNode;
}) {
  const imageSrc = getProductImageSrc(product);

  return (
    <section
      data-product-details
      className="flex items-start gap-12 max-[1000px]:grid max-[1000px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] max-[1000px]:gap-7 max-[760px]:flex max-[760px]:w-full max-[760px]:flex-col max-[760px]:gap-6"
    >
      <div
        data-product-image-frame
        className="relative aspect-square w-full max-w-[620px] flex-[0_1_620px] overflow-hidden max-[1000px]:max-w-none max-[760px]:flex-none"
      >
        <Image
          loading="eager"
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className="object-contain"
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </div>

      <div
        data-product-info
        className="flex max-w-[520px] flex-[1_1_420px] flex-col gap-[18px] max-[1000px]:min-w-0 max-[1000px]:max-w-none max-[1000px]:gap-3.5 max-[760px]:w-full max-[760px]:gap-4"
      >
        <p
          data-product-category
          className="m-0 w-fit rounded-md bg-cyan-400/20 px-3 py-1.5 text-sm text-cyan-300 max-[760px]:px-2.5 max-[760px]:text-[13px]"
        >
          {product.category.name}
        </p>
        <h1
          data-product-title
          className="m-0 text-4xl leading-[1.1] text-[var(--foreground)] max-[1000px]:text-3xl max-[1000px]:[overflow-wrap:anywhere] max-[760px]:leading-[1.15]"
        >
          {product.title}
        </h1>
        <p
          data-product-price
          className="m-0 text-[28px] font-bold max-[1000px]:text-[26px]"
        >
          {formatPrice(product.price)}
        </p>

        <div
          data-product-description
          className="max-h-[220px] overflow-y-auto rounded-lg border border-[var(--border)] p-4 text-[15px] leading-[1.6] text-[var(--muted)] max-[1000px]:max-h-[180px] max-[1000px]:p-3.5 max-[1000px]:text-sm max-[1000px]:leading-[1.5] max-[760px]:max-h-none max-[760px]:overflow-visible"
        >
          {product.description}
        </div>

        {actions}
      </div>
    </section>
  );
}
