import { Cart } from "@/features/cart/ui/Cart";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";

export default function CartPage() {
  return (
    <div data-page-shell="cart">
      <SiteHeader />
      <main className="page" data-page="cart">
        <Cart />
      </main>
    </div>
  );
}
