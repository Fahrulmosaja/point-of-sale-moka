import { create } from 'zustand';
import { PRODUCTS } from '../constants/products.constant';

interface PosState {
  searchQuery: string;
  selectedCategoryId: string | null;
  favorites: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (categoryId: string | null) => void;
  toggleFavorite: (productId: string) => void;
}

// Initial favorites based on the mock data
const initialFavorites = PRODUCTS.filter((p) => p.isFavorite).map((p) => p.id);

export const usePosStore = create<PosState>((set) => ({
  searchQuery: '',
  selectedCategoryId: null,
  favorites: initialFavorites,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),
  toggleFavorite: (productId) =>
    set((state) => {
      const isFav = state.favorites.includes(productId);
      return {
        favorites: isFav
          ? state.favorites.filter((id) => id !== productId)
          : [...state.favorites, productId],
      };
    }),
}));
