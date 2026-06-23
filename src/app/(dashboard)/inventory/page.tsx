import { Suspense } from "react";

import { InventoryOverview } from "@/features/inventory/components/inventory-overview";

export const metadata = {
  title: "Inventory | Moka POS",
  description:
    "Manage raw materials and product menus. Monitor stock levels in real-time.",
};

export default function InventoryPage() {
  return (
    <main className="w-full h-full flex flex-col gap-6 select-none">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage raw materials and product menus. Stock is calculated dynamically from
          recipes.
        </p>
      </section>

      <section className="flex-1 overflow-auto pr-1">
        <Suspense
          fallback={
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          }>
          <InventoryOverview />
        </Suspense>
      </section>
    </main>
  );
}
