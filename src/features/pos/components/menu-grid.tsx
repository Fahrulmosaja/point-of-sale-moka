"use client";

import { usePosStore } from "@/stores/pos-store";
import { useProducts } from "../hooks/use-products";
import { MenuCard } from "./menu-card";
import { useMemo } from "react";

export function MenuGrid() {
  const {
    searchQuery,
    selectedCategory,
    favorites,
  } = usePosStore();

  const { data: products = [], isLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(lowerQuery),
      );
    }

    // Sort: Favorites first, then by name
    filtered.sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      if (bFav !== aFav) return bFav - aFav;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, favorites]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-muted animate-pulse aspect-[3/4]"
          />
        ))}
      </div>
    );
  }

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
