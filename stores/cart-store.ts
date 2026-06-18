import { create } from "zustand";
import { OrderType } from "../types/sale.types";
import { Product } from "../types/product.types";

export interface CartItem {
  id: string;
  productMenuId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productMenuId: string) => void;
  updateQuantity: (productMenuId: string, quantity: number) => void;
  setOrderType: (type: OrderType) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  orderType: "dine_in",

  addItem: (product, quantity = 1, notes) =>
    set((state) => {
      const existing = state.items.find((i) => i.productMenuId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productMenuId === product.id
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  notes: notes ?? i.notes,
                }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: `ci-${Date.now()}`,
            productMenuId: product.id,
            product,
            quantity,
            unitPrice: product.price,
            notes,
          },
        ],
      };
    }),

  removeItem: (productMenuId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productMenuId !== productMenuId),
    })),

  updateQuantity: (productMenuId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((i) => i.productMenuId !== productMenuId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.productMenuId === productMenuId ? { ...i, quantity } : i,
        ),
      };
    }),

  setOrderType: (type) => set({ orderType: type }),
  clearCart: () => set({ items: [] }),
}));
