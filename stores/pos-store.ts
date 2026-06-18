import { create } from "zustand";
import { Product } from "../types/product.types";

interface PosState {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  favorites: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleFavorite: (productId: string) => void;
  fetchProducts: () => Promise<void>;
}

export const usePosStore = create<PosState>((set, get) => ({
  products: [],
  isLoading: false,
  searchQuery: "",
  selectedCategory: null,
  favorites: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId],
    })),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/product-menus?active=true");
      if (res.ok) {
        const data: Product[] = await res.json();
        set({
          products: data,
          favorites: data.filter((p) => p.isFavorite).map((p) => p.id),
        });
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
