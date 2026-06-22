import { mockCartItems } from "@/features/cart/model/mockCartItems";
import { Cart } from "@/features/cart/ui/Cart";

export default function CartPage() {
  return (
    <main className="page">
      <Cart initialItems={mockCartItems} />
    </main>
  );
}
