import { CategoryFilter } from "@/features/pos/components/category-filter";
import { MenuGrid } from "@/features/pos/components/menu-grid";
import { CartPanel } from "@/features/pos/components/cart-panel";

export default function PointOfSalePage() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 items-start h-full max-w-full overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 w-full min-w-0 h-full overflow-hidden">
        <div className="shrink-0">
          <CategoryFilter />
        </div>
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <MenuGrid />
        </div>
      </div>
      <div className="w-full lg:w-auto shrink-0">
        <CartPanel />
      </div>
    </main>
  );
}
