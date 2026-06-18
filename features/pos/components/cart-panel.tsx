'use client';

import { useCartStore } from '@/stores/cart-store';
import { useCartOperations } from '../hooks/use-cart-operations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { OrderType } from '@/types/order.types';
import { formatCurrency } from '@/lib/utils';

export function CartPanel() {
  const { items, orderType, setOrderType, updateQuantity, removeItem } = useCartStore();
  const { handleCheckout } = useCartOperations();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const onCheckoutClick = () => {
    handleCheckout('Cash');
  };


  return (
    <Card className="w-full lg:w-[350px] flex flex-col h-[calc(100vh-theme(spacing.20))] shrink-0 sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Current Order</CardTitle>
        <Tabs
          value={orderType}
          onValueChange={(v) => setOrderType(v as OrderType)}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dine_in">Dine In</TabsTrigger>
            <TabsTrigger value="take_away">Take Away</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 p-0 px-6 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 -mx-6 px-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              Cart is empty
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold leading-none mb-1">{item.product?.name}</h4>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <div className="mt-auto p-6 bg-muted/20">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
        <Button
          className="w-full mt-6"
          size="lg"
          disabled={items.length === 0}
          onClick={onCheckoutClick}
        >
          Checkout
        </Button>
      </div>
    </Card>
  );
}
