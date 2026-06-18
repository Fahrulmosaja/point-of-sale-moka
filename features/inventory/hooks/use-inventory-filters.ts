import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInventoryStore } from '@/stores/inventory-store';
import { InventoryType, InventoryItem, StockStatus } from '@/types/inventory.types';

export type StatusFilter = 'all' | StockStatus;

export function useInventoryFilters() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as InventoryType | null;

  const [activeTab, setActiveTab] = useState<InventoryType>(
    tabParam === 'raw_material' ? 'raw_material' : 'product'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const inventoryItems = useInventoryStore((state) => state.items);
  const fetchInventory = useInventoryStore((state) => state.fetchInventory);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Sync tab if URL param changes (e.g. from notification dropdown)
  useEffect(() => {
    if (tabParam === 'raw_material' || tabParam === 'product') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Count helpers per tab
  const counts = useMemo(() => {
    const tabItems = inventoryItems.filter((item) => item.type === activeTab);
    return {
      all: tabItems.length,
      healthy: tabItems.filter((i) => i.status === 'healthy').length,
      low_stock: tabItems.filter((i) => i.status === 'low_stock').length,
      out_of_stock: tabItems.filter((i) => i.status === 'out_of_stock').length,
    };
  }, [inventoryItems, activeTab]);

  const filteredAndSortedItems = useMemo(() => {
    // Filter by Tab type
    let result = inventoryItems.filter((item) => item.type === activeTab);

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(lowerQuery));
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sort by Auto Priority: out_of_stock > low_stock > healthy
    const priorityMap: Record<InventoryItem['status'], number> = {
      out_of_stock: 0,
      low_stock: 1,
      healthy: 2,
    };

    result.sort((a, b) => priorityMap[a.status] - priorityMap[b.status]);

    return result;
  }, [inventoryItems, activeTab, searchQuery, statusFilter]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as InventoryType);
    setStatusFilter('all');
    setSearchQuery('');
  };

  return {
    activeTab,
    searchQuery,
    statusFilter,
    counts,
    filteredAndSortedItems,
    handleTabChange,
    setSearchQuery,
    setStatusFilter,
  };
}
