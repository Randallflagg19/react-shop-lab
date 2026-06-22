import { Product } from "@/entities/product/model/types";

export type CartItem = {
  product: Product;
  quantity: number;
};
