"use client";

import { Product } from "@/types/product.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle } from "lucide-react";
import { usePosStore } from "@/stores/pos-store";
import { useCartOperations } from "../hooks/use-cart-operations";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  product: Product;
}

export function MenuCard({ product }: MenuCardProps) {
  const { handleAddItem } = useCartOperations();
  const { favorites, toggleFavorite } = usePosStore();

  const isFav = favorites.includes(product.id);
  const isOutOfStock = product.stockStatus === "out_of_stock";
  const isLowStock = product.stockStatus === "low_stock";

  return (
    <Card
      className={cn(
        "py-0 overflow-hidden group transition-all",
        isOutOfStock
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:ring-2 hover:ring-primary/50",
      )}
      onClick={() => !isOutOfStock && handleAddItem(product)}>
      <div className="relative w-full aspect-square bg-muted overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl">☕</span>
        )}

        {/* Favorite button — always enabled regardless of stock */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 rounded-full shadow-sm bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}>
          <Star
            className={`h-4 w-4 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        </Button>

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Badge
              variant="destructive"
              className="text-xs font-semibold px-2 py-1">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Low Stock badge */}
        {isLowStock && !isOutOfStock && (
          <Badge
            variant="outline"
            className="absolute bottom-2 left-2 text-[10px] border-amber-500 text-amber-500 bg-background/80 backdrop-blur-sm gap-1">
            <AlertTriangle className="h-2.5 w-2.5" />
            Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-3 flex flex-col gap-1.5">
        <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
        <p className="text-sm text-primary font-medium">
          {formatCurrency(product.price)}
        </p>
        <div className="flex items-center justify-between mt-1 pt-1 border-t">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Stock
          </span>
          {isOutOfStock ? (
            <span className="text-xs font-semibold text-destructive">
              0 (Sold Out)
            </span>
          ) : (
            <span
              className={cn(
                "text-xs font-semibold",
                isLowStock ? "text-amber-500" : "text-emerald-500",
              )}>
              {product.availableStock} servings
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
