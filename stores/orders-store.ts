import { create } from 'zustand';
import { Order } from '../types/order.types';
import { ORDERS } from '../constants/orders.constant';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  refundOrder: (orderId: string) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: ORDERS,
  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),
  refundOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'refunded' as const } : o
      ),
    })),
}));
