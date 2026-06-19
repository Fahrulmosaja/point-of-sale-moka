"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useCartOperations } from "../hooks/use-cart-operations";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CartSummary() {
  const { items } = useCartStore();
  const { handleCheckout } = useCartOperations();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const onCheckoutClick = async () => {
    setIsCheckingOut(true);
    await handleCheckout("Cash");
    setIsCheckingOut(false);
  };

  return (
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
        disabled={items.length === 0 || isCheckingOut}
        onClick={onCheckoutClick}>
        {isCheckingOut ? "Processing..." : "Checkout"}
      </Button>
    </div>
  );
}
