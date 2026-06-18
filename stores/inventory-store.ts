import { create } from 'zustand';
import { InventoryItem, StockStatus } from '../types/inventory.types';

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  deductStock: (productName: string, quantity: number) => void;
  getLowStockItems: () => InventoryItem[];
  getAlertCount: () => number;
  fetchInventory: () => Promise<void>;
}

function computeStatus(stock: number, minStock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock < minStock) return 'low_stock';
  return 'healthy';
}

function deductProductStock(items: InventoryItem[], productName: string, quantity: number): InventoryItem[] {
  return items.map((item) => {
    if (item.name === productName && item.type === 'product') {
      const newStock = Math.max(0, item.stock - quantity);
      return {
        ...item,
        stock: newStock,
        status: computeStatus(newStock, item.minStock),
        lastUpdated: new Date().toISOString(),
      };
    }
    return item;
  });
}

function deductRawMaterials(items: InventoryItem[], productItem: InventoryItem, quantity: number): InventoryItem[] {
  if (!productItem.requiredMaterials) return items;

  return items.map((item) => {
    const material = productItem.requiredMaterials!.find(
      (m) => m.materialId === item.id
    );
    if (!material) return item;
    const newStock = Math.max(0, item.stock - material.amountPerUnit * quantity);
    return {
      ...item,
      stock: parseFloat(newStock.toFixed(3)),
      status: computeStatus(newStock, item.minStock),
      lastUpdated: new Date().toISOString(),
    };
  });
}

export function calculateDeductedInventory(items: InventoryItem[], productName: string, quantity: number): InventoryItem[] {
  const productItem = items.find((item) => item.name === productName && item.type === 'product');
  
  let updatedItems = deductProductStock(items, productName, quantity);

  if (productItem?.requiredMaterials) {
    updatedItems = deductRawMaterials(updatedItems, productItem, quantity);
  }

  return updatedItems;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  isLoading: false,

  deductStock: (productName, quantity) =>
    set((state) => ({
      items: calculateDeductedInventory(state.items, productName, quantity)
    })),

  getLowStockItems: () => {
    return get().items.filter(
      (item) => item.status === 'low_stock' || item.status === 'out_of_stock'
    );
  },

  getAlertCount: () => {
    return get().items.filter(
      (item) => item.status === 'low_stock' || item.status === 'out_of_stock'
    ).length;
  },

  fetchInventory: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        set({ items: data });
      }
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
