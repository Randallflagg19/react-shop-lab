import { Cart } from "@/features/cart/ui/Cart";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="page">
        <Cart />
      </main>
    </>
  );
}
