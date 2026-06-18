'use client';

import { Product } from '@/types/product.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { usePosStore } from '@/stores/pos-store';
import { useCartOperations } from '../hooks/use-cart-operations';
import { formatCurrency } from '@/lib/utils';

interface MenuCardProps {
  product: Product;
}

export function MenuCard({ product }: MenuCardProps) {
  const { handleAddItem } = useCartOperations();
  const { favorites, toggleFavorite } = usePosStore();

  const isFav = favorites.includes(product.id);

  const formattedPrice = formatCurrency(product.price);

  return (
    <Card className="overflow-hidden cursor-pointer group transition-all hover:ring-2 hover:ring-primary/50" onClick={() => handleAddItem(product)}>
      <div className="relative aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 rounded-full shadow-sm bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        >
          <Star className={`h-4 w-4 ${isFav ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
        </Button>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
        <p className="text-sm text-primary font-medium mt-1">{formattedPrice}</p>
      </CardContent>
    </Card>
  );
}
