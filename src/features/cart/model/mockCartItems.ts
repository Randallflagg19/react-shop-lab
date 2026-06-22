import type { CartItem } from "./types";

export const mockCartItems = [
  {
    product: {
      id: 1001,
      title: "Sleek Futuristic Electric Bicycle",
      slug: "sleek-futuristic-electric-bicycle",
      price: 22,
      description: "Modern electric bicycle",
      category: {
        id: 1,
        name: "Miscellaneous",
        slug: "miscellaneous",
        image: "",
      },
      images: ["https://picsum.photos/seed/bicycle/600/600"],
      creationAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    quantity: 2,
  },
  {
    product: {
      id: 1002,
      title: "Classic Red Pullover Hoodie",
      slug: "classic-red-pullover-hoodie",
      price: 10,
      description: "Comfortable red hoodie",
      category: {
        id: 2,
        name: "Clothes",
        slug: "clothes",
        image: "",
      },
      images: ["https://picsum.photos/seed/hoodie/600/600"],
      creationAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    quantity: 1,
  },
] satisfies CartItem[];
