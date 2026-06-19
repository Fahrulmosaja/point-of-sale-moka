"use client";

import { useCartStore } from "@/stores/cart-store";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { CartHeader } from "./cart-header";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

export function CartOverview() {
  const { items } = useCartStore();

  return (
    <Card className="w-full lg:w-87.5 flex flex-col h-[calc(100vh-(--spacing(20)))] shrink-0 sticky top-4">
      <CartHeader />
      <CardContent className="flex-1 p-0 px-6 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 -mx-6 px-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              Cart is empty
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {items.map((item) => (
                <CartItem key={item.productMenuId} item={item} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CartSummary />
    </Card>
  );
}
