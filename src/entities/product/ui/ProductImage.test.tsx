import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Product } from "../model/types";
import { PRODUCT_IMAGE_FALLBACK_SRC } from "../model/getProductImageSrc";
import { ProductImage } from "./ProductImage";

vi.mock("next/image", async () => {
  const { createElement } = await import("react");

  return {
    default: (
      props: ImgHTMLAttributes<HTMLImageElement> & {
        fill?: boolean;
        unoptimized?: boolean;
      },
    ) => {
      const { fill, unoptimized, ...imageProps } = props;

      void fill;
      void unoptimized;

      return createElement("img", imageProps);
    },
  };
});

const product: Product = {
  id: 42,
  title: "Тестовый артефакт",
  slug: "test-artifact",
  description: "Описание товара",
  price: 129.9,
  images: ["/images/products/test-artifact-v2.jpg"],
  category: {
    id: 7,
    name: "Артефакты",
    slug: "artifacts",
    image: "",
  },
  creationAt: "2026-07-05T08:00:00.000Z",
  updatedAt: "2026-07-05T08:00:00.000Z",
};

afterEach(() => {
  cleanup();
});

describe("ProductImage", () => {
  it("показывает изображение товара", () => {
    render(
      <ProductImage product={product} alt={product.title} sizes="100px" />,
    );

    expect(screen.getByRole("img").getAttribute("src")).toBe(
      "/images/products/test-artifact-v2.jpg",
    );
  });

  it("переключается на fallback после ошибки загрузки", () => {
    render(
      <ProductImage product={product} alt={product.title} sizes="100px" />,
    );

    fireEvent.error(screen.getByRole("img"));

    expect(screen.getByRole("img").getAttribute("src")).toBe(
      PRODUCT_IMAGE_FALLBACK_SRC,
    );
  });

  it("не меняет src повторно, если fallback тоже не загрузился", () => {
    render(
      <ProductImage
        product={{ ...product, images: [] }}
        alt={product.title}
        sizes="100px"
      />,
    );

    const image = screen.getByRole("img");

    expect(image.getAttribute("src")).toBe(PRODUCT_IMAGE_FALLBACK_SRC);

    fireEvent.error(image);

    expect(image.getAttribute("src")).toBe(PRODUCT_IMAGE_FALLBACK_SRC);
  });
});
