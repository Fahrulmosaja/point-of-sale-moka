'use client';

import { CATEGORIES } from '@/constants/categories.constant';
import { usePosStore } from '@/stores/pos-store';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export function CategoryFilter() {
  const { selectedCategoryId, setSelectedCategoryId } = usePosStore();

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card">
      <div className="flex w-max space-x-2 p-2">
        <Button
          variant={selectedCategoryId === null ? 'default' : 'ghost'}
          onClick={() => setSelectedCategoryId(null)}
          className="rounded-full"
        >
          All
        </Button>
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? 'default' : 'ghost'}
            onClick={() => setSelectedCategoryId(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
