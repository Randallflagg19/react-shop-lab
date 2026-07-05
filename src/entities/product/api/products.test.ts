import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "../model/types";
import { fetchProducts } from "./products";

const products: Product[] = [
  {
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
  },
];

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchProducts", () => {
  it("возвращает товары при успешном ответе", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => products,
    } as Response);

    await expect(fetchProducts()).resolves.toEqual(products);
    expect(fetchMock).toHaveBeenCalledWith("/api/products", {
      signal: undefined,
    });
  });

  it("выбрасывает ошибку при неуспешном HTTP-статусе", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
    } as Response);

    await expect(fetchProducts()).rejects.toThrow(
      "Products request failed: 502",
    );
  });

  it("отклоняет ответ, который не является массивом", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ products }),
    } as Response);

    await expect(fetchProducts()).rejects.toThrow(
      "Products response is not an array",
    );
  });

  it("передаёт AbortSignal в fetch", async () => {
    const controller = new AbortController();

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => products,
    } as Response);

    await fetchProducts(controller.signal);

    expect(fetchMock).toHaveBeenCalledWith("/api/products", {
      signal: controller.signal,
    });
  });
});
