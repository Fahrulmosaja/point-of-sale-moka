import { create } from 'zustand';
import { OrderItem, OrderType } from '../types/order.types';
import { Product } from '../types/product.types';

interface CartState {
  items: OrderItem[];
  orderType: OrderType;
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setOrderType: (type: OrderType) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  orderType: 'dine_in',

  addItem: (product, quantity = 1, notes) => 
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: `oi-${Date.now()}`,
            productId: product.id,
            product: product,
            quantity: quantity,
            price: product.price,
            notes,
          },
        ],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.productId !== productId) };
      }
      return {
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      };
    }),

  setOrderType: (type) => set({ orderType: type }),

  clearCart: () => set({ items: [] }),
}));
