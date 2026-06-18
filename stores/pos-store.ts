import { create } from "zustand";

interface PosState {
  searchQuery: string;
  selectedCategory: string | null;
  favorites: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleFavorite: (productId: string) => void;
  setFavorites: (favorites: string[]) => void;
}

export const usePosStore = create<PosState>((set) => ({
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

  setFavorites: (favorites) => set({ favorites }),
}));
