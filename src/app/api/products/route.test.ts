import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/entities/product/model/types";

const { repositoryMock } = vi.hoisted(() => ({
  repositoryMock: vi.fn(),
}));

vi.mock("@/entities/product/api/insforgeProducts.server", () => ({
  fetchProductsFromInsforgeServer: repositoryMock,
}));

import { GET } from "./route";

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

beforeEach(() => {
  repositoryMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/products", () => {
  it("возвращает товары и CDN-заголовки", async () => {
    repositoryMock.mockResolvedValue(products);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(products);

    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate",
    );
    expect(response.headers.get("Vercel-CDN-Cache-Control")).toBe(
      "public, s-maxage=259200, stale-while-revalidate=86400",
    );
  });

  it("возвращает безопасный 502 при ошибке repository", async () => {
    repositoryMock.mockRejectedValue(
      new Error("Внутренние подробности InsForge"),
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({
      message: "Не удалось загрузить товары",
    });
    expect(JSON.stringify(body)).not.toContain("InsForge");
    expect(consoleError).toHaveBeenCalled();
  });
});
