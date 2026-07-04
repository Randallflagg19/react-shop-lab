import { fetchProductsFromInsforgeServer } from "@/entities/product/api/insforgeProducts.server";

export async function GET() {
  try {
    const products = await fetchProductsFromInsforgeServer();

    return Response.json(products, {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Vercel-CDN-Cache-Control":
          "public, s-maxage=259200, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to fetch products from InsForge:", error);

    return Response.json(
      { message: "Не удалось загрузить товары" },
      { status: 502 },
    );
  }
}
