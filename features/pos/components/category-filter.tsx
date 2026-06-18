"use client";

import { usePosStore } from "@/stores/pos-store";
import { useProducts } from "../hooks/use-products";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = usePosStore();
  const { data: products = [] } = useProducts();

  // Derive unique categories from loaded products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category))).sort();
    return cats;
  }, [products]);

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card">
      <div className="flex w-max space-x-2 p-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full">
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full">
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
