'use client';

import { Badge } from '@/components/ui/badge';
import { InventoryTable } from './inventory-table';
import { useInventoryFilters } from '../hooks/use-inventory-filters';
import { InventoryControls } from './inventory-controls';

export function InventoryTabs() {
  const {
    activeTab,
    searchQuery,
    statusFilter,
    counts,
    filteredAndSortedItems,
    handleTabChange,
    setSearchQuery,
    setStatusFilter,
  } = useInventoryFilters();

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <InventoryControls
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        counts={counts}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Active filter summary */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-2">
          <span>Showing</span>
          <Badge
            variant={
              statusFilter === 'out_of_stock'
                ? 'destructive'
                : statusFilter === 'low_stock'
                  ? 'outline'
                  : 'secondary'
            }
            className={
              statusFilter === 'low_stock' ? 'border-amber-500 text-amber-600' : ''
            }
          >
            {statusFilter === 'low_stock'
              ? 'Low Stock'
              : statusFilter === 'out_of_stock'
                ? 'Out of Stock'
                : 'Healthy'}
          </Badge>
          <span>· {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      <InventoryTable items={filteredAndSortedItems} />
    </div>
  );
}
