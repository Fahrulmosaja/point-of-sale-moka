import { Suspense } from 'react';
import { InventoryTabs } from '@/features/inventory/components/inventory-tabs';

export default function InventoryPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your stock levels in real-time. Low stock and out-of-stock items are automatically prioritized.
        </p>
      </div>

      <div className="flex-1 overflow-auto pr-2">
        <Suspense fallback={<div className="text-muted-foreground text-sm">Loading inventory...</div>}>
          <InventoryTabs />
        </Suspense>
      </div>
    </div>
  );
}
