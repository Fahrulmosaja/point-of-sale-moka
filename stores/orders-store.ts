import { create } from 'zustand';
import { Order } from '../types/order.types';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Order) => Promise<void>;
  refundOrder: (orderId: string) => void;
  fetchOrders: () => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,
  addOrder: async (order) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      set((state) => ({ orders: [order, ...state.orders] }));
    } catch (error) {
      console.error('Failed to add order:', error);
    }
  },
  refundOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'refunded' as const } : o
      ),
    })),
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        set({ orders: data });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
