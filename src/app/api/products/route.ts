import { fetchProductsFromInsforgeServer } from "@/entities/product/api/insforgeProducts.server";

export async function GET() {
  try {
    const products = await fetchProductsFromInsforgeServer();

    return Response.json(products);
  } catch (error) {
    console.error("Failed to fetch products from InsForge:", error);

    return Response.json(
      { message: "Не удалось загрузить товары" },
      { status: 502 },
    );
  }
}
