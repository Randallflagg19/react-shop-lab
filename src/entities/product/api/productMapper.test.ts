import { describe, expect, it } from "vitest";
import { mapProductRowToProduct } from "./productMapper";
import type { ProductRow } from "./types";

const productRow: ProductRow = {
  id: "42",
  title: "Тестовый артефакт",
  slug: "test-artifact",
  description: "Описание товара",
  price: "129.90",
  image_key: "test-artifact-v2.jpg",
  image_url: "unused",
  created_at: "2026-07-05T08:00:00.000Z",
  category: {
    id: "7",
    name: "Артефакты",
    slug: "artifacts",
  },
};

describe("mapProductRowToProduct", () => {
  it("преобразует строку базы данных в доменный товар", () => {
    const product = mapProductRowToProduct(productRow);

    expect(product.id).toBe(42);
    expect(product.price).toBe(129.9);
    expect(product.category.id).toBe(7);
    expect(product.images).toEqual(["/images/products/test-artifact-v2.jpg"]);
  });

  it("выбрасывает ошибку, если у товара нет категории", () => {
    expect(() =>
      mapProductRowToProduct({
        ...productRow,
        category: null,
      }),
    ).toThrow('Product "test-artifact" has no category');
  });
});
