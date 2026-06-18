'use client';

import { usePosStore } from '@/stores/pos-store';
import { PRODUCTS } from '@/constants/products.constant';
import { MenuCard } from './menu-card';
import { useMemo } from 'react';

export function MenuGrid() {
  const { searchQuery, selectedCategoryId, favorites } = usePosStore();

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS;

    if (selectedCategoryId) {
      filtered = filtered.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(lowerQuery));
    }

    // Sort: Favorites first
    filtered.sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });

    return filtered;
  }, [searchQuery, selectedCategoryId, favorites]);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredProducts.map((product) => (
        <MenuCard key={product.id} product={product} />
      ))}
    </div>
  );
}
