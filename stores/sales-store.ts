import { create } from 'zustand';
import { Sale } from '../types/sale.types';
import { api } from '../lib/api';

interface SalesState {
  sales: Sale[];
  isLoading: boolean;
  fetchSales: () => Promise<void>;
}

export const useSalesStore = create<SalesState>((set) => ({
  sales: [],
  isLoading: false,

  fetchSales: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/sales');
      set({ sales: data });
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
