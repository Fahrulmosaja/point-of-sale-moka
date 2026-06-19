import { Minus, Plus, Trash2 } from "lucide-react";

import { CartItem as CartItemType, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold leading-none mb-1">{item.product.name}</h4>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(item.unitPrice)}
          </p>
        </div>
        <p className="text-sm font-medium">
          {formatCurrency(item.unitPrice * item.quantity)}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => removeItem(item.productMenuId)}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => updateQuantity(item.productMenuId, item.quantity - 1)}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm w-4 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => updateQuantity(item.productMenuId, item.quantity + 1)}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
