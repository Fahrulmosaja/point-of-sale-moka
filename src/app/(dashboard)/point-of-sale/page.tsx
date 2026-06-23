import { CategoryFilter } from "@/features/pos/components/category-filter";
import { MenuOverview } from "@/features/pos/components/menu-overview";
import { CartOverview } from "@/features/pos/components/cart-overview";

export const metadata = {
  title: "Point of Sale | Moka POS",
  description:
    "Manage your sales transactions efficiently. Browse the menu, add items to the cart, and complete sales with ease.",
};

export default function PointOfSalePage() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 items-start max-w-full lg:h-full lg:overflow-hidden select-none">
      <section className="flex-1 flex flex-col gap-4 w-full min-w-0 lg:h-full lg:overflow-hidden">
        <div className="shrink-0">
          <CategoryFilter />
        </div>
        <div className="lg:flex-1 lg:overflow-y-auto pr-2 pb-4">
          <MenuOverview />
        </div>
      </section>

      <section className="w-full lg:w-auto lg:shrink-0 ">
        <CartOverview />
      </section>
    </main>
  );
}
